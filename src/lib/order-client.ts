"use client";

import { getBrowserSupabase } from "@/lib/supabase/browser";
import type { Order, OrderItemInput } from "@/types/operations";
import type { OrderResponse, PendingOrderRequest } from "@/types/ordering";

export const LAST_ORDER_KEY = "cafesite:last-order";
let customerSession: Promise<string> | null = null;

export async function customerAccessToken(create: boolean = false): Promise<string> {
  const supabase = getBrowserSupabase();
  if (!supabase) throw new Error("Pemesanan belum tersedia. Silakan pesan langsung di kasir.");
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error("Sesi belum dapat dibaca. Coba kembali beberapa saat lagi.");
  if (data.session) return data.session.access_token;
  if (!create) throw new Error("Buka pesanan dari browser yang digunakan saat memesan. Jika sesi sudah dihapus, minta bantuan kasir.");
  if (!customerSession) {
    customerSession = supabase.auth.signInAnonymously().then(({ data: signedIn, error: signInError }) => {
      if (signInError || !signedIn.session) throw new Error("Belum bisa memulai sesi pesanan. Silakan coba lagi atau hubungi kasir.");
      return signedIn.session.access_token;
    }).finally(() => { customerSession = null; });
  }
  return customerSession;
}

export async function orderRequest<T>(path: string, options: RequestInit = {}, createSession: boolean = false): Promise<T> {
  const token = await customerAccessToken(createSession);
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(path, {
      ...options,
      cache: "no-store",
      signal: controller.signal,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...options.headers },
    });
    const payload: T & { error?: string } = await response.json();
    if (!response.ok) throw new Error(payload.error || "Pesanan belum dapat diproses. Silakan coba lagi.");
    return payload;
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Koneksi terlalu lama. Coba kirim lagi dengan rincian yang sama; pesanan tidak akan dibuat dua kali.");
    }
    if (error instanceof TypeError) throw new Error("Koneksi terputus. Periksa internet, lalu coba lagi dengan rincian yang sama.");
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function fetchCustomerOrder(id: string): Promise<Order> {
  const { order } = await orderRequest<OrderResponse>(`/api/orders/${encodeURIComponent(id)}`);
  return order;
}

export function queueLabel(number: number): string {
  return `A-${String(number).padStart(3, "0")}`;
}

export function canAddToOrder(order: Order): boolean {
  return !["completed", "cancelled"].includes(order.status) && order.payment_status === "unpaid";
}

// Keep retries of the same checkout tied to one server-side idempotency key.
// Only a digest is persisted; customer names and phone numbers stay out of storage.
export async function requestKey(scope: string, payload: unknown): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(payload)));
  const fingerprint = Array.from(new Uint8Array(digest), (byte: number): string => byte.toString(16).padStart(2, "0")).join("");
  const storageKey = `cafesite:request:${scope}`;
  try {
    const previous = JSON.parse(localStorage.getItem(storageKey) || "null") as PendingOrderRequest | null;
    if (previous?.fingerprint === fingerprint && previous.key) return previous.key;
  } catch { /* Storage can be disabled; the request can still be made. */ }
  const key = crypto.randomUUID();
  try { localStorage.setItem(storageKey, JSON.stringify({ fingerprint, key })); } catch { /* Optional recovery storage. */ }
  return key;
}

export function finishOrderRequest(scope: string, orderId: string): void {
  try {
    localStorage.removeItem(`cafesite:request:${scope}`);
    localStorage.setItem(LAST_ORDER_KEY, orderId);
  } catch { /* A successful order must remain successful when storage is disabled. */ }
}

export function isCartItem(value: unknown): value is OrderItemInput {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<OrderItemInput>;
  return typeof item.menuItemId === "string" && item.menuItemId.length <= 100
    && Number.isInteger(item.quantity) && Number(item.quantity) >= 1 && Number(item.quantity) <= 20
    && typeof item.notes === "string" && item.notes.length <= 300;
}
