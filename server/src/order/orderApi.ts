import { createServiceRoleClient, type SupabaseConfig } from "../supabase/client";
import type { CartLine } from "./session";

export interface OrderDocument {
  id: string;
  queue_number: number;
  customer_name: string;
  phone: string;
  fulfillment: "dine_in" | "takeaway";
  table_id: string | null;
  status: string;
  payment_status: string;
  total: number;
  items: { name: string; unit_price: number; quantity: number }[];
}

/**
 * Bungkus RPC create_cafe_order (security definer, hanya bisa dipanggil
 * service_role). JANGAN pernah insert langsung ke tabel orders/order_items
 * dari sini - semua validasi (harga saat ini, is_available, meja available,
 * rate limit 5/10menit) sudah dilakukan RPC di database.
 */
export async function createCafeOrder(
  supabaseConfig: SupabaseConfig,
  actorUserId: string,
  idempotencyKey: string,
  customerName: string,
  phone: string,
  fulfillment: "dine_in" | "takeaway",
  tableCode: string | null,
  cart: CartLine[],
): Promise<OrderDocument> {
  const client = createServiceRoleClient(supabaseConfig);

  const lineItems = cart.map((line) => ({
    menuItemId: line.menuItemId,
    quantity: line.quantity,
    notes: line.notes,
  }));

  const { data, error } = await client.rpc("create_cafe_order", {
    actor: actorUserId,
    request_key: idempotencyKey,
    customer: customerName,
    customer_phone: phone,
    fulfillment_value: fulfillment,
    table_code: tableCode,
    line_items: lineItems,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data as OrderDocument;
}

/**
 * Bungkus RPC update_cafe_order khusus untuk menandai lunas (mode
 * development, belum ada payment gateway sungguhan - lihat ipaymu.md untuk
 * rencana fase mendatang).
 */
export async function markOrderPaid(supabaseConfig: SupabaseConfig, orderId: string): Promise<OrderDocument> {
  const client = createServiceRoleClient(supabaseConfig);

  const { data, error } = await client.rpc("update_cafe_order", {
    order_uuid: orderId,
    next_status: null,
    mark_paid: true,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data as OrderDocument;
}
