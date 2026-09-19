import { PDFParse } from "pdf-parse";
import type { SupabaseClient } from "@supabase/supabase-js";
import { embed, type EmbeddingConfig } from "./embed";
import { chunkText } from "./chunk";

export async function extractPdfText(buffer: Uint8Array): Promise<string> {
  if (buffer.length > 10 * 1024 * 1024 || Buffer.from(buffer.subarray(0, 5)).toString() !== "%PDF-") throw new Error("PDF tidak valid atau melebihi 10 MB.");
  const parser = new PDFParse({ data: buffer });
  try { return (await parser.getText()).text; }
  finally { await parser.destroy(); }
}

export async function extractDocumentText(buffer: Uint8Array, source: string): Promise<string> {
  const ext = source.toLowerCase().slice(source.lastIndexOf("."));
  if (ext === ".md") {
    if (buffer.length > 10 * 1024 * 1024) throw new Error("Ukuran Markdown melebihi 10 MB.");
    const text = Buffer.from(buffer).toString("utf-8").trim();
    if (!text) throw new Error("File Markdown kosong.");
    return text;
  }
  if (ext === ".pdf") {
    return extractPdfText(buffer);
  }
  throw new Error(`Format file "${ext}" tidak didukung. Gunakan PDF (.pdf) atau Markdown (.md).`);
}

export async function ingestDocument(client: SupabaseClient, config: EmbeddingConfig, buffer: Uint8Array, source: string, job?: { id: string; worker: string }): Promise<boolean> {
  const text = await extractDocumentText(buffer, source);
  const chunks = chunkText(text);
  if (!chunks.length) throw new Error("Dokumen tidak memiliki teks yang dapat dibaca. Pastikan dokumen berisi teks.");
  const embeddings: number[][] = [];
  for (let start = 0; start < chunks.length; start += 20) embeddings.push(...await embed(config, chunks.slice(start, start + 20), "passage"));
  if (embeddings.length !== chunks.length) throw new Error("Jumlah embedding tidak sesuai jumlah chunk.");
  const { data, error } = await client.rpc("replace_rag_source", {
    doc_source: source,
    chunks: chunks.map((content, index) => ({ content, embedding: embeddings[index] })),
    job_id: job?.id ?? null, worker: job?.worker ?? null,
  });
  if (error) throw new Error(`Gagal menyimpan chunk: ${error.message}`);
  return data === true;
}

// Alias untuk kompatibilitas ke belakang
export const ingestPdf = ingestDocument;
