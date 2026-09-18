const ORDER_INTENT_KEYWORDS: readonly string[] = ["pesan", "order", "beli", "mau pesan"];
const CANCEL_KEYWORDS: readonly string[] = ["batal", "cancel"];

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

/**
 * Deteksi kata kunci intent order di AWAL percakapan (belum ada sesi order
 * aktif). Dipakai index.ts untuk memutuskan apakah pesan diteruskan ke
 * orderFlow atau ke handleChat (AI/RAG) seperti biasa.
 */
export function isOrderIntent(text: string): boolean {
  const normalized = normalize(text);
  return ORDER_INTENT_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

/**
 * Dipakai orderFlow SELAMA sesi order aktif untuk mendeteksi user ingin
 * membatalkan dan kembali ke langkah awal.
 */
export function isCancelIntent(text: string): boolean {
  const normalized = normalize(text);
  return CANCEL_KEYWORDS.some((keyword) => normalized === keyword || normalized.startsWith(`${keyword} `));
}
