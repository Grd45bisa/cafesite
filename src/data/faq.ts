import { FaqItem } from "@/types";

// TODO: ganti dengan data FAQ spesifik dari client
export const faqItems: FaqItem[] = [
  {
    id: "faq-01",
    question: "Apakah tersedia koneksi Wi-Fi dan colokan listrik?",
    answer: "Ya, Wi-Fi berkecepatan tinggi stabil dan stopkontak tersedia di hampir semua meja untuk kenyamanan bekerja.",
    category: "facility",
  },
  {
    id: "faq-02",
    question: "Apakah bisa melakukan reservasi meja untuk rombongan?",
    answer: "Tentu bisa. Silakan chat tim kami via WhatsApp minimal 3 jam sebelum waktu kedatangan untuk pengaturan meja terbaik.",
    category: "reservation",
  },
  {
    id: "faq-03",
    question: "Apakah tersedia area khusus merokok (smoking area)?",
    answer: "Tersedia area outdoor terpisah yang asri, sejuk, dan tidak mengganggu tamu di ruang indoor ber-AC.",
    category: "facility",
  },
  {
    id: "faq-04",
    question: "Apakah ada opsi susu nabati untuk menu kopi?",
    answer: "Ya, kami menyediakan opsi pengganti susu seperti Oat Milk untuk seluruh menu minuman berbasis espresso.",
    category: "menu",
  },
  {
    id: "faq-05",
    question: "Apakah kafe ramah hewan peliharaan (pet-friendly)?",
    answer: "Area outdoor kami menyambut hewan peliharaan berukuran kecil dengan catatan menggunakan tali kekang dan menjaga kenyamanan bersama.",
    category: "general",
  },
];
