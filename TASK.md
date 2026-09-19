# TASK.md — Task Breakdown
## Project: CafeSite

Status: `Not Started` | `In Progress` | `Done`
Update status di setiap task seiring progress.

---

## Phase 0 — Requirement & Content Gathering
- [x] Siapkan instrumen kuesioner konten lengkap (`CONTENT_QUESTIONNAIRE.md`)
- [x] Tinjau & lengkapi checklist penerimaan asset foto di `PHOTO_BRIEF.md` §5
- [x] Rumuskan 3 opsi kalibrasi Brand Voice (`CONTENT_QUESTIONNAIRE.md` §4)
- [x] Rumuskan target performa konkret / SLA (`CONTENT_QUESTIONNAIRE.md` §5)
- [x] Set ekspektasi soal batasan versi gratis & roadmap Phase 2 (`CONTENT_QUESTIONNAIRE.md` §6)
- [ ] Kumpulkan logo & font pilihan client (Nama cafe: **CafeSite** & Warna Brand 6-Palette: **Terkunci**) [BLOCKED: menunggu file asset logo/font client]
- [ ] Kumpulkan foto asli cafe sesuai brief di `PHOTO_BRIEF.md` (interior, exterior, menu items) [BLOCKED: menunggu data asli client]
- [ ] Kumpulkan data menu lengkap (nama, deskripsi, harga, kategori, foto) [BLOCKED: menunggu data asli client]
- [ ] Kumpulkan alamat, jam operasional, link Maps [BLOCKED: menunggu data asli client]
- [ ] Kumpulkan link Instagram & nomor WhatsApp aktif [BLOCKED: menunggu data asli client]
- [ ] Sepakati Brand Voice (`BRAND_VOICE.md`) — tone & contoh copy dengan client [BLOCKED: menunggu data asli client]
- [ ] Sepakati target performa (Lighthouse score, dsb.) dengan client [BLOCKED: menunggu data asli client]

## Phase 1 — Planning & Design System
- [x] Finalisasi sitemap (`/`, `/menu`, `/about`, `/gallery`, `/location`) — terdokumentasi di `SITEMAP.md`
- [x] Wireframe tiap halaman (low-fidelity, minimal Home & Menu) — terdokumentasi di `WIREFRAME.md`
- [x] Tentukan font pairing (heading vs body) — Playfair Display + Plus Jakarta Sans di `DESIGN_TOKENS.md` §2
- [x] Setup design tokens (warna, font, spacing) di Tailwind CSS v4 via `@theme` di `globals.css`

## Phase 2 — Project Setup
- [x] Init project Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- [x] Setup struktur folder sesuai ARSITEKTUR.md (`src/app`, `src/components/{layout,home,menu,gallery,ui}`, `src/data`, `src/lib`, `src/types`)
- [x] Setup `types/index.ts` (tipe eksplisit untuk MenuItem, CafeInfo, GalleryImage, Testimonial, FaqItem, OpeningHour, WhatsAppContext)
- [x] Setup `data/cafe.ts` (info statis CafeSite dengan penanda `// TODO: ganti dengan data asli client`)
- [x] Setup `data/menu.ts` (struktur menu 5 kategori dengan penanda `// TODO: ganti dengan data asli client`)
- [x] Setup data `testimonials.ts` & `faq.ts` (dengan penanda `// TODO: ganti dengan data asli client`)
- [x] Setup helper `src/lib/utils.ts` (builder WhatsApp deep-link & isOpenNow real-time status)
- [x] Setup komponen dasar UI: `Button`, `Container`, `SectionHeading` (server components, semantic HTML, token-based styling)
- [x] Setup root layout (`src/app/layout.tsx`) dengan font pairing Google Fonts (Playfair Display + Plus Jakarta Sans) & metadata dasar

## Phase 3 — Layout & Navigasi
- [x] Build `Navbar.tsx` (desktop nav + mobile hamburger animasi, transparent-to-solid on scroll, active route, aksesibilitas keyboard Escape/aria-expanded)
- [x] Build `Footer.tsx` (semantic footer: brand, navigasi, kontak deep-link WA/Instagram/Maps, copyright dinamis)
- [x] Setup root layout (`app/layout.tsx`) dengan metadata dasar (sudah dikerjakan di Phase 2: metadata + font pairing; sekarang ditambah integrasi Navbar/Footer/overlay + skip-to-content link)
- [x] Build `FloatingWhatsApp.tsx` (tombol melayang CTA WhatsApp kanan bawah, desktop only, deep-link otomatis)
- [x] Build `StickyMobileCTA.tsx` (bottom bar mobile-only: Lihat Menu + Chat WA, padding-bottom aman)
- [x] Build `OpenNowBadge.tsx` (status buka/tutup real-time via isOpenNow(), server component)
- [x] Refactor: shared icon `ui/WhatsAppIcon.tsx` (hilangkan duplikasi SVG di Navbar/Footer/FloatingWhatsApp/StickyMobileCTA)
- [x] Simpilify `FloatingWhatsApp.tsx` menjadi ikon-only FAB (sesuai feedback: tanpa pill text panjang)
- [x] Fix lint `react-hooks/set-state-in-effect` — OpenNowBadge pakai `initialStatus` prop dari server (anti hydration mismatch) + interval refresh
- [x] Define token `--shadow-floating` di `globals.css` & ganti utility `safe-area-bottom` yang tidak terdefinisi dengan arbitrary value
- [x] Verifikasi ulang: `npm run lint` & `npm run build` sukses setelah refactor
- [x] Konsolidasi CTA: hapus pill "Chat WhatsApp" di Navbar desktop (redundan dengan FAB) — 1 touchpoint WA per viewport (desktop: FAB, mobile: sticky bar)

## Phase 4 — Home Page
- [x] Build `icons.tsx` (ikon garis tipis stroke-consistent untuk Highlights, CTA, dan elemen UI)
- [x] Build `Hero.tsx` — **redesign**: jumbo tipografi sentral minimalis, tanpa blob gradient & tanpa panel foto artifisial, tanpa OpenNowBadge (pindah ke LocationCTA saja)
- [x] Build `Highlights.tsx` — **redesign**: editorial list tanpa kartu berlatar (ikon + hairline divider), grid 1/2/4 kolom
- [x] Build `FeaturedMenu.tsx` — **redesign**: bento grid (1 besar + 2 kompak desktop), kartu compact horizontal di mobile (tidak menjulur), placeholder foto tenang tanpa label teknis
- [x] Build `AboutPreview.tsx` — **redesign**: teks + pull-quote elegan (bukan panel foto), latar espresso solid tanpa gradasi
- [x] Build `GalleryPreview.tsx` — **redesign**: bento asimetris (1 besar kiri + 2 kecil + 1 lebar), caption muncul hover desktop / selalu terlihat mobile
- [x] Build `Testimonials.tsx` — **redesign**: carousel scroll-snap (swipe native + tombol panah, tanpa library), rating ringkas 1 bintang + skor
- [x] Build `LocationCTA.tsx` — **redesign**: panel datar tanpa glow, WhatsApp jadi CTA utama (solid), Maps outline
- [x] Compose `src/app/page.tsx` (komposisi modular bersih: Hero → Highlights → FeaturedMenu → AboutPreview → GalleryPreview → Testimonials → LocationCTA)
- [x] **Anti-slop cleanup**: hapus semua blob gradient/blur-3xl, radial-gradient, label "// TODO", "4:5 Ratio", "Est. 2024" dari UI; heading divariasikan (center ↔ left) agar tidak monoton
- [x] **Voice & style consistency pass**: seluruh copy Home diselaraskan ke satu register (hangat, tenang, minim slang) sesuai BRAND_VOICE; eyebrow seragam `text-terracotta`; panah CTA outline seragam `text-latte`; Highlights jadi editorial list (bukan kartu)
- [x] Verifikasi: `npm run lint` & `npm run build` sukses (0 errors, 0 warnings)
- [x] Verifikasi responsive visual di browser (375px mobile, 768px tablet, 1440px desktop) — bebas overflow horizontal di 375px

## Phase 5 — Menu Page
- [x] Render menu dari `data/menu.ts`, grouped by 5 kategori (Coffee, Non-Coffee, Food, Snack, Dessert)
- [x] Build `MenuItemRow.tsx` (baris menu tipografis klasik restoran, dotted leader, formatPrice Rupiah, tag terracotta, deskripsi)
- [x] Build `MenuCategoryNav.tsx` (sticky anchor nav h-16, horizontal scroll pill di mobile, murni tipografi tanpa emoji/state)
- [x] Build `MenuCategorySection.tsx` (render per kategori, latar berselang-seling charcoal & charcoal-darkest, layout 2 kolom restoran di lg)
- [x] Build `MenuHeader.tsx` (header minimalis, eyebrow terracotta, judul serif tenang, deskripsi single origin)
- [x] Build `MenuNotes.tsx` (informasi opsi oat milk, preferensi manis, panel rounded-lg senada dengan design tokens)
- [x] Build `MenuInquiryCTA.tsx` (panel penutup rounded-xl selaras dengan Home LocationCTA, WhatsApp deep-link menu_inquiry)
- [x] Compose `src/app/menu/page.tsx` (Server Component, static prerender, metadata SEO)
- [x] Pastikan markup semantic (<main>, <section>, <nav>, <article>, <h2>, <h3>) — bebas overflow horizontal di 375px
- [x] Verifikasi: `npm run lint` & `npm run build` sukses (0 errors, 0 warnings)

## Phase 6 — About Page
- [x] Build `AboutHero.tsx` (header tipografi terpusat, foto strip placeholder di ≥ sm, selaras MenuHeader)
- [x] Build `OurStory.tsx` (2 kolom teks + foto placeholder lg, narasi BRAND_VOICE tanpa klaim fiktif, CTA ke /menu)
- [x] Build `OurPhilosophy.tsx` (editorial list 3 nilai ala Highlights Home)
- [x] Build `OurSpace.tsx` (deskripsi atmosfer + mozaik 3 tile placeholder)
- [x] Build `BaristaQuote.tsx` (pull-quote terpusat, latar espresso, semantic blockquote/figcaption)
- [x] Build `InviteCTA.tsx` (panel penutup rounded-xl selaras LocationCTA, CTA WhatsApp general + /location)
- [x] Compose `src/app/about/page.tsx` (Server Component, static prerender, metadata SEO)
- [x] Pastikan semantic HTML (<main>, <section>, <figure>, <blockquote>) — tanpa overflow horizontal di 375px
- [x] Verifikasi: `npm run lint` & `npm run build` sukses (0 errors, 0 warnings), route `/about` muncul

## Phase 7 — Gallery Page
- [x] Grid/masonry layout (desktop 3-kolom CSS columns, tablet 2-kolom, mobile 1-kolom anti-overflow)
- [x] Kategori foto (Semua, Interior, Eksterior, Kopi, Makanan, Suasana) + filter interaktif murni useState
- [x] Implementasi aspect ratio pasti per orientasi (landscape, portrait, square) — CLS = 0, placeholder flat dengan penanda TODO untuk foto asli PHOTO_BRIEF.md
- [x] Build `GalleryHeader.tsx`, `GalleryFilterBar.tsx`, `GalleryGrid.tsx`, `GallerySection.tsx`, `InstagramTeaser.tsx`
- [x] Compose `src/app/gallery/page.tsx` (Server Component, metadata SEO, static prerender)
- [x] Verifikasi: `npm run lint` & `npm run build` sukses (0 errors, 0 warnings), route `/gallery` muncul

## Phase 8 — Location Page
- [x] Info alamat lengkap & landmark terpusat (`LocationHeader.tsx`, data dari `cafeInfo`) + status real-time `OpenNowBadge`
- [x] Jam operasional 7 hari (`OperatingHoursTable.tsx`, flex mobile-first tanpa overflow, highlight hari aktif)
- [x] Embed Google Maps responsif (`MapContainer.tsx`, aspect-[4/3] sm:aspect-[16/9] tanpa CLS) + tombol navigasi eksternal
- [x] Panduan akses & transportasi (`TransportGuide.tsx`: parkir, patokan, angkutan umum via `src/data/location.ts`)
- [x] Kontak terkurasi (`ContactCards.tsx`: WhatsApp, Instagram, Google Maps)
- [x] FAQ native tanpa JavaScript (`FAQSection.tsx`, semantik `<details>/<summary>`)
- [x] Compose `src/app/location/page.tsx` (Server Component, metadata SEO, static prerender)
- [x] Verifikasi: `npm run lint` & `npm run build` sukses (0 errors, 0 warnings), route `/location` muncul

## Phase 9 — Responsive Implementation
- [x] Test & fix di breakpoint mobile → tablet → desktop (teruji via browser subagent di 375px, 768px, 1024px, 1440px)
- [x] Pastikan tidak ada horizontal overflow (0 overflow di seluruh 5 rute halaman)
- [x] Pastikan CTA mudah ditekan di mobile (touch target utama ≥ 44×44dp: tombol hamburger 44px, sticky CTA 44px, primary buttons)
- [x] Pastikan tidak ada layout shift dari gambar/iframe (CLS = 0 via aspect ratio terkunci pada iframe & foto)

## Phase 10 — SEO Implementation
- [x] Metadata API per halaman (title, description) — `createPageMetadata()` di `src/lib/seo.ts`, keyword-rich sesuai isi tiap halaman
- [x] Open Graph tags (title, description, image, url) — default di `layout.tsx` + override per halaman, OG image generasi otomatis via `app/opengraph-image.tsx`
- [x] Twitter Card (`summary_large_image`) di metadata layout
- [x] `sitemap.xml` — `app/sitemap.ts` (5 halaman, priority & changeFrequency)
- [x] `robots.txt` — `app/robots.ts` (allow all + sitemap + host)
- [x] Structured Data / JSON-LD — `CafeOrCoffeeShop` + `WebSite` di layout, `FAQPage` (6 FAQ fasilitas) di `/location` via `src/components/seo/JsonLd.tsx`
- [x] `manifest.webmanifest` — `app/manifest.ts` (theme color, background, favicon)
- [x] `metadataBase` + canonical URL dari `src/config/site.ts` (SITE_URL)
- [x] Review semantic HTML (header, nav, main, section, article, footer) — 1 `<h1>` per halaman, konten fasilitas & FAQ selaras dengan copy
- [x] Verifikasi: `npm run lint` & `npm run build` sukses (0 errors, 0 warnings)

> Catatan: `SITE_URL` kini `https://cafesite-five.vercel.app` (domain produksi) — sudah masuk production build.

## Phase 11 — Accessibility
- [x] Cek contrast ratio warna — teks body `offwhite-muted`/`offwhite-darker` di atas charcoal/espresso ≥ 5:1 (pass); eyebrow `text-terracotta` dipakai cuma sebagai label dekoratif (heading serif yang bawa makna) — dipantau, bukan regresi design
- [x] Alt text relevan di semua gambar — bg hero ("Suasana hangat meja dan sudut kedai kopi…") & tile menu (nama item); placeholder ikon dekoratif `aria-hidden` (tanpa `alt` bermakna karena bukan foto)
- [x] Keyboard navigation & focus state — global `:focus-visible` outline terracotta di `globals.css` (a, button, input, summary, role=button, tabindex); skip-link "Langsung ke konten utama"; hamburger Esc/aria; carousel keyboard scroll
- [x] Button/link jelas & dapat dibedakan — CTA solid vs outline, tombol panah border+aria-label, tile kontak footer border; `::selection` difinekan
- [x] Semantic HTML review — 1 `<h1>`/halaman, nav/main/section/article/blockquote/figure/adress sesuai
- [ ] Langkah manual: verifikasi pembaca layar (NVDA/VoiceOver) + Lighthouse AX

## Phase 12 — Performance Optimization
- [x] LCP hero: `next/image` `priority` + `sizes="100vw"`, `quality` 90→80 (payload ≥ 30% lebih kecil, ditutup overlay gelap)
- [x] Lazy load gambar non-critical — selain hero, semua `next/image` default `loading="lazy"`; iframe Maps `loading="lazy"`
- [x] Output AVIF+WebP via `images.formats: ["image/avif", "image/webp"]` di `next.config.ts` (Order: AVIF diprioritaskan, WebP fallback)
- [x] Font optimization (`next/font/google`): Playfair Display + Plus Jakarta Sans `display:swap` + preload otomatis + subset latin; `color-scheme: dark` anti-flash
- [x] Review Server vs Client Components — 10 komponen `"use client"` semuanya interaktif (navbar, carousel, gallery grid/filter/lightbox, preview grid, badge timer, sticky CTA, copy address); seluruh halaman & section lain Server / static prerender (12 route)
- [ ] Audit Lighthouse produksi & pastikan target skor — manual (user/CI)

## Phase 13 — Testing
- [x] Test semua CTA — terverifikasi di HTML build: `wa.me` deep-link (general + reservasi, `text` URL-encoded), Instagram, Google Maps
- [x] Validasi structured data — JSON-LD CafeOrCoffeeShop/WebSite/FAQPage: parse JSON OK (± terkonfirmasi di HTML prerender)
- [x] `sitemap.xml` & `robots.txt` respond 200 di produksi
- [ ] Cross-browser check (Chrome, Safari, Firefox) — manual
- [ ] Cross-device check (real mobile device) — manual
- [ ] Rich Results Test Google — manual (akun Google)

## Phase 14 — Deployment
- [x] Setup domain — https://cafesite-five.vercel.app (Vercel production alias)
- [x] Deploy (Vercel) — production build Next.js 16, repo GitHub `Grd45bisa/cafesite` terhubung → auto-deploy tiap push ke `main`
- [x] Final check di production URL — status 200, title SEO benar, sitemap 200
- [ ] Submit sitemap ke Google Search Console — butuh akun & verifikasi domain oleh user

## Phase 15 — Handover
- [x] Dokumentasi singkat cara update konten — `CARA_UPDATE_KONTEN.md`
- [ ] Serah terima ke client + penjelasan batasan versi gratis — oleh user
- [x] Catat roadmap Phase 2 (dashboard, reservasi, online ordering, CMS) — lihat `CONTENT_QUESTIONNAIRE.md` §6 & batasan di `AGENTS.md` §5

## Phase 16 — Dashboard & Pemesanan (dalam pengerjaan)
> Keputusan client: pembayaran online ditunda dan ditampilkan sebagai **"Segera hadir"**. Checkout aktif yang dituju adalah **bayar di kasir (COD)**. Konfigurasi operasional: admin + staf, upload foto, publikasi langsung, QR bisa dicetak, makan di tempat dan bawa pulang.

- [x] Tambahkan dependensi Supabase browser/server dan QR generator (`@supabase/supabase-js`, `qrcode`)
- [x] Rancang model data TypeScript untuk role, modul staf, meja, pesanan, item pesanan, serta cart (`src/types/{operations,admin,ordering}.ts`)
- [x] Siapkan skema Supabase copy-paste (`supabase/01_schema.sql`): tabel, index, RLS, Storage, Realtime, dan fungsi transaksi atomik untuk pesanan/status meja
- [x] Siapkan helper konfigurasi Supabase browser/server dan validasi input server yang ketat
- [x] Buat halaman dashboard `/admin` dengan login Supabase, pembatasan akses admin/staf, navigasi modul, serta tampilan saat konfigurasi belum tersedia
- [x] Pisahkan autentikasi dan dashboard: `/auth` khusus login, `/dashboard` wajib sesi, `/admin` redirect ke `/dashboard`; website publik tidak menampilkan tombol login
- [x] Buat halaman `/order` dan `/order/[id]`, menu pemesanan responsif, cart localStorage, deteksi query `?meja=`, serta pesan status konfigurasi
- [x] Tetapkan COD sebagai metode pembayaran yang diizinkan dalam validasi dan skema database; pembayaran online ditandai segera hadir
- [x] Dokumentasikan langkah penyiapan project, akun admin pertama, environment variable, dan batasan keamanan (`SETUP_SUPABASE.md`)
- [x] Siapkan SQL satu kali untuk menjadikan seluruh akun Supabase yang sudah ada sebagai admin, dengan pengecualian wajib untuk akun customer anonim (`supabase/02_promote_existing_users_to_admin.sql`)
- [x] Verifikasi build Next.js 16 berhasil: 14 route termasuk `/admin`, `/order`, `/order/[id]`
- [ ] Buat seluruh Route Handlers API yang menghubungkan UI ke fungsi Supabase
  - [x] Catalog menu/meja, checkout COD atomik, add-on, dan baca status pesanan customer
  - [x] Bootstrap login dashboard dan baca/update status antrian staff
  - [x] Baca/simpan konten kafe, galeri, testimoni, FAQ, panduan lokasi, menu, meja, dan pengaturan modul lewat endpoint berotorisasi
  - [x] CRUD UI khusus menu: tambah, edit, hapus, kategori, harga, deskripsi, tag, unggulan, urutan, tersedia/habis, dan upload foto Supabase Storage
  - [x] CRUD UI khusus meja/QR (lantai, status, QR unduh/cetak, realtime patch lokal)
  - [x] Kanban pesanan realtime, status/pembayaran, notifikasi suara, badge antrean, dan toggle cepat menu habis
  - [ ] Laporan agregat
- [ ] Implementasikan UI operasional penuh tiap modul dashboard (antrian live, CRUD menu/konten, unggah gambar, denah drag-drop, cetak QR, laporan, pengaturan modul)
- [ ] Hubungkan website publik ke data dashboard agar menu, galeri, lokasi, FAQ, dan testimoni langsung memakai database
- [ ] Implementasikan seluruh Realtime operasional
  - [x] Pelacakan status pesanan customer melalui Supabase Realtime
  - [ ] Antrian staff, pembaruan meja, dan notifikasi suara/vibrasi pesanan baru
- [ ] Jalankan SQL pada project Supabase milik client, buat akun admin pertama, isi environment Vercel, dan uji RLS/Realtime end-to-end
- [ ] Masukkan data asli cafe (logo, foto, menu, alamat, jam, WhatsApp, Instagram) sebelum peluncuran

## Tugas Terbaru — Draft (masih dipikirkan)

### WA Bot — Plan (+ Prompt per Phase) di `WA_BOT_PLAN.md`
> Bot WhatsApp (wa-webjs) di folder `server/` terpisah dari Next.js. AI memakai Nemotron 3.5 Lightning via **NVIDIA API langsung** (`integrate.api.nvidia.com`, model `nvidia/nemotron-3.5-lightning-30b-a3b`, env `NVIDIA_API_KEY`/`NVIDIA_MODEL`). RAG di Supabase + pgvector. Order dev pakai keyword `bayar` (payment gateway iPaymu ditunda, lihat `ipaymu.md`).
> - [x] Riset model Nemotron (Lightning/Nano Omni/Ultra) + harga & model ID
> - [x] Implementasi Phase 1 (folder `server/` + wa-webjs login/QR/reconnect) & Phase 2 (AI Hub Nemotron via NVIDIA API + guard topik) — build 0 error
> - [x] Implementasi Phase 3 (RAG: `server/src/rag/` + SQL `supabase/04_rag_documents.sql`, embedding NVIDIA `nv-embedqa-e5-v5`, CLI `rag:ingest`) — build 0 error

## Tugas Terbaru — Draft (masih dipikirkan)

### Admin Dashboard — Phase 2 (berbayar) — Opsi A: Content-Only CMS + Online Ordering (ala Mi Gacoan) + Payment Gateway
> Implementasi awal sudah tersedia: skema Supabase/RLS/Realtime di `supabase/01_schema.sql`, dashboard di `/admin`, dan alur `/order`. Aktivasi menunggu project Supabase, akun admin, serta data asli kafe. Pembayaran online ditunda atas keputusan client; pembayaran kasir/COD menjadi alur aktif.
**Keputusan:** Dashboard = control panel konten + penerima pesanan; website utama baca dari database. **Opsi A** → dashboard mengurus *konten data* (menu, info, galeri, testimoni, FAQ, panduan). Copy marketing (hero headline, intro section, cerita About) tetap di kode/copywriter. **Tambah:** customer bisa **pesan via website** tanpa akun, alur ala Mi Gacoan + **QR per meja & sketsa meja per lantai** + **Payment Gateway** (wajib ada, tapi provider masih dicari — yang registrasinya simpel, modal KTP saja).

**Arsitektur (rencana):**
- Database + Auth + Storage + Realtime: **Supabase** (Postgres + Auth + Storage + Realtime via **WebSocket**, free tier) — semua status pesanan, notifikasi, dan perubahan data dikirim real-time tanpa refresh
- Admin/staff di route `/admin` (login), web tetap statis
- Save → "Simpan & Publikasikan" (revalidate/ISR); menu **DB-driven** (sumber sama dgn yang dipesan customer)
- Cart customer pakai localStorage + React Context (tanpa library tambahan)
- **Payment Gateway** → integrasi menunggu keputusan provider (webhook pembayaran diarahkan ke server route/edge function; COD tetap diproses manual oleh kasir)
- **Sistem pemesanan wajib pakai WebSocket** — customer & staff/admin terima update real-time (pesanan masuk, status berubah, item ditambah) tanpa harus refresh

**Alur pemesanan customer (ala Gacoan, tanpa akun):**
- [ ] Scan **QR di tiap meja** (atau buka menu manual) → langsung buka halaman pemesanan dengan meja terdeteksi (mis. `/order?meja=L1-03`)
- [ ] Menu page → tombol "Pesan" tiap item (qty + catatan request)
- [ ] Keranjang (drawer) → checkout singkat: nama + no HP
- [ ] Dapat nomor antrian (mis. `A-023`)
- [ ] **Pembayaran:** pilih metode — **Payment Gateway** (QRIS / ewallet / kartu) ATAU **COD / bayar di kasir**
- [ ] Customer (setelah pesan) melihat **status pesanan ter-update real-time via WebSocket** (Menunggu → Diproses → Siap diambil → Selesai) tanpa refresh — user dan staff/admin lihat hal yang sama
- [ ] Staff update status: Menunggu → Diproses → Siap diambil → Selesai

**Modul dashboard (peta koneksi ke website utama):**
- [ ] **Pesanan (antrian real-time)** — list pesanan masuk (siapa, pesen apa, qty, total, status), update via Supabase Realtime → baru, modul utama staff
- [ ] **Menu** — CRUD item (nama, deskripsi, harga, kategori, tags, isFeatured, urutan, foto) → `/menu`, Featured Home, & sumber yang dipesan
- [ ] **Tata Letak Meja & QR** — tambah/hapus **lantai** (Lantai 1, Lantai 2, dst. — fleksibel), **sketsa meja per lantai** (edit posisi drag & drop), tiap meja punya ID unik + QR (generate & export untuk cetak stiker), status meja kosong/terisi → customer scan QR buat pesan
- [ ] **Info Kafe & Jam Buka** — nama, tagline, alamat, landmark, kota, jam 7 hari + openTime/closeTime + notes, WhatsApp, Instagram, Maps/UAPI embed → Hero/LocationCTA/Location/Footer
- [ ] **Galeri** — upload foto, kategori, caption, aspect, urutan → Home collage & `/gallery`
- [ ] **Testimoni** — nama, sumber, rating, komentar, tanggal → Home
- [ ] **FAQ & Panduan Lokasi** — FAQ (ikut JSON-LD FAQPage Google/AI) + kartu transportasi → `/location`
- [ ] (admin only) **Module Management** — toggle module aktif/non-aktif untuk dashboard staff
- [ ] (opsional dipertimbangkan nanti) **Pengaturan SEO** — deskripsi, keywords, SITE_URL

**Fitur operasional (Must-Have — tanpa ini operasional cafe nggak jalan):**
- [ ] **Notifikasi pesanan baru — real-time via WebSocket** — suara/vibrasi di dashboard staff saat pesanan masuk (Notification API + Web Audio API, tanpa dependency baru)
- [ ] **Status meja** — kosong / terisi / butuh dibersihkan; setelah pesanan selesai otomatis jadi "butuh dibersihkan", staff yang update
- [ ] **Item "habis" / unavailable** — toggle dari staff/admin → otomatis hilang dari menu yang bisa dipesan customer
- [ ] **Order history + laporan ringkas** — pendapatan **hari ini / minggu ini / bulan ini**, filter rentang tanggal (tanggal X s/d tanggal Y, maksimal 1 bulan), item terlaris, jam ramai (buat admin)
- [ ] **Add-on ke pesanan yang sama** — customer bisa tambah item ke pesanan yang masih berjalan tanpa buat pesanan baru

**Role (konsep: dashboard staff = dashboard admin, beda hanya pengaturan module):**
- [ ] **Admin** — akses semua module + **Module Management**: setting module mana yang aktif/non-aktif untuk dashboard staff (toggle per module)
- [ ] **Staff/Kasir** — UI identik dengan admin; hanya melihat module yang di-enable admin (mis. default cuma "Pesanan" & "Status"; "Testimoni"/"Pengaturan" bisa di-nonaktifkan admin)
- [ ] Setiap dashboard website punya admin + staff — perbedaan cuma konfigurasi module (bukan beda aplikasi/layout)

**Pertanyaan yang belum dijawab user (masih menunggu):**
- [ ] Dipakai siapa? Owner sendiri / tim+karyawan (butuh berapa akun/role)?
- [ ] Upload foto langsung dari dashboard: wajib atau tidak?
- [ ] Fitur reservasi (list pemesanan dari WA) ikut dashboard ini atau fase terpisah?
- [ ] Save langsung update web, atau ada tombol "Publish" dulu?
- [x] Payment gateway ditunda oleh client; tampilkan "Segera hadir", aktifkan COD/bayar di kasir
- [x] QR meja perlu dapat diekspor untuk cetak stiker
- [x] Sediakan opsi Makan di Tempat dan Bawa Pulang
- [ ] Sketsa meja: posisi meja bebas (drag & drop manual) atau pakai grid/kamar tetap (mis. 2x2, 3x3) biar rapi?

---

### Catatan lama (sebelumnya)
- [ ] (perlu diputuskan) Arah selanjutnya: versi lanjutan / perombakan / fitur baru
- [ ] Kandidat: data asli client (alamat, jam, menu, foto, nomor WA) masuk ke `src/data/*`

## WhatsApp Bot — Dashboard PDF RAG
- [x] Modul wa_bot di navigasi dashboard, upload PDF, polling status, proses ulang, hapus per source.
- [x] API berotorisasi dengan validasi MIME/header PDF/ukuran/path; tulis memakai service_role.
- [x] Migrasi 06: bucket, RLS, antrean, klaim atomik, penggantian chunk transaksional halfvec(2048).
- [x] Pipeline PDF/chunk/embed bersama CLI dan worker rag:watch; retry download satu kali, isolasi kegagalan job.
- [x] Panduan aktivasi dan pemulihan worker di SETUP_WA_BOT_DASHBOARD.md.
- [x] Verifikasi build root/server sukses (0 error); 2 tes pipeline lokal lolos (PDF invalid/oversize, ekstraksi nyata, embedding gagal tidak menulis, hasil job dibatalkan).
- [ ] Terapkan migrasi 06 dan uji upload → jawaban WhatsApp, re-upload, delete, RLS staff pada deployment.


## Perbaikan kontrol percakapan WhatsApp
- [x] Deduplikasi ID pesan sebelum async, hilangkan fallback kirim ulang yang berpotensi membalas dua kali.
- [x] Awalan @bot untuk satu pertanyaan; @bot saja aktifkan mode per nomor, @tutup nonaktifkan bahkan saat rate-limit.
- [x] Timeout 5 menit tanpa chat, pembersihan sesi sementara, dan pembatalan balasan AI yang masih diproses.
- [x] Build bot sukses; 5 tes regresi lolos (isolasi nomor, awalan, timeout, deduplikasi, pengiriman tanpa fallback, tutup saat AI berjalan/rate-limit).
- [ ] Uji pengiriman WhatsApp langsung setelah restart proses bot deployment.

