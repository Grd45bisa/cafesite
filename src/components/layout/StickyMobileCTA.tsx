"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MenuItemRow } from "@/components/menu/MenuItemRow";
import { CloseIcon } from "@/components/ui/icons";
import { cafeInfo } from "@/data/cafe";
import { menuCategories, menuItems } from "@/data/menu";
import { buildWhatsAppUrl } from "@/lib/utils";

const SHEET_ANIMATION_MS = 300;

/**
 * StickyMobileCTA — Bottom bar mobile dengan Bottom Sheet Menu (Client Component)
 * Tombol "Lihat Menu" membuka menu sebagai bottom sheet tanpa refresh halaman.
 * Sheet masuk/keluar dengan animasi slide (naik saat buka, turun saat tutup),
 * berlaku untuk semua cara menutup (tombol menu, silang, backdrop, Escape).
 */
export function StickyMobileCTA() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const waUrl = buildWhatsAppUrl(cafeInfo.whatsapp, "reservation");

  const openSheet = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMounted(true);
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const closeSheet = useCallback(() => {
    setVisible(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setMounted(false), SHEET_ANIMATION_MS);
  }, []);

  // Kunci scroll halaman + tutup dengan Escape saat sheet terbuka
  useEffect(() => {
    if (!mounted) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSheet();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [mounted, closeSheet]);

  return (
    <>
      <div
        className="fixed inset-x-0 bottom-0 z-50 bg-charcoal/95 backdrop-blur-md border-t border-charcoal-border/50 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:hidden"
        role="complementary"
        aria-label="Aksi cepat"
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => (mounted ? closeSheet() : openSheet())}
            aria-expanded={mounted}
            aria-controls="menu-bottom-sheet"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 min-h-[44px] text-sm font-medium text-offwhite border border-offwhite/30 rounded-md hover:bg-offwhite/10 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 01-2.5-2.5z" />
              <path d="M8 7h6" />
              <path d="M8 11h8" />
            </svg>
            {mounted ? "Tutup Menu" : "Lihat Menu"}
          </button>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 min-h-[44px] text-sm font-medium bg-terracotta text-offwhite rounded-md hover:bg-terracotta-hover transition-colors"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat WA
          </a>
        </div>
      </div>

      {mounted && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={closeSheet}
            className={`md:hidden fixed inset-0 z-30 bg-charcoal/60 transition-opacity duration-300 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Bottom Sheet */}
          <div
            id="menu-bottom-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Menu dan harga CafeSite"
            className={`md:hidden fixed inset-x-0 bottom-0 z-40 flex max-h-[82dvh] flex-col overflow-hidden rounded-t-lg border-t border-x border-charcoal-border/50 bg-charcoal shadow-floating transition-transform duration-300 ease-out ${
              visible ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <header className="flex shrink-0 items-center justify-between gap-3 border-b border-charcoal-border/30 px-5 py-3.5">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-widest text-terracotta">
                  Menu &amp; Harga
                </p>
                <h3 className="font-serif text-lg font-medium tracking-tight text-offwhite">
                  Pilih dulu, kami yang siapin
                </h3>
              </div>
              <button
                type="button"
                onClick={closeSheet}
                aria-label="Tutup menu"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-charcoal-border/70 text-offwhite transition-colors hover:border-offwhite/60"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </header>

            <div className="overflow-y-auto px-5 pt-2 pb-[calc(env(safe-area-inset-bottom)+5.5rem)] [&_article]:py-2.5 [&_article>div:last-child]:line-clamp-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {menuCategories.map((category) => {
                const items = menuItems.filter(
                  (item) => item.category === category.id,
                );
                if (items.length === 0) return null;
                return (
                  <section key={category.id} className="mt-6 first:mt-1">
                    <div className="flex items-baseline gap-2">
                      <h4 className="font-serif text-base font-medium tracking-tight text-offwhite">
                        {category.name}
                      </h4>
                      <span className="text-xs text-offwhite-darker">
                        {items.length}
                      </span>
                    </div>
                    <div className="mt-1">
                      {items.map((item, itemIndex) => (
                        <MenuItemRow key={item.id} item={item} index={itemIndex} showImage={false} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}