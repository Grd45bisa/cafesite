import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import {
  ArrowRightIcon,
  MapPinIcon,
  CupIcon,
  ArmchairIcon,
  UsersGroupIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InstagramIcon,
} from "@/components/ui/icons";
import { cafeInfo } from "@/data/cafe";

/**
 * Hero Section — Beranda
 * Mobile: Tetap mempertahankan centered minimalis dengan background atmospheric & touch-friendly CTA
 * Desktop (lg+): Mengadaptasi layout split editorial modern (Teks Kurasi + 3 Pilar + Foto Artisan Framed)
 */
export function Hero() {
  return (
    <section
      aria-label="Beranda"
      className="relative overflow-hidden border-b border-charcoal-border/30 bg-charcoal"
    >
      {/* ========================================================================= */}
      {/* 1. MOBILE HERO (< lg) — Dipertahankan sesuai desain asli, anti-overflow */}
      {/* ========================================================================= */}
      <div className="relative flex min-h-[calc(100vh-4.5rem)] items-center py-16 lg:hidden">
        {/* Mobile Background Image & Dark Atmosphere Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/Image/hero/hero_authentic.jpg"
            alt="Suasana hangat meja dan sudut kedai kopi CafeSite"
            fill
            priority
            sizes="100vw"
            quality={80}
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-charcoal/70 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/80" />
        </div>

        <Container size="default" className="relative z-10">
          <div className="mx-auto flex max-w-xl flex-col items-center text-center">
            <span className="mb-4 text-xs font-medium uppercase tracking-widest text-terracotta">
              Kedai Kopi &amp; Tempat Nyantai
            </span>
            <h1 className="font-serif text-4xl font-medium leading-[1.15] tracking-tight text-offwhite sm:text-5xl">
              Kopi enak, bangku nyaman, waktu nggak dikejar-kejar.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-offwhite-muted sm:text-lg">
              Niatnya cuma ngopi bentar, eh malah betah sampai sore. Itu normal
              kok di sini.
            </p>
            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button
                variant="solid"
                size="lg"
                href="/menu"
                className="w-full sm:w-auto rounded-full"
              >
                <span>Lihat Menu</span>
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                href={cafeInfo.googleMapsUrl}
                isExternal
                className="w-full sm:w-auto rounded-full"
              >
                <MapPinIcon className="h-4 w-4 text-terracotta" />
                <span>Buka Maps</span>
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP HERO (lg+) — Split Editorial Layout ala Kalā / Specialty Cafe */}
      {/* ========================================================================= */}
      <div className="hidden lg:block pt-[35px] pb-[65px]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-12 gap-10 xl:gap-14 items-center">
            {/* Kolom Kiri: Tipografi & Value Proposition */}
            <div className="col-span-6 xl:col-span-6 flex flex-col justify-between">
              {/* Eyebrow badge */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[11px] uppercase tracking-[0.25em] text-offwhite-muted font-medium">
                  A Better Day Starts Here
                </span>
                <div className="w-12 h-[1px] bg-charcoal-border/70" />
              </div>

              {/* Serif Headline with dual-color terracotta accent */}
              <h1 className="font-serif text-5xl xl:text-6xl font-normal leading-[1.12] tracking-tight">
                <span className="block text-offwhite">Kopi enak,</span>
                <span className="block text-terracotta">bangku nyaman</span>
              </h1>

              {/* Subtitle ala anak cafe */}
              <p className="mt-6 max-w-md text-base leading-relaxed text-offwhite-muted font-normal">
                Tempat untuk menikmati kopi berkualitas, obrolan hangat, dan jeda
                yang berarti. Dari pagi sampai sore, nikmati setiap tegukannya.
              </p>

              {/* Action Button Pills */}
              <div className="mt-8 flex items-center gap-4">
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium bg-terracotta text-offwhite rounded-full hover:bg-terracotta-hover transition-all duration-200 shadow-sm"
                >
                  <span>Lihat Menu</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>

                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium bg-transparent text-offwhite border border-charcoal-border/80 rounded-full hover:border-offwhite hover:bg-offwhite/5 transition-all duration-200"
                >
                  <span>Tentang Kami</span>
                </Link>
              </div>

              {/* 3 Pillar Features with Dividers */}
              <div className="mt-12 pt-8 border-t border-charcoal-border/40 grid grid-cols-3 gap-2 items-center">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-charcoal-light flex items-center justify-center shrink-0 border border-charcoal-border/40">
                    <CupIcon className="w-4 h-4 text-terracotta" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-medium text-offwhite leading-tight">
                      Kopi
                    </p>
                    <p className="text-[11px] text-offwhite-muted leading-tight">
                      Pilihan
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-l border-charcoal-border/40 pl-3">
                  <div className="w-9 h-9 rounded-full bg-charcoal-light flex items-center justify-center shrink-0 border border-charcoal-border/40">
                    <ArmchairIcon className="w-4 h-4 text-terracotta" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-medium text-offwhite leading-tight">
                      Suasana
                    </p>
                    <p className="text-[11px] text-offwhite-muted leading-tight">
                      Nyaman
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-l border-charcoal-border/40 pl-3">
                  <div className="w-9 h-9 rounded-full bg-charcoal-light flex items-center justify-center shrink-0 border border-charcoal-border/40">
                    <UsersGroupIcon className="w-4 h-4 text-terracotta" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-medium text-offwhite leading-tight">
                      Tempat
                    </p>
                    <p className="text-[11px] text-offwhite-muted leading-tight">
                      untuk Semua
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Editorial Numbering */}
              <div className="mt-10 flex items-center gap-3 text-xs tracking-widest text-offwhite-darker uppercase font-sans">
                <span className="font-serif text-offwhite font-medium text-sm">
                  01
                </span>
                <div className="w-8 h-[1px] bg-charcoal-border/80" />
                <span>03</span>
                <span className="text-[10px] tracking-[0.2em] ml-2 text-offwhite-muted">
                  LEBIH DARI SEKADAR KOPI
                </span>
              </div>
            </div>

            {/* Kolom Kanan: Framed Visual Photo & Interactive Caption Bar */}
            <div className="col-span-6 xl:col-span-6 flex flex-col">
              <div className="relative w-full aspect-[4/3] xl:aspect-[5/4] rounded-2xl overflow-hidden shadow-2xl border border-charcoal-border/40 bg-charcoal-light">
                <Image
                  src="/Image/hero/hero_authentic.jpg"
                  alt="Secangkir kopi hangat artisan di atas meja kayu kedai CafeSite"
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  quality={85}
                  className="object-cover object-center"
                />
                {/* Subtle warm depth gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Bottom Bar: Slider accents, quote, and social link */}
              <div className="mt-4 flex items-center justify-between text-xs text-offwhite-muted px-1">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Foto sebelumnya"
                      className="w-8 h-8 rounded-full border border-charcoal-border/70 flex items-center justify-center hover:border-offwhite hover:text-offwhite transition-colors"
                    >
                      <ChevronLeftIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Foto berikutnya"
                      className="w-8 h-8 rounded-full border border-charcoal-border/70 flex items-center justify-center hover:border-offwhite hover:text-offwhite transition-colors"
                    >
                      <ChevronRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="italic font-serif text-offwhite/80 text-[13px]">
                    &ldquo;Satu cangkir, seribu cerita.&rdquo;
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-[1px] bg-charcoal-border/60" />
                  <a
                    href={cafeInfo.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram CafeSite"
                    className="p-1 text-offwhite-muted hover:text-terracotta-light transition-colors"
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}