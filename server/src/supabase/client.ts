import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface SupabaseConfig {
  url: string;
  serviceRoleKey: string;
}

/**
 * Client Supabase pakai service_role key - dipakai server-side saja
 * (ingest & retrieve RAG), sesuai pola project ini (semua tulis data
 * lewat service_role, bukan anon/authenticated key).
 */
export function createServiceRoleClient(config: SupabaseConfig): SupabaseClient {
  return createClient(config.url, config.serviceRoleKey, {
    auth: { persistSession: false },
  });
}
