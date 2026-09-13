import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon, QuoteIcon } from "@/components/ui/icons";

/**
 * AboutPreview Section — Server Component
 * Teks di kiri, pull-quote tenang di kanan (tanpa panel foto artifisial).
 * Latar espresso solid — tanpa gradasi.
 */
export function AboutPreview() {
  return (
    <section
      id="about-preview"
      aria-label="Tentang CafeSite"
      className="border-b border-charcoal-border/30 bg-espresso py-16 md:py-24"
    >
      <Container size="default">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <span className="mb-3 inline-block text-xs uppercase tracking-widest text-terracotta">
              Tentang Kami
            </span>
            <h2 className="max-w-xl font-serif text-3xl font-medium tracking-tight text-offwhite sm:text-4xl lg:text-5xl">
              Bukan sekadar tempat ngopi sambil lalu.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-offwhite/80">
              CafeSite awalnya cuma obrolan satu sore, soal pengen bikin tempat
              yang betah disinggahi lama. Kopinya nggak usah cepet-cepet abis,
              yang penting obrolannya lanjut.
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-offwhite/80">
              Kerja, ngobrol panjang, atau nyendiri baca — kekamu mau. Kami
              cuma nemuin bijinya biar pas; soal suasana biar yang ngikut.
            </p>
            <Button
              variant="outline"
              size="lg"
              href="/about"
              className="mt-8"
            >
              <span>Baca Cerita Kami</span>
              <ArrowRightIcon className="h-4 w-4 text-latte" />
            </Button>
          </div>

          <figure className="lg:col-span-5">
            <div className="flex h-full flex-col justify-between rounded-md border border-latte/20 bg-charcoal/40 p-8 md:p-10">
              <QuoteIcon className="h-8 w-8 text-latte/50" />
              <blockquote className="mt-8 font-serif text-xl font-medium leading-snug text-offwhite md:text-2xl">
                &ldquo;Kopinya nggak pura-pura, suasananya nggak ngejar-ngejar.&rdquo;
              </blockquote>
              <figcaption className="mt-8 text-xs uppercase tracking-widest text-latte">
                Filosofi CafeSite
              </figcaption>
            </div>
          </figure>
        </div>
      </Container>
    </section>
  );
}