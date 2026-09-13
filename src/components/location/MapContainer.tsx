import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MapPinIcon } from "@/components/ui/icons";
import { cafeInfo } from "@/data/cafe";

/**
 * MapContainer Section — Peta Lokasi (Server Component)
 * Bingkai peta polos + satu baris alamat di bawah. Info transit (MRT,
 * TransJakarta, parkir) tidak digesek di sini karena sudah ada di section
 * TransportGuide — hindari informasi dobel yang bikin page terasa penuh.
 */
export function MapContainer() {
  return (
    <section
      id="map-embed"
      aria-label="Peta Lokasi Kedai"
      className="border-b border-charcoal-border/30 bg-charcoal py-16 md:py-24"
    >
      <Container size="default">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-4 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-medium uppercase tracking-widest text-terracotta">
                Lokasi di Peta
              </span>
              <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight text-offwhite sm:text-3xl lg:text-4xl">
                Temukan Kami di Peta
              </h2>
            </div>

            <Button
              variant="outline"
              size="md"
              href={cafeInfo.googleMapsUrl}
              isExternal
              className="self-start sm:self-auto"
            >
              <span>Buka di Google Maps</span>
            </Button>
          </div>

          {/* Map Showcase — Flat, CLS-safe */}
          <div className="overflow-hidden rounded-md border border-charcoal-border/50 bg-charcoal-darkest">
            <div className="relative aspect-[4/3] w-full bg-charcoal-lighter sm:aspect-[16/9] lg:aspect-[21/9]">
              <iframe
                src={cafeInfo.googleMapsEmbedUrl}
                title={`Peta Lokasi ${cafeInfo.name} di Google Maps`}
                width="100%"
                height="100%"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
            </div>

            <div className="flex items-center gap-2 border-t border-charcoal-border/40 bg-charcoal-light/20 px-4 py-3 text-xs text-offwhite-muted">
              <MapPinIcon className="h-4 w-4 shrink-0 text-terracotta" />
              <p className="leading-relaxed">
                <strong className="font-medium text-offwhite">
                  {cafeInfo.name}
                </strong>
                {" \u2014 "}
                {cafeInfo.address}, {cafeInfo.city}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}