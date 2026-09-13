import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowRightIcon } from "@/components/ui/icons";
import { GalleryPreviewGrid } from "./GalleryPreviewGrid";

/**
 * GalleryPreview Section — Server Component
 * Layout: mobile & tablet potrait collage 2 kolom (hero lebar penuh di atas &
 * bawah, dua tile sedang di tengah), desktop bento 4 kolom. Interaksi
 * (caption muncul saat foto diklik) dipegang penuh oleh GalleryPreviewGrid.
 */
export function GalleryPreview() {
  return (
    <section
      id="gallery-preview"
      aria-label="Galeri Suasana"
      className="border-b border-charcoal-border/30 bg-charcoal-darkest py-16 md:py-24"
    >
      <Container size="default">
        <SectionHeading
          eyebrow="GALERI SUASANA"
          title="Sekilas suasana kedai kami"
          description="Sekilas sebelum kamu datang. Meja pojok jendela itu yang sering banget diperebutkan pas sore."
          align="left"
        />

        <GalleryPreviewGrid />

        <div className="mt-10 flex justify-center md:justify-start">
          <Button variant="outline" size="lg" href="/gallery">
            <span>Lihat Semua Foto</span>
            <ArrowRightIcon className="h-4 w-4 text-latte" />
          </Button>
        </div>
      </Container>
    </section>
  );
}