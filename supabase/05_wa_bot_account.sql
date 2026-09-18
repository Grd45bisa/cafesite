-- CafeSite — verifikasi akun bot WhatsApp untuk WA_BOT_USER_ID.
--
-- PENTING: user di auth.users TIDAK BISA dibuat lewat SQL biasa (Supabase
-- mengelola tabel ini secara khusus - password harus di-hash lewat jalur
-- resminya, bukan insert manual). Buat usernya dulu lewat salah satu cara
-- di bawah, BARU jalankan query verifikasi di file ini.
--
-- ============================================================
-- CARA MEMBUAT AKUN BOT (pilih salah satu, lakukan SEBELUM run file ini)
-- ============================================================
--
-- Opsi A — Supabase Dashboard (paling gampang, tidak perlu command apapun):
--   1. Buka project Supabase → Authentication → Users → tombol "Add user".
--   2. Pilih "Create new user".
--   3. Isi email bebas yang jelas asalnya, misalnya: wa-bot@cafesite.internal
--      (tidak perlu email yang benar-benar aktif/bisa menerima surel).
--   4. Isi password bebas yang kuat (bot tidak pernah login interaktif,
--      cukup disimpan sekali lalu tidak dipakai lagi).
--   5. PENTING: centang "Auto Confirm User" supaya email tidak perlu
--      diverifikasi (kalau tidak dicentang, user berstatus unconfirmed dan
--      sebagian alur Supabase Auth bisa menolaknya).
--   6. Setelah dibuat, klik user itu di daftar untuk melihat "User UID"
--      (format UUID) - itu yang disalin ke WA_BOT_USER_ID di server/.env.local.
--
-- Opsi B — Supabase CLI (kalau sudah pakai `supabase` CLI dan linked project):
--   supabase auth admin create-user --email wa-bot@cafesite.internal \
--     --password "<password-kuat-bebas>" --email-confirm
--
-- Opsi C — Management API langsung (kalau butuh otomatisasi/CI):
--   curl -X POST 'https://<project-ref>.supabase.co/auth/v1/admin/users' \
--     -H "apikey: <SUPABASE_SERVICE_ROLE_KEY>" \
--     -H "Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>" \
--     -H "Content-Type: application/json" \
--     -d '{"email":"wa-bot@cafesite.internal","password":"<password-kuat-bebas>","email_confirm":true}'
--   Response-nya berisi field "id" (UUID) - itu WA_BOT_USER_ID-nya.
--
-- ============================================================
-- VERIFIKASI (jalankan di Supabase SQL Editor SETELAH user dibuat)
-- ============================================================

-- 1. Pastikan user ditemukan dan sudah confirmed (email_confirmed_at terisi).
--    Ganti '<uuid-yang-baru-dibuat>' dengan UID dari langkah di atas, ATAU
--    ganti WHERE-nya pakai email kalau belum tahu UID-nya.
select
  id,
  email,
  email_confirmed_at,
  coalesce(is_anonymous, false) as is_anonymous,
  created_at
from auth.users
where email = 'wa-bot@cafesite.internal';
-- atau: where id = '<uuid-yang-baru-dibuat>';

-- 2. Pastikan akun bot TIDAK MASUK ke public.profiles. Bot tidak perlu
--    (dan tidak boleh) punya akses login dashboard admin/staff - dia hanya
--    dipakai sebagai `actor` UUID di RPC create_cafe_order/update_cafe_order
--    yang dipanggil server/ pakai service_role key, bukan lewat sesi login.
--    Query ini harus mengembalikan 0 baris:
select p.id, p.role
from public.profiles p
join auth.users u on u.id = p.id
where u.email = 'wa-bot@cafesite.internal';

-- Kalau langkah 2 di atas TIDAK kosong (ada baris), berarti akun ini
-- ke-insert ke profiles secara tidak sengaja (misal lewat 02_promote_
-- existing_users_to_admin.sql yang menjadikan SEMUA user non-anonymous
-- sebagai admin). Hapus baris itu supaya bot tidak dapat akses dashboard:
--   delete from public.profiles where id = (select id from auth.users where email='wa-bot@cafesite.internal');

-- 3. (Opsional) Cek tidak ada order yang salah terhubung ke akun ini sebelum
--    dipakai production - harus kosong di awal.
select count(*) as order_count_untuk_bot
from public.orders
where user_id = (select id from auth.users where email = 'wa-bot@cafesite.internal');
