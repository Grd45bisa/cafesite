import { Container } from "@/components/ui/Container";

/**
 * GalleryHeader Section — Header Halaman Gallery (Server Component)
 * Mengikuti pola tipografis MenuHeader & AboutHero:
 * Terpusat, tenang, bernada reflektif dan mengundang tanpa kesan jualan.
 */
export function GalleryHeader() {
  return (
    <section
      id="gallery-hero"
      aria-label="Pengantar Galeri Suasana"
      className="border-b border-charcoal-border/30 bg-charcoal py-16 md:py-24"
    >
      <Container size="default">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="mb-3 text-xs font-medium uppercase tracking-widest text-terracotta">
            Rekaman Sudut &amp; Waktu
          </span>
          <h1 className="font-serif text-4xl font-medium leading-[1.15] tracking-tight text-offwhite sm:text-5xl lg:text-6xl">
            Kumpulan sore di sini.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-offwhite-muted sm:text-lg">
            Foto-foto dari tiap jam yang dihabiskan di cafe. Kalau fotonya kamu
            juga ada, pasti kami simpan dengan senang.
          </p>
        </div>
      </Container>
    </section>
  );
}
