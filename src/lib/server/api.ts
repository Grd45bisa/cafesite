import "server-only";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { ModuleId, StaffProfile } from "@/types/operations";
import { getServiceSupabase } from "@/lib/supabase/server";
import { HttpError, objectValue } from "./validation";

export function database(): SupabaseClient {
  const client = getServiceSupabase();
  if (!client) throw new HttpError(503, "Pemesanan belum aktif. Hubungi kasir untuk memesan.");
  return client;
}

export async function authenticate(request: Request): Promise<{ db: SupabaseClient; user: User }> {
  const db = database();
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) throw new HttpError(401, "Silakan masuk kembali.");
  const { data, error } = await db.auth.getUser(authorization.slice(7));
  if (error || !data.user) throw new HttpError(401, "Sesi berakhir. Silakan masuk kembali.");
  return { db, user: data.user };
}

export async function authorizeStaff(request: Request, module?: ModuleId | "admin"): Promise<{ db: SupabaseClient; user: User; profile: StaffProfile }> {
  const { db, user } = await authenticate(request);
  const { data, error } = await db.from("profiles").select("id,role").eq("id", user.id).maybeSingle();
  if (error) throw new HttpError(503, "Database belum siap. Periksa migrasi Supabase.");
  if (!data || !["admin", "staff"].includes(data.role)) throw new HttpError(403, "Akun ini tidak memiliki akses dashboard.");
  const profile = data as StaffProfile;
  if (profile.role !== "admin" && module) {
    if (module === "admin") throw new HttpError(403, "Hanya admin yang dapat mengakses pengaturan ini.");
    const { data: enabled } = await db.from("staff_modules").select("enabled").eq("id", module).maybeSingle();
    if (!enabled?.enabled) throw new HttpError(403, "Modul ini belum diaktifkan untuk staff.");
  }
  return { db, user, profile };
}

export async function bodyJson(request: Request): Promise<Record<string, unknown>> {
  const declaredSize = Number(request.headers.get("content-length") || 0);
  if (declaredSize > 256_000) throw new HttpError(413, "Data terlalu besar.");
  const body = await request.text();
  if (body.length > 256_000) throw new HttpError(413, "Data terlalu besar.");
  try { return objectValue(JSON.parse(body)); } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(400, "Format JSON tidak valid.");
  }
}

export function dbError(error: { message: string; code?: string } | null): void {
  if (!error) return;
  if (error.code === "23503") throw new HttpError(409, "Data masih digunakan. Pindahkan atau selesaikan data terkait dahulu.");
  if (error.code === "23505") throw new HttpError(409, "ID sudah digunakan. Pilih ID lain.");
  if (error.code === "P0001") throw new HttpError(409, error.message);
  if (error.code === "23514" || error.code === "22P02") throw new HttpError(400, "Isi data tidak sesuai format.");
  console.error("Database operation failed", { code: error.code });
  throw new HttpError(503, "Data belum dapat diproses. Coba lagi atau hubungi kasir.");
}

export function apiError(error: unknown): Response {
  if (error instanceof HttpError) return Response.json({ error: error.message }, { status: error.status });
  console.error("API request failed", error instanceof Error ? error.name : "Unknown error");
  return Response.json({ error: "Terjadi gangguan. Silakan coba kembali." }, { status: 500 });
}

export function json(data: unknown, status = 200): Response {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}
