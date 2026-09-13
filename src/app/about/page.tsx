import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { BaristaQuote } from "@/components/about/BaristaQuote";
import { InviteCTA } from "@/components/about/InviteCTA";
import { OurPhilosophy } from "@/components/about/OurPhilosophy";
import { OurSpace } from "@/components/about/OurSpace";
import { OurStory } from "@/components/about/OurStory";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Tentang Kami & Filosofi Kopi",
  description:
    "Cerita dan filosofi CafeSite: biji single origin Nusantara, seduhan yang sabar, dan ruang hangat untuk bekerja, mengobrol, atau berhenti sejenak. Kenalan dengan nilai kami — slow coffee & ruang yang jujur.",
  path: "/about",
  keywords: [
    "filosofi kopi",
    "single origin Nusantara",
    "cerita kafe",
    "slow coffee",
  ],
});

/**
 * AboutPage — Halaman Tentang Kami (Server Component)
 * Komposisi: AboutHero → OurStory → OurPhilosophy → OurSpace → BaristaQuote → InviteCTA.
 * Murni cerita, tanpa library eksternal; visual memakai placeholder foto bertanda TODO.
 */
export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <OurStory />
      <OurPhilosophy />
      <OurSpace />
      <BaristaQuote />
      <InviteCTA />
    </>
  );
}