"use client";

import { useState } from "react";
import type { AdminMenuRecord, MenuCategoryMeta } from "@/types";
import { adminInputClass, adminSecondaryClass } from "./admin-api";

interface CategoryManagerModalProps {
  categories: MenuCategoryMeta[];
  records: AdminMenuRecord[];
  busy: boolean;
  onClose: () => void;
  onSaveCategories: (updatedCategories: MenuCategoryMeta[]) => Promise<void>;
}

export default function CategoryManagerModal({
  categories,
  records,
  busy,
  onClose,
  onSaveCategories,
}: CategoryManagerModalProps): React.JSX.Element {
  const [list, setList] = useState<MenuCategoryMeta[]>(categories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleNameChange(val: string) {
    setName(val);
    if (!editingId) {
      setSlug(slugify(val));
    }
  }

  function handleStartEdit(category: MenuCategoryMeta) {
    setEditingId(category.id);
    setName(category.name);
    setSlug(category.id);
    setDescription(category.description);
    setError("");
  }

  function handleCancelForm() {
    setEditingId(null);
    setName("");
    setSlug("");
    setDescription("");
    setError("");
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const cleanName = name.trim();
    const cleanSlug = (slug || slugify(cleanName)).trim();

    if (!cleanName) {
      setError("Nama kategori wajib diisi.");
      return;
    }

    if (!cleanSlug) {
      setError("ID/Slug kategori tidak valid.");
      return;
    }

    let updatedList: MenuCategoryMeta[];

    if (editingId) {
      // Update existing
      updatedList = list.map((item) =>
        item.id === editingId
          ? { ...item, name: cleanName, description: description.trim() }
          : item
      );
    } else {
      // Check duplicate slug
      if (list.some((item) => item.id === cleanSlug)) {
        setError(`Kategori dengan ID '${cleanSlug}' sudah ada.`);
        return;
      }
      const newCategory: MenuCategoryMeta = {
        id: cleanSlug,
        name: cleanName,
        description: description.trim(),
      };
      updatedList = [...list, newCategory];
    }

    setSaving(true);
    try {
      await onSaveCategories(updatedList);
      setList(updatedList);
      handleCancelForm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan kategori.");
    } finally {
      setSaving(false);
    }
  }

  async function handleMove(fromIndex: number, toIndex: number) {
    if (toIndex < 0 || toIndex >= list.length || fromIndex === toIndex) return;
    const nextList = [...list];
    const [moved] = nextList.splice(fromIndex, 1);
    nextList.splice(toIndex, 0, moved);

    setSaving(true);
    try {
      await onSaveCategories(nextList);
      setList(nextList);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal memindahkan urutan kategori.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(category: MenuCategoryMeta) {
    const menuCount = records.filter((r) => r.data.category === category.id).length;
    let confirmMsg = `Hapus kategori "${category.name}"?`;
    if (menuCount > 0) {
      confirmMsg += `\n\nPerhatian: Ada ${menuCount} menu yang saat ini menggunakan kategori ini!`;
    }

    if (!confirm(confirmMsg)) return;

    if (list.length <= 1) {
      setError("Minimal harus ada 1 kategori.");
      return;
    }

    const nextList = list.filter((item) => item.id !== category.id);
    setSaving(true);
    try {
      await onSaveCategories(nextList);
      setList(nextList);
      if (editingId === category.id) {
        handleCancelForm();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal menghapus kategori.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-darkest/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl border border-charcoal-border bg-charcoal p-5 shadow-2xl md:p-6">
        {/* Header Modal */}
        <div className="flex items-start justify-between border-b border-charcoal-border/50 pb-4">
          <div>
            <h2 className="font-serif text-2xl font-medium tracking-tight text-offwhite">
              Kelola Kategori Menu
            </h2>
            <p className="mt-1 text-xs text-offwhite-muted sm:text-sm">
              Sesuaikan nama, deskripsi, atau tambah kategori baru sesuai konsep kafe Anda.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-offwhite-darker hover:bg-charcoal-light hover:text-offwhite transition"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Isi Scrollable */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {error && (
            <div className="rounded-xl border border-terracotta/40 bg-terracotta/10 p-3 text-xs text-terracotta-light">
              {error}
            </div>
          )}

          {/* Form Tambah / Edit Kategori */}
          <form onSubmit={handleFormSubmit} className="rounded-xl border border-charcoal-border/70 bg-charcoal-darkest/40 p-4">
            <h3 className="text-sm font-semibold text-offwhite mb-3">
              {editingId ? `Edit Kategori: ${name}` : "Tambah Kategori Baru"}
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1.5 text-xs text-offwhite-muted">
                Nama Kategori *
                <input
                  type="text"
                  placeholder="mis. Mocktail, Manual Brew"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={adminInputClass}
                  required
                />
              </label>

              <label className="grid gap-1.5 text-xs text-offwhite-muted">
                ID / Slug
                <input
                  type="text"
                  placeholder="mis. manual-brew"
                  value={slug}
                  disabled={Boolean(editingId)}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  className={`${adminInputClass} disabled:opacity-50`}
                />
              </label>

              <label className="grid gap-1.5 text-xs text-offwhite-muted sm:col-span-2">
                Deskripsi Singkat
                <input
                  type="text"
                  placeholder="mis. Seduhan segar buah dan rempah dingin"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={adminInputClass}
                />
              </label>
            </div>

            <div className="mt-3 flex items-center justify-end gap-2">
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="rounded-lg border border-charcoal-border px-3 py-1.5 text-xs text-offwhite-muted hover:border-offwhite hover:text-offwhite transition"
                >
                  Batal
                </button>
              )}
              <button
                type="submit"
                disabled={saving || busy}
                className="rounded-lg bg-terracotta px-4 py-1.5 text-xs font-semibold text-offwhite hover:bg-terracotta-hover disabled:opacity-50 transition"
              >
                {saving ? "Menyimpan…" : editingId ? "Perbarui Kategori" : "+ Tambah Kategori"}
              </button>
            </div>
          </form>

          {/* Daftar Kategori Aktif */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-terracotta">
                Daftar Kategori Aktif ({list.length})
              </span>
              <span className="text-[11px] text-offwhite-darker">
                Gunakan panah untuk urutan
              </span>
            </div>

            <div className="divide-y divide-charcoal-border/30 rounded-xl border border-charcoal-border bg-charcoal-darkest/30">
              {list.map((category, index) => {
                const count = records.filter((r) => r.data.category === category.id).length;
                const isSelected = editingId === category.id;

                return (
                  <div
                    key={category.id}
                    className={`flex items-center justify-between gap-3 p-3 transition ${
                      isSelected ? "bg-charcoal-light/30" : "hover:bg-charcoal-light/10"
                    }`}
                  >
                    {/* Urutan Controls */}
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        disabled={index === 0 || saving}
                        onClick={() => void handleMove(index, index - 1)}
                        title="Geser ke atas"
                        className="rounded p-0.5 text-offwhite-darker hover:bg-charcoal-light hover:text-latte disabled:opacity-20"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        disabled={index === list.length - 1 || saving}
                        onClick={() => void handleMove(index, index + 1)}
                        title="Geser ke bawah"
                        className="rounded p-0.5 text-offwhite-darker hover:bg-charcoal-light hover:text-latte disabled:opacity-20"
                      >
                        ▼
                      </button>
                    </div>

                    {/* Informasi Kategori */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-serif text-sm font-medium text-offwhite sm:text-base">
                          {category.name}
                        </span>
                        <span className="rounded bg-charcoal-light px-1.5 py-0.5 text-[10px] text-offwhite-darker font-mono">
                          {category.id}
                        </span>
                        <span className="rounded-full border border-charcoal-border/80 px-2 py-0.5 text-[10px] text-latte-light">
                          {count} menu
                        </span>
                      </div>
                      {category.description && (
                        <p className="mt-0.5 truncate text-xs text-offwhite-muted">
                          {category.description}
                        </p>
                      )}
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(category)}
                        className="rounded-lg border border-charcoal-border px-2.5 py-1 text-xs text-latte hover:border-latte hover:bg-latte/10 transition"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(category)}
                        className="rounded-lg border border-charcoal-border px-2.5 py-1 text-xs text-terracotta-light hover:border-terracotta/60 hover:bg-terracotta/10 transition"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="mt-4 flex items-center justify-between border-t border-charcoal-border/50 pt-4">
          <p className="text-xs text-offwhite-darker">
            Perubahan kategori langsung diterapkan pada formulir dan halaman menu.
          </p>
          <button
            type="button"
            onClick={onClose}
            className={`${adminSecondaryClass} text-xs`}
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
