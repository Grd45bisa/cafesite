import path from "node:path";
import { Client, LocalAuth, type Message } from "whatsapp-web.js";
import qrcodeTerminal from "qrcode-terminal";
import { logger } from "./logger";
import type { BotEnv } from "../config/env";

const SESSION_DIR = path.join(__dirname, "..", "..", "session");
const MAX_RECONNECT_ATTEMPTS = 8;
const BASE_BACKOFF_MS = 5_000;
const MAX_BACKOFF_MS = 5 * 60_000;

type MessageHandler = (message: Message) => Promise<void> | void;

interface BotClient {
  client: Client;
  start: () => Promise<void>;
  cancelReconnect: () => void;
}

function backoffDelay(attempt: number): number {
  const delay = BASE_BACKOFF_MS * 2 ** attempt;
  return Math.min(delay, MAX_BACKOFF_MS);
}

function createWhatsAppClient(env: BotEnv): Client {
  return new Client({
    authStrategy: new LocalAuth({ dataPath: SESSION_DIR }),
    puppeteer: {
      headless: true,
      executablePath: env.puppeteerExecutablePath,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  });
}

/**
 * Membungkus Client wa-webjs dengan:
 * - Log QR ke terminal saat perlu login.
 * - Reconnect otomatis dengan backoff terbatas (tidak retry tanpa akhir).
 * - Registrasi handler pesan masuk dari luar (dipasang sekali di index.ts).
 */
export function createBotClient(env: BotEnv, onMessage: MessageHandler): BotClient {
  let reconnectAttempts = 0;
  let reconnectTimer: NodeJS.Timeout | null = null;
  let authFailed = false;

  const client = createWhatsAppClient(env);

  function clearReconnectTimer(): void {
    if (reconnectTimer !== null) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  }

  function scheduleReconnect(reason: string): void {
    if (authFailed) {
      logger.warn("Reconnect dilewati karena autentikasi gagal - butuh scan ulang QR secara manual.", { reason });
      return;
    }

    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      logger.error("Batas percobaan reconnect tercapai. Bot berhenti mencoba ulang otomatis.", {
        reason,
        attempts: reconnectAttempts,
      });
      return;
    }

    const delay = backoffDelay(reconnectAttempts);
    reconnectAttempts += 1;
    logger.warn("Menjadwalkan reconnect.", {
      reason,
      attempt: reconnectAttempts,
      maxAttempts: MAX_RECONNECT_ATTEMPTS,
      delayMs: delay,
    });

    clearReconnectTimer();
    reconnectTimer = setTimeout(() => {
      void client.initialize().catch((error: unknown) => {
        logger.error("Gagal inisialisasi ulang client saat reconnect.", {
          error: error instanceof Error ? error.message : String(error),
        });
        scheduleReconnect("initialize_failed");
      });
    }, delay);
  }

  client.on("qr", (qr: string) => {
    logger.info("QR code diterima. Silakan scan dengan WhatsApp (Perangkat Tertaut).");
    qrcodeTerminal.generate(qr, { small: true });
  });

  client.on("authenticated", () => {
    logger.info("Autentikasi berhasil.");
  });

  client.on("auth_failure", (message: string) => {
    // Session lokal korup/logout dari HP - reconnect otomatis TIDAK akan
    // menyelesaikan ini (QR baru wajib di-scan ulang secara manual). Set
    // flag `authFailed` supaya event "disconnected" yang biasanya menyusul
    // auth_failure TIDAK ikut memicu scheduleReconnect - tanpa flag ini,
    // "disconnected" akan bypass keputusan berhenti di sini.
    authFailed = true;
    clearReconnectTimer();
    logger.error("Autentikasi gagal - perlu scan ulang QR. Bot berhenti, tidak mencoba reconnect otomatis.", { message });
  });

  client.on("ready", () => {
    authFailed = false;
    reconnectAttempts = 0;
    clearReconnectTimer();
    logger.info("Bot WhatsApp siap dan tersambung.", { phone: env.waBotPhone, processUptimeSeconds: Math.round(process.uptime()) });
  });

  client.on("disconnected", (reason: string) => {
    logger.warn("Client terputus dari WhatsApp.", { reason });
    scheduleReconnect(`disconnected:${reason}`);
  });

  client.on("message", (message: Message) => {
    void Promise.resolve(onMessage(message)).catch((error: unknown) => {
      logger.error("Gagal memproses pesan masuk.", {
        error: error instanceof Error ? error.message : String(error),
      });
    });
  });

  async function start(): Promise<void> {
    logger.info(
      "Menginisialisasi client WhatsApp... (kalau proses sebelumnya mati mendadak tanpa shutdown bersih, Chromium lama mungkin masih mengunci folder session - lihat server/DEPLOY.md bagian troubleshooting kalau initialize gagal dengan error 'already running')",
    );
    try {
      await client.initialize();
    } catch (error: unknown) {
      logger.error("Gagal inisialisasi client saat start.", {
        error: error instanceof Error ? error.message : String(error),
      });
      scheduleReconnect("initialize_failed_on_start");
    }
  }

  return { client, start, cancelReconnect: clearReconnectTimer };
}
