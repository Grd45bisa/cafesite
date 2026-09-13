import { cafeInfo } from "@/data/cafe";
import { buildWhatsAppUrl } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

/**
 * FloatingWhatsApp — Tombol melayang ikon WhatsApp (Server Component)
 * Tampil di semua halaman via layout, kanan bawah. Desktop only,
 * karena mobile sudah ada StickyMobileCTA.
 */
export function FloatingWhatsApp() {
  const waUrl = buildWhatsAppUrl(cafeInfo.whatsapp, "general");

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat kami via WhatsApp"
      title="Chat WhatsApp"
      className="hidden md:flex fixed bottom-6 right-6 z-40 items-center justify-center w-12 h-12 rounded-full bg-terracotta text-offwhite shadow-floating transition-colors hover:bg-terracotta-hover"
    >
      <WhatsAppIcon className="w-6 h-6" />
    </a>
  );
}