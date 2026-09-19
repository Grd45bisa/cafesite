import type { Message, Chat } from "whatsapp-web.js";
import { loadEnv, getNemotronConfig, type BotEnv } from "./config/env";
import { createBotClient } from "./whatsapp/client";
import { logger, setLogLevel, describeError } from "./whatsapp/logger";
import { hashIdentity, summarizeMessageLength } from "./whatsapp/privacy";
import { registerGracefulShutdown } from "./whatsapp/shutdown";
import { handleChat } from "./ai/chatHandler";
import type { NemotronConfig } from "./ai/nemotronClient";
import { isOrderIntent } from "./order/intent";
import { clearSession, hasActiveSession } from "./order/session";
import { handleOrderMessage } from "./order/orderFlow";
import { checkRateLimit, pruneRateLimitState, type RateLimitConfig } from "./queue/rateLimit";

import { BotAccess } from "./whatsapp/botAccess";

const access = new BotAccess(clearSession);

const GENERIC_ERROR_REPLY = "Sebentar ya, saya lagi gangguan koneksi. Coba lagi.";
const AI_NOT_CONFIGURED_REPLY = "Maaf, layanan tanya-jawab AI belum aktif saat ini. Coba lagi nanti ya.";
const PONG_REPLY = "pong";
const RATE_LIMIT_PRUNE_INTERVAL_MS = 5 * 60_000;

// Deduplicate and apply per-number opt-in before rate limiting or async work.
export async function handleIncomingMessage(
  env: BotEnv,
  rateLimitConfig: RateLimitConfig,
  nemotronConfig: NemotronConfig | null,
  message: Message,
): Promise<void> {
  if (message.from === "status@broadcast") return;
  if (message.fromMe) return;
  if (message.isStatus) return;
  if (message.from.endsWith("@g.us")) return;
  if (typeof message.body !== "string") return;

  const identity = hashIdentity(message.from);
  const decision = access.accept(message.from, message.id?._serialized ?? "", message.body);
  if (decision.kind === "ignore") return;
  // @tutup must take effect even if this sender has exhausted their rate limit.
  if (decision.kind === "disabled") {
    await message.reply("Bot dinonaktifkan untuk nomor ini. Ketik @bot untuk mengaktifkan kembali.").catch((error: unknown) => {
      logger.error("Gagal mengirim konfirmasi penutupan.", { identity, error: describeError(error) });
    });
    return;
  }

  // Rate-limit dicek sebelum panggilan async apapun supaya nomor yang
  // sedang spam tidak membebani bot dengan request tambahan.
  const rateLimit = checkRateLimit(message.from, rateLimitConfig);
  if (!rateLimit.allowed) {
    logger.warn("Pesan ditahan oleh rate-limit.", { identity, waitMs: rateLimit.waitMs });
    return;
  }

  if (decision.kind === "enabled") {
    await message.reply("Bot aktif untuk nomor ini. Silakan kirim pertanyaan. Ketik @tutup untuk berhenti; bot otomatis nonaktif setelah 5 menit tanpa chat.").catch((error: unknown) => {
      logger.error("Gagal mengirim konfirmasi aktivasi.", { identity, error: describeError(error) });
    });
    return;
  }
  if (decision.kind !== "message") return;
  const text = decision.text;

  // Metadata chat bersifat opsional (misalnya untuk typing indicator).
  // Jangan hentikan proses pesan jika getChat gagal karena struktur internal WhatsApp Web.
  let chat: Chat | null = null;
  try {
    chat = await message.getChat();
    if (chat?.isGroup) return;
  } catch (error: unknown) {
    logger.warn("Metadata chat tidak dapat dimuat (typing indicator dilewati).", {
      identity,
      error: describeError(error),
    });
  }

  logger.info("Pesan masuk diterima.", { identity, ...summarizeMessageLength(message.body) });

  if (text.toLowerCase() === "ping") {
    if (!access.canReply(message.from, decision.token)) return;
    await message.reply(PONG_REPLY).catch((error: unknown) => {
      logger.error("Gagal membalas ping.", { identity, error: describeError(error) });
    });
    return;
  }

  let userName = "Pelanggan";
  try {
    const contact = await message.getContact();
    userName = contact.pushname || contact.name || "Pelanggan";
  } catch (error: unknown) {
    logger.warn("Gagal mengambil data kontak, pakai nama default.", { identity, error: describeError(error) });
  }

  const shouldUseOrderFlow = hasActiveSession(message.from) || isOrderIntent(text);

  if (!access.canReply(message.from, decision.token)) return;
  let reply = GENERIC_ERROR_REPLY;
  try {
    if (chat && typeof chat.sendStateTyping === "function") {
      await chat.sendStateTyping().catch(() => undefined);
    }

    if (shouldUseOrderFlow) {
      reply = await handleOrderMessage(env, message.from, text);
    } else {
      reply = nemotronConfig === null
        ? AI_NOT_CONFIGURED_REPLY
        : await handleChat(nemotronConfig, userName, text);
    }
  } catch (error: unknown) {
    logger.error("Gagal memproses pesan.", { identity, error: describeError(error) });
  } finally {
    if (chat && typeof chat.clearState === "function") {
      await chat.clearState().catch(() => undefined);
    }
  }

  if (!access.canReply(message.from, decision.token)) return;
  try {
    await message.reply(reply);
    logger.info("Balasan terkirim.", { identity });
  } catch (error: unknown) {
    // A rejected send can already have reached WhatsApp. Never blindly send twice.
    logger.error("Status pengiriman balasan tidak pasti; tidak dikirim ulang otomatis.", { identity, error: describeError(error) });
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
      error: describeError(error),
    });
  }

  const rateLimitConfig: RateLimitConfig = { maxPerMinute: env.rateLimitMaxPerMinute, windowMs: env.rateLimitWindowMs };
  logger.info("Rate-limit diaktifkan.", { ...rateLimitConfig });
  setInterval(() => pruneRateLimitState(rateLimitConfig), RATE_LIMIT_PRUNE_INTERVAL_MS).unref();

  setInterval(() => access.prune(), 30_000).unref();

  const bot = createBotClient(env, (message) => handleIncomingMessage(env, rateLimitConfig, nemotronConfig, message));
  registerGracefulShutdown(bot.client, bot.cancelReconnect);
  await bot.start();
}

if (require.main === module) void main().catch((error: unknown) => {
  logger.error("Bot gagal start.", { error: describeError(error) });
  process.exitCode = 1;
});
