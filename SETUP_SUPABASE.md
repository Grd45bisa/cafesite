# Menyalakan Dashboard, QR Meja, dan Pemesanan

1. Buat project baru di Supabase, lalu buka **SQL Editor**.
2. Salin seluruh isi [supabase/01_schema.sql](./supabase/01_schema.sql), jalankan sekali, dan tunggu sampai sukses.
3. Di **Authentication > Providers**, aktifkan Anonymous Sign-ins untuk pelanggan dan Email untuk admin/staf.
4. Buat pengguna admin melalui **Authentication > Users**. Untuk menjadikan seluruh akun email/password yang sekarang sudah ada sebagai admin, jalankan `supabase/02_promote_existing_users_to_admin.sql`. Akun customer anonim otomatis dikecualikan.

   Jika hanya ingin mengangkat satu akun tertentu, jalankan SQL berikut dengan UUID pengguna tersebut:

```sql
insert into public.profiles (id, role)
values ('PASTE_UUID_ADMIN_DI_SINI', 'admin');
```

5. File `.env.local` sudah disiapkan di root project. Isi tiga nilai berikut dari **Supabase Dashboard > Project Settings > API**. Jangan pernah menaruh service-role key di variabel `NEXT_PUBLIC_*`.

```env
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=PASTE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=PASTE_SERVICE_ROLE_KEY
```

6. Deploy ulang, masuk ke `/admin`, dan isi menu, meja, serta konten kafe dengan data asli. QR setiap meja mengarah ke `/order?meja=ID_MEJA`.

Pembayaran online sengaja belum diaktifkan. Alur yang tersedia adalah bayar di kasir (COD); label “Segera hadir” tampil untuk pembayaran online.

## Keamanan yang sudah diterapkan

- Pelanggan hanya dapat melihat pesanan miliknya melalui sesi anonim yang dibuat browser.
- Harga dan status menu selalu dihitung di database, bukan dari browser.
- Admin dan staf diperiksa melalui `profiles` dan `staff_modules`.
- Gambar hanya menerima JPEG, PNG, WebP, atau AVIF, maksimal 5 MB.
- Pembaruan pesanan dan meja dipublikasikan melalui Supabase Realtime.
