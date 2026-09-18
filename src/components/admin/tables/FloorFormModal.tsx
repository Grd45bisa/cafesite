"use client";

import { useState } from "react";
import type { AdminFloorForm } from "@/types";
import AdminField from "../AdminField";
import { adminButtonClass, adminInputClass, adminSecondaryClass } from "../admin-api";

interface FloorFormModalProps { initial: AdminFloorForm; busy: boolean; onClose: () => void; onSave: (floor: AdminFloorForm) => Promise<void>; }

export default function FloorFormModal({ initial, busy, onClose, onSave }: FloorFormModalProps): React.JSX.Element {
  const [form, setForm] = useState(initial);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-charcoal-darkest/80 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="floor-form-title" className="w-full max-w-md rounded-2xl border border-charcoal-border bg-charcoal p-5 shadow-floating md:p-6">
        <h2 id="floor-form-title" className="font-serif text-2xl">{form.id ? "Ubah nama lantai" : "Tambahkan lantai"}</h2>
        <form className="mt-5 grid gap-4" onSubmit={(event) => { event.preventDefault(); void onSave(form); }}>
          <AdminField label="Nama lantai"><input autoFocus required maxLength={80} className={adminInputClass} value={form.name} placeholder="Contoh: Lantai 1" onChange={(event) => setForm({ ...form, name: event.target.value })} /></AdminField>
          <AdminField label="Urutan tampil"><input required min={0} max={10000} type="number" className={adminInputClass} value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })} /></AdminField>
          <div className="mt-2 flex justify-end gap-3"><button type="button" className={adminSecondaryClass} onClick={onClose}>Batal</button><button disabled={busy} className={adminButtonClass}>{busy ? "Menyimpan…" : "Simpan lantai"}</button></div>
        </form>
      </section>
    </div>
  );
}
