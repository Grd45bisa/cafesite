"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ExpandIcon, ImageIcon } from "@/components/ui/icons";
import { GalleryPhoto } from "@/types";
import { GalleryLightbox } from "./GalleryLightbox";

interface GalleryGridProps {
  photos: GalleryPhoto[];
}

/**
 * GalleryGrid — Grid Kolase Foto & Interaksi Dua Mode (Client Component)
 *
 * 1. Desktop: Hover kursor menampilkan teks cerita, judul, dan kategori secara halus.
 * 2. Mobile / Sentuh:
 *    - Ketuk 1x (Tap/Click): Membuka foto dalam modal penuh (GalleryLightbox).
 *    - Tekan & Tahan (Long-press >= 350ms): Menampilkan teks cerita langsung di atas tile foto.
 * 3. Tata letak kolase dinamis menggunakan variasi rasio aspek (portrait, landscape, square).
 */
export function GalleryGrid({ photos }: GalleryGridProps) {
  // State untuk modal foto penuh (1x klik)
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  // State untuk teks yang muncul saat ditekan-tahan di mobile (long press)
  const [pinnedTextId, setPinnedTextId] = useState<string | null>(null);

  // Ref untuk tracking long press mobile
  const touchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const isLongPressActiveRef = useRef<boolean>(false);

  // Bersihkan timer jika unmount
  useEffect(() => {
    return () => {
      if (touchTimerRef.current) {
        clearTimeout(touchTimerRef.current);
      }
    };
  }, []);

  if (photos.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-serif text-lg text-offwhite-muted">
          Belum ada foto di kategori ini. Ceritanya segera menyusul.
        </p>
      </div>
    );
  }

  // Rasio aspek kolase dinamis konsisten di mobile & desktop
  const aspectClassByType = {
    portrait: "aspect-[4/5]",
    landscape: "aspect-[16/10]",
    square: "aspect-square",
  };

  // Handler touch start (mulai hitung long press)
  const handleTouchStart = (photoId: string, e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
    isLongPressActiveRef.current = false;

    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
    }

    touchTimerRef.current = setTimeout(() => {
      isLongPressActiveRef.current = true;
      setPinnedTextId((prev) => (prev === photoId ? null : photoId));

      // Haptic feedback ringan jika didukung peramban ponsel
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(35);
      }
    }, 350);
  };

  // Handler touch move (batalkan long press jika pengguna sedang scroll)
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPosRef.current) return;
    const touch = e.touches[0];
    const diffX = Math.abs(touch.clientX - touchStartPosRef.current.x);
    const diffY = Math.abs(touch.clientY - touchStartPosRef.current.y);

    // Jika jari bergeser lebih dari 10px, batalkan long press
    if (diffX > 10 || diffY > 10) {
      if (touchTimerRef.current) {
        clearTimeout(touchTimerRef.current);
        touchTimerRef.current = null;
      }
    }
  };

  // Handler touch end (bersihkan timer)
  const handleTouchEnd = () => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
  };

  // Handler klik biasa (buka modal jika bukan hasil long press)
  const handlePhotoClick = (photo: GalleryPhoto) => {
    if (isLongPressActiveRef.current) {
      // Long press baru saja selesai, jangan buka modal
      isLongPressActiveRef.current = false;
      return;
    }

    // Jika sedang menampilkan teks hasil long press di tile ini, tutup teks atau buka modal
    if (pinnedTextId === photo.id) {
      setPinnedTextId(null);
    }

    // 1x klik: buka tampilan foto penuh
    setSelectedPhoto(photo);
  };

  return (
    <>
      {/* Petunjuk Interaksi Halus di Mobile */}
      <div className="mb-4 flex items-center justify-between text-[11px] text-offwhite-darker sm:hidden px-1">
        <span>Ketuk 1x untuk foto penuh &bull; Tekan &amp; tahan untuk baca cerita</span>
      </div>

      {/* Grid Kolase Multi-Rasio Aspek */}
      <div className="columns-2 gap-3 sm:columns-2 sm:gap-4 lg:columns-3 lg:gap-5 xl:columns-4">
        {photos.map((photo) => {
          const isPinnedOnMobile = pinnedTextId === photo.id;

          return (
            <article
              key={photo.id}
              role="button"
              tabIndex={0}
              aria-label={`${photo.title || "Foto galeri"} — Ketuk untuk memperbesar, tahan untuk membaca`}
              onClick={() => handlePhotoClick(photo)}
              onTouchStart={(e) => handleTouchStart(photo.id, e)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedPhoto(photo);
                }
              }}
              className="group relative mb-3 sm:mb-4 lg:mb-5 cursor-pointer break-inside-avoid overflow-hidden rounded-md border border-charcoal-border/50 bg-charcoal-light/40 transition-all duration-200 select-none hover:border-terracotta/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            >
              {/* Foto / Placeholder Wadah */}
              <figure
                className={`relative flex w-full items-center justify-center bg-charcoal-lighter transition-transform duration-300 group-hover:scale-[1.02] ${
                  aspectClassByType[photo.aspect]
                }`}
              >
                {photo.src ? (
                  <Image
                    src={photo.src}
                    alt={photo.alt || photo.title || "Foto galeri"}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                ) : (
                  <ImageIcon className="h-7 w-7 text-charcoal-muted transition-colors group-hover:text-latte" />
                )}

                {/* Badge Kategori Minimalis di Sudut Atas (Terlihat saat tidak di-hover) */}
                <span className="absolute top-2.5 left-2.5 z-10 rounded bg-charcoal/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-offwhite-muted backdrop-blur-sm group-hover:opacity-0 transition-opacity duration-200">
                  {photo.category}
                </span>
              </figure>

              {/* 
                Overlay Teks & Cerita:
                - Desktop: Muncul otomatis saat kursor berada di atas foto (group-hover:opacity-100)
                - Mobile: Muncul saat ditekan-tahan (isPinnedOnMobile = true)
              */}
              <div
                className={`absolute inset-0 flex flex-col justify-between bg-charcoal-darkest/90 p-3.5 sm:p-4.5 transition-all duration-200 ${
                  isPinnedOnMobile
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
                }`}
              >
                {/* Bagian Atas: Kategori & Icon Perbesar */}
                <div className="flex items-center justify-between border-b border-charcoal-border/40 pb-2">
                  <span className="text-[10px] font-medium uppercase tracking-widest text-terracotta">
                    {photo.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-offwhite-muted">
                    <span className="text-[10px] hidden sm:inline">Perbesar</span>
                    <ExpandIcon className="h-3.5 w-3.5 text-latte" />
                  </div>
                </div>

                {/* Bagian Bawah: Judul & Kutipan Cerita */}
                <div className="pt-2">
                  <h3 className="font-serif text-sm font-medium text-offwhite sm:text-base leading-snug">
                    {photo.title}
                  </h3>
                  <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-offwhite-muted">
                    {photo.caption}
                  </p>
                  {isPinnedOnMobile && (
                    <span className="mt-2 inline-block text-[10px] text-latte font-medium">
                      Ketuk 1x untuk foto penuh &rarr;
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Lightbox Modal untuk Tampilan Penuh (1x klik) */}
      <GalleryLightbox
        photo={selectedPhoto}
        photos={photos}
        onClose={() => setSelectedPhoto(null)}
        onSelectPhoto={setSelectedPhoto}
      />
    </>
  );
}