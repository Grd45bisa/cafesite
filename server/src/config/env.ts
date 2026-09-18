import { config as loadDotenv } from "dotenv";

loadDotenv({ path: ".env.local" });
loadDotenv();

interface BotEnv {
  waBotPhone: string;
  puppeteerExecutablePath: string | undefined;
  nvidiaApiKey: string | undefined;
  nvidiaModel: string | undefined;
  supabaseUrl: string | undefined;
  supabaseServiceRoleKey: string | undefined;
  waBotUserId: string | undefined;
  embeddingModel: string | undefined;
  embeddingApiKey: string | undefined;
  embeddingBaseUrl: string | undefined;
  rateLimitMaxPerMinute: number;
  rateLimitWindowMs: number;
  logLevel: "info" | "warn" | "error";
}

const DEFAULT_RATE_LIMIT_MAX_PER_MINUTE = 5;
const DEFAULT_RATE_LIMIT_WINDOW_MS = 60_000;
const DEFAULT_LOG_LEVEL = "info";

function readOptionalInt(name: string, fallback: number): number {
  const value = process.env[name];
  if (value === undefined || value.trim() === "") return fallback;
  const parsed = Number.parseInt(value.trim(), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function readLogLevel(): "info" | "warn" | "error" {
  const value = process.env.LOG_LEVEL?.trim().toLowerCase();
  if (value === "info" || value === "warn" || value === "error") return value;
  return DEFAULT_LOG_LEVEL;
}

function readRequired(name: string): string {
  const value = process.env[name];
  if (value === undefined || value.trim() === "") {
    throw new Error(`Environment variable "${name}" wajib diisi. Cek file server/.env.local.`);
  }
  return value.trim();
}

function readOptional(name: string): string | undefined {
  const value = process.env[name];
  if (value === undefined || value.trim() === "") return undefined;
  return value.trim();
}

/**
 * Fase 1 hanya butuh WA_BOT_PHONE. Variabel lain (NVIDIA AI, Supabase,
 * embedding RAG, dst) disiapkan untuk fase berikutnya - dibaca sebagai
 * optional di sini supaya bot tetap bisa start meski belum diisi, tapi
 * tersedia begitu dibutuhkan.
 */
export function loadEnv(): BotEnv {
  return {
    waBotPhone: readRequired("WA_BOT_PHONE"),
    puppeteerExecutablePath: readOptional("PUPPETEER_EXECUTABLE_PATH"),
    nvidiaApiKey: readOptional("NVIDIA_API_KEY"),
    nvidiaModel: readOptional("NVIDIA_MODEL"),
    supabaseUrl: readOptional("SUPABASE_URL"),
    supabaseServiceRoleKey: readOptional("SUPABASE_SERVICE_ROLE_KEY"),
    waBotUserId: readOptional("WA_BOT_USER_ID"),
    embeddingModel: readOptional("EMBEDDING_MODEL"),
    embeddingApiKey: readOptional("EMBEDDING_API_KEY"),
    embeddingBaseUrl: readOptional("EMBEDDING_BASE_URL"),
    rateLimitMaxPerMinute: readOptionalInt("RATE_LIMIT_MAX_PER_MINUTE", DEFAULT_RATE_LIMIT_MAX_PER_MINUTE),
    rateLimitWindowMs: readOptionalInt("RATE_LIMIT_WINDOW_MS", DEFAULT_RATE_LIMIT_WINDOW_MS),
    logLevel: readLogLevel(),
  };
}

interface NemotronConfig {
  apiKey: string;
  model: string;
}

/**
 * Divalidasi lazy (bukan saat startup) supaya bot tetap bisa jalan dan
 * menjawab guard-only walau NVIDIA_API_KEY/MODEL belum diisi - baru
 * throw begitu pesan lolos guard dan benar-benar butuh panggil AI.
 */
export function getNemotronConfig(env: BotEnv): NemotronConfig {
  if (env.nvidiaApiKey === undefined) {
    throw new Error('Environment variable "NVIDIA_API_KEY" wajib diisi untuk menjawab lewat AI. Cek file server/.env.local.');
  }
  if (env.nvidiaModel === undefined) {
    throw new Error('Environment variable "NVIDIA_MODEL" wajib diisi untuk menjawab lewat AI. Cek file server/.env.local.');
  }
  return { apiKey: env.nvidiaApiKey, model: env.nvidiaModel };
}

interface EmbeddingConfig {
  apiKey: string;
  model: string;
  baseUrl: string;
}

/**
 * Divalidasi lazy juga, dipakai oleh src/rag/embed.ts. Kalau belum diisi,
 * retrieve() di chatHandler cukup melewati konteks RAG (tidak crash bot),
 * dan script ingest CLI akan throw jelas karena memang tidak bisa jalan
 * tanpa config ini.
 */
export function getEmbeddingConfig(env: BotEnv): EmbeddingConfig {
  if (env.embeddingApiKey === undefined) {
    throw new Error('Environment variable "EMBEDDING_API_KEY" wajib diisi untuk RAG. Cek file server/.env.local.');
  }
  if (env.embeddingModel === undefined) {
    throw new Error('Environment variable "EMBEDDING_MODEL" wajib diisi untuk RAG. Cek file server/.env.local.');
  }
  if (env.embeddingBaseUrl === undefined) {
    throw new Error('Environment variable "EMBEDDING_BASE_URL" wajib diisi untuk RAG. Cek file server/.env.local.');
  }
  return { apiKey: env.embeddingApiKey, model: env.embeddingModel, baseUrl: env.embeddingBaseUrl };
}

interface SupabaseConfig {
  url: string;
  serviceRoleKey: string;
}

export function getSupabaseConfig(env: BotEnv): SupabaseConfig {
  if (env.supabaseUrl === undefined) {
    throw new Error('Environment variable "SUPABASE_URL" wajib diisi untuk RAG. Cek file server/.env.local.');
  }
  if (env.supabaseServiceRoleKey === undefined) {
    throw new Error('Environment variable "SUPABASE_SERVICE_ROLE_KEY" wajib diisi untuk RAG. Cek file server/.env.local.');
  }
  return { url: env.supabaseUrl, serviceRoleKey: env.supabaseServiceRoleKey };
}

/**
 * Divalidasi lazy juga, dipakai orderFlow sebagai `actor` di RPC
 * create_cafe_order/update_cafe_order. WhatsApp bukan user Supabase, jadi
 * semua order dari bot memakai satu akun bot tetap (dibuat manual di
 * Supabase Auth dashboard) - user_id-nya ditaruh di env ini.
 */
export function getBotUserId(env: BotEnv): string {
  if (env.waBotUserId === undefined) {
    throw new Error('Environment variable "WA_BOT_USER_ID" wajib diisi untuk memproses pesanan. Cek file server/.env.local.');
  }
  return env.waBotUserId;
}

export type { BotEnv };
