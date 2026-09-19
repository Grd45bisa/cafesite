import { randomUUID } from "node:crypto";
import { setTimeout as sleep } from "node:timers/promises";
import { loadEnv, getEmbeddingConfig, getSupabaseConfig } from "../config/env";
import { createServiceRoleClient } from "../supabase/client";
import { logger, describeError } from "../whatsapp/logger";
import { ingestPdf } from "./pipeline";

async function main(): Promise<void> {
  const env = loadEnv();
  const config = getEmbeddingConfig(env);
  const client = createServiceRoleClient(getSupabaseConfig(env));
  const worker = randomUUID();
  const configuredPoll = Number(process.env.RAG_POLL_MS ?? 15000);
  const pollMs = Number.isFinite(configuredPoll) && configuredPoll >= 1000 ? configuredPoll : 15000;
  let stopping = false;
  const shutdown = new AbortController();
  const stop = (): void => { stopping = true; shutdown.abort(); };
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
  logger.info("Worker RAG aktif.", { worker, pollMs });
  while (!stopping) {
    try {
      for (let index = 0; index < 5 && !stopping; index++) {
        const { data, error } = await client.rpc("claim_rag_job", { worker });
        if (error) throw new Error(error.message);
        const job = data?.[0] as { id: string; file_path: string; source: string } | undefined;
        if (!job) break;
        try {
          let file: Blob | null = null;
          for (let attempt = 0; attempt < 2; attempt++) {
            const result = await client.storage.from("wa-bot-rag").download(job.file_path);
            if (!result.error && result.data) { file = result.data; break; }
            if (attempt === 0) await sleep(1000);
          }
          if (!file) throw new Error("PDF gagal diunduh setelah dua percobaan. Coba unggah kembali.");
          const saved = await ingestPdf(client, config, new Uint8Array(await file.arrayBuffer()), job.source, { id: job.id, worker });
          logger.info(saved ? "Job RAG selesai." : "Job RAG sudah dihapus; hasil diabaikan.", { id: job.id });
        } catch (cause) {
          logger.error("Job RAG gagal.", { id: job.id, error: describeError(cause) });
          // Do not expose upstream responses/configuration in the public dashboard.
          const { error: failError } = await client.from("rag_ingest_jobs").update({ status: "failed", error: "PDF belum dapat diproses. Pastikan PDF berisi teks, lalu proses ulang. Jika berulang, periksa log worker.", updated_at: new Date().toISOString() }).eq("id", job.id).eq("status", "processing").eq("processing_by", worker);
          if (failError) throw new Error(`Gagal mencatat status job ${job.id}: ${failError.message}`);
        }
      }
    } catch (cause) { logger.error("Polling RAG gagal; akan dicoba kembali.", { error: describeError(cause) }); }
    if (!stopping) await sleep(pollMs, undefined, { signal: shutdown.signal }).catch(() => undefined);
  }
}
void main().catch((cause: unknown) => { logger.error("Worker RAG gagal dimulai.", { error: describeError(cause) }); process.exitCode = 1; });
