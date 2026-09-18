import type { Metadata } from "next";
import { GalleryHeader } from "@/components/gallery/GalleryHeader";
import { GallerySection } from "@/components/gallery/GallerySection";
import { InstagramTeaser } from "@/components/gallery/InstagramTeaser";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Galeri Suasana & Foto Kafe",
  description:
    "Galeri foto CafeSite: interior hangat bata ekspos, kopi yang diseduh pelan, sudut-sudut semi-outdoor, hingga menu andalan. Lihat vibes tempat sebelum kamu mampir.",
  path: "/gallery",
  keywords: ["foto cafe", "suasana kafe", "interior cafe jakarta", "foto kopi"],
});

/**
 * GalleryPage — Halaman Galeri Foto Suasana (Server Component)
 * Sesuai SITEMAP §3.4: GalleryHeader → GalleryFilterBar & GalleryGrid → InstagramTeaser.
 */
export default function GalleryPage() {
  return (
    <>
      <GalleryHeader />
      <GallerySection />
      <InstagramTeaser />
    </>
  );
}
