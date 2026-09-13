import { GalleryCategory, GalleryPhoto } from "@/types";

export interface GalleryCategoryMeta {
  id: "all" | GalleryCategory;
  name: string;
}

export const galleryCategories: GalleryCategoryMeta[] = [
  { id: "all", name: "Semua" },
  { id: "interior", name: "Interior" },
  { id: "exterior", name: "Eksterior" },
  { id: "coffee", name: "Kopi" },
  { id: "food", name: "Makanan" },
  { id: "atmosphere", name: "Suasana" },
];

/**
 * Data foto galeri CafeSite.
 * // TODO: ganti dengan path foto asli client sesuai checklist PHOTO_BRIEF.md
 * Caption bernada kenangan kasual, hangat, jujur, tanpa klise AI.
 */
export const galleryPhotos: GalleryPhoto[] = [
  {
    id: "gal-01",
    category: "interior",
    aspect: "landscape",
    year: "2024",
    title: "Meja Pojok Jendela",
    caption:
      "Sudut ini yang biasanya dipilih orang yang lagi mikir atau sekadar males ditanya-tanya.",
  },
  {
    id: "gal-02",
    category: "coffee",
    aspect: "portrait",
    year: "2024",
    title: "Seduhan Pagi Hari",
    caption:
      "Uap pertama dari cangkir V60 pagi hari. Kadang kopinya cuma alasan buat duduk diam.",
  },
  {
    id: "gal-03",
    category: "exterior",
    aspect: "landscape",
    year: "2024",
    title: "Sore Setelah Hujan",
    caption:
      "Sore yang mayan langka: langit sebentar cerah, jalanan depan masih basah sisa gerimis.",
  },
  {
    id: "gal-04",
    category: "atmosphere",
    aspect: "square",
    year: "2024",
    title: "Sudut Tenang",
    caption:
      "Seseorang yang duduk sendirian di pojok, nggak buka HP, cuma mandang ke luar lama banget.",
  },
  {
    id: "gal-05",
    category: "food",
    aspect: "portrait",
    year: "2024",
    title: "Pasta Hangat Sore",
    caption:
      "Pasta hangat pas hujan deras di luar. Porsinya pas buat nemenin sampai gerimis reda.",
  },
  {
    id: "gal-06",
    category: "interior",
    aspect: "portrait",
    year: "2024",
    title: "Lampu Bar Kopi",
    caption:
      "Lampu gantung di atas meja bar, dinyalain pas jam lima sore saat langit mulai remang.",
  },
  {
    id: "gal-07",
    category: "coffee",
    aspect: "landscape",
    year: "2024",
    title: "Dua Cangkir Obrolan",
    caption:
      "Dua cangkir sisa obrolan dua jam. Yang satu habis duluan, yang satu dingin pelan-pelan.",
  },
  {
    id: "gal-08",
    category: "exterior",
    aspect: "portrait",
    year: "2024",
    title: "Pintu Masuk Pagi",
    caption:
      "Pintu depan sebelum kami buka jam delapan pagi. Masih sepi, udara jalanan masih dingin.",
  },
  {
    id: "gal-09",
    category: "food",
    aspect: "square",
    year: "2024",
    title: "Butter Croissant",
    caption:
      "Croissant yang renyah berantakan di meja. Remahannya sengaja nggak langsung dibersihin.",
  },
  {
    id: "gal-10",
    category: "atmosphere",
    aspect: "landscape",
    year: "2024",
    title: "Meja Komunal Siang",
    caption:
      "Meja panjang di tengah ruang. Nggak saling kenal, tapi sama-sama sibuk di depan layar masing-masing.",
  },
  {
    id: "gal-11",
    category: "interior",
    aspect: "square",
    year: "2024",
    title: "Rak Bacaan Kecil",
    caption:
      "Rak buku kecil di samping kasir. Bukunya jarang ganti, tapi selalu ada yang baca ulang.",
  },
  {
    id: "gal-12",
    category: "coffee",
    aspect: "square",
    year: "2024",
    title: "Latte di Meja Kayu",
    caption:
      "Latte hangat di meja kayu. Busa susunya tebal, belum diaduk karena sayang.",
  },
  {
    id: "gal-13",
    category: "food",
    aspect: "landscape",
    year: "2024",
    title: "Nasi Goreng Kampung",
    caption:
      "Sepiring nasi goreng yang dipesen pas jam nanggung, waktu perut mulai rewel minta diisi.",
  },
  {
    id: "gal-14",
    category: "exterior",
    aspect: "square",
    year: "2024",
    title: "Plang Nama Dinding Bata",
    caption:
      "Plang nama kecil di dinding bata. Sering dilewati orang pulang kerja yang langkahnya pelan.",
  },
  {
    id: "gal-15",
    category: "atmosphere",
    aspect: "portrait",
    year: "2024",
    title: "Jendela Kaca Saat Gerimis",
    caption:
      "Hujan sore di balik kaca jendela. Yang di dalam sibuk ngobrol pelan, yang di luar neduh.",
  },
];
