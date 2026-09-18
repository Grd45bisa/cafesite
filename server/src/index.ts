import type { Message } from "whatsapp-web.js";
import { loadEnv } from "./config/env";
import { createBotClient } from "./whatsapp/client";
import { logger } from "./whatsapp/logger";

const REPLY_TEXT = "✓ Bot CafeSite aktif";

/**
 * Fase 1: balas semua pesan teks masuk (bukan status/broadcast) dengan
 * teks tetap. Belum ada AI/RAG/order - itu fase berikutnya.
 */
async function handleIncomingMessage(message: Message): Promise<void> {
  if (message.from === "status@broadcast") return;
  if (typeof message.body !== "string" || message.body.trim() === "") return;

  logger.info("Pesan masuk diterima.", { from: message.from, body: message.body });

  await message.reply(REPLY_TEXT);
  logger.info("Balasan terkirim.", { to: message.from });
}

async function main(): Promise<void> {
  const env = loadEnv();
  logger.info("Bot CafeSite mulai dijalankan.", { phone: env.waBotPhone });

  const bot = createBotClient(env, handleIncomingMessage);
  await bot.start();
}

void main().catch((error: unknown) => {
  logger.error("Bot gagal start.", {
    error: error instanceof Error ? error.message : String(error),
  });
  process.exitCode = 1;
});
