-- Apply after 01 and 04. Queue polling only; no database triggers.
begin;
alter table public.staff_modules drop constraint if exists staff_modules_id_check;
alter table public.staff_modules add constraint staff_modules_id_check check (id in
 ('orders','menu','tables','cafe','gallery','testimonials','faq','location','reports','wa_bot'));
insert into public.staff_modules(id,enabled) values ('wa_bot',false) on conflict do nothing;
create table if not exists public.rag_ingest_jobs (
 id uuid primary key default gen_random_uuid(),
 file_path text not null unique,
 source text not null check (length(source) between 1 and 80),
 status text not null default 'pending' check(status in ('pending','processing','done','failed')),
 error text, processing_by text, started_at timestamptz,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists rag_jobs_pending_idx on public.rag_ingest_jobs(status,created_at,id);
alter table public.rag_ingest_jobs enable row level security;
drop policy if exists rag_jobs_read on public.rag_ingest_jobs;
create policy rag_jobs_read on public.rag_ingest_jobs for select to authenticated using(public.can_module('wa_bot'));
revoke all on public.rag_ingest_jobs from anon,authenticated;
grant select on public.rag_ingest_jobs to authenticated;
grant all on public.rag_ingest_jobs to service_role;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('wa-bot-rag','wa-bot-rag',true,10485760,array['application/pdf'])
 on conflict(id) do update set public=true,file_size_limit=10485760,allowed_mime_types=array['application/pdf'];
drop policy if exists wa_rag_read on storage.objects;
create policy wa_rag_read on storage.objects for select to anon,authenticated using(bucket_id='wa-bot-rag');
drop policy if exists wa_rag_insert on storage.objects;
create policy wa_rag_insert on storage.objects for insert to authenticated with check(bucket_id='wa-bot-rag' and public.can_module('wa_bot'));
drop policy if exists wa_rag_update on storage.objects;
create policy wa_rag_update on storage.objects for update to authenticated using(bucket_id='wa-bot-rag' and public.can_module('wa_bot')) with check(bucket_id='wa-bot-rag' and public.can_module('wa_bot'));
drop policy if exists wa_rag_delete on storage.objects;
create policy wa_rag_delete on storage.objects for delete to authenticated using(bucket_id='wa-bot-rag' and public.can_module('wa_bot'));

-- Short transaction lock serializes claims and source mutations, not embedding work.
-- Only one active job globally; UPDATE RETURNING is the atomic claim.
create or replace function public.claim_rag_job(worker text) returns setof public.rag_ingest_jobs
language plpgsql set search_path=public as $$
begin
 perform pg_advisory_xact_lock(604206);
 if exists(select 1 from public.rag_ingest_jobs where status='processing') then return; end if;
 return query update public.rag_ingest_jobs set status='processing',processing_by=worker,started_at=now(),updated_at=now(),error=null
 where id=(select id from public.rag_ingest_jobs where status='pending' order by created_at,id limit 1 for update skip locked) returning *;
end $$;

-- Atomic replacement shared by CLI and worker. A deleted job cannot resurrect chunks.
create or replace function public.replace_rag_source(doc_source text, chunks jsonb, job_id uuid default null, worker text default null)
returns boolean language plpgsql set search_path=public as $$
begin
 perform pg_advisory_xact_lock(604206);
 if job_id is not null and not exists(select 1 from public.rag_ingest_jobs where id=job_id and source=doc_source and status='processing' and processing_by=worker) then return false; end if;
 if jsonb_array_length(chunks)=0 then raise exception 'Dokumen tidak memiliki teks.'; end if;
 delete from public.rag_documents where source=doc_source;
 insert into public.rag_documents(source,content,embedding)
 select doc_source,item->>'content',(item->>'embedding')::halfvec(2048) from jsonb_array_elements(chunks) item;
 if job_id is not null then update public.rag_ingest_jobs set status='done',error=null,updated_at=now() where id=job_id; end if;
 return true;
end $$;

create or replace function public.delete_rag_source(doc_source text) returns table(file_path text)
language plpgsql set search_path=public as $$
begin
 perform pg_advisory_xact_lock(604206);
 delete from public.rag_documents where source=doc_source;
 return query delete from public.rag_ingest_jobs j where j.source=doc_source returning j.file_path;
end $$;
revoke all on function public.claim_rag_job(text),public.replace_rag_source(text,jsonb,uuid,text),public.delete_rag_source(text) from public,anon,authenticated;
grant execute on function public.claim_rag_job(text),public.replace_rag_source(text,jsonb,uuid,text),public.delete_rag_source(text) to service_role;
commit;
