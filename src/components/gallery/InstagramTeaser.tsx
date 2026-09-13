import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { InstagramIcon } from "@/components/ui/icons";
import { cafeInfo } from "@/data/cafe";

/**
 * InstagramTeaser Section — Penutup Halaman Galeri (Server Component)
 * Mengajak pengunjung membagikan momen personal mereka saat mampir.
 * Nada copy hangat, jujur, menghargai perspektif pengunjung.
 */
export function InstagramTeaser() {
  return (
    <section
      id="instagram-teaser"
      aria-label="Bagikan Momen di Instagram"
      className="border-t border-charcoal-border/30 bg-charcoal-darkest py-16 md:py-24"
    >
      <Container size="default">
        <div className="mx-auto max-w-3xl rounded-xl border border-charcoal-border/70 bg-charcoal-light/40 p-8 text-center sm:p-10 md:p-12">
          <span className="mb-3 inline-block text-xs font-medium uppercase tracking-widest text-terracotta">
            Sudut Pandangmu
          </span>
          <h2 className="font-serif text-3xl font-medium tracking-tight text-offwhite sm:text-4xl">
            Fotomu bakal jadi cerita orang lain.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-offwhite-muted">
            Kalau mampir dan jepret sesuatu yang kamu suka, tag{" "}
            {cafeInfo.instagram} — nanti fotomu kami simpen di sini, biar yang
            belum ke sini kerasa lewat fotomu.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3">
            <Button
              variant="solid"
              size="lg"
              href={cafeInfo.instagramUrl}
              isExternal
              className="inline-flex items-center gap-2"
            >
              <InstagramIcon className="h-4 w-4" />
              <span>Buka Instagram {cafeInfo.instagram}</span>
            </Button>
            <p className="text-xs text-offwhite-darker">
              Tag cerita &amp; postinganmu di {cafeInfo.instagram}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
