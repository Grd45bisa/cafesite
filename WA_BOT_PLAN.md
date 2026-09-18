# WA_BOT_PLAN.md — Plan Bot WhatsApp CafeSite (wa-webjs + Nemotron + RAG)

> Dokumen ini berisi **rencana kerja sampai bot stabil/"fix"** dan **prompt per phase** yang siap di-paste ke AI coding agent. Bot jalan di folder `server/` (project Node.js + TypeScript terpisah, BUKAN di dalam Next.js). AI milik bot memakai **NVIDIA Nemotron** via API OpenRouter.
>
> Status: `Draft` — belum ada kode di folder `server/`.

---

## 0. Ringkasan Arsitektur

```
Gambar kerja (dev):

  Admin upload PDF (nanti via website) ─┐
                                        ▼
  Supabase (Storage + Postgres + pgvector)   ← tempat RAG disimpan (chunk + vector)
                                        ▲
  ┌───────────────── server/ (VPS 24/7) ─────────────────┐
  │  wa-webjs (session WhatsApp, jalan terus)            │
  │    │                                                 │
  │    ├─ AI call → OpenRouter → nvidia/nemotron-3.5-lightning
  │    ├─ RAG: cari context → kirim ke AI → jawab
  │    ├─ Order flow (dev: keyword "bayar") → insert ke tabel orders
  │    ▼
  └───────────────┐
                  ▼
   Dashboard /admin (Next.js yang sudah ada) — pesanan WA masuk di sini (Realtime)
```

- **AI (Nemotron) TIDAK pernah dijalankan lokal di VPS.** VPS hanya memanggil API OpenRouter.
- **Supabase dipakai untuk** vektor RAG + metadata + storage PDF + tabel `orders` (agar order WA tampil di dashboard yang sudah ada).
- **Order via WA belum pakai payment gateway.** Dev = customer cukup ketik `bayar` (placeholder). Integrasi iPaymu QRIS dijadwalkan setelah fase ini, merujuk `ipaymu.md`.

---

## 1. Aturan Dasar (wajib untuk semua phase)

1. **Folder target:** `server/` di root repo ini, dengan `package.json` sendiri (ISI penuh terpisah dari root — jangan tambahkan dependency bot ke package.json Next.js).
2. **Bahasa:** TypeScript strict. Semua env lewat `.env` (file `.env.example` wajib dibuat).
3. **wa-webjs:** pascal session persistent (`LocalAuth`), login QR dicetak ke console + bisa ditampilkan ulang. Bot wajib auto-reconnect.
4. **AI Reinforcement (guard) — WAJIB ada di semua phase AI:**
   - Hanya boleh menjawab informasi seputar tempat/cafe: menu (dari data CafeSite), ketersediaan meja, jam buka, lokasi, dan pertanyaan yang dijawab oleh RAG.
   - DILARANG: pendapat pribadi AI, informasi pribadi pemilik/karyawan, gosip, rekomendasi pribadi, hal di luar konteks cafe.
   - Kalau tidak yakin / di luar topik → jawab SOP (lihat system prompt di Phase 2).
5. **Order via WA:** `bayar` = placeholder pembayaran (dev). Produksi nanti diganti iPaymu (lihat `ipaymu.md`).
6. Jangan commit secret. Semua kredensial lewat `.env` (`.gitignore` di `server/`).

---

## 2. Fase Rencana (sampai "fix")

| Fase | Target "fix" (kriteria selesai) | Isi |
|---|---|---|
| **P1 — Laying** | Bot WhatsApp hidup & bisa balas pesan | Folde `server/`, wa-webjs + session, hello/ping, auto-reconnect, QR login |
| **P2 — AI Hub** | Bot bisa jawab pertanyaan cafe pakai Nemotron | Call OpenRouter, system prompt + topic guard, fallback SOP |
| **P3 — RAG** | RAG jalan: PDF upload → chunk → embed → simpan → retrieve | Pipeline ingest (script), similarity search, context ke AI, cleanup |
| **P4 — Order** | Order via WA masuk dashboard pakai kata `bayar` | Ambil item dari tabel `menu_items`, hitung total, alur konfirmasi, insert ke `orders` (service role), badge ke dashboard |
| **P5 — Ops** | Stabil jalan 24/7 di VPS | PM2/systemd, log, restart otomatis, rate-limit anti-spam, monitoring |
| **FUTURE** | (BUKAN bagian sekarang) | Ganti `bayar` → iPaymu QRIS (pakai `ipaymu.md`), upload PDF via website |

---

## 3. Keputusan & Risiko yang Harus Diingat (context untuk semua phase)

- **`orders.user_id` wajib UUID dari `auth.users`** (lihat `supabase/01_schema.sql`). WhatsApp bukan login Supabase → bot harus pakai **akun user khusus bot** (dibuat sekali di Supabase Auth) dan insert pakai **`service_role` key** (dari `server/.env`), dengan `idempotency_key` unik per order.
- **`payment_method` di tabel `orders` hanya menerima `'cod'`** (constraint di schema). Untuk dev, bot insert dengan `payment_method='cod'` `payment_status='paid' simulasikan` via fungsi `update_cafe_order(mark_paid=true)` — atau diskusikan alter constraint per kebutuhan. Jangan ubah schema di luar kebutuhan.
- **Menu dibaca dari tabel `menu_items` Supabase** (bukan dari `data/menu.ts`), agar selaras dengan dashboard (termasuk `is_available` = habis).
- **wa-webjs tidak 100% stabil** dan rawan diblokir jika dipakai massal; batasi ke kebutuhan cafe (starter).
- **Embedding untuk RAG** masih open decision: pantau biaya. Rekomendasi awal: kubedr `pgvector` + embedding hubung key yang murah/embed model gratis OpenAI (`text-embedding-3-small`) — konfigurasi via env, bukan hardcode.

---

## 4. Prompt Per Phase

> Cara pakai: copy blok prompt (antara `---` dan `---` berikutnya) ke AI coding agent dan jalankan di repo ini. Setiap phase dimulai dari status repo saat ini (folder `server/` dikerjakan bertahap).

### PHASE 1 — Prompt: Servis WhatsApp (wa-webjs)

```
Tugasmu: buat fondasi bot WhatsApp di folder `server/` di repo CafeSite ini (Windows local dev dulu, target VPS Linux).

## Hasil akhir yang dicapai
1. Folder `server/` adalah project Node.js + TypeScript STANDALONE (package.json sendiri, tsconfig sendiri). JANGAN sentuh/menambah dep ke root package.json Next.js.
2. Bot wa-webjs bisa:
   - Login via QR (tampilkan QR di console pakai `qrcode-terminal`), session persistent dengan `LocalAuth` (folder `server/session/`).
   - Auto-reconnect saat disconnect/tidak sinkron.
   - Multi-device ready (pakai lib: `whatsapp-web.js`).
   - Balas pesan kosong/ping dengan "✓ Bot CafeSite aktif".
3. Struktur:
   server/
     .env.example   (lengkapi: OPENROUTER_API_KEY, OPENROUTER_MODEL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, WA_BOT_PHONE) — belum dipakai phase ini, siapkan saja
     .gitignore     (node_modules, .env, session)
     package.json   (script: "dev": "tsx watch src/index.ts", "start": "node dist/index.js")
     tsconfig.json
     src/index.ts         (entry: start client + daftarkan event)
     src/config/env.ts    (baca env, throw kalau missing)
     src/whatsapp/client.ts  (setup wa-webjs + LocalAuth + reconnect)
     src/whatsapp/logger.ts  (log dengan timestamp)
4. Jangan tambahkan fitur AI/RAG/order di phase ini.

## Verifikasi
- `npm run dev` di `server/` menampilkan QR, scan dengan WhatsApp (mode perangkat tertaut), kirim "ping" → balas "✓ Bot CafeSite aktif".
- File `.env.example` berisi placeholder yang jelas, gunakan variabel di atas.

## Revisi jika gagal
- Jika wa-webjs gagal konek (versi Node), laporkan error mentah dan sesuaikan.
```

---

### PHASE 2 — Prompt: AI Hub (Nemotron + guard)

```
Tugasmu: tambahkan "otak AI" ke bot WhatsApp di `server/` (lanjutkan dari Phase 1). AI memakai model NVIDIA Nemotron yang diakses VIA API OpenRouter — JANGAN pernah menjalankan model lokal.

## Model (wajib sesuai)
- Production: `nvidia/nemotron-3.5-lightning` (NVIDIA Nemotron 3.5 Lightning 30B A3B) via OpenRouter, endpoint OpenAI-compatible: https://openrouter.ai/api/v1/chat/completions
- Alternatif gratis untuk testing (pakai env `OPENROUTER_MODEL`): `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free`
- Header auth: `Authorization: Bearer $OPENROUTER_API_KEY`, tambah `HTTP-Referer` dan `X-Title` (identitas app: "CafeSite WhatsApp Bot").

## Apa yang dibuat
1. `src/ai/nemotronClient.ts` — fungsi `askAI(messages)` panggil OpenRouter, handle error/timeout/retry 1x, return text.
2. `src/ai/systemPrompt.ts` — Ekspor SYSTEM_PROMPT (lihat isi wajib di bawah).
3. `src/ai/guard.ts` — fungsi penjaga topik PRA-AI:
   - Daftar kata kunci cafe (menu, harga, jam buka, lokasi, meja, resepsi, kepada dll).
   - Jika pesan user tidak menyangkut cafe → BALAS segera dengan SOP tanpa panggil AI (mis. "Maaf, saya hanya bisa bantu soal CafeSite ☕").
4. `src/ai/chatHandler.ts` — dipanggil dari WA: guard → (nanti: retrieve RAG) → build messages → `askAI` → kirim balik. Fase ini RAG belum ada, langsung panggil AI dengan prompt + system prompt.

## SYSTEM_PROMPT (isi minimal, boleh diperluas):
Kamu adalah asisten WhatsApp resmi CafeSite. Tugasmu HANYA menjawab pertanyaan seputar CafeSite berdasarkan informasi yang diberikan. ATURAN: (1) Hanya bicara tentang CafeSite: menu & harga, jam buka, lokasi, ketersediaan meja, dan info yang ada di konteks. (2) JANGAN pernah: memberi pendapat pribadi, menceritakan informasi pribadi pemilik/karyawan, membocorkan data orang lain, atau menjawab topik di luar cafe. (3) Jika tidak yakin atau di luar topik, katakan: "Maaf, saya hanya bisa membantu soal CafeSite ☕ Tanya seputar menu, jam buka, atau lokasi ya." (4) Jawab singkat, ramah, bahasa Indonesia santai.

## Verifikasi
- Kirim "menu apa saja yang ada?" → AI jawab (walaupun tanpa RAG, jawab dari pengetahuan/prompt umum).
- Kirim "kerjaan rumah saya bagaimana?" → guard menolak tanpa panggil AI.
- Log berisi timestamp untuk tiap call.
```

---

### PHASE 3 — Prompt: RAG Pipeline (Supabase + pgvector)

```
Tugasmu: tambahkan RAG (Retrieval-Augmented Generation) ke bot `server/`. Dokumen sumber = PDF info cafe (menu lengkap, aturan, FAQ). RAG disimpan cloud di Supabase.

## Prasyarat yang harus kamu pastikan dulu (baca & ikuti)
- Baca `supabase/01_schema.sql` (aturan tabel & RLS di project ini; jangan rusak: semua tulis lewat `service_role` dari server).
- Aktifkan ekstensi `vector` (pgvector) di project Supabase klien (jalankan `create extension if not exists vector;`).
- Buat tabel chunk:
  ```sql
  create table if not exists public.rag_documents (
    id uuid primary key default gen_random_uuid(),
    source text not null,          -- nama pdf / sumber
    content text not null,
    embedding vector(1536),        -- sesuaikan dimensi embedding yang dipilih
    created_at timestamptz not null default now()
  );
  create index on public.rag_documents using hnsw (embedding vector_cosine_ops);
  alter table public.rag_documents enable row level security;
  -- Baca: anon & authenticated; tulis: service_role saja
  create policy rag_read on public.rag_documents for select to anon,authenticated using(true);
  revoke all on public.rag_documents from anon,authenticated;
  grant select on public.rag_documents to anon,authenticated;
  grant all on public.rag_documents to service_role;
  ```

## Yang dibuat di `server/`
1. `src/rag/ingest.ts` — script CLI `npm run rag:ingest <path.pdf>`:
   - Parse PDF (pakai library ringan, mis. `pdf-parse`).
   - Chunking by heading/paragraf (~600-800 char, overlap kecil).
   - Embed tiap chunk (embedding model dari env `EMBEDDING_MODEL`, default `text-embedding-3-small` via API provider dari env `EMBEDDING_API_KEY`/`EMBEDDING_BASE_URL`).
   - Hapus chunk lama dari `source` yang sama, lalu insert chunk baru (bisa "ganti-ganti" isi RAG dengan meng-upload ulang).
2. `src/rag/retrieve.ts` — `retrieve(query, limit=5)`:
   - Embed query → query similarity di `rag_documents` (`<=>`) → return `content` list.
3. `src/ai/chatHandler.ts` — UPDATE:
   - Pertama retrieve top-5 chunk relevan → sertakan sebagai konteks di pesan AI.
   - Tetap lewati guard dulu seperti Phase 2.
4. `.env.example` tambah: `EMBEDDING_MODEL`, `EMBEDDING_API_KEY`, `EMBEDDING_BASE_URL`.

## Verifikasi
- Jalankan ingest pada PDF contoh (buat 1 PDF kecil berisi info cafe) → muncul di tabel `rag_documents`.
- Tanya bot: isi yang ada di PDF → jawaban memakai konteks RAG (bukan asumsi).
- Ganti isi PDF (re-ingest source sama) → jawaban ikut berubah (bukti bisa di-update).
```

---

### PHASE 4 — Prompt: Order via WhatsApp (dev: kata "bayar")

```
Tugasmu: tambahkan alur PEMESANAN via WhatsApp di `server/`. BELUM ada payment gateway: dev = customer cukup ketik "bayar" dan pesanan masuk dashboard /admin sebagai PAID.

## Sumber data & constraints (WAJIB baca)
- Baca `supabase/01_schema.sql`. Tabel `orders` butuh `user_id uuid references auth.users` — WhatsApp bukan user Supabase, jadi:
  - Buat 1 akun bot di Supabase Auth (lewat dashboard) → catat `user_id`-nya → taruh di env `WA_BOT_USER_ID`.
  - Semua tulis order dilakukan dengan `service_role` key (dari `server/.env`), memenuhi RLS.
- Menu dibaca dari tabel `menu_items` (jangan hardcode). Hormati `is_available`.

## Alur yang diimplementasikan (lanjutkan dari fase 2–3)
1. Intent order ketika user mengetik kata kunci: "pesan", "order", "beli", "mau pesan".
2. Bot tanya: nama item (cari di menu_items), qty, opsi dine-in/takeaway (+ meja jika dine-in), lalu nama + nomor HP customer untuk pengisian `orders.customer_name/phone`.
3. Bot konfirmasi ringkasan: item, qty, total (hitung dari harga menu_items), fulfillment.
4. Setelah konfirmasi, bot bilang: "Silakan lanjutkan dengan mengetik `bayar` untuk memproses pesanan (mode development)."
   Setelah user ketik `bayar`: transaksi dibuat (insert order_items dari menu current price) dan langsung tandai PAID (mis. insert via fungsi membuat pesanan + `update_cafe_order(mark_paid=true)` atau pola lain yang aman, konsisten dengan schema). Kirim balik: nomor antrian/queue_number + total.
5. Semua error validasi (meja tidak tersedia, menu habis, format salah) → balas pesan ramah, jangan crash.

## Pengujian
- Pesan "order" → seluruh alur berjalan sampai "bayar" → cek dashboard `/admin` (kanban Pesanan) bahwa pesanan WA muncul sebagai paid.
- Menu habis (toggle `is_available=false`) → bot menolak item tersebut.

## Catatan
- `payment_method` pada tabel orders hanya menerima `'cod'`. Untuk dev, gunakan nilai yang valid `'cod'` (pa-in, diganti gateway di fase FUTURE). Kalau butuh enumerasi baru, JELASKAN dulu ke user sebelum alter schema.
```

---

### PHASE 5 — Prompt: Ops / Produksi (stabil 24/7 di VPS)

```
Tugasmu: polish bot `server/` agar stabil jalan 24/7 di VPS (target Oracle Cloud Always Free Ubuntu).

## Yang dikerjakan
1. `src/config/env.ts` — pastikan semua env divalidasi saat start (fail fast).
2. Rate-limit anti-spam: maks N pesan per user per menit (buat file `src/queue/rateLimit.ts`), melebihi → bot diam/respon pelan.
3. Reconnect strategy yang solid: listener `auth_failure`, `disconnected`, `ready`; backoff; log jelas.
4. Logging: `src/whatsapp/logger.ts` minimal console json (timestamp, level, source).
5. Tulis `server/DEPLOY.md` berisi langkah:
   - git clone ke VPS, `npm ci`, build `tsc`, jalankan via **PM2** (`ecosystem.config.js`) dengan restart on crash + `max_memory_restart`.
   - Hint: session mobile (QR) bisa dipakai di PM2 asal folder session dibackup.
   - Set env di `.env` (jangan commit).
   - fire & forget: start script `pm2 start ecosystem.config.js`.
6. Health check sederhana: pesan "ping" → pong (sudah ada), tambah log uptime di start.

## Verifikasi
- Simulasi disconnect (nonaktifkan internet laptop) → bot reconnect sendiri.
- Spam > N pesan → bot menahan balasan.
- Deploy ke VPS → bot online, idempotent after reboot (PM2 + `pm2 startup`).
```

---

## 5. Setelah Semua Phase Fix — FUTURE (BUKAN bagian sekarang)

- Ganti keyword `bayar` → integrasi **iPaymu QRIS** sesuai `ipaymu.md` (endpoint direct payment qris, callback verifikasi, signature).
- Upload PDF RAG dari website (alur admin panel) — PDF masuk Supabase Storage → server ingest otomatis via trigger/webhook.
- Evaluasi embed model (biaya) dan apakah Nemotron Lightning tetap paling cepat/hemat.

---

## 6. Checklist Per Phase

- [ ] P1: bot login + ping/pong + auto-reconnect
- [ ] P2: AI Nemotron (OpenRouter) + guard topik
- [ ] P3: RAG (pgvector) upload → chunk → embed → retrieve → jawab kontekstual
- [ ] P4: order WA (dev `bayar`) masuk dashboard paid
- [ ] P5: rate-limit + PM2 + deploy VPS + recovery

---

## 7. Log Keputusan (isi saat phase berjalan)

| Tanggal | Keputusan | Alasan |
|---|---|---|
| (isi) | Model: Nemotron 3.5 Lightning via OpenRouter | Tercepat untuk always-on agent, murah ($0.08/M input) |
| (isi) | RAG di Supabase + pgvector | Sudah ada project Supabase untuk dashboard |
| (isi) | (dsb.) | |