import type { Client } from "whatsapp-web.js";
import { logger } from "./logger";

const DESTROY_TIMEOUT_MS = 10_000;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, timeoutMessage: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
    promise.then(
      (value) => { clearTimeout(timer); resolve(value); },
      (error: unknown) => { clearTimeout(timer); reject(error instanceof Error ? error : new Error(String(error))); },
    );
  });
}

/**
 * Pasang handler SIGINT/SIGTERM sekali saat startup. Tanpa ini, mematikan
 * proses (Ctrl+C, `pm2 stop`, restart deploy) bisa meninggalkan Chromium
 * child process yang masih memegang lock folder `server/session/` -
 * startup berikutnya gagal dengan error semacam "The browser is already
 * running for ...\session". `client.destroy()` menutup browser dengan
 * benar sebelum proses Node exit, mencegah masalah itu.
 *
 * Dipanggil sekali dari index.ts (bukan di dalam client.ts) supaya jelas
 * hanya ada satu listener SIGINT/SIGTERM per proses - dobel listener
 * berarti dobel `client.destroy()` yang bisa saling tabrakan.
 */
export function registerGracefulShutdown(client: Client, cancelReconnect: () => void): void {
  let shuttingDown = false;

  async function shutdown(signal: NodeJS.Signals): Promise<void> {
    if (shuttingDown) return;
    shuttingDown = true;

    logger.info("Menerima sinyal shutdown, menutup client dengan bersih.", { signal });
    cancelReconnect();

    try {
      // Puppeteer/Chromium kadang hang saat ditutup (jarang, tapi pernah
      // terjadi di lingkungan VPS terbatas resource) - beri batas waktu
      // supaya proses tetap exit dan PM2 bisa restart, bukan menggantung
      // selamanya menunggu destroy() yang tidak pernah selesai.
      await withTimeout(client.destroy(), DESTROY_TIMEOUT_MS, "client.destroy() melebihi batas waktu.");
      logger.info("Shutdown bersih selesai.", { signal });
    } catch (error: unknown) {
      logger.error("Gagal menutup client dengan bersih saat shutdown.", {
        signal,
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      process.exit(0);
    }
  }

  process.on("SIGINT", () => { void shutdown("SIGINT"); });
  process.on("SIGTERM", () => { void shutdown("SIGTERM"); });
}
