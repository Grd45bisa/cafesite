import type { ChatMessage } from "./types";
import { logger } from "../whatsapp/logger";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const REQUEST_TIMEOUT_MS = 30_000;
const MAX_ATTEMPTS = 2; // percobaan pertama + 1x retry

interface OpenRouterChoice {
  message?: {
    content?: string;
  };
}

interface OpenRouterResponseBody {
  choices?: OpenRouterChoice[];
}

interface NemotronConfig {
  apiKey: string;
  model: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callOpenRouter(config: NemotronConfig, messages: ChatMessage[]): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
        "HTTP-Referer": "https://cafesite-five.vercel.app",
        "X-Title": "CafeSite WhatsApp Bot",
      },
      body: JSON.stringify({
        model: config.model,
        messages,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(`OpenRouter merespons status ${response.status}: ${errorBody.slice(0, 300)}`);
    }

    const data = (await response.json()) as OpenRouterResponseBody;
    const content = data.choices?.[0]?.message?.content;
    if (typeof content !== "string" || content.trim() === "") {
      throw new Error("OpenRouter tidak mengembalikan konten jawaban yang valid.");
    }

    return content.trim();
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Panggil model Nemotron via OpenRouter. Retry sekali kalau percobaan
 * pertama gagal (timeout/error jaringan/response tidak valid), lalu
 * throw error yang jelas kalau tetap gagal - dibiarkan ditangani
 * pemanggil (chatHandler) supaya bot tidak crash.
 */
export async function askAI(config: NemotronConfig, messages: ChatMessage[]): Promise<string> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      return await callOpenRouter(config, messages);
    } catch (error: unknown) {
      lastError = error;
      const message = error instanceof Error ? error.message : String(error);
      logger.warn("Percobaan panggilan OpenRouter gagal.", { attempt, maxAttempts: MAX_ATTEMPTS, error: message });

      if (attempt < MAX_ATTEMPTS) {
        await sleep(1_000);
      }
    }
  }

  const finalMessage = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(`Gagal memanggil OpenRouter setelah ${MAX_ATTEMPTS} percobaan: ${finalMessage}`);
}

export type { NemotronConfig };
