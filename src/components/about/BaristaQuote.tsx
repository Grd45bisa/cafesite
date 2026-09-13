import { Container } from "@/components/ui/Container";
import { QuoteIcon } from "@/components/ui/icons";

/**
 * BaristaQuote Section — Catatan Barista (Server Component)
 * Pull-quote terpusat di latar espresso solid, selaras dengan AboutPreview
 * Home. Menggunakan markah semantik <blockquote> + <figcaption>.
 */
export function BaristaQuote() {
  return (
    <section
      id="barista-quote"
      aria-label="Catatan Barista"
      className="border-b border-charcoal-border/30 bg-espresso py-16 md:py-24"
    >
      <Container size="default">
        <figure className="mx-auto max-w-3xl rounded-md border border-latte/20 bg-charcoal/40 p-8 text-center md:p-10">
          <QuoteIcon className="mx-auto h-8 w-8 text-latte/50" />
          <blockquote className="mt-6 font-serif text-xl font-medium leading-snug text-offwhite md:text-2xl">
            &ldquo;Biji yang sama bisa beda banget rasanya kalau seduhannya
            tergesa. Kopi enak itu bukan cuma soal mesin — tapi sabar nggaknya
            barista di balik meja.&rdquo;
          </blockquote>
          <figcaption className="mt-8 text-xs uppercase tracking-widest text-latte">
            Catatan Barista
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}