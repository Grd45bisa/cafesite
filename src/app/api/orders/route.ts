import { apiError, authenticate, bodyJson, dbError, json } from "@/lib/server/api";
import { createOrderInput } from "@/lib/server/validation";

export async function POST(request: Request): Promise<Response> {
 try { const { db, user } = await authenticate(request); const input = createOrderInput(await bodyJson(request));
  const { data, error } = await db.rpc("create_cafe_order", { actor: user.id, request_key: input.idempotencyKey, customer: input.customerName, customer_phone: input.phone, fulfillment_value: input.fulfillment, table_code: input.tableCode ?? null, line_items: input.items });
  dbError(error); return json({ order: data }, 201);
 } catch (error) { return apiError(error); }
}
