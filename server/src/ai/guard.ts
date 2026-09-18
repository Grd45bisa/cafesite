export const OFF_TOPIC_REPLY =
  "Maaf, saya hanya bisa membantu soal CafeSite ☕ Tanya seputar menu, jam buka, atau lokasi ya.";

/**
 * Kata kunci yang menandakan pesan relevan dengan CafeSite (menu, jam buka,
 * lokasi, meja, pemesanan, dsb). Daftar sengaja mencampur Bahasa Indonesia
 * dan Inggris karena pelanggan bisa menulis dengan salah satu.
 */
const CAFE_KEYWORDS: readonly string[] = [
  "menu",
  "harga",
  "kopi",
  "espresso",
  "latte",
  "cappuccino",
  "macha",
  "matcha",
  "croissant",
  "cireng",
  "cheesecake",
  "carbonara",
  "nasi goreng",
  "americano",
  "mocktail",
  "teh",
  "minum",
  "minuman",
  "makan",
  "makanan",
  "dessert",
  "snack",
  "jam",
  "buka",
  "tutup",
  "lokasi",
  "alamat",
  "meja",
  "pesan",
  "order",
  "reservasi",
  "reservation",
  "cafesite",
  "cafe",
  "kedai",
  "wifi",
  "parkir",
  "open",
  "close",
  "where",
  "price",
  "table",
  "menu apa",
  "jam berapa",
];

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

/**
 * Guard pra-AI: kalau pesan tidak mengandung satupun kata kunci cafe,
 * jangan panggil model sama sekali - langsung tolak dengan teks tetap.
 */
export function isCafeRelated(text: string): boolean {
  const normalized = normalize(text);
  return CAFE_KEYWORDS.some((keyword) => normalized.includes(keyword));
}
