import { OpenNowBadge } from "@/components/layout/OpenNowBadge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MapPinIcon, SignpostIcon } from "@/components/ui/icons";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { cafeInfo } from "@/data/cafe";
import { buildWhatsAppUrl, OpenStatusResult } from "@/lib/utils";
import { CopyAddressButton } from "./CopyAddressButton";

interface LocationHeaderProps {
  initialStatus: OpenStatusResult;
}

/**
 * LocationHeader Section — Hero Lokasi (Server Component)
 * Narasi kasual di kiri, kartu info ringkas (status + alamat + patokan) di kanan.
 * Asymmetric di desktop, tumpuk di mobile. Tanpa label berlebihan.
 */
export function LocationHeader({ initialStatus }: LocationHeaderProps) {
  const waUrl = buildWhatsAppUrl(cafeInfo.whatsapp, "general");
  const todayNotes = initialStatus.todaySchedule?.notes;

  return (
    <section
      id="location-hero"
      aria-label="Pengantar Lokasi dan Petunjuk Arah"
      className="border-b border-charcoal-border/30 bg-charcoal py-16 md:py-24"
    >
      <Container size="default">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          {/* Kolom Kiri: Narasi & CTA */}
          <div className="lg:col-span-7">
            <span className="text-xs font-medium uppercase tracking-widest text-terracotta">
              Cara ke Sini
            </span>
            <h1 className="mt-3 font-serif text-3xl font-medium leading-[1.15] tracking-tight text-offwhite sm:text-4xl lg:text-5xl">
              Biar nggak muter-muter, kopi hangat sudah nunggu.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-offwhite-muted sm:text-base">
              Pintu kami buka tiap hari. Dateng aja, sisanya kami yang urus.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                variant="solid"
                size="lg"
                href={cafeInfo.googleMapsUrl}
                isExternal
                className="inline-flex w-full items-center justify-center gap-2 sm:w-auto"
              >
                <MapPinIcon className="h-4 w-4" />
                <span>Buka di Google Maps</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                href={waUrl}
                isExternal
                className="inline-flex w-full items-center justify-center gap-2 sm:w-auto"
              >
                <WhatsAppIcon className="h-4 w-4 text-latte" />
                <span>Chat Barista via WhatsApp</span>
              </Button>
            </div>
          </div>

          {/* Kolom Kanan: Info Ringkas */}
          <div className="lg:col-span-5">
            <div className="rounded-md border border-charcoal-border/50 bg-charcoal-light/40 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <OpenNowBadge initialStatus={initialStatus} />
              </div>

              <div className="mt-5 flex items-start gap-3">
                <MapPinIcon className="mt-1 h-5 w-5 shrink-0 text-terracotta" />
                <div className="min-w-0">
                  <p className="font-serif text-lg font-medium leading-snug text-offwhite">
                    {cafeInfo.address}
                  </p>
                  <p className="mt-0.5 text-xs text-offwhite-muted">
                    {cafeInfo.city}
                  </p>
                  <div className="mt-3">
                    <CopyAddressButton
                      address={`${cafeInfo.address}, ${cafeInfo.city}`}
                    />
                  </div>
                </div>
              </div>

              {cafeInfo.landmark && (
                <div className="mt-4 flex items-start gap-3 border-t border-charcoal-border/30 pt-4 text-xs text-offwhite-muted">
                  <SignpostIcon className="mt-0.5 h-4 w-4 shrink-0 text-latte" />
                  <p className="leading-relaxed">{cafeInfo.landmark}</p>
                </div>
              )}
              {todayNotes && (
                <p className="mt-3 text-[11px] text-offwhite-darker">
                  {todayNotes}
                </p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}