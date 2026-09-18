"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminMenuRecord, MenuCategory, MenuCategoryMeta, MenuItem } from "@/types";
import { menuCategories as defaultCategories } from "@/data/menu";
import { adminButtonClass, adminError, adminRequest, adminSecondaryClass } from "./admin-api";
import AdminNotice from "./AdminNotice";
import MenuFormModal from "./MenuFormModal";
import MenuCategoryGroup from "./MenuCategoryGroup";
import CategoryManagerModal from "./CategoryManagerModal";

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

type Modal = { initial: MenuItem; initialSort: number; editing: boolean } | null;

export default function MenuManager(): React.JSX.Element {
  const [rows, setRows] = useState<AdminMenuRecord[]>([]);
  const [categories, setCategories] = useState<MenuCategoryMeta[]>(defaultCategories);
  const [modal, setModal] = useState<Modal>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (): Promise<void> => {
    try {
      const [menuResult, catResult] = await Promise.allSettled([
        adminRequest<{ data: AdminMenuRecord[] }>("manage?resource=menu"),
        adminRequest<{ data: MenuCategoryMeta[] | null }>("manage?resource=categories"),
      ]);

      let currentRows: AdminMenuRecord[] = [];
      if (menuResult.status === "fulfilled") {
        currentRows = menuResult.value.data;
        setRows(currentRows);
      } else {
        setError(adminError(menuResult.reason));
      }

      let activeCats = defaultCategories;
      if (catResult.status === "fulfilled" && Array.isArray(catResult.value.data) && catResult.value.data.length > 0) {
        activeCats = catResult.value.data;
      }

      // Pastikan jika ada kategori di menu yang belum ada di list kategori, tetap muncul
      const existingCatIds = new Set(activeCats.map((c) => c.id));
      const extraCats: MenuCategoryMeta[] = [];
      currentRows.forEach((r) => {
        const catId = r.data.category;
        if (catId && !existingCatIds.has(catId)) {
          existingCatIds.add(catId);
          extraCats.push({
            id: catId,
            name: catId.charAt(0).toUpperCase() + catId.slice(1).replace(/-/g, " "),
            description: "",
          });
        }
      });

      setCategories([...activeCats, ...extraCats]);
    } catch (cause: unknown) {
      setError(adminError(cause));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function save(item: MenuItem, sortOrder: number): Promise<void> {
    setBusy(true);
    setError("");
    try {
      await adminRequest("manage?resource=menu", { method: "PUT", body: JSON.stringify({ item, sortOrder }) });
      setMessage(modal?.editing ? "Perubahan menu sudah tersimpan." : "Menu baru sudah tersimpan dan langsung dipublikasikan.");
      setModal(null);
      await load();
    } catch (cause: unknown) {
      setError(adminError(cause));
    } finally {
      setBusy(false);
    }
  }

  async function remove(record: AdminMenuRecord): Promise<void> {
    if (!confirm(`Hapus ${record.data.name}?`)) return;
    setError("");
    try {
      await adminRequest("manage?resource=menu", { method: "DELETE", body: JSON.stringify({ id: record.id }) });
      setRows((current) => current.filter((row) => row.id !== record.id));
      setMessage(`${record.data.name} sudah dihapus.`);
    } catch (cause: unknown) {
      setError(adminError(cause));
    }
  }

  async function handleReorder(category: MenuCategory, updatedCategoryRecords: AdminMenuRecord[]): Promise<void> {
    const combinedRows: AdminMenuRecord[] = [];
    categories.forEach((cat) => {
      if (cat.id === category) {
        combinedRows.push(...updatedCategoryRecords);
      } else {
        combinedRows.push(...rows.filter((r) => r.data.category === cat.id));
      }
    });

    const rowsWithSort = combinedRows.map((r, idx) => ({ ...r, sort_order: idx }));
    setRows(rowsWithSort);

    const reorderPayload = updatedCategoryRecords.map((r) => {
      const globalIdx = rowsWithSort.findIndex((item) => item.id === r.id);
      return { id: r.id, sort_order: globalIdx >= 0 ? globalIdx : 0 };
    });

    try {
      await adminRequest("manage?resource=menu", {
        method: "PUT",
        body: JSON.stringify({ reorder: reorderPayload }),
      });
      setMessage("Urutan menu berhasil diperbarui.");
    } catch (cause: unknown) {
      setError(adminError(cause));
      await load();
    }
  }

  async function handleSaveCategories(updatedCategories: MenuCategoryMeta[]): Promise<void> {
    setBusy(true);
    setError("");
    try {
      await adminRequest("manage?resource=categories", {
        method: "PUT",
        body: JSON.stringify({ data: updatedCategories }),
      });
      setCategories(updatedCategories);
      setMessage("Daftar kategori berhasil disimpan.");
    } catch (cause: unknown) {
      setError(adminError(cause));
      throw cause;
    } finally {
      setBusy(false);
    }
  }

  if (loading && rows.length === 0 && !error) {
    return (
      <section className="rounded-2xl border border-charcoal-border bg-charcoal p-6">
        <p role="status" className="animate-pulse text-sm text-latte">
          Menyiapkan daftar menu…
        </p>
      </section>
    );
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm leading-6 text-offwhite-muted">
          Menu yang tersimpan di sini langsung tampil di halaman pemesanan dan situs kedai.
        </p>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className={`${adminSecondaryClass} shrink-0 text-xs sm:text-sm`}
            onClick={() => setCategoryModalOpen(true)}
          >
            Kelola Kategori ({categories.length})
          </button>
          <button
            type="button"
            className={`${adminButtonClass} shrink-0 text-xs sm:text-sm`}
            onClick={() =>
              setModal({
                initial: {
                  ...blank,
                  category: (categories[0]?.id as MenuCategory) || "coffee",
                  id: "",
                },
                initialSort: rows.length,
                editing: false,
              })
            }
          >
            + Tambah menu
          </button>
        </div>
      </div>

      <AdminNotice message={error} error />
      <AdminNotice message={message} />

      <section className="rounded-2xl border border-charcoal-border bg-charcoal p-5 md:p-6">
        {rows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-charcoal-border p-6 text-center text-sm text-offwhite-darker">
            Belum ada menu. Gunakan tombol “Tambah menu” untuk mulai mengisi.
          </p>
        ) : (
          categories.map((category) => {
            const records = rows.filter((row) => row.data.category === category.id);
            if (records.length === 0) return null;
            return (
              <MenuCategoryGroup
                key={category.id}
                category={category.id}
                name={category.name}
                description={category.description}
                records={records}
                onEdit={(record) =>
                  setModal({
                    initial: { ...record.data, isAvailable: record.is_available },
                    initialSort: record.sort_order,
                    editing: true,
                  })
                }
                onRemove={(record) => void remove(record)}
                onReorder={(reordered) => void handleReorder(category.id, reordered)}
              />
            );
          })
        )}
      </section>

      {/* Modal Edit / Tambah Menu */}
      {modal && (
        <MenuFormModal
          initial={modal.initial}
          initialSort={modal.initialSort}
          categories={categories}
          editing={modal.editing}
          busy={busy}
          onClose={() => setModal(null)}
          onSave={save}
          onManageCategories={() => {
            setCategoryModalOpen(true);
          }}
        />
      )}

      {/* Modal Kelola Kategori */}
      {categoryModalOpen && (
        <CategoryManagerModal
          categories={categories}
          records={rows}
          busy={busy}
          onClose={() => setCategoryModalOpen(false)}
          onSaveCategories={handleSaveCategories}
        />
      )}
    </div>
  );
}
