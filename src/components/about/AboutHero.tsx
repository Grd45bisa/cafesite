import { Container } from "@/components/ui/Container";
import { ImageIcon } from "@/components/ui/icons";

/**
 * AboutHero Section — Header Halaman About (Server Component)
 * Tipografi terpusat yang tenang, selaras dengan MenuHeader. Foto strip
 * hanya tampil di layar ≥ sm agar mobile tetap ringkas tanpa info palsu.
 */
export function AboutHero() {
  return (
    <section
      id="about-hero"
      aria-label="Pengantar Tentang CafeSite"
      className="border-b border-charcoal-border/30 bg-charcoal py-16 md:py-24"
    >
      <Container size="default">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="mb-3 text-xs font-medium uppercase tracking-widest text-terracotta">
            Halo, Ini Kami
          </span>
          <h1 className="font-serif text-3xl font-medium leading-[1.15] tracking-tight text-offwhite sm:text-5xl lg:text-6xl">
            Kopi yang nggak diburu-buru.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-offwhite-muted sm:text-lg">
            CafeSite itu kedai kopi kecil, konsepnya cuma satu: kopi dibuat
            pelan biar nikmat, orang dibuat kerasan biar balik lagi.
          </p>
        </div>

        {/* // TODO: ganti dengan foto suasana kedai asli dari PHOTO_BRIEF.md (hero runcing lebar) */}
        <figure
          aria-hidden="true"
          className="mt-10 hidden items-center justify-center rounded-md border border-charcoal-border/50 bg-charcoal-lighter sm:flex md:mt-12"
        >
          <div className="flex aspect-[16/6] w-full items-center justify-center lg:aspect-[16/5]">
            <ImageIcon className="h-10 w-10 text-charcoal-muted md:h-12 md:w-12" />
          </div>
        </figure>
      </Container>
    </section>
  );
}