"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { isCartItem } from "@/lib/order-client";
import type { ReactElement } from "react";
import type { OrderItemInput } from "@/types/operations";
import type { CartContextValue, CartProviderProps } from "@/types/ordering";

const STORAGE_KEY = "cafesite:cart:v1";
const CART_EVENT = "cafesite:cart-change";
const CartContext = createContext<CartContextValue | null>(null);
let memoryCart = "[]";

function subscribe(listener: () => void): () => void {
  window.addEventListener("storage", listener);
  window.addEventListener(CART_EVENT, listener);
  return (): void => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(CART_EVENT, listener);
  };
}

function snapshot(): string {
  try { return localStorage.getItem(STORAGE_KEY) || memoryCart; } catch { return memoryCart; }
}

function parseCart(raw: string): OrderItemInput[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isCartItem).slice(0, 40) : [];
  } catch { return []; }
}

function saveCart(items: OrderItemInput[]): void {
  memoryCart = JSON.stringify(items);
  try { localStorage.setItem(STORAGE_KEY, memoryCart); } catch { /* Fall back to this tab's memory. */ }
  window.dispatchEvent(new Event(CART_EVENT));
}

export function CartProvider({ children }: CartProviderProps): ReactElement {
  const raw = useSyncExternalStore(subscribe, snapshot, (): string => "[]");
  const items = useMemo((): OrderItemInput[] => parseCart(raw), [raw]);
  const value = useMemo((): CartContextValue => ({
    items,
    count: items.reduce((sum: number, item: OrderItemInput): number => sum + item.quantity, 0),
    add: (menuItemId: string): void => {
      const current = parseCart(snapshot());
      const existing = current.find((item: OrderItemInput): boolean => item.menuItemId === menuItemId);
      if (existing) {
        saveCart(current.map((item: OrderItemInput): OrderItemInput => item.menuItemId === menuItemId
          ? { ...item, quantity: Math.min(20, item.quantity + 1) } : item));
      } else if (current.length < 40) {
        saveCart([...current, { menuItemId, quantity: 1, notes: "" }]);
      }
    },
    update: (menuItemId: string, values: Partial<Pick<OrderItemInput, "quantity" | "notes">>): void => {
      saveCart(parseCart(snapshot()).map((item: OrderItemInput): OrderItemInput => item.menuItemId === menuItemId
        ? { ...item, ...values, quantity: Math.max(1, Math.min(20, values.quantity ?? item.quantity)), notes: (values.notes ?? item.notes).slice(0, 300) }
        : item));
    },
    remove: (menuItemId: string): void => saveCart(parseCart(snapshot()).filter((item: OrderItemInput): boolean => item.menuItemId !== menuItemId)),
    clear: (): void => saveCart([]),
  }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart must be used inside CartProvider.");
  return cart;
}
