# Deploy Bot WhatsApp CafeSite ke VPS (Oracle Cloud Always Free, Ubuntu)

Panduan ini untuk menjalankan `server/` (bot WhatsApp standalone, terpisah dari Next.js) 24/7 di VPS memakai PM2, idempotent setelah reboot.

## 1. Persiapan VPS

```bash
sudo apt update
sudo apt install -y git curl chromium-browser
```

Kalau `chromium-browser` tidak tersedia di repo Ubuntu versi Anda (kadang di Ubuntu 22.04+ paketnya bernama `chromium`), coba:

```bash
sudo apt install -y chromium
```

atau install Google Chrome sebagai gantinya (lihat dokumentasi resmi Google untuk repo `.deb`-nya).

Install Node.js (versi 20+; project ini dikembangkan dengan Node 24):

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Install PM2 secara global:

```bash
sudo npm install -g pm2
```

## 2. Clone & build

```bash
git clone <url-repo-anda> cafesite
cd cafesite/server
npm ci
npm run build
```

## 3. Konfigurasi environment

```bash
cp .env.example .env.local
nano .env.local
```

Isi **semua** variabel di `.env.local` sesuai kebutuhan (lihat `.env.example` untuk daftar lengkap dan penjelasan tiap variabel). Yang penting untuk VPS:

- `PUPPETEER_EXECUTABLE_PATH` — arahkan ke binary Chromium/Chrome yang baru diinstall:
  - Chromium: `/usr/bin/chromium-browser` (atau `/usr/bin/chromium` tergantung nama paket)
  - Google Chrome: `/usr/bin/google-chrome`
  
  Cek path pastinya dengan `which chromium-browser` atau `which google-chrome` setelah instalasi.

- `NVIDIA_API_KEY`, `NVIDIA_MODEL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `WA_BOT_USER_ID`, `EMBEDDING_*` — isi sesuai environment production Anda.
- `LOG_LEVEL` — opsional, default `info`. Set ke `warn` di production kalau log terlalu ramai.
- `RATE_LIMIT_MAX_PER_MINUTE` / `RATE_LIMIT_WINDOW_MS` — opsional, default 5 pesan per 60 detik per nomor.

**JANGAN commit `.env.local`** — sudah ada di `.gitignore`.

## 4. Migrasi session WhatsApp (kalau pindah dari mesin lama)

Kalau bot sudah pernah login (scan QR) di mesin development, Anda tidak perlu scan ulang di VPS — cukup pindahkan folder session:

```bash
# Di mesin lama, backup dulu:
tar -czf session-backup.tar.gz server/session/

# Pindahkan session-backup.tar.gz ke VPS (scp/rsync), lalu di VPS:
cd cafesite/server
tar -xzf session-backup.tar.gz
```

**JANGAN commit folder `server/session/` ke git** — berisi kredensial sesi WhatsApp yang sangat sensitif (setara akses penuh ke akun WhatsApp itu). Sudah ada di `.gitignore`.

Kalau ini deploy pertama kali (belum pernah login sama sekali), lewati langkah ini — nanti scan QR langsung di VPS lewat `pm2 logs` (lihat langkah 6).

## 5. Jalankan dengan PM2

```bash
cd cafesite/server
pm2 start ecosystem.config.js
pm2 save
```

`pm2 save` menyimpan daftar proses yang sedang jalan supaya bisa di-restore otomatis setelah reboot.

Supaya PM2 sendiri otomatis jalan lagi setelah VPS reboot (idempotent — tidak perlu langkah manual apa pun setelah `sudo reboot`):

```bash
pm2 startup
```

Perintah ini akan mencetak 1 baris perintah `sudo env PATH=... pm2 startup systemd -u <user> --hp <home>` — **copy-paste dan jalankan baris itu persis seperti yang dicetak**, itu yang mendaftarkan PM2 sebagai systemd service.

Setelah itu, `sudo reboot` VPS kapan pun akan otomatis menyalakan kembali bot ini tanpa langkah manual.

## 6. Login WhatsApp (kalau belum pernah scan QR)

```bash
pm2 logs cafesite-wa-bot
```

QR code akan tercetak di log dalam bentuk ASCII. Scan dengan WhatsApp di HP (Perangkat Tertaut → Tautkan Perangkat). Setelah `ready` muncul di log, tekan `Ctrl+C` untuk keluar dari `pm2 logs` (bot tetap jalan di background, `Ctrl+C` di sini hanya menghentikan tail log, bukan proses PM2).

## 7. Verifikasi

```bash
pm2 status
```

Harus menunjukkan `cafesite-wa-bot` dengan status `online`.

```bash
pm2 logs cafesite-wa-bot --lines 50
```

Cek log terbaru — harus ada baris `Bot WhatsApp siap dan tersambung.`

Test kirim pesan `@bot ping` dari WhatsApp ke nomor bot — harus dibalas `pong` dalam hitungan detik.

## 8. Update deploy (setelah ada perubahan kode)

```bash
cd cafesite/server
git pull
npm ci
npm run build
pm2 restart cafesite-wa-bot
```

`pm2 restart` memicu graceful shutdown (`SIGINT`/`SIGTERM` ditangani di `src/whatsapp/shutdown.ts`) sebelum proses baru dimulai, jadi Chromium lama ditutup dengan benar — tidak akan meninggalkan lock file di folder `session/`.

## Troubleshooting

### Error saat start: "The browser is already running for ...\session" atau serupa

Ini terjadi kalau proses sebelumnya mati mendadak (`kill -9`, VPS crash, out-of-memory) tanpa sempat menjalankan graceful shutdown, sehingga Chromium child process masih memegang lock folder `server/session/`.

Solusi:
1. Pastikan tidak ada proses Chromium lain yang masih jalan: `pkill -f chromium` (atau `pkill -f chrome`).
2. Restart PM2: `pm2 restart cafesite-wa-bot`.

Kalau masih terjadi berulang, cek apakah `max_memory_restart: "300M"` di `ecosystem.config.js` terlalu ketat untuk beban server Anda (Chromium headless bisa makan >150-200MB sendiri) — naikkan nilainya kalau perlu, restart yang terlalu sering karena OOM lebih rawan meninggalkan lock file dibanding shutdown yang direncanakan.

### Bot tidak balas apa-apa untuk sebagian pesan

Cek log untuk baris "Pesan ditahan oleh rate-limit." — ini bukan bug, itu rate-limit bekerja sesuai desain (default: diam total kalau > 5 pesan/menit dari nomor yang sama, lihat komentar di `src/queue/rateLimit.ts` untuk alasan kenapa "diam" dipilih daripada membalas pesan peringatan).

### Auth failure / perlu scan ulang QR

Kalau log menunjukkan "Autentikasi gagal - perlu scan ulang QR.", bot **sengaja berhenti mencoba reconnect otomatis** (retry buta pada auth_failure tidak akan menyelesaikan masalah — WhatsApp di HP mungkin logout manual, atau sesi kedaluwarsa). Hapus folder `server/session/` lalu `pm2 restart cafesite-wa-bot` dan scan ulang QR dari `pm2 logs`.

## Kontrol bot per nomor

- `@bot pertanyaan` di awal pesan: jawab pesan tersebut satu kali; tidak otomatis mengaktifkan mode percakapan.
- `@bot` saja: aktifkan balasan bot untuk nomor/chat pribadi tersebut. Pesan berikutnya boleh tanpa awalan.
- `@tutup`: nonaktifkan, kosongkan sesi order sementara, dan abaikan jawaban AI lama yang masih diproses. Perintah tetap bekerja saat rate-limit tercapai.
- Setelah 5 menit tanpa pesan masuk, sesi nonaktif otomatis tanpa pesan tambahan. Balasan bot tidak memperpanjang waktu. Pesan baru yang datang tepat/setelah batas waktu membutuhkan `@bot` lagi.
- Health check kini `@bot ping` → `pong`. Chat biasa saat nonaktif diabaikan, termasuk intent order. Grup/status/pesan sendiri tetap diabaikan.
- State aktivasi dan deduplikasi disimpan di memori satu proses: restart menonaktifkan semua nomor. ID pesan dideduplikasi selama 1 jam; tidak ada retry kirim otomatis ketika status pengiriman tidak pasti.
- Jalankan satu instance bot saja (jangan menjalankan `npm run dev` bersamaan dengan PM2/start untuk nomor yang sama). Deduplikasi memori tidak lintas proses.

Tes: `npm run build` lalu `node --test tests/bot-access.test.cjs` dari folder server. Setelah deploy, restart satu proses bot dan uji dua nomor berbeda.

