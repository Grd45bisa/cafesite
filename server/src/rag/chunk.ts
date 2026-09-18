const CHUNK_SIZE = 700;
const CHUNK_OVERLAP = 80;

/**
 * Pecah teks panjang jadi potongan ~600-800 karakter dengan overlap kecil
 * antar potongan, supaya konteks yang terpotong di batas chunk tidak hilang
 * total. Prioritaskan memotong di batas paragraf/baris kosong dulu; kalau
 * satu "paragraf" masih lebih panjang dari CHUNK_SIZE, potong paksa per
 * karakter dengan overlap yang sama.
 */
export function chunkText(text: string): string[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (normalized === "") return [];

  const paragraphs = normalized
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);

  const chunks: string[] = [];
  let buffer = "";

  function flushBuffer(): void {
    if (buffer.trim() !== "") {
      chunks.push(buffer.trim());
    }
    buffer = "";
  }

  function pushWithOverlap(nextPiece: string): void {
    if (buffer === "") {
      buffer = nextPiece;
      return;
    }
    if (buffer.length + 1 + nextPiece.length <= CHUNK_SIZE) {
      buffer = `${buffer}\n${nextPiece}`;
      return;
    }
    flushBuffer();
    const overlapSource = chunks.at(-1) ?? "";
    const overlap = overlapSource.slice(Math.max(0, overlapSource.length - CHUNK_OVERLAP));
    buffer = overlap === "" ? nextPiece : `${overlap}\n${nextPiece}`;
  }

  for (const paragraph of paragraphs) {
    if (paragraph.length <= CHUNK_SIZE) {
      pushWithOverlap(paragraph);
      continue;
    }

    // Paragraf sendiri lebih panjang dari batas chunk - potong paksa per karakter.
    let start = 0;
    while (start < paragraph.length) {
      const end = Math.min(start + CHUNK_SIZE, paragraph.length);
      const piece = paragraph.slice(start, end);
      pushWithOverlap(piece);
      if (end >= paragraph.length) break;
      start = end - CHUNK_OVERLAP;
    }
  }

  flushBuffer();
  return chunks;
}
