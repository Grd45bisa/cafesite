import { OpeningHour, WhatsAppContext } from "@/types";

/**
 * Format angka ke format Rupiah standar Indonesia
 * Contoh: 22000 -> "Rp 22.000"
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format angka ringkas untuk kartu menu (contoh: 22000 -> "22k")
 */
export function formatPriceShort(price: number): string {
  if (price >= 1000) {
    const inK = price / 1000;
    return `${inK}k`;
  }
  return String(price);
}

/**
 * Builder tautan deep-link WhatsApp dengan teks pesan terisi otomatis
 * Mengikuti konvensi wa.me standar internasional tanpa library luar
 */
export function buildWhatsAppUrl(
  phone: string,
  context: WhatsAppContext = "general",
  customMessage?: string
): string {
  // Bersihkan nomor telepon dari karakter non-digit
  const cleanPhone = phone.replace(/\D/g, "");

  if (customMessage && customMessage.trim().length > 0) {
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customMessage.trim())}`;
  }

  const messageTemplates: Record<WhatsAppContext, string> = {
    general:
      "Halo CafeSite, aku liat web kamu dan mau tanya-tanya dulu soal kafe.",
    reservation:
      "Halo CafeSite, aku mau tanya reservasi meja buat [jumlah orang] orang tanggal [hari/tanggal] jam [jam]. Masih ada nggak ya?",
    menu_inquiry:
      "Halo CafeSite, aku mau tanya ketersediaan menu / opsi khusus hari ini.",
    group_booking:
      "Halo CafeSite, aku mau nanya info booking area buat rombongan / kegiatan. Boleh detailnya?",
  };

  const message = messageTemplates[context] ?? messageTemplates.general;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export interface OpenStatusResult {
  isOpen: boolean;
  statusText: string;
  todaySchedule?: OpeningHour;
}

/**
 * Memeriksa status operasional kafe secara real-time berdasarkan jam saat ini
 * Fungsi pure tanpa dependensi eksternal
 */
export function isOpenNow(
  openingHours: OpeningHour[],
  referenceDate: Date = new Date()
): OpenStatusResult {
  const dayNames = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  const currentDayIndex = referenceDate.getDay();
  const currentDayName = dayNames[currentDayIndex];

  const todaySchedule = openingHours.find(
    (item) => item.day.toLowerCase() === currentDayName.toLowerCase()
  );

  if (!todaySchedule || !todaySchedule.isOpen) {
    return {
      isOpen: false,
      statusText: "Tutup hari ini",
      todaySchedule,
    };
  }

  // Jika openTime atau closeTime tidak didefinisikan, default buka
  if (!todaySchedule.openTime || !todaySchedule.closeTime) {
    return {
      isOpen: true,
      statusText: "Buka hari ini",
      todaySchedule,
    };
  }

  const [openHour, openMinute] = todaySchedule.openTime.split(":").map(Number);
  const [closeHour, closeMinute] = todaySchedule.closeTime.split(":").map(Number);

  const currentMinutes = referenceDate.getHours() * 60 + referenceDate.getMinutes();
  const openMinutes = openHour * 60 + openMinute;
  let closeMinutes = closeHour * 60 + closeMinute;

  // Tangani kasus jam tutup lewat tengah malam (contoh: buka 18:00 tutup 02:00)
  if (closeMinutes < openMinutes) {
    closeMinutes += 24 * 60;
  }

  const isCurrentlyOpen =
    currentMinutes >= openMinutes && currentMinutes < closeMinutes;

  if (isCurrentlyOpen) {
    return {
      isOpen: true,
      statusText: `Buka sampai ${todaySchedule.closeTime}`,
      todaySchedule,
    };
  }

  return {
    isOpen: false,
    statusText: `Tutup, buka lagi ${todaySchedule.openTime}`,
    todaySchedule,
  };
}
