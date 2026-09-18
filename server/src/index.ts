import type { Message } from "whatsapp-web.js";
import { loadEnv, getNemotronConfig, type BotEnv } from "./config/env";
import { createBotClient } from "./whatsapp/client";
import { logger, setLogLevel } from "./whatsapp/logger";
import { hashIdentity, summarizeMessageLength } from "./whatsapp/privacy";
import { registerGracefulShutdown } from "./whatsapp/shutdown";
import { handleChat } from "./ai/chatHandler";
import type { NemotronConfig } from "./ai/nemotronClient";
import { isOrderIntent } from "./order/intent";
import { hasActiveSession } from "./order/session";
import { handleOrderMessage } from "./order/orderFlow";
import { checkRateLimit, pruneRateLimitState, type RateLimitConfig } from "./queue/rateLimit";

const GENERIC_ERROR_REPLY = "Sebentar ya, saya lagi gangguan koneksi. Coba lagi.";
const AI_NOT_CONFIGURED_REPLY = "Maaf, layanan tanya-jawab AI belum aktif saat ini. Coba lagi nanti ya.";
const PONG_REPLY = "pong";
const RATE_LIMIT_PRUNE_INTERVAL_MS = 5 * 60_000;

/**
 * Fase 5: rate-limit dulu (paling atas, sebelum apapun lain) - kalau
 * terlampaui, bot diam total (tidak balas, tidak panggil AI/order), cuma
 * dicatat di log. Lalu "ping" -> "pong" langsung (health check manual dari
 * HP, tidak boleh kena guard/AI supaya tetap kerja walau NVIDIA_API_KEY
 * kosong). Baru setelah itu order flow / AI hub seperti Fase 2-4.
 */
async function handleIncomingMessage(
  env: BotEnv,
  rateLimitConfig: RateLimitConfig,
  nemotronConfig: NemotronConfig | null,
  message: Message,
): Promise<void> {
  if (message.from === "status@broadcast") return;
  if (message.fromMe) return;
  if (message.isStatus) return;
  if (typeof message.body !== "string" || message.body.trim() === "") return;

  const identity = hashIdentity(message.from);

  // Rate-limit dicek sebelum panggilan async apapun (getChat, dsb) supaya
  // nomor yang sedang spam tidak ikut membebani bot dengan request WhatsApp
  // Web tambahan - checkRateLimit murni in-memory, O(1) rata-rata.
  const rateLimit = checkRateLimit(message.from, rateLimitConfig);
  if (!rateLimit.allowed) {
    logger.warn("Pesan ditahan oleh rate-limit.", { identity, waitMs: rateLimit.waitMs });
    return;
  }

  const chat = await message.getChat();
  if (chat.isGroup) return;

  logger.info("Pesan masuk diterima.", { identity, ...summarizeMessageLength(message.body) });

  if (message.body.trim().toLowerCase() === "ping") {
    await message.reply(PONG_REPLY).catch((error: unknown) => {
      logger.error("Gagal membalas ping.", { identity, error: error instanceof Error ? error.message : String(error) });
    });
    return;
  }

  const contact = await message.getContact();
  const userName = contact.pushname || contact.name || "Pelanggan";

  const shouldUseOrderFlow = hasActiveSession(message.from) || isOrderIntent(message.body);

  let reply = GENERIC_ERROR_REPLY;
  try {
    await chat.sendStateTyping();

    if (shouldUseOrderFlow) {
      reply = await handleOrderMessage(env, message.from, message.body);
    } else {
      reply = nemotronConfig === null
        ? AI_NOT_CONFIGURED_REPLY
        : await handleChat(nemotronConfig, userName, message.body);
    }
  } catch (error: unknown) {
    logger.error("Gagal memproses pesan.", {
      identity,
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    await chat.clearState().catch(() => undefined);
  }

  try {
    await message.reply(reply);
    logger.info("Balasan terkirim.", { identity });
  } catch (error: unknown) {
    logger.error("Gagal mengirim balasan.", {
      identity,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

async function main(): Promise<void> {
  const env = loadEnv();
  setLogLevel(env.logLevel);
  logger.info("Bot CafeSite mulai dijalankan.", { phone: env.waBotPhone, logLevel: env.logLevel });

  let nemotronConfig: NemotronConfig | null = null;
  try {
    nemotronConfig = getNemotronConfig(env);
  } catch (error: unknown) {
    logger.warn("Konfigurasi AI belum lengkap. Bot tetap jalan, tapi pertanyaan cafe akan dibalas pesan 'belum aktif'.", {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  const rateLimitConfig: RateLimitConfig = { maxPerMinute: env.rateLimitMaxPerMinute, windowMs: env.rateLimitWindowMs };
  logger.info("Rate-limit diaktifkan.", { ...rateLimitConfig });
  setInterval(() => pruneRateLimitState(rateLimitConfig), RATE_LIMIT_PRUNE_INTERVAL_MS).unref();

  const bot = createBotClient(env, (message) => handleIncomingMessage(env, rateLimitConfig, nemotronConfig, message));
  registerGracefulShutdown(bot.client, bot.cancelReconnect);
  await bot.start();
}

void main().catch((error: unknown) => {
  logger.error("Bot gagal start.", {
    error: error instanceof Error ? error.message : String(error),
  });
  process.exitCode = 1;
});
