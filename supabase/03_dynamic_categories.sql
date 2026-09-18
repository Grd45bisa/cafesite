-- Migration: Mengaktifkan Kategori Menu Dinamis (Bebas Tambah/Ubah/Hapus Kategori)
-- Jalankan skrip ini di SQL Editor dashboard Supabase Anda.

-- 1. Lepaskan check constraint lama pada tabel menu_items yang membatasi 5 kategori statis
alter table public.menu_items drop constraint if exists menu_items_data_check;

-- 2. Tambahkan constraint baru yang fleksibel (memvalidasi format item tanpa mengunci nama kategori)
alter table public.menu_items add constraint menu_items_data_check check (
  jsonb_typeof(data) = 'object'
  and data->>'id' = id
  and data ? 'price'
  and jsonb_typeof(data->'price') = 'number'
  and (data->>'price')::numeric between 0 and 10000000
  and (data->>'price')::numeric = trunc((data->>'price')::numeric)
  and length(trim(coalesce(data->>'category', ''))) between 1 and 50
);

-- 3. Izinkan key 'categories' pada tabel content untuk menyimpan konfigurasi kategori kafe
alter table public.content drop constraint if exists content_key_check;
alter table public.content add constraint content_key_check check (
  key in ('cafe', 'gallery', 'testimonials', 'faq', 'location', 'categories')
);
