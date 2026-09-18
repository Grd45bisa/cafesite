"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { AdminMenuRecord, MenuCategory, MenuItem } from "@/types";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { adminButtonClass, adminError, adminInputClass, adminRequest, adminSecondaryClass } from "./admin-api";

const blank: MenuItem = {
  id: "",
  name: "",
  description: "",
  price: 0,
  category: "coffee",
  tags: [],
  isFeatured: false,
  isAvailable: true,
};

const categories: MenuCategory[] = ["coffee", "non-coffee", "food", "snack", "dessert"];

export default function MenuManager(): React.JSX.Element {
  const [rows, setRows] = useState<AdminMenuRecord[]>([]);
  const [item, setItem] = useState<MenuItem>(blank);
  const [sort, setSort] = useState(0);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (): Promise<void> => {
    try {
      const result = await adminRequest<{ data: AdminMenuRecord[] }>("manage?resource=menu");
      setRows(result.data);
    } catch (cause: unknown) {
      setMessage(adminError(cause));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async (): Promise<void> => {
      try {
        const result = await adminRequest<{ data: AdminMenuRecord[] }>("manage?resource=menu");
        if (!cancelled) setRows(result.data);
      } catch (cause: unknown) {
        if (!cancelled) setMessage(adminError(cause));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function save(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    setBusy(true);
    try {
      await adminRequest("manage?resource=menu", {
        method: "PUT",
        body: JSON.stringify({ item, sortOrder: sort }),
      });
      setMessage("Menu tersimpan dan langsung dipublikasikan.");
      setItem(blank);
      await load();
    } catch (cause: unknown) {
      setMessage(adminError(cause));
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string): Promise<void> {
    if (!confirm("Hapus menu ini?")) return;
    try {
      await adminRequest("manage?resource=menu", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      await load();
    } catch (cause: unknown) {
      setMessage(adminError(cause));
    }
  }

  async function upload(file: File): Promise<void> {
    const client = getBrowserSupabase();
    if (!client) {
      setMessage("Supabase belum aktif.");
      return;
    }
    if (file.size > 5_242_880 || !/^image\/(jpeg|png|webp|avif)$/.test(file.type)) {
      setMessage("Foto harus JPG, PNG, WebP, atau AVIF maksimal 5 MB.");
      return;
    }
    setBusy(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `menu/${crypto.randomUUID()}.${ext}`;
    const { error } = await client.storage.from("cafe-assets").upload(path, file, { contentType: file.type });
    if (error) {
      setMessage("Upload foto gagal.");
    } else {
      const publicUrl = client.storage.from("cafe-assets").getPublicUrl(path).data.publicUrl;
      setItem((current) => ({ ...current, image: publicUrl }));
    }
    setBusy(false);
  }

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <section className="rounded-2xl border border-charcoal-border bg-charcoal p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-serif text-2xl">Daftar menu</h2>
          <button
            type="button"
            className={adminSecondaryClass}
            onClick={() => {
              setItem(blank);
              setSort(rows.length);
            }}
          >
            Tambah menu
          </button>
        </div>

        {rows.length === 0 ? (
          <p className="mt-5 rounded-xl border border-dashed border-charcoal-border p-6 text-sm text-offwhite-darker">
            Belum ada menu. Gunakan tombol “Tambah menu” untuk mulai mengisi.
          </p>
        ) : (
          <div className="mt-5 space-y-3">
            {rows.map((row) => (
              <article
                key={row.id}
                className="flex items-center gap-3 rounded-xl border border-charcoal-border p-3"
              >
                {row.data.image ? (
                  <Image
                    src={row.data.image}
                    alt={row.data.name}
                    width={56}
                    height={56}
                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-14 w-14 shrink-0 rounded-lg bg-charcoal-lighter" aria-hidden="true" />
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-offwhite">{row.data.name}</h3>
                  <p className="text-xs text-offwhite-darker">
                    Rp {row.data.price.toLocaleString("id-ID")} · {row.is_available ? "Tersedia" : "Habis"}
                  </p>
                </div>
                <button
                  type="button"
                  className="min-h-11 px-2 text-xs text-latte transition-colors hover:text-latte-light"
                  onClick={() => {
                    setItem({ ...row.data, isAvailable: row.is_available });
                    setSort(row.sort_order);
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="min-h-11 px-2 text-xs text-terracotta-light transition-colors hover:text-offwhite"
                  onClick={() => void remove(row.id)}
                >
                  Hapus
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <form
        onSubmit={(event) => void save(event)}
        className="rounded-2xl border border-charcoal-border bg-charcoal p-5 md:p-6"
      >
        <h2 className="font-serif text-2xl">{item.id ? "Edit menu" : "Menu baru"}</h2>
        <div className="mt-5 grid gap-4">
          <label className="grid gap-2 text-sm">
            ID menu
            <input
              required
              placeholder="contoh: espresso"
              value={item.id}
              onChange={(event) =>
                setItem({ ...item, id: event.target.value.replace(/\s+/g, "-").toLowerCase() })
              }
              className={adminInputClass}
            />
          </label>
          <label className="grid gap-2 text-sm">
            Nama
            <input
              required
              placeholder="Nama menu"
              value={item.name}
              onChange={(event) => setItem({ ...item, name: event.target.value })}
              className={adminInputClass}
            />
          </label>
          <label className="grid gap-2 text-sm">
            Deskripsi
            <textarea
              required
              placeholder="Singkat dan mengundang."
              value={item.description}
              onChange={(event) => setItem({ ...item, description: event.target.value })}
              className={`${adminInputClass} min-h-24`}
            />
          </label>
          <label className="grid gap-2 text-sm">
            Harga
            <input
              required
              type="number"
              min="0"
              placeholder="25000"
              value={item.price || ""}
              onChange={(event) => setItem({ ...item, price: Number(event.target.value) })}
              className={adminInputClass}
            />
          </label>
          <label className="grid gap-2 text-sm">
            Kategori
            <select
              value={item.category}
              onChange={(event) => setItem({ ...item, category: event.target.value as MenuCategory })}
              className={adminInputClass}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            Tag (pisahkan koma)
            <input
              placeholder="mis. signature, lokal"
              value={item.tags?.join(", ") ?? ""}
              onChange={(event) =>
                setItem({
                  ...item,
                  tags: event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean),
                })
              }
              className={adminInputClass}
            />
          </label>
          <label className="grid gap-2 text-sm">
            Urutan tampil
            <input
              type="number"
              min="0"
              value={sort}
              onChange={(event) => setSort(Number(event.target.value))}
              className={adminInputClass}
            />
          </label>
          <label className="grid gap-2 text-sm">
            Foto menu
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              disabled={busy}
              className="file:mr-3 file:rounded-lg file:border-0 file:bg-charcoal-light file:px-3 file:py-1.5 file:text-xs file:text-offwhite-muted"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void upload(file);
              }}
            />
          </label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-offwhite-muted">
              <input
                type="checkbox"
                checked={item.isAvailable !== false}
                onChange={(event) => setItem({ ...item, isAvailable: event.target.checked })}
                className="h-4 w-4 accent-terracotta"
              />
              Tersedia
            </label>
            <label className="flex items-center gap-2 text-sm text-offwhite-muted">
              <input
                type="checkbox"
                checked={item.isFeatured === true}
                onChange={(event) => setItem({ ...item, isFeatured: event.target.checked })}
                className="h-4 w-4 accent-terracotta"
              />
              Unggulan
            </label>
          </div>
          <button type="submit" disabled={busy} className={adminButtonClass}>
            {busy ? "Menyimpan…" : "Simpan menu"}
          </button>
          {message && <p className="text-sm text-latte">{message}</p>}
        </div>
      </form>
    </div>
  );
}