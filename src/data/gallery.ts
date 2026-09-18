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
    src: "/Image/Gallery/gal-01-window-table.jpg",
    alt: "Meja pojok kayu di samping jendela kafe dengan cahaya sore yang hangat",
    caption:
      "Sudut ini yang biasanya dipilih orang yang lagi mikir atau sekadar males ditanya-tanya.",
  },
  {
    id: "gal-02",
    category: "coffee",
    aspect: "portrait",
    year: "2024",
    title: "Seduhan Pagi Hari",
    src: "/Image/Gallery/gal-02-morning-brew.jpg",
    alt: "Barista menyeduh kopi manual brew V60 dengan uap mengepul hangat",
    caption:
      "Uap pertama dari cangkir V60 pagi hari. Kadang kopinya cuma alasan buat duduk diam.",
  },
  {
    id: "gal-03",
    category: "exterior",
    aspect: "landscape",
    year: "2024",
    title: "Sore Setelah Hujan",
    src: "/Image/Gallery/gal-03-after-rain.jpg",
    alt: "Fasad kafe di pinggir jalanan basah setelah hujan sore dengan cahaya lampu hangat",
    caption:
      "Sore yang mayan langka: langit sebentar cerah, jalanan depan masih basah sisa gerimis.",
  },
  {
    id: "gal-04",
    category: "atmosphere",
    aspect: "square",
    year: "2024",
    title: "Sudut Tenang",
    src: "/Image/Gallery/gal-04-quiet-corner.jpg",
    alt: "Suasana sudut tenang kafe dengan pencahayaan hangat",
    caption:
      "Seseorang yang duduk sendirian di pojok, nggak buka HP, cuma mandang ke luar lama banget.",
  },
  {
    id: "gal-05",
    category: "food",
    aspect: "portrait",
    year: "2024",
    title: "Pasta Hangat Sore",
    src: "/Image/Gallery/gal-05-pasta-sore.jpg",
    alt: "Sepiring fettuccine carbonara creamy hangat dengan potongan ayam panggang",
    caption:
      "Pasta hangat pas hujan deras di luar. Porsinya pas buat nemenin sampai gerimis reda.",
  },
  {
    id: "gal-06",
    category: "interior",
    aspect: "portrait",
    year: "2024",
    title: "Lampu Bar Kopi",
    src: "/Image/Gallery/gal-06-lampu-bar.jpg",
    alt: "Lampu bar kopi menyala hangat di interior kafe",
    caption:
      "Lampu gantung di atas meja bar, dinyalain pas jam lima sore saat langit mulai remang.",
  },
  {
    id: "gal-07",
    category: "coffee",
    aspect: "landscape",
    year: "2024",
    title: "Dua Cangkir Obrolan",
    src: "/Image/Gallery/gal-07-dua-cangkir.jpg",
    alt: "Segelas es americano segar dengan crema tebal di atas meja kayu",
    caption:
      "Dua cangkir sisa obrolan dua jam. Yang satu habis duluan, yang satu dingin pelan-pelan.",
  },
  {
    id: "gal-08",
    category: "exterior",
    aspect: "portrait",
    year: "2024",
    title: "Pintu Masuk Pagi",
    src: "/Image/Gallery/gal-08-pintu-masuk.jpg",
    alt: "Pintu masuk depan kafe dengan tanaman hias",
    caption:
      "Pintu depan sebelum kami buka jam delapan pagi. Masih sepi, udara jalanan masih dingin.",
  },
  {
    id: "gal-09",
    category: "food",
    aspect: "square",
    year: "2024",
    title: "Butter Croissant",
    src: "/Image/Gallery/gal-09-croissant.jpg",
    alt: "Artisanal butter croissant renyah keemasan di atas papan kayu",
    caption:
      "Croissant yang renyah berantakan di meja. Remahannya sengaja nggak langsung dibersihin.",
  },
  {
    id: "gal-10",
    category: "atmosphere",
    aspect: "landscape",
    year: "2024",
    title: "Meja Komunal Siang",
    src: "/Image/Gallery/gal-10-meja-komunal.jpg",
    alt: "Meja komunal kafe yang hangat dan ramah",
    caption:
      "Meja panjang di tengah ruang. Nggak saling kenal, tapi sama-sama sibuk di depan layar masing-masing.",
  },
  {
    id: "gal-11",
    category: "interior",
    aspect: "square",
    year: "2024",
    title: "Rak Bacaan Kecil",
    src: "/Image/Gallery/gal-11-rak-bacaan.jpg",
    alt: "Rak buku dan sudut interior kafe yang nyaman",
    caption:
      "Rak buku kecil di samping kasir. Bukunya jarang ganti, tapi selalu ada yang baca ulang.",
  },
  {
    id: "gal-12",
    category: "coffee",
    aspect: "square",
    year: "2024",
    title: "Latte di Meja Kayu",
    src: "/Image/Gallery/gal-12-latte-kayu.png",
    alt: "Caramel macchiato dengan saus karamel lezat di atas meja kayu",
    caption:
      "Latte hangat di meja kayu. Busa susunya tebal, belum diaduk karena sayang.",
  },
  {
    id: "gal-13",
    category: "food",
    aspect: "landscape",
    year: "2024",
    title: "Nasi Goreng Kampung",
    src: "/Image/Gallery/gal-13-nasgor.jpg",
    alt: "Sepiring nasi goreng kampung rempah dengan telur mata sapi dan kerupuk",
    caption:
      "Sepiring nasi goreng yang dipesen pas jam nanggung, waktu perut mulai rewel minta diisi.",
  },
  {
    id: "gal-14",
    category: "exterior",
    aspect: "square",
    year: "2024",
    title: "Plang Nama Dinding Bata",
    src: "/Image/Gallery/gal-14-plang-nama.jpg",
    alt: "Signage kafe di fasad dinding bata",
    caption:
      "Plang nama kecil di dinding bata. Sering dilewati orang pulang kerja yang langkahnya pelan.",
  },
  {
    id: "gal-15",
    category: "atmosphere",
    aspect: "portrait",
    year: "2024",
    title: "Jendela Kaca Saat Gerimis",
    src: "/Image/Gallery/gal-15-jendela-gerimis.jpg",
    alt: "Suasana nyaman di dekat jendela kaca kafe saat gerimis",
    caption:
      "Hujan sore di balik kaca jendela. Yang di dalam sibuk ngobrol pelan, yang di luar neduh.",
  },
];
