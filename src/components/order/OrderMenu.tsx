"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";
import { OrderMenuCard } from "./OrderMenuCard";
import { finishOrderRequest, orderRequest, requestKey } from "@/lib/order-client";
import { formatPrice } from "@/lib/utils";
import { menuCategories } from "@/data/menu";
import { MapPinIcon } from "@/components/ui/icons";
import type { CatalogResponse, OrderMenuProps } from "@/types";

const fieldClass = "mt-2 min-h-11 w-full rounded-xl border border-charcoal-border bg-charcoal-darkest px-3.5 py-2.5 text-sm text-offwhite outline-none transition focus:border-latte";

export function OrderMenu({ initialMenu, tableCode }: OrderMenuProps): React.JSX.Element {
  const cart = useCart();
  const router = useRouter();
  const [catalog, setCatalog] = useState<CatalogResponse>({ menu: initialMenu, tables: [], configured: false, onlinePayment: false });
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void fetch("/api/catalog", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => { if (data?.configured) setCatalog(data); })
      .catch(() => undefined);
  }, []);

  const available = useMemo(() => catalog.menu.filter((item) => item.isAvailable !== false), [catalog.menu]);
  const groups = useMemo(
    () => menuCategories
      .map((category) => ({ category, items: available.filter((item) => item.category === category.id) }))
      .filter((group) => group.items.length > 0),
    [available],
  );
  const total = useMemo(
    () => cart.items.reduce((sum, line) => sum + (catalog.menu.find((item) => item.id === line.menuItemId)?.price ?? 0) * line.quantity, 0),
    [cart.items, catalog.menu],
  );

  async function checkout(form: FormData): Promise<void> {
    setBusy(true);
    setError("");
    try {
      const fulfillment = String(form.get("fulfillment"));
      const payload = {
        customerName: String(form.get("name")),
        phone: String(form.get("phone")),
        fulfillment,
        tableCode: fulfillment === "dine_in" ? String(form.get("table") || tableCode) : undefined,
        paymentMethod: "cod" as const,
        items: cart.items,
      };
      const idempotencyKey = await requestKey("checkout", payload);
      const result = await orderRequest<{ order: { id: string } }>("/api/orders", { method: "POST", body: JSON.stringify({ ...payload, idempotencyKey }) }, true);
      finishOrderRequest("checkout", result.order.id);
      cart.clear();
      router.push(`/order/${result.order.id}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Pesanan belum terkirim.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-5 py-8 md:py-14">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-latte">Pesan di meja</p>
        <h1 className="mt-3 font-serif text-3xl sm:text-4xl">Pilih yang ingin dinikmati.</h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-offwhite-muted">
          {tableCode ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-latte/30 bg-latte/5 px-3 py-1 text-xs font-medium text-latte">
              <MapPinIcon className="h-3.5 w-3.5" /> Meja {tableCode}
            </span>
          ) : (
            <span>Pilih makan di tempat atau bawa pulang saat checkout.</span>
          )}
          <span className="text-offwhite-darker">· Bayar di kasir</span>
        </div>
      </header>

      <div className="mt-8 space-y-10">
        {groups.map((group) => (
          <div key={group.category.id}>
            <div className="mb-3 flex items-baseline gap-2">
              <h2 className="font-serif text-xl text-offwhite sm:text-2xl">{group.category.name}</h2>
              <span className="text-xs text-offwhite-darker">{group.items.length} pilihan</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2 md:gap-4">
              {group.items.map((item) => {
                const quantity = cart.items.find((line) => line.menuItemId === item.id)?.quantity ?? 0;
                return (
                  <OrderMenuCard
                    key={item.id}
                    item={item}
                    quantity={quantity}
                    onAdd={() => cart.add(item.id)}
                    onDecrease={() => (quantity <= 1 ? cart.remove(item.id) : cart.update(item.id, { quantity: quantity - 1 }))}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-4 z-20 mt-8 flex items-center justify-between gap-3 rounded-2xl border border-latte/30 bg-espresso p-4 shadow-floating">
        <span className="min-w-0 truncate text-sm text-offwhite">
          {cart.count > 0 ? <><strong className="font-semibold">{cart.count}</strong> item · {formatPrice(total)}</> : "Keranjang masih kosong"}
        </span>
        <button
          type="button"
          disabled={!cart.count}
          onClick={() => setOpen(true)}
          className="min-h-11 shrink-0 rounded-xl bg-terracotta px-5 text-sm font-semibold text-offwhite-pure transition hover:bg-terracotta-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          Checkout
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] grid place-items-end bg-charcoal-darkest/80 p-0 sm:place-items-center sm:p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <form
            action={checkout}
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-charcoal p-6 shadow-floating sm:rounded-2xl"
          >
            <h2 className="font-serif text-2xl">Detail pesanan</h2>
            <p className="mt-2 text-sm text-offwhite-muted">Bayar di kasir · <span className="font-semibold text-offwhite">{formatPrice(total)}</span></p>

            <label className="mt-5 block text-sm text-offwhite-muted">
              Nama
              <input required name="name" minLength={2} placeholder="Nama kamu" className={fieldClass} />
            </label>
            <label className="mt-4 block text-sm text-offwhite-muted">
              Nomor WhatsApp
              <input required name="phone" inputMode="tel" placeholder="08xxxxxxxxxx" className={fieldClass} />
            </label>
            <label className="mt-4 block text-sm text-offwhite-muted">
              Untuk
              <select name="fulfillment" defaultValue={tableCode ? "dine_in" : "takeaway"} className={fieldClass}>
                <option value="dine_in">Makan di tempat</option>
                <option value="takeaway">Bawa pulang</option>
              </select>
            </label>
            <label className="mt-4 block text-sm text-offwhite-muted">
              ID meja (untuk makan di tempat)
              <input name="table" defaultValue={tableCode} placeholder="mis. L1-M001" className={fieldClass} />
            </label>

            {error && <p role="alert" className="mt-4 text-sm text-terracotta-light">{error}</p>}

            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setOpen(false)} className="min-h-11 flex-1 rounded-xl border border-charcoal-border text-sm font-medium text-offwhite transition hover:border-latte hover:bg-charcoal-light">
                Batal
              </button>
              <button disabled={busy} className="min-h-11 flex-1 rounded-xl bg-terracotta text-sm font-semibold text-offwhite-pure transition hover:bg-terracotta-hover disabled:cursor-wait disabled:opacity-50">
                {busy ? "Mengirim…" : "Kirim pesanan"}
              </button>
            </div>
          </form>
        </div>
      )}

      <Link className="mt-8 inline-block text-sm text-latte underline underline-offset-4" href="/">← Kembali ke CafeSite</Link>
    </section>
  );
}
