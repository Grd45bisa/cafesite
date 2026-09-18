export interface CartLine {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes: string;
}

export type OrderStep =
  | "collecting_items"
  | "awaiting_fulfillment"
  | "awaiting_table"
  | "awaiting_name"
  | "awaiting_phone"
  | "awaiting_confirmation";

export interface OrderSession {
  step: OrderStep;
  cart: CartLine[];
  fulfillment: "dine_in" | "takeaway" | null;
  tableCode: string | null;
  customerName: string | null;
  phone: string | null;
  idempotencyKey: string;
  lastActivity: number;
}

const SESSION_TIMEOUT_MS = 10 * 60_000;
const sessions = new Map<string, OrderSession>();

function newSession(): OrderSession {
  return {
    step: "collecting_items",
    cart: [],
    fulfillment: null,
    tableCode: null,
    customerName: null,
    phone: null,
    idempotencyKey: crypto.randomUUID(),
    lastActivity: Date.now(),
  };
}

/**
 * Ambil sesi order aktif untuk `chatId` (message.from), atau `null` kalau
 * tidak ada / sudah kedaluwarsa (>10 menit tidak ada aktivitas). Sesi yang
 * kedaluwarsa otomatis dihapus dari Map di sini.
 */
export function getSession(chatId: string): OrderSession | null {
  const session = sessions.get(chatId);
  if (!session) return null;

  if (Date.now() - session.lastActivity > SESSION_TIMEOUT_MS) {
    sessions.delete(chatId);
    return null;
  }

  return session;
}

export function hasActiveSession(chatId: string): boolean {
  return getSession(chatId) !== null;
}

/**
 * Mulai sesi order baru untuk `chatId`, menimpa sesi lama kalau ada.
 * `idempotencyKey` dibuat sekali di sini dan dipakai ulang untuk seluruh
 * sesi (termasuk saat retry "bayar"), sesuai constraint unique(user_id,
 * idempotency_key) di tabel orders.
 */
export function startSession(chatId: string): OrderSession {
  const session = newSession();
  sessions.set(chatId, session);
  return session;
}

export function touchSession(chatId: string): void {
  const session = sessions.get(chatId);
  if (session) session.lastActivity = Date.now();
}

export function clearSession(chatId: string): void {
  sessions.delete(chatId);
}
