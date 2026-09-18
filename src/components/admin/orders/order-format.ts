import type { Order, OrderStatus } from "@/types";

export const WAIT_WARNING_MINUTES = 5;
export const WAIT_URGENT_MINUTES = 15;

export function formatRupiah(value: number): string { return `Rp ${value.toLocaleString("id-ID")}`; }
export function queueLabel(queue: number): string { return `A-${String(queue).padStart(3, "0")}`; }
export function fulfillmentLabel(order: Order): string { return order.fulfillment === "dine_in" ? `Meja ${order.table_id ?? "-"}` : "Bawa pulang"; }
export function waitingMinutes(createdAt: string, now: number): number { return Math.max(0, Math.floor((now - Date.parse(createdAt)) / 60000)); }
export function waitingLabel(createdAt: string, now: number): string { const minutes = waitingMinutes(createdAt, now); return minutes < 1 ? "Baru masuk" : `${minutes} menit`; }
export function urgencyClass(createdAt: string, now: number): string { const minutes = waitingMinutes(createdAt, now); if (minutes >= WAIT_URGENT_MINUTES) return "border-terracotta-light bg-terracotta/15 text-terracotta-light animate-pulse"; if (minutes >= WAIT_WARNING_MINUTES) return "border-latte/50 bg-latte/10 text-latte-light"; return "border-charcoal-border bg-charcoal-light text-offwhite-muted"; }
export function nextOrderAction(order: Order): { status: OrderStatus; label: string; markPaid: boolean } | null { if (order.status === "waiting") return { status: "preparing", label: "Mulai proses", markPaid: false }; if (order.status === "preparing") return { status: "ready", label: "Siap disajikan", markPaid: false }; if (order.status === "ready") return { status: "completed", label: order.payment_status === "unpaid" ? "Tandai lunas & selesai" : "Selesaikan", markPaid: order.payment_status === "unpaid" }; return null; }
export function isToday(date: string): boolean { const formatter = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }); return formatter.format(new Date(date)) === formatter.format(new Date()); }
