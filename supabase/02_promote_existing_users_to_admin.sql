-- CafeSite — jadikan semua akun manusia yang SUDAH ADA sebagai admin.
-- Jalankan setelah 01_schema.sql melalui Supabase SQL Editor.
--
-- Akun anonymous customer sengaja dikecualikan. Sistem /order menggunakan
-- anonymous auth; memasukkannya ke profiles akan memberikan akses dashboard.

begin;

insert into public.profiles (id, role)
select id, 'admin'
from auth.users
where coalesce(is_anonymous, false) = false
on conflict (id) do update
set role = 'admin';

commit;

-- Hasil verifikasi. Daftar ini tidak memuat akun anonymous customer.
select
  u.id,
  u.email,
  p.role,
  u.created_at
from auth.users as u
join public.profiles as p on p.id = u.id
where coalesce(u.is_anonymous, false) = false
order by u.created_at asc;
