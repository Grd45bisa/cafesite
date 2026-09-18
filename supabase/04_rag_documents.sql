-- Phase 3 bot WhatsApp: tabel RAG untuk dokumen sumber (PDF info cafe).
-- Embedding model: NVIDIA nvidia/nemotron-3-embed-1b (dimensi native 2048,
-- TIDAK mendukung reduced dimensions via API cloud) via
-- integrate.api.nvidia.com/v1/embeddings, satu ecosystem dengan chat model
-- yang sudah dipakai bot (NVIDIA_API_KEY sama).
--
-- Kolom embedding pakai tipe `halfvec(2048)`, BUKAN `vector(2048)`, karena
-- index HNSW pgvector untuk tipe `vector` biasa dibatasi maksimal 2000
-- dimensi - 2048 melebihi limit itu. `halfvec` (half-precision float)
-- mendukung sampai 4000 dimensi dan tetap bisa dipasangi index HNSW dengan
-- operator cosine yang sama. Precision setengah cukup untuk similarity
-- search teks RAG skala kecil seperti ini.
--
-- Jalankan file ini di Supabase SQL Editor setelah 01_schema.sql (dan
-- 03_dynamic_categories.sql kalau relevan) sudah diterapkan.
--
-- CATATAN: `halfvec` butuh pgvector >= 0.7.0. Kalau `create table` di bawah
-- gagal dengan error tipe "halfvec" tidak dikenal, jalankan
-- `select extversion from pg_extension where extname='vector';` dulu untuk
-- cek versi - kalau di bawah 0.7.0, extension pgvector di project ini perlu
-- di-upgrade dulu lewat Database > Extensions di Supabase Dashboard.

create extension if not exists vector;

create table if not exists public.rag_documents (
  id uuid primary key default gen_random_uuid(),
  source text not null,          -- nama pdf / sumber dokumen
  content text not null,
  embedding halfvec(2048),       -- dimensi native nvidia/nemotron-3-embed-1b
  created_at timestamptz not null default now()
);

create index if not exists rag_documents_embedding_idx
  on public.rag_documents using hnsw (embedding halfvec_cosine_ops);

create index if not exists rag_documents_source_idx
  on public.rag_documents (source);

alter table public.rag_documents enable row level security;

drop policy if exists rag_read_public on public.rag_documents;
create policy rag_read_public on public.rag_documents
  for select to anon, authenticated using (true);

-- Chunk RAG bukan data sensitif, jadi SELECT boleh terbuka untuk web/public
-- juga nanti. Semua tulis (insert/update/delete) HANYA lewat service_role
-- dari server bot, konsisten dengan pola tabel lain di skema ini.
revoke all on public.rag_documents from anon, authenticated;
grant select on public.rag_documents to anon, authenticated;
grant select, insert, update, delete on public.rag_documents to service_role;

-- RPC similarity search (cosine, operator <=>) supaya retrieve() dari server
-- tidak perlu membangun raw SQL vector lewat REST client biasa.
create or replace function public.match_rag_documents(
  query_embedding halfvec(2048),
  match_count int default 5,
  filter_source text default null
)
returns table (
  id uuid,
  source text,
  content text,
  similarity float
)
language sql
stable
security definer
set search_path = public
as $$
  select
    rag_documents.id,
    rag_documents.source,
    rag_documents.content,
    1 - (rag_documents.embedding <=> query_embedding) as similarity
  from public.rag_documents
  where filter_source is null or rag_documents.source = filter_source
  order by rag_documents.embedding <=> query_embedding
  limit greatest(match_count, 1);
$$;

revoke all on function public.match_rag_documents(halfvec, int, text) from public, anon, authenticated;
grant execute on function public.match_rag_documents(halfvec, int, text) to service_role;
