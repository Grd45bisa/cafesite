import { Container } from "@/components/ui/Container";
import { menuCategories } from "@/data/menu";

/**
 * MenuCategoryNav — Navigasi Kategori Menu Sticky (Server Component)
 * Tanpa state atau library tab: murni anchor link HTML yang ringan dan cepat.
 * Menggunakan pill tipografis konsisten tanpa emoji.
 */
export function MenuCategoryNav() {
  return (
    <nav
      aria-label="Pintas Kategori Menu"
      className="sticky top-16 md:top-18 z-30 border-b border-charcoal-border/30 bg-charcoal/95 backdrop-blur-md py-3 md:py-3.5"
    >
      <Container size="default">
        <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-0 sm:px-0">
          {menuCategories.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="inline-flex shrink-0 items-center rounded-md border border-charcoal-border/70 px-3.5 py-1.5 text-sm text-offwhite-muted transition-colors hover:border-offwhite/60 hover:text-offwhite whitespace-nowrap"
            >
              {category.name}
            </a>
          ))}
        </div>
      </Container>
    </nav>
  );
}
