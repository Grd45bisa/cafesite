import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  LeafIcon,
  MosqueIcon,
  ParkingIcon,
  PlugIcon,
  SignpostIcon,
  SnowflakeIcon,
  SparklesIcon,
  TransitIcon,
  WifiIcon,
} from "@/components/ui/icons";
import { transportGuides } from "@/data/location";

const amenities = [
  { icon: PlugIcon, label: "Colokan" },
  { icon: WifiIcon, label: "Wi-Fi" },
  { icon: SnowflakeIcon, label: "AC" },
  { icon: LeafIcon, label: "Semi-Outdoor" },
  { icon: MosqueIcon, label: "Musholla" },
  { icon: SparklesIcon, label: "Toilet" },
];

/**
 * TransportGuide Section — Cara ke Sini & Fasilitas (Server Component)
 * 3 kartu rute (parkir, patokan, angkutan umum) + grid fasilitas icon-only
 * (tanpa paragraf deskripsi) supaya ringkas, bersih, dan terus kebaca cepat.
 */
export function TransportGuide() {
  function renderIcon(icon: string) {
    switch (icon) {
      case "parking":
        return <ParkingIcon className="h-5 w-5 text-latte" />;
      case "landmark":
        return <SignpostIcon className="h-5 w-5 text-latte" />;
      case "transit":
        return <TransitIcon className="h-5 w-5 text-latte" />;
      default:
        return null;
    }
  }

  return (
    <section
      id="transport-guide"
      aria-label="Panduan Akses dan Fasilitas Kedai"
      className="border-b border-charcoal-border/30 bg-charcoal-darkest py-16 md:py-24"
    >
      <Container size="default">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            eyebrow="Cara ke Sini"
            title="Gampang Mencarinya, Kok"
            description="Biar nggak bingung di jalan, langsung baca patokan, parkir, dan opsi kendaraan umumnya di bawah."
            align="left"
          />

          {/* 3 Kartu: Akses Transportasi */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            {transportGuides.map((guide) => (
              <div
                key={guide.id}
                className="flex flex-col justify-between rounded-md border border-charcoal-border/50 bg-charcoal-light/30 p-5 sm:p-6 transition-colors hover:border-charcoal-border"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-charcoal-border/50 bg-charcoal">
                    {renderIcon(guide.icon)}
                  </div>
                  <h3 className="mt-4 font-serif text-lg font-medium text-offwhite">
                    {guide.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-offwhite-muted">
                    {guide.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Fasilitas: Icon-Only Grid */}
          <div className="mt-10 rounded-md border border-charcoal-border/50 bg-charcoal-light/20 p-6 sm:p-8">
            <h3 className="font-serif text-base font-medium text-offwhite sm:text-lg">
              Yang Ada di Dalam Kedai
            </h3>

            <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-4">
              {amenities.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex flex-col items-center justify-center gap-2 rounded-md border border-charcoal-border/40 bg-charcoal/60 p-3.5 text-center transition-colors hover:border-terracotta/40"
                  >
                    <IconComponent className="h-6 w-6 text-latte" />
                    <p className="text-xs font-medium text-offwhite">
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}