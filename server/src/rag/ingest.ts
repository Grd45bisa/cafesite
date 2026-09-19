import { readFile } from "node:fs/promises";
import path from "node:path";
import { loadEnv, getEmbeddingConfig, getSupabaseConfig } from "../config/env";
import { createServiceRoleClient } from "../supabase/client";
import { logger, describeError } from "../whatsapp/logger";
import { ingestPdf } from "./pipeline";

async function main(): Promise<void> {
  const argument = process.argv[2];
  if (!argument) throw new Error("Argumen path PDF wajib diisi. Contoh: npm run rag:ingest docs/info.pdf");
  const filePath = path.resolve(argument);
  const source = path.basename(filePath);
  const env = loadEnv();
  const client = createServiceRoleClient(getSupabaseConfig(env));
  await ingestPdf(client, getEmbeddingConfig(env), await readFile(filePath), source);
  logger.info("Ingest selesai.", { source });
}
void main().catch((error: unknown) => {
  logger.error("Ingest gagal.", { error: describeError(error) });
  process.exitCode = 1;
});
