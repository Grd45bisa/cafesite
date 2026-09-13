import { CafeInfo } from "@/types";

// TODO: ganti dengan data asli client setelah CONTENT_QUESTIONNAIRE.md dikembalikan
export const cafeInfo: CafeInfo = {
  name: "CafeSite",
  tagline: "Kopi yang Diseduh Pelan-Pelan, Ruang yang Terasa Milik Kamu",
  address: "Jl. Senopati Raya No. 12, Kebayoran Baru", // TODO: ganti dengan alamat asli client
  city: "Jakarta Selatan", // TODO: ganti dengan kota asli client
  landmark: "100m dari perempatan lampu merah, seberang taman kota", // TODO: ganti dengan patokan asli client
  openingHours: [
    // TODO: ganti dengan jadwal jam operasional asli client
    { day: "Senin", hours: "08:00 – 22:00", isOpen: true, openTime: "08:00", closeTime: "22:00", notes: "Last order 21:30" },
    { day: "Selasa", hours: "08:00 – 22:00", isOpen: true, openTime: "08:00", closeTime: "22:00", notes: "Last order 21:30" },
    { day: "Rabu", hours: "08:00 – 22:00", isOpen: true, openTime: "08:00", closeTime: "22:00", notes: "Last order 21:30" },
    { day: "Kamis", hours: "08:00 – 22:00", isOpen: true, openTime: "08:00", closeTime: "22:00", notes: "Last order 21:30" },
    { day: "Jumat", hours: "08:00 – 23:00", isOpen: true, openTime: "08:00", closeTime: "23:00", notes: "Last order 22:30" },
    { day: "Sabtu", hours: "07:00 – 23:00", isOpen: true, openTime: "07:00", closeTime: "23:00", notes: "Last order 22:30" },
    { day: "Minggu", hours: "07:00 – 22:00", isOpen: true, openTime: "07:00", closeTime: "22:00", notes: "Last order 21:30" },
  ],
  whatsapp: "6281234567890", // TODO: ganti dengan nomor WhatsApp aktif client
  whatsappFormatted: "+62 812-3456-7890", // TODO: ganti dengan format nomor display client
  instagram: "@CafeSite", // TODO: ganti dengan username Instagram asli client
  instagramUrl: "https://instagram.com/CafeSite", // TODO: ganti dengan URL profil Instagram asli client
  googleMapsUrl: "https://maps.google.com/?q=Jl.+Senopati+Raya+No.+12,+Kebayoran+Baru,+Jakarta+Selatan", // TODO: ganti dengan link Google Maps lokasi asli client
  googleMapsEmbedUrl: "https://maps.google.com/maps?q=Jl.+Senopati+Raya+No.+12,+Kebayoran+Baru,+Jakarta+Selatan&t=&z=15&ie=UTF8&iwloc=&output=embed", // TODO: ganti dengan iframe embed Maps client
};
