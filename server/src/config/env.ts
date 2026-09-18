import { config as loadDotenv } from "dotenv";

loadDotenv({ path: ".env.local" });
loadDotenv();

interface BotEnv {
  waBotPhone: string;
  puppeteerExecutablePath: string | undefined;
  openRouterApiKey: string | undefined;
  openRouterModel: string | undefined;
  supabaseUrl: string | undefined;
  supabaseServiceRoleKey: string | undefined;
  waBotUserId: string | undefined;
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
 * Fase 1 hanya butuh WA_BOT_PHONE. Variabel lain (OpenRouter, Supabase, dst)
 * disiapkan untuk fase berikutnya - dibaca sebagai optional di sini supaya
 * bot tetap bisa start meski belum diisi, tapi tersedia begitu dibutuhkan.
 */
export function loadEnv(): BotEnv {
  return {
    waBotPhone: readRequired("WA_BOT_PHONE"),
    puppeteerExecutablePath: readOptional("PUPPETEER_EXECUTABLE_PATH"),
    openRouterApiKey: readOptional("OPENROUTER_API_KEY"),
    openRouterModel: readOptional("OPENROUTER_MODEL"),
    supabaseUrl: readOptional("SUPABASE_URL"),
    supabaseServiceRoleKey: readOptional("SUPABASE_SERVICE_ROLE_KEY"),
    waBotUserId: readOptional("WA_BOT_USER_ID"),
  };
}

export type { BotEnv };
