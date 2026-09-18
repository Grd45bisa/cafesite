import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFParse } from "pdf-parse";
import { loadEnv, getEmbeddingConfig, getSupabaseConfig } from "../config/env";
import { embed } from "./embed";
import { chunkText } from "./chunk";
import { createServiceRoleClient } from "../supabase/client";
import { logger } from "../whatsapp/logger";

const EMBED_BATCH_SIZE = 20;

async function extractPdfText(filePath: string): Promise<string> {
  const buffer = await readFile(filePath);
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
}

function chunkBatches<T>(items: T[], size: number): T[][] {
  const batches: T[][] = [];
  for (let start = 0; start < items.length; start += size) {
    batches.push(items.slice(start, start + size));
  }
  return batches;
}

async function main(): Promise<void> {
  const pdfPathArg = process.argv[2];
  if (!pdfPathArg) {
    logger.error("Argumen path PDF wajib diisi. Contoh: npm run rag:ingest server/docs/contoh-cafesite.pdf");
    process.exitCode = 1;
    return;
  }

  const filePath = path.resolve(pdfPathArg);
  const source = path.basename(filePath);

  const env = loadEnv();
  const embeddingConfig = getEmbeddingConfig(env);
  const supabaseConfig = getSupabaseConfig(env);
  const client = createServiceRoleClient(supabaseConfig);

  logger.info("Mulai ingest dokumen RAG.", { filePath, source });

  const text = await extractPdfText(filePath);
  const chunks = chunkText(text);

  if (chunks.length === 0) {
    logger.error("Tidak ada teks yang bisa diekstrak dari PDF ini. Ingest dibatalkan.", { filePath });
    process.exitCode = 1;
    return;
  }

  logger.info("PDF berhasil dipecah jadi chunk.", { source, totalChunks: chunks.length });

  const embeddings: number[][] = [];
  const batches = chunkBatches(chunks, EMBED_BATCH_SIZE);

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex += 1) {
    const batch = batches[batchIndex];
    if (!batch) continue;
    try {
      const batchEmbeddings = await embed(embeddingConfig, batch, "passage");
      embeddings.push(...batchEmbeddings);
      logger.info("Batch embedding berhasil.", { batch: batchIndex + 1, totalBatches: batches.length, size: batch.length });
    } catch (error: unknown) {
      logger.error("Batch embedding gagal, ingest dihentikan.", {
        batch: batchIndex + 1,
        error: error instanceof Error ? error.message : String(error),
      });
      process.exitCode = 1;
      return;
    }
  }

  if (embeddings.length !== chunks.length) {
    logger.error("Jumlah embedding tidak cocok dengan jumlah chunk. Ingest dibatalkan tanpa menulis ke database.", {
      chunks: chunks.length,
      embeddings: embeddings.length,
    });
    process.exitCode = 1;
    return;
  }

  // Hapus chunk lama dari source yang sama dulu, supaya re-ingest "mengganti isi".
  const { error: deleteError } = await client.from("rag_documents").delete().eq("source", source);
  if (deleteError) {
    logger.error("Gagal menghapus chunk lama sebelum insert ulang.", { source, error: deleteError.message });
    process.exitCode = 1;
    return;
  }

  const rows = chunks.map((content, index) => ({
    source,
    content,
    embedding: embeddings[index],
  }));

  const { error: insertError, count } = await client.from("rag_documents").insert(rows, { count: "exact" });
  if (insertError) {
    logger.error("Gagal insert chunk baru ke Supabase.", { source, error: insertError.message });
    process.exitCode = 1;
    return;
  }

  logger.info("Ingest selesai.", { source, chunksInserted: count ?? rows.length });
}

void main().catch((error: unknown) => {
  logger.error("Ingest gagal karena error tidak tertangani.", {
    error: error instanceof Error ? error.message : String(error),
  });
  process.exitCode = 1;
});
