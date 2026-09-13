import { formatPrice } from "@/lib/utils";
import type { MenuItem } from "@/types";

interface MenuItemRowProps {
  item: MenuItem;
}

/**
 * MenuItemRow — Baris Menu Tipografis Restoran Klasik (Server Component)
 * Menghindari visual bising foto placeholder: murni tipografi serif,
 * dotted leader pembatas, dan format harga Rupiah presisi.
 */
export function MenuItemRow({ item }: MenuItemRowProps) {
  return (
    <article className="border-b border-charcoal-border/20 py-4 last:border-b-0">
      {/* Baris Nama & Harga dengan Dotted Leader */}
      <div className="flex items-baseline gap-2 sm:gap-3">
        <h3 className="shrink-0 font-serif text-base font-medium tracking-tight text-offwhite sm:text-lg">
          {item.name}
        </h3>
        <div
          className="mx-1 mb-1 flex-1 self-end border-b border-dotted border-charcoal-border/60 sm:mx-2"
          aria-hidden="true"
        />
        <span className="shrink-0 text-sm font-semibold text-latte sm:text-base">
          {formatPrice(item.price)}
        </span>
      </div>

      {/* Baris Keterangan & Tag Pilihan */}
      <div className="mt-1 text-sm leading-relaxed text-offwhite-muted">
        {item.tags?.[0] && (
          <span className="mr-2 inline-block text-[11px] font-medium uppercase tracking-wide text-terracotta">
            {item.tags[0]}
          </span>
        )}
        <span>{item.description}</span>
      </div>
    </article>
  );
}
