import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ImageIcon } from "@/components/ui/icons";

/**
 * OurSpace Section — Suasana & Sudut Favorit (Server Component)
 * Deskripsi atmosfer di atas + mozaik kecil ala GalleryPreview Home tanpa
 * caption interaktif (placeholder foto). Latar charcoal-darkest bergantian.
 */
export function OurSpace() {
  return (
    <section
      id="our-space"
      aria-label="Ruang dan Suasana"
      className="border-b border-charcoal-border/30 bg-charcoal-darkest py-16 md:py-24"
    >
      <Container size="default">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading
              eyebrow="Ruang Kami"
              title="Spot yang paling sering rebutan."
              description="Pojokan dekat jendela paling sering diperebutkan, apalagi pas sore. Mau kerja bareng? Meja panjang di tengah. Mau baca-baca? Pojokan dekat mesin yang sepi. Colokan ada di hampir semua meja, Wi-Fi stabil, musiknya nggak usil."
              align="left"
              className="mb-0 md:mb-0"
            />
          </div>
        </div>

        {/* // TODO: ganti dengan foto asli interior/semi-outdoor dari PHOTO_BRIEF.md */}
        <div className="mt-8 grid grid-cols-2 gap-2 sm:gap-3" aria-hidden="true">
          <div className="flex aspect-[16/10] items-center justify-center rounded-md border border-charcoal-border/50 bg-charcoal-lighter col-span-2">
            <ImageIcon className="h-10 w-10 text-charcoal-muted" />
          </div>
          <div className="flex aspect-square items-center justify-center rounded-md border border-charcoal-border/50 bg-charcoal-lighter">
            <ImageIcon className="h-8 w-8 text-charcoal-muted" />
          </div>
          <div className="flex aspect-square items-center justify-center rounded-md border border-charcoal-border/50 bg-charcoal-lighter">
            <ImageIcon className="h-8 w-8 text-charcoal-muted" />
          </div>
        </div>
      </Container>
    </section>
  );
}