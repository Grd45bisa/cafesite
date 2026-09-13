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

## Phase 4 — Home Page
- [x] Build `icons.tsx` (ikon garis tipis stroke-consistent untuk Highlights, CTA, dan elemen UI)
- [x] Build `Hero.tsx` (split layout 2 kolom di desktop, headline Playfair, subheadline, OpenNowBadge prop server, CTA "Lihat Menu" & "Buka Maps", foto frame 4:5 CLS-safe)
- [x] Build `Highlights.tsx` (4 brand highlights: Biji Kopi Kurasi, Ruang Tenang WFC, Wi-Fi Cepat & Stabil, Seduhan Artisanal, grid 2x2 mobile / 4 desktop)
- [x] Build `FeaturedMenu.tsx` (3 menu unggulan terfavorit, formatPrice Rupiah, aspect 1:1, CTA ke `/menu`)
- [x] Build `AboutPreview.tsx` (2 kolom desktop / 1 mobile, narasi brand voice otentik, palet deep espresso, CTA ke `/about`)
- [x] Build `GalleryPreview.tsx` (4 foto atmosferik aspect-4/5, grid 2x2 mobile / 4 desktop, CTA ke `/gallery`)
- [x] Build `Testimonials.tsx` (3 ulasan pengunjung nyata, rating bintang vektor monokrom tanpa emoji, semantic blockquote)
- [x] Build `LocationCTA.tsx` (alamat singkat, jam operasional hari ini via OpenNowBadge, tombol Maps & WA deep-link reservation)
- [x] Compose `src/app/page.tsx` (komposisi modular bersih: Hero → Highlights → FeaturedMenu → AboutPreview → GalleryPreview → Testimonials → LocationCTA)
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
- [ ] Section Our Story
- [ ] Section Our Philosophy
- [ ] Section Our Space
- [ ] Gallery/atmosphere snippet

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
- [ ] Metadata API per halaman (title, description)
- [ ] Open Graph tags (title, description, image, url)
- [ ] `sitemap.xml`
- [ ] `robots.txt`
- [ ] Structured Data / JSON-LD (LocalBusiness / CafeOrCoffeeShop)
- [ ] Review semantic HTML (header, nav, main, section, article, footer)

## Phase 11 — Accessibility
- [ ] Cek contrast ratio warna (khususnya teks di atas warna gelap/terracotta)
- [ ] Alt text relevan di semua gambar
- [ ] Keyboard navigation & focus state
- [ ] Button/link jelas dan dapat dibedakan

## Phase 12 — Performance Optimization
- [ ] Audit dengan Lighthouse, target skor sesuai kesepakatan
- [ ] Lazy load gambar non-critical
- [ ] Font optimization (`next/font`)
- [ ] Compress & optimize semua asset foto
- [ ] Review penggunaan Server Components vs Client Components

## Phase 13 — Testing
- [ ] Cross-browser check (Chrome, Safari, Firefox)
- [ ] Cross-device check (real mobile device jika memungkinkan)
- [ ] Test semua CTA (WhatsApp link, Maps link, Instagram link)
- [ ] Validasi metadata & structured data (Rich Results Test dari Google)

## Phase 14 — Deployment
- [ ] Setup domain
- [ ] Deploy (Vercel direkomendasikan untuk Next.js)
- [ ] Final check di production URL
- [ ] Submit sitemap ke Google Search Console

## Phase 15 — Handover
- [ ] Dokumentasi singkat cara update konten (jika ada yang bisa diubah client)
- [ ] Serah terima ke client + penjelasan batasan versi gratis
- [ ] Tawarkan roadmap Phase 2 (dashboard, reservasi, dll.)