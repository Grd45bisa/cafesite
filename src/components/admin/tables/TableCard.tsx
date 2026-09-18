import type { AdminTable } from "@/types";

interface TableCardProps {
  table: AdminTable;
  onQr: () => void;
  onEdit: () => void;
  onClean: () => void;
  onDelete: () => void;
}

const statusText: Record<AdminTable["status"], string> = { available: "Tersedia", occupied: "Terisi", dirty: "Perlu dibersihkan" };
const statusClass: Record<AdminTable["status"], string> = {
  available: "border-latte/30 bg-latte/10 text-latte-light",
  occupied: "border-terracotta-light/40 bg-terracotta/15 text-offwhite",
  dirty: "border-terracotta/60 bg-terracotta/20 text-terracotta-light",
};

export default function TableCard({ table, onQr, onEdit, onClean, onDelete }: TableCardProps): React.JSX.Element {
  return (
    <article className="flex flex-col rounded-2xl border border-charcoal-border bg-charcoal p-4 transition hover:border-charcoal-muted">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-serif text-xl text-offwhite">{table.label}</h3>
          <p className="mt-1 truncate text-xs text-offwhite-darker">ID {table.id}</p>
        </div>
        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusClass[table.status]}`}>{statusText[table.status]}</span>
      </div>

      <button type="button" className="mt-4 min-h-11 rounded-xl bg-terracotta px-3 text-xs font-semibold transition hover:bg-terracotta-hover" onClick={onQr}>
        Lihat QR
      </button>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <button type="button" className="min-h-10 rounded-xl border border-charcoal-border px-2 text-xs transition hover:border-latte" onClick={onEdit}>
          Edit
        </button>
        {table.status === "dirty" ? (
          <button type="button" className="min-h-10 rounded-xl border border-latte/40 px-2 text-xs text-latte-light transition hover:bg-charcoal-light" onClick={onClean}>
            Bersihkan
          </button>
        ) : (
          <button type="button" className="min-h-10 rounded-xl px-2 text-xs text-terracotta-light transition hover:bg-terracotta/10" onClick={onDelete}>
            Hapus
          </button>
        )}
      </div>
      {table.status === "dirty" && (
        <button type="button" className="mt-2 min-h-9 text-xs text-terracotta-light transition hover:text-offwhite" onClick={onDelete}>
          Hapus meja
        </button>
      )}
    </article>
  );
}
