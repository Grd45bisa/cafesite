import { apiError, authorizeStaff, dbError, json } from "@/lib/server/api";
export async function GET(request: Request): Promise<Response> { try { const { db, profile }=await authorizeStaff(request); const {data,error}=await db.from("staff_modules").select("id,enabled"); dbError(error); return json({profile,modules:data ?? []}); } catch(error){ return apiError(error); } }
