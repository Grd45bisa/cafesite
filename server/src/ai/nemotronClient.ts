import type { ChatMessage } from "./types";
import { logger, describeError } from "../whatsapp/logger";

const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const REQUEST_TIMEOUT_MS = 30_000;
const MAX_ATTEMPTS = 2; // percobaan pertama + 1x retry

interface NvidiaChoice {
  message?: {
    content?: string;
  };
}

interface NvidiaResponseBody {
  choices?: NvidiaChoice[];
}

interface NemotronConfig {
  apiKey: string;
  model: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callNvidiaApi(config: NemotronConfig, messages: ChatMessage[]): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(NVIDIA_API_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: 1,
        top_p: 0.95,
        max_tokens: 1024,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(`NVIDIA API merespons status ${response.status}: ${errorBody.slice(0, 300)}`);
    }

    const data = (await response.json()) as NvidiaResponseBody;
    const content = data.choices?.[0]?.message?.content;
    if (typeof content !== "string" || content.trim() === "") {
      throw new Error("NVIDIA API tidak mengembalikan konten jawaban yang valid.");
    }

    return content.trim();
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Panggil model Nemotron langsung ke NVIDIA API (integrate.api.nvidia.com,
 * OpenAI-compatible, bukan streaming - bot butuh teks lengkap sebelum
 * dikirim balas ke WhatsApp). Retry sekali kalau percobaan pertama gagal
 * (timeout/error jaringan/response tidak valid), lalu throw error yang
 * jelas kalau tetap gagal - dibiarkan ditangani pemanggil (chatHandler)
 * supaya bot tidak crash.
 */
export async function askAI(config: NemotronConfig, messages: ChatMessage[]): Promise<string> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      return await callNvidiaApi(config, messages);
    } catch (error: unknown) {
      lastError = error;
      logger.warn("Percobaan panggilan NVIDIA API gagal.", { attempt, maxAttempts: MAX_ATTEMPTS, error: describeError(error) });

      if (attempt < MAX_ATTEMPTS) {
        await sleep(1_000);
      }
    }
  }

  throw new Error(`Gagal memanggil NVIDIA API setelah ${MAX_ATTEMPTS} percobaan: ${describeError(lastError)}`);
}

export type { NemotronConfig };
