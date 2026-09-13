import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon, MapPinIcon } from "@/components/ui/icons";
import { cafeInfo } from "@/data/cafe";

/**
 * Hero Section — Beranda (Server Component)
 * Menggunakan background foto kedai asli dengan overlay hangat khas specialty coffee.
 */
export function Hero() {
  return (
    <section
      aria-label="Beranda"
      className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden border-b border-charcoal-border/30 bg-charcoal py-16 md:py-20"
    >
      {/* Background Image & Atmospheric Coffee Shop Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/Image/hero/Hero.png"
          alt="Suasana hangat meja dan sudut kedai kopi CafeSite"
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover object-center"
        />
        {/* Balanced dark overlay to keep warm cafe ambient visible while ensuring strong typography contrast */}
        <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/70" />
      </div>

      <Container size="default" className="relative z-10">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="mb-4 text-xs font-medium uppercase tracking-widest text-terracotta">
            Kedai Kopi &amp; Tempat Nyantai
          </span>
          <h1 className="font-serif text-4xl font-medium leading-[1.15] tracking-tight text-offwhite sm:text-5xl lg:text-6xl">
            Kopi enak, bangku nyaman, waktu nggak dikejar-kejar.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-offwhite-muted sm:text-lg">
            Niatnya cuma ngopi bentar, eh malah betah sampai sore. Itu normal
            kok di sini.
          </p>
          <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button
              variant="solid"
              size="lg"
              href="/menu"
              className="w-full sm:w-auto"
            >
              <span>Lihat Menu</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              href={cafeInfo.googleMapsUrl}
              isExternal
              className="w-full sm:w-auto"
            >
              <MapPinIcon className="h-4 w-4 text-terracotta" />
              <span>Buka Maps</span>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}