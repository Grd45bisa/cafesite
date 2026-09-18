import type { CreateOrderInput, OrderItemInput } from "@/types/operations";

export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export function objectValue(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new HttpError(400, "Data tidak valid.");
  return value as Record<string, unknown>;
}

export function textValue(value: unknown, name: string, maximum = 200, minimum = 1): string {
  if (typeof value !== "string" || value.trim().length < minimum || value.trim().length > maximum) throw new HttpError(400, `${name} harus berisi ${minimum}–${maximum} karakter.`);
  return value.trim();
}

export function uuidValue(value: unknown): string {
  const id = textValue(value, "ID", 36, 36);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) throw new HttpError(400, "ID tidak valid.");
  return id;
}

export function numberValue(value: unknown, name: string, min: number, max: number, integer = true): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))) throw new HttpError(400, `${name} di luar batas.`);
  return value;
}

export function itemInputs(value: unknown): OrderItemInput[] {
  if (!Array.isArray(value) || value.length < 1 || value.length > 30) throw new HttpError(400, "Pesanan harus berisi 1–30 item.");
  const items = value.map((raw: unknown): OrderItemInput => {
    const item = objectValue(raw);
    return { menuItemId: textValue(item.menuItemId, "Menu", 80), quantity: numberValue(item.quantity, "Jumlah", 1, 20), notes: item.notes ? textValue(item.notes, "Catatan", 300, 0) : "" };
  });
  if (items.reduce((sum, item) => sum + item.quantity, 0) > 100) throw new HttpError(400, "Maksimal 100 porsi dalam satu pengiriman.");
  return items;
}

export function createOrderInput(value: unknown): CreateOrderInput {
  const raw = objectValue(value);
  const phone = textValue(raw.phone, "Nomor HP", 20, 8).replace(/[\s()+-]/g, "");
  if (!/^\d{8,15}$/.test(phone)) throw new HttpError(400, "Nomor HP tidak valid.");
  if (raw.fulfillment !== "dine_in" && raw.fulfillment !== "takeaway") throw new HttpError(400, "Pilih makan di tempat atau bawa pulang.");
  if (raw.paymentMethod !== "cod") throw new HttpError(400, "Pembayaran online segera hadir. Gunakan bayar di kasir.");
  return {
    customerName: textValue(raw.customerName, "Nama", 80, 2), phone, fulfillment: raw.fulfillment,
    tableCode: raw.fulfillment === "dine_in" ? textValue(raw.tableCode, "Meja", 40) : undefined,
    paymentMethod: "cod", items: itemInputs(raw.items), idempotencyKey: uuidValue(raw.idempotencyKey),
  };
}

export function reportDates(url: URL): { from: string; to: string } {
  const now = new Date();
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  const from = url.searchParams.get("from") || today;
  const to = url.searchParams.get("to") || today;
  for (const date of [from, to]) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) throw new HttpError(400, "Tanggal tidak valid.");
  }
  const days = (Date.parse(to) - Date.parse(from)) / 86400000;
  if (days < 0 || days > 30) throw new HttpError(400, "Rentang laporan maksimal 31 hari.");
  return { from: new Date(`${from}T00:00:00+07:00`).toISOString(), to: new Date(Date.parse(`${to}T00:00:00+07:00`) + 86400000).toISOString() };
}
