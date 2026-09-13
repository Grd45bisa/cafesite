"use client";

import { Container } from "@/components/ui/Container";
import { galleryCategories } from "@/data/gallery";
import { GalleryCategory } from "@/types";

interface GalleryFilterBarProps {
  activeCategory: "all" | GalleryCategory;
  onSelectCategory: (category: "all" | GalleryCategory) => void;
  currentCount: number;
  categoryCounts: Record<string, number>;
}

/**
 * GalleryFilterBar — Filter Kategori Galeri (Client Component)
 * Menggunakan pill tipografis konsisten dengan MenuCategoryNav (tanpa emoji),
 * dengan counter foto yang sedang tampil di sisi kanan.
 */
export function GalleryFilterBar({
  activeCategory,
  onSelectCategory,
  currentCount,
  categoryCounts,
}: GalleryFilterBarProps) {
  return (
    <nav
      aria-label="Filter Kategori Galeri"
      className="sticky top-16 md:top-18 z-30 border-b border-charcoal-border/30 bg-charcoal/95 backdrop-blur-md py-3.5"
    >
      <Container size="default">
        <div className="flex items-center justify-between gap-4">
          {/* Horizontal scrollable pills */}
          <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-0 sm:px-0">
            {galleryCategories.map((category) => {
              const isActive = activeCategory === category.id;
              const count = categoryCounts[category.id] ?? 0;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onSelectCategory(category.id)}
                  aria-pressed={isActive}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-3.5 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta whitespace-nowrap ${
                    isActive
                      ? "border-terracotta/70 bg-charcoal-light text-offwhite font-medium"
                      : "border-charcoal-border/70 text-offwhite-muted hover:border-offwhite/60 hover:text-offwhite"
                  }`}
                >
                  <span>{category.name}</span>
                  <span
                    className={`text-xs ${
                      isActive ? "text-latte" : "text-offwhite-darker"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Human photo counter on the right */}
          <div className="hidden shrink-0 items-center text-xs text-offwhite-muted sm:flex">
            <span>{currentCount} foto</span>
          </div>
        </div>
      </Container>
    </nav>
  );
}
