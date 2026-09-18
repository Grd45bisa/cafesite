import { useState } from "react";
import type { AdminMenuRecord } from "@/types";
import { formatPrice } from "@/lib/utils";

interface MenuRowProps {
  record: AdminMenuRecord;
  index: number;
  total: number;
  isDragging?: boolean;
  isDragOver?: boolean;
  onEdit: () => void;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDragStart?: (e: React.DragEvent<HTMLElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLElement>) => void;
  onDragLeave?: (e: React.DragEvent<HTMLElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLElement>) => void;
}

export default function MenuRow({
  record,
  index,
  total,
  isDragging,
  isDragOver,
  onEdit,
  onRemove,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}: MenuRowProps): React.JSX.Element {
  const { data } = record;
  const available = record.is_available !== false;
  const [isShaking, setIsShaking] = useState(false);

  function handleHandleClick() {
    setIsShaking(false);
    requestAnimationFrame(() => {
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
      }, 500);
    });
  }

  return (
    <article
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`group flex flex-col gap-3 border-b border-charcoal-border/20 py-3.5 last:border-b-0 transition-all duration-150 sm:flex-row sm:items-center sm:justify-between ${
        isShaking ? "animate-shake-vertical border-latte/60 bg-charcoal-light/25 shadow-md" : ""
      } ${
        isDragging ? "opacity-35 bg-charcoal-light/30 border-dashed border-latte rounded-xl" : ""
      } ${
        isDragOver ? "border-t-2 border-t-latte bg-charcoal-lighter/25 pl-2 rounded-lg" : ""
      } ${available ? "" : "opacity-60"}`}
    >
      {/* Sisi Kiri: Tombol Pegangan Tarik (Drag Handle) + Info Menu */}
      <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
        {/* Tombol Pegangan Tarik (Drag) & Navigasi Panah Naik/Turun */}
        <div className="flex shrink-0 items-center gap-1 self-center">
          <button
            type="button"
            draggable
            onClick={handleHandleClick}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            title="Tahan dan tarik untuk mengatur urutan (atau klik untuk petunjuk)"
            aria-label="Tahan dan tarik untuk mengatur urutan"
            className="flex h-8 w-8 cursor-grab active:cursor-grabbing items-center justify-center rounded-lg border border-transparent text-offwhite-darker transition-colors hover:border-charcoal-border hover:bg-charcoal-light/60 hover:text-offwhite group-hover:text-offwhite-muted"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="9" cy="6" r="1.5" />
              <circle cx="15" cy="6" r="1.5" />
              <circle cx="9" cy="12" r="1.5" />
              <circle cx="15" cy="12" r="1.5" />
              <circle cx="9" cy="18" r="1.5" />
              <circle cx="15" cy="18" r="1.5" />
            </svg>
          </button>

          <div className="flex flex-col">
            <button
              type="button"
              disabled={index === 0}
              onClick={onMoveUp}
              title="Pindah ke atas"
              aria-label="Pindah ke atas"
              className="rounded p-0.5 text-offwhite-darker transition-colors hover:bg-charcoal-light hover:text-latte disabled:cursor-not-allowed disabled:opacity-20"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button
              type="button"
              disabled={index === total - 1}
              onClick={onMoveDown}
              title="Pindah ke bawah"
              aria-label="Pindah ke bawah"
              className="rounded p-0.5 text-offwhite-darker transition-colors hover:bg-charcoal-light hover:text-latte disabled:cursor-not-allowed disabled:opacity-20"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Informasi Menu */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-serif text-base font-medium tracking-tight text-offwhite sm:text-lg">
              {data.name}
            </h3>
            {data.tags?.[0] && (
              <span className="rounded bg-terracotta/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-terracotta">
                {data.tags[0]}
              </span>
            )}
            {data.isFeatured && (
              <span className="rounded bg-latte/15 px-1.5 py-0.5 text-[10px] font-semibold text-latte">
                Unggulan
              </span>
            )}
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                available
                  ? "border-latte/30 bg-latte/10 text-latte-light"
                  : "border-terracotta/40 bg-terracotta/15 text-terracotta-light"
              }`}
            >
              {available ? "Tersedia" : "Habis"}
            </span>
          </div>
          {data.description && (
            <p className="mt-1 text-xs leading-relaxed text-offwhite-muted sm:text-sm">
              {data.description}
            </p>
          )}
        </div>
      </div>

      {/* Sisi Kanan: Harga & Tombol Aksi */}
      <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
        <span className="text-sm font-semibold text-latte sm:text-base">
          {formatPrice(data.price)}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg border border-charcoal-border/70 bg-charcoal-light/40 px-2.5 py-1 text-xs font-medium text-latte transition hover:border-latte hover:bg-latte/10 hover:text-latte-light"
            onClick={onEdit}
          >
            Edit
          </button>
          <button
            type="button"
            className="rounded-lg border border-charcoal-border/70 bg-charcoal-light/40 px-2.5 py-1 text-xs font-medium text-terracotta-light transition hover:border-terracotta/60 hover:bg-terracotta/10 hover:text-offwhite"
            onClick={onRemove}
          >
            Hapus
          </button>
        </div>
      </div>
    </article>
  );
}
