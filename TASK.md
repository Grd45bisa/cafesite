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

> Catatan: `SITE_URL` masih placeholder `https://cafesite.example.com` — wajib diganti domain produksi (`src/config/site.ts`) sebelum deploy, agar canonical/sitemap/robots/OG benar.

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