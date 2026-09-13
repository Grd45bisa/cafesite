import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InstagramIcon, MapPinIcon } from "@/components/ui/icons";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { cafeInfo } from "@/data/cafe";
import { buildWhatsAppUrl } from "@/lib/utils";

/**
 * ContactCards Section — Kontak Langsung (Server Component)
 * 4 tile ikon besar (Chat Barista, Meja Rombongan, Instagram, Google Maps)
 * dengan label & sub-label singkat — tap target besar, mudah dipahami.
 */
export function ContactCards() {
  const waReservationUrl = buildWhatsAppUrl(cafeInfo.whatsapp, "reservation");

  const tiles = [
    {
      href: waReservationUrl,
      external: true,
      icon: <WhatsAppIcon className="h-6 w-6" />,
      label: "Meja Rombongan",
      sub: "&gt;6 orang, kabari aja",
    },
    {
      href: cafeInfo.instagramUrl,
      external: true,
      icon: <InstagramIcon className="h-6 w-6 text-latte" />,
      label: "Instagram",
      sub: cafeInfo.instagram,
    },
    {
      href: cafeInfo.googleMapsUrl,
      external: true,
      icon: <MapPinIcon className="h-6 w-6 text-latte" />,
      label: "Google Maps",
      sub: "Buka rute ke sini",
    },
  ];

  return (
    <section
      id="direct-contact"
      aria-label="Kanal Komunikasi"
      className="border-b border-charcoal-border/30 bg-charcoal py-16 md:py-24"
    >
      <Container size="default">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            eyebrow="Meja Barista &amp; Kontak"
            title="Langsung Aja, Pilih yang Mana"
            description="Mau nanya apa-apa dulu sebelum dateng? Ngobrol santai aja sama kami."
            align="left"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {tiles.map((tile) => (
              <a
                key={tile.label}
                href={tile.href}
                target={tile.external ? "_blank" : undefined}
                rel={tile.external ? "noopener noreferrer" : undefined}
                className="flex flex-col items-center gap-2.5 rounded-md border border-charcoal-border/50 bg-charcoal-light/30 p-5 text-center transition-colors hover:border-terracotta/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta sm:p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-md border border-charcoal-border/50 bg-charcoal text-latte">
                  {tile.icon}
                </span>
                <span className="text-sm font-medium text-offwhite">
                  {tile.label}
                </span>
                {tile.sub && (
                  <span className="text-[11px] text-offwhite-muted">
                    {tile.sub}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}