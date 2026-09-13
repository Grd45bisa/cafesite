import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowRightIcon, ImageIcon } from "@/components/ui/icons";
import { menuItems } from "@/data/menu";
import { formatPrice } from "@/lib/utils";
import type { MenuItem } from "@/types";

/**
 * MenuItemTile — Kartu menu favorit proporsional (Server Component)
 * Mobile: Baris horizontal kompak (thumb 64px + nama + harga) hemat ruang layar.
 * Tablet & Desktop: Grid 3 kolom seimbang dengan rasio thumbnail 4:3 yang proporsional,
 * tidak raksasa/col-span-2 agar selaras dengan ritme visual section lain di Home.
 */
function MenuItemTile({ item }: { item: MenuItem }) {
  return (
    <article className="flex items-center gap-3 rounded-md border border-charcoal-border/50 bg-charcoal-light/40 p-2.5 transition-colors hover:border-charcoal-border md:flex-col md:items-stretch md:gap-0 md:overflow-hidden md:p-0">
      {/* Thumbnail Foto Menu */}
      {/* // TODO: ganti dengan foto asli dari PHOTO_BRIEF.md via next/image saat asset fisik tersedia */}
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-charcoal-lighter md:h-auto md:w-full md:rounded-none md:aspect-[4/3]">
        <ImageIcon className="h-6 w-6 text-charcoal-muted md:h-7 md:w-7" />
      </div>

      <div className="min-w-0 flex-1 flex flex-col justify-between md:p-5">
        <div>
          <div className="flex items-baseline justify-between gap-2 md:flex-col md:items-start md:gap-1">
            <h3 className="truncate font-serif text-base font-medium tracking-tight text-offwhite md:text-lg">
              {item.name}
            </h3>
            <span className="shrink-0 font-mono text-sm font-semibold text-latte">
              {formatPrice(item.price)}
            </span>
          </div>

          <p className="mt-0.5 line-clamp-1 text-xs leading-snug text-offwhite-muted md:mt-2 md:line-clamp-2 md:leading-relaxed">
            {item.description}
          </p>
        </div>

        {item.tags?.[0] && (
          <span className="mt-3 hidden text-[10px] font-medium uppercase tracking-wider text-offwhite-darker md:inline-block">
            {item.tags[0]}
          </span>
        )}
      </div>
    </article>
  );
}

/**
 * FeaturedMenu Section — Server Component
 * Menampilkan 3 menu unggulan terfavorit dalam 3-kolom seragam di tablet & desktop.
 */
export function FeaturedMenu() {
  const featuredList = menuItems.filter((item) => item.isFeatured).slice(0, 3);

  return (
    <section
      id="featured-menu"
      aria-label="Menu Unggulan"
      className="border-b border-charcoal-border/30 bg-charcoal py-16 md:py-24"
    >
      <Container size="default">
        <SectionHeading
          eyebrow="PILIHAN TERFAVORIT"
          title="Menu yang paling sering di-order"
          description="Kopi susu buat nemenin kerja, camilan gurih buat ngobrol — rata-rata meja di sini selalu punya salah satunya. Bingung mulai dari mana? Mulai dari tiga ini."
          align="left"
        />

        {featuredList.length > 0 && (
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3 md:gap-4 lg:gap-6">
            {featuredList.map((item) => (
              <MenuItemTile key={item.id} item={item} />
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center md:justify-start">
          <Button variant="outline" size="lg" href="/menu">
            <span>Lihat Semua Menu</span>
            <ArrowRightIcon className="h-4 w-4 text-latte" />
          </Button>
        </div>
      </Container>
    </section>
  );
}