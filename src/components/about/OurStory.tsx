import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon, ImageIcon } from "@/components/ui/icons";

/**
 * OurStory Section — Cerita Awal CafeSite (Server Component)
 * Teks di kiri, placeholder foto di kanan (lg). Copy mengikuti BRAND_VOICE:
 * narasi hangat & spesifik, tanpa tanggal/nama yang belum dikonfirmasi.
 */
export function OurStory() {
  return (
    <section
      id="our-story"
      aria-label="Cerita Kami"
      className="border-b border-charcoal-border/30 bg-charcoal-darkest py-16 md:py-24"
    >
      <Container size="default">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <span className="mb-3 block text-xs font-medium uppercase tracking-widest text-terracotta">
              Cerita Kami
            </span>
            <h2 className="max-w-xl font-serif text-3xl font-medium tracking-tight text-offwhite sm:text-4xl lg:text-5xl">
              Kami milih arah yang lebih santai.
            </h2>
            <div className="mt-6 space-y-4">
              <p className="max-w-xl text-base leading-relaxed text-offwhite/80">
                Rata-rata kafe lain maksa kita cepet ngabisin kopi biar mejanya
                cepet kosong. Kami nggak. Kopinya diracik santai, kursinya
                sengaja dibuat nyaman, dan kamu boleh duduk sampai sore tanpa
                ditanya-tanya.
              </p>
              <p className="max-w-xl text-base leading-relaxed text-offwhite/80">
                Mulai dari biji sampai lampunya, semua kami pilih dengan satu
                pertanyaan: &ldquo;enak nggak buat duduk lama?&rdquo; Kalau
                enak, kami simpan. Kalau nggak, kami ganti.
              </p>
            </div>
            <Button
              variant="outline"
              size="md"
              href="/menu"
              className="mt-8"
            >
              <span>Intip Menu Kami</span>
              <ArrowRightIcon className="h-4 w-4 text-latte" />
            </Button>
          </div>

          {/* // TODO: ganti dengan foto interior / proses penyangraian asli dari PHOTO_BRIEF.md */}
          <figure className="hidden lg:block lg:col-span-5">
            <div className="flex aspect-[4/3] w-full items-center justify-center rounded-md border border-charcoal-border/50 bg-charcoal-lighter">
              <ImageIcon className="h-10 w-10 text-charcoal-muted" />
            </div>
          </figure>
        </div>
      </Container>
    </section>
  );
}