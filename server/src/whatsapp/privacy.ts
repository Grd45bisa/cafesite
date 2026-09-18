import { createHash } from "node:crypto";

/**
 * Ubah identitas WhatsApp (message.from, mis. "628123456789@c.us") jadi hash
 * pendek untuk keperluan log - supaya nomor pelanggan tidak tercatat mentah
 * di log server, tapi tetap bisa dipakai untuk korelasi ("user yang sama
 * kirim pesan A lalu B") tanpa perlu tahu nomornya.
 */
export function hashIdentity(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 12);
}

/**
 * Ringkasan aman untuk isi pesan di log level info: panjang teks saja,
 * bukan isinya. Body pesan sering berisi nama/HP/alamat pelanggan saat
 * order flow berjalan, jadi tidak boleh ikut tercatat di log.
 */
export function summarizeMessageLength(body: string): { length: number } {
  return { length: body.length };
}
