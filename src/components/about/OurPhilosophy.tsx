import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  ArtisanalBrewIcon,
  CoffeeBeanIcon,
  LampIcon,
} from "@/components/ui/icons";

interface PhilosophyValue {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const philosophyValues: PhilosophyValue[] = [
  {
    id: "beans",
    title: "Biji dari Sumbernya",
    description:
      "Beli langsung dari petani yang kami kenal, sangrainya rutin. Soal rasa, kami nggak mau ngarang.",
    icon: CoffeeBeanIcon,
  },
  {
    id: "brew",
    title: "Seduh yang Nggak Buru-Buru",
    description:
      "V60 atau kopi susu, semua nggak kami buru. Takaran dihitung, sisanya menunggu.",
    icon: ArtisanalBrewIcon,
  },
  {
    id: "space",
    title: "Ruang buat Santai",
    description:
      "Colokan deket, cahaya adem, kursi enak. Kerja atau ngobrol, dua-duanya kerasan.",
    icon: LampIcon,
  },
];

/**
 * OurPhilosophy Section — Nilai & Filosofi (Server Component)
 * Editorial list ringkas mengikuti pola Highlights Home: hairline atas,
 * ikon latte, tanpa kartu berlengkungan berlebihan.
 */
export function OurPhilosophy() {
  return (
    <section
      id="our-philosophy"
      aria-label="Filosofi Kami"
      className="border-b border-charcoal-border/30 bg-charcoal py-16 md:py-24"
    >
      <Container size="default">
        <SectionHeading
          eyebrow="Filosofi Kami"
          title="Tiga hal yang kami jaga banget"
          description="Bukan janji manis. Tiga ini yang kami kerjain tiap hari, di balik meja dan di ruang tamu."
          align="left"
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-3">
          {philosophyValues.map((value) => {
            const Icon = value.icon;
            return (
              <div
                key={value.id}
                className="border-t border-charcoal-border/40 pt-4"
              >
                <Icon className="h-5 w-5 text-latte" />
                <h3 className="mt-2.5 text-[15px] font-medium leading-snug text-offwhite">
                  {value.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-offwhite-muted">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}