import type { Metadata } from "next";
import { AboutPreview } from "@/components/home/AboutPreview";
import { FeaturedMenu } from "@/components/home/FeaturedMenu";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { Hero } from "@/components/home/Hero";
import { Highlights } from "@/components/home/Highlights";
import { LocationCTA } from "@/components/home/LocationCTA";
import { Testimonials } from "@/components/home/Testimonials";
import { cafeInfo } from "@/data/cafe";
import { isOpenNow } from "@/lib/utils";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Kafe Nyaman & Kopi Enak di Jakarta Selatan",
  description:
    "Kafe enak dan nyaman di Jakarta Selatan buat ngopi, nongkrong, atau kerja remote. Biji single origin Nusantara, Wi-Fi kencang, colokan di tiap meja, dan fasilitas semi-outdoor. Temukan menu & suasana CafeSite.",
  path: "/",
  keywords: ["cafe enak Jakarta Selatan", "kafe nyaman", "tempat nongkrong enak"],
});

/**
 * HomePage — Halaman Beranda Utama CafeSite (Server Component)
 * Komposisi bersih: Hero → Highlights → FeaturedMenu → AboutPreview → GalleryPreview → Testimonials → LocationCTA.
 * initialStatus dihitung server sekali untuk diteruskan ke komponen yang membutuhkannya.
 */
export default function HomePage() {
  const initialStatus = isOpenNow(cafeInfo.openingHours);

  return (
    <>
      <Hero />
      <Highlights />
      <FeaturedMenu />
      <AboutPreview />
      <GalleryPreview />
      <Testimonials />
      <LocationCTA initialStatus={initialStatus} />
    </>
  );
}
