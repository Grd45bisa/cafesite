import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MapPinIcon } from "@/components/ui/icons";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { cafeInfo } from "@/data/cafe";
import { buildWhatsAppUrl } from "@/lib/utils";

/**
 * InviteCTA Section — Ajak Berkunjung (Server Component)
 * Panel penutup selaras dengan LocationCTA & MenuInquiryCTA: datar,
 * rounded-xl, CTA ganda (WhatsApp tanya & alamat).
 */
export function InviteCTA() {
  return (
    <section
      id="cta"
      aria-label="Ajak Berkunjung"
      className="border-t border-charcoal-border/30 bg-charcoal-darkest py-16 md:py-24"
    >
      <Container size="default">
        <div className="rounded-xl border border-charcoal-border/70 bg-charcoal-light/40 p-8 md:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="mb-3 block text-xs font-medium uppercase tracking-widest text-terracotta">
                Mampir Ya
              </span>
              <h2 className="font-serif text-3xl font-medium tracking-tight text-offwhite sm:text-4xl">
                Tulisan segimana pun enak dibaca, kopi paling enak dicoba langsung.
              </h2>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-offwhite-muted">
                Datang pas sore, duduk di mana aja — kami nggak bakal protes.
                Alamat dan jam bukanya ada di halaman lokasi.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3.5 lg:col-span-5">
              <Button
                variant="solid"
                size="lg"
                href={buildWhatsAppUrl(cafeInfo.whatsapp, "general")}
                isExternal
                className="w-full"
              >
                <WhatsAppIcon className="h-4 w-4" />
                <span>Chat Kami Saja</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                href="/location"
                className="w-full"
              >
                <MapPinIcon className="h-4 w-4 text-latte" />
                <span>Lihat Alamat &amp; Jam</span>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}