import type { Metadata } from "next";
import { ContactCards } from "@/components/location/ContactCards";
import { FAQSection } from "@/components/location/FAQSection";
import { LocationHeader } from "@/components/location/LocationHeader";
import { MapContainer } from "@/components/location/MapContainer";
import { OperatingHoursTable } from "@/components/location/OperatingHoursTable";
import { TransportGuide } from "@/components/location/TransportGuide";
import { JsonLd } from "@/components/seo/JsonLd";
import { cafeInfo } from "@/data/cafe";
import { locationFaqs } from "@/data/location";
import { isOpenNow } from "@/lib/utils";
import { createPageMetadata, buildFaqJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Lokasi, Jam Buka & Kontak",
  description:
    "Lokasi CafeSite di Jakarta Selatan: alamat lengkap, jam operasional 7 hari, panduan rute parkir & angkutan umum, peta Google Maps, serta fasilitas yang tersedia — Wi-Fi kencang, colokan, semi-outdoor, musholla.",
  path: "/location",
  keywords: [
    "lokasi cafe jakarta selatan",
    "jam buka cafe",
    "cafe wifi colokan",
    "cafe semi outdoor",
    "panduan parkir cafe",
  ],
});

/**
 * LocationPage — Halaman Lokasi, Jadwal & Kontak (Server Component)
 * Sesuai SITEMAP §3.5:
 * LocationHeader → OperatingHoursTable → MapContainer → TransportGuide → ContactCards → FAQSection.
 * Status buka/tutup dihitung di server saat prerender agar tidak terjadi hydration mismatch.
 */
export default function LocationPage() {
  const initialStatus = isOpenNow(cafeInfo.openingHours);

  return (
    <>
      <JsonLd data={buildFaqJsonLd(locationFaqs)} />
      <LocationHeader initialStatus={initialStatus} />
      <OperatingHoursTable initialStatus={initialStatus} />
      <MapContainer />
      <TransportGuide />
      <ContactCards />
      <FAQSection />
    </>
  );
}
