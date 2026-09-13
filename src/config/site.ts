/**
 * Site-wide SEO & brand configuration — single source of truth.
 * Dipakai oleh metadata API, sitemap, robots, manifest, dan JSON-LD.
 *
 * // TODO: ganti SITE_URL dengan domain produksi asli setelah deploy.
 * Keywords/deskripsi menargetkan penelusuran lokal: cafe enak & nyaman
 * Jakarta Selatan/Tangerang, fasilitas kerja (Wi-Fi, colokan), dll.
 */
export const SITE_URL = "https://cafesite.example.com";

export const siteConfig = {
  name: "CafeSite",
  tagline: "Kopi Kurasi & Ruang Tenang Jakarta Selatan",
  description:
    "CafeSite — kafe enak dan nyaman di Jakarta Selatan. Biji kopi single origin Nusantara, Wi-Fi kencang, colokan di hampir tiap meja, area semi-outdoor, musholla, dan ruang adem untuk kerja remote. Tempat ngopi & nongkrong dengan fasilitas lengkap untuk kerja atau kumpul rombongan.",
  keywords: [
    "cafe enak Jakarta Selatan",
    "kafe nyaman Jakarta",
    "cafe anyar Tangerang",
    "kopi enak Jakarta",
    "tempat nongkrong enak",
    "cafe buat kerja remote",
    "wifi kencang cafe",
    "cafe colokan listrik",
    "cafe semi outdoor",
    "cafe fasilitas lengkap",
    "kopi single origin Nusantara",
    "cafe buat rombongan",
  ],
  locale: "id_ID",
  siteName: "CafeSite",
};