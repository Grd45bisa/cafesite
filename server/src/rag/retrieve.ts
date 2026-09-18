import { embed, type EmbeddingConfig } from "./embed";
import { createServiceRoleClient, type SupabaseConfig } from "../supabase/client";
import { logger } from "../whatsapp/logger";

interface MatchRow {
  id: string;
  source: string;
  content: string;
  similarity: number;
}

/**
 * Embed query lalu cari chunk paling relevan lewat RPC `match_rag_documents`
 * (cosine similarity, operator <=>) di Supabase. Return list `content` saja
 * - urutan sudah dari yang paling relevan. Kalau ada apapun yang gagal,
 * throw ke pemanggil (chatHandler) yang akan menelan error ini supaya bot
 * tetap jalan tanpa konteks RAG.
 */
export async function retrieve(
  embeddingConfig: EmbeddingConfig,
  supabaseConfig: SupabaseConfig,
  query: string,
  limit = 5,
): Promise<string[]> {
  const [queryEmbedding] = await embed(embeddingConfig, [query], "query");
  if (!queryEmbedding) {
    throw new Error("Embedding query tidak menghasilkan vektor.");
  }

  const client = createServiceRoleClient(supabaseConfig);
  const { data, error } = await client.rpc("match_rag_documents", {
    query_embedding: queryEmbedding,
    match_count: limit,
    filter_source: null,
  });

  if (error) {
    throw new Error(`Gagal query kemiripan RAG: ${error.message}`);
  }

  const rows = (data ?? []) as MatchRow[];
  logger.info("Retrieve RAG selesai.", { query, matched: rows.length });

  return rows.map((row) => row.content);
}
