import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { cafeInfo } from "@/data/cafe";
import { buildWhatsAppUrl } from "@/lib/utils";

/**
 * MenuInquiryCTA — CTA Konsultasi / Pertanyaan Menu (Server Component)
 * Menggunakan panel rounded-xl datar berpalet charcoal-light/40 selaras dengan Home.
 */
export function MenuInquiryCTA() {
  return (
    <section
      id="menu-cta"
      aria-label="Pertanyaan Menu"
      className="border-t border-charcoal-border/30 bg-charcoal-darkest py-16 md:py-24"
    >
      <Container size="default">
        <div className="rounded-xl border border-charcoal-border/70 bg-charcoal-light/40 p-8 md:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="mb-3 block text-xs font-medium uppercase tracking-widest text-terracotta">
                Tanya Menu
              </span>
              <h2 className="font-serif text-3xl font-medium tracking-tight text-offwhite sm:text-4xl">
                Ragu mau mulai dari mana?
              </h2>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-offwhite-muted">
                Baru pertama ke sini dan bingung milih? Chat dulu aja — barista
                kami seneng ngobrol soal biji, seduhan, sampai camilan yang
                cocok.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3.5 lg:col-span-5">
              <Button
                variant="solid"
                size="lg"
                href={buildWhatsAppUrl(cafeInfo.whatsapp, "menu_inquiry")}
                isExternal
                className="w-full"
              >
                <WhatsAppIcon className="h-4 w-4" />
                <span>Chat Barista</span>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
