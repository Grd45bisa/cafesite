import { apiError, authorizeStaff, bodyJson, dbError, json } from "@/lib/server/api";
import { HttpError, textValue, uuidValue } from "@/lib/server/validation";

const bucket = "wa-bot-rag";
function sourceValue(value: unknown): string {
  const source = textValue(value, "Nama PDF", 80);
  if (!/^[a-z0-9][a-z0-9._-]*\.pdf$/.test(source)) throw new HttpError(400, "Nama PDF hanya boleh berisi huruf, angka, titik, dan tanda hubung.");
  return source;
}
export async function GET(request: Request): Promise<Response> {
  try {
    const { db } = await authorizeStaff(request, "wa_bot");
    const { data, error } = await db.from("rag_ingest_jobs").select("id,file_path,source,status,error,created_at,updated_at").order("created_at", { ascending: false }).order("id");
    dbError(error);
    return json({ data: data ?? [] });
  } catch (error) { return apiError(error); }
}
export async function POST(request: Request): Promise<Response> {
  try {
    const { db } = await authorizeStaff(request, "wa_bot");
    const body = await bodyJson(request);
    const source = sourceValue(body.source);
    const filePath = textValue(body.file_path, "Path PDF", 180);
    if (!/^rag\/[0-9]+-[a-f0-9-]{36}-[a-z0-9][a-z0-9._-]*\.pdf$/.test(filePath) || !filePath.endsWith(`-${source}`)) throw new HttpError(400, "Path PDF tidak valid.");
    const { data: file, error: downloadError } = await db.storage.from(bucket).download(filePath);
    if (downloadError || !file) throw new HttpError(400, "PDF belum tersedia di Storage. Unggah kembali.");
    if (file.size > 10 * 1024 * 1024) throw new HttpError(413, "Ukuran PDF maksimal 10 MB.");
    if (file.type.split(";")[0] !== "application/pdf" || await file.slice(0, 5).text() !== "%PDF-") throw new HttpError(400, "File harus berupa PDF yang valid.");
    const { error } = await db.from("rag_ingest_jobs").upsert({ file_path: filePath, source }, { onConflict: "file_path", ignoreDuplicates: true });
    dbError(error);
    return json({ ok: true }, 201);
  } catch (error) { return apiError(error); }
}
export async function PATCH(request: Request): Promise<Response> {
  try {
    const { db } = await authorizeStaff(request, "wa_bot");
    const body = await bodyJson(request);
    const { data, error } = await db.from("rag_ingest_jobs").update({ status: "pending", error: null, processing_by: null, started_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", uuidValue(body.id)).in("status", ["done", "failed"]).select("id");
    dbError(error);
    if (!data?.length) throw new HttpError(409, "Dokumen sudah dihapus atau masih diproses.");
    return json({ ok: true });
  } catch (error) { return apiError(error); }
}
export async function DELETE(request: Request): Promise<Response> {
  try {
    const { db } = await authorizeStaff(request, "wa_bot");
    const body = await bodyJson(request);
    const source = sourceValue(body.source);
    // Remove storage first so a storage outage leaves retryable job paths.
    const { data: jobs, error: listError } = await db.from("rag_ingest_jobs").select("file_path").eq("source", source);
    dbError(listError);
    if (jobs?.length) {
      const { error } = await db.storage.from(bucket).remove(jobs.map((job) => job.file_path));
      dbError(error);
    }
    const { data: removed, error } = await db.rpc("delete_rag_source", { doc_source: source });
    dbError(error);
    // Include any upload queued concurrently with the first storage removal.
    if (removed?.length) {
      const { error: storageError } = await db.storage.from(bucket).remove(removed.map((row: { file_path: string }) => row.file_path));
      dbError(storageError);
    }
    return json({ ok: true });
  } catch (error) { return apiError(error); }
}
