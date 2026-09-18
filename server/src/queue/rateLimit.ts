export interface RateLimitConfig {
  maxPerMinute: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  waitMs: number;
}

// Sliding window per user (message.from), in-memory Map - cukup untuk single
// proses bot (tidak di-cluster), tidak butuh dependency/DB tambahan.
const requestTimestamps = new Map<string, number[]>();

/**
 * Keputusan: kalau limit terlampaui, bot DIAM SAJA (tidak balas apa-apa),
 * bukan membalas pesan "tunggu sebentar". Alasan: kalau seseorang benar-benar
 * spam (bot lain, script, atau orang iseng), membalas tiap pesan yang
 * di-rate-limit justru ikut menambah beban kirim WA dan bisa dianggap
 * perilaku bot yang mencurigakan oleh WhatsApp (rawan banned session). Diam
 * + log cukup untuk kebutuhan cafe kecil ini; pesan "pelan" bisa ditambah
 * nanti kalau ternyata dibutuhkan.
 */
export function checkRateLimit(from: string, config: RateLimitConfig, now = Date.now()): RateLimitResult {
  const windowStart = now - config.windowMs;
  const existing = requestTimestamps.get(from) ?? [];
  const withinWindow = existing.filter((timestamp) => timestamp > windowStart);

  if (withinWindow.length >= config.maxPerMinute) {
    requestTimestamps.set(from, withinWindow);
    const oldestInWindow = withinWindow[0] ?? now;
    return { allowed: false, waitMs: Math.max(0, oldestInWindow + config.windowMs - now) };
  }

  withinWindow.push(now);
  requestTimestamps.set(from, withinWindow);
  return { allowed: true, waitMs: 0 };
}

/**
 * Buang entry lama dari Map supaya tidak tumbuh tanpa batas kalau ada
 * banyak nomor unik yang pernah chat. Dipanggil secara berkala dari
 * index.ts, bukan di tiap request (supaya checkRateLimit tetap O(1) rata-rata).
 */
export function pruneRateLimitState(config: RateLimitConfig, now = Date.now()): void {
  const windowStart = now - config.windowMs;
  for (const [from, timestamps] of requestTimestamps) {
    const withinWindow = timestamps.filter((timestamp) => timestamp > windowStart);
    if (withinWindow.length === 0) {
      requestTimestamps.delete(from);
    } else {
      requestTimestamps.set(from, withinWindow);
    }
  }
}
