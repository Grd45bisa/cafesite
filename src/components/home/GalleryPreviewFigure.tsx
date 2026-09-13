import { ImageIcon } from "@/components/ui/icons";

interface GalleryPreviewFigureProps {
  id: string;
  title: string;
  note: string;
  className?: string;
  isActive: boolean;
  onToggle: (id: string) => void;
}

/**
 * GalleryPreviewFigure — Tile Galeri (Client Component)
 * Caption tersembunyi di semua tile; klik/tap pada foto akan memperlihatkan
 * caption miliknya dan menyembunyikan yang lain. Perilakunya dikendalikan
 * penuh oleh GalleryPreviewGrid (state `activeId`). Aman untuk keyboard
 * (role="button" + Enter/Spasi) dengan focus ring terracotta.
 */
export function GalleryPreviewFigure({
  id,
  title,
  note,
  className = "",
  isActive,
  onToggle,
}: GalleryPreviewFigureProps) {
  return (
    <figure
      id={id}
      role="button"
      tabIndex={0}
      aria-expanded={isActive}
      onClick={() => onToggle(id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onToggle(id);
        }
      }}
      className={`group relative cursor-pointer overflow-hidden rounded-md border bg-charcoal-light transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${
        isActive ? "border-charcoal-border" : "border-charcoal-border/50"
      } ${className}`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <ImageIcon className="h-7 w-7 text-charcoal-muted" />
      </div>
      <figcaption
        className={`pointer-events-none absolute inset-x-0 bottom-0 bg-charcoal/85 p-3.5 transition-opacity duration-200 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="line-clamp-1 text-sm font-medium text-offwhite">{title}</p>
        <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-offwhite-muted">
          {note}
        </p>
      </figcaption>
    </figure>
  );
}