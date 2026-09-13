import { Container } from "@/components/ui/Container";

/**
 * MenuHeader Section — Header Halaman Menu (Server Component)
 * Mengusung tipografi terpusat yang tenang dan selaras dengan estetika Home.
 */
export function MenuHeader() {
  return (
    <section
      aria-label="Pengantar Menu"
      className="border-b border-charcoal-border/30 bg-charcoal py-14 md:py-20"
    >
      <Container size="default">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="mb-3 text-xs font-medium uppercase tracking-widest text-terracotta">
            Menu &amp; Seduhan
          </span>
          <h1 className="font-serif text-4xl font-medium leading-[1.15] tracking-tight text-offwhite sm:text-5xl lg:text-6xl">
            Menu sederhana, rasanya yang panjang.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-offwhite-muted sm:text-lg">
            Biji single origin yang kami sangrai berkala, teh yang menunya
            sering gonta-ganti, dan camilan buat nemenin kamu berlama-lama.
          </p>
        </div>
      </Container>
    </section>
  );
}
