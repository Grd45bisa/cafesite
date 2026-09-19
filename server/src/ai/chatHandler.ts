import { askAI, type NemotronConfig } from "./nemotronClient";
import { isCafeRelated, OFF_TOPIC_REPLY } from "./guard";
import { SYSTEM_PROMPT } from "./systemPrompt";
import type { ChatMessage } from "./types";
import { logger, describeError } from "../whatsapp/logger";
import { loadEnv, getEmbeddingConfig, getSupabaseConfig } from "../config/env";
import { retrieve } from "../rag/retrieve";

const AI_ERROR_REPLY = "Sebentar ya, saya lagi gangguan koneksi. Coba lagi.";
const RAG_TOP_K = 5;

function buildMessages(userName: string, text: string, ragContext: string[]): ChatMessage[] {
  const messages: ChatMessage[] = [{ role: "system", content: SYSTEM_PROMPT }];

  if (ragContext.length > 0) {
    messages.push({
      role: "system",
      content: `Konteks dari dokumen CafeSite:\n${ragContext.map((chunk, index) => `${index + 1}. ${chunk}`).join("\n")}`,
    });
  }

  messages.push({ role: "user", content: `Nama pelanggan: ${userName}\nPesan: ${text}` });
  return messages;
}

/**
 * Retrieve chunk RAG relevan untuk pesan user. Config RAG dibaca lazy dari
 * env di sini (bukan lewat parameter) supaya tanda tangan `handleChat` tetap
 * sama seperti Fase 2. Kalau config belum lengkap atau retrieve gagal,
 * kembalikan array kosong - chatHandler tetap jalan tanpa konteks RAG,
 * tidak boleh membuat bot crash/gagal balas.
 */
async function tryRetrieveContext(text: string): Promise<string[]> {
  try {
    const env = loadEnv();
    const embeddingConfig = getEmbeddingConfig(env);
    const supabaseConfig = getSupabaseConfig(env);
    return await retrieve(embeddingConfig, supabaseConfig, text, RAG_TOP_K);
  } catch (error: unknown) {
    logger.warn("Retrieve RAG gagal atau belum dikonfigurasi, lanjut tanpa konteks dokumen.", { error: describeError(error) });
    return [];
  }
}

/**
 * Alur utama chat: guard topik dulu (tanpa panggil API kalau tidak relevan),
 * lalu retrieve konteks RAG (best-effort), baru panggil AI. Menerima input
 * primitif (string) supaya tidak bergantung pada objek wa-webjs dan mudah
 * diuji.
 */
export async function handleChat(config: NemotronConfig, userName: string, text: string): Promise<string> {
  if (!isCafeRelated(text)) {
    // Jangan log `userName`/`text` mentah di sini - bisa berisi nama asli
    // pelanggan dan isi pesan bebas (kadang berisi nomor HP/alamat kalau
    // pelanggan menulisnya sendiri). Panjang teks saja cukup untuk debug.
    logger.info("Guard menolak pesan di luar topik cafe.", { textLength: text.length });
    return OFF_TOPIC_REPLY;
  }

  try {
    const ragContext = await tryRetrieveContext(text);
    const messages = buildMessages(userName, text, ragContext);
    return await askAI(config, messages);
  } catch (error: unknown) {
    logger.error("Gagal mendapatkan jawaban dari AI.", { error: describeError(error) });
    return AI_ERROR_REPLY;
  }
}
