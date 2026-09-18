"use client";

import { useEffect } from "react";
import Image from "next/image";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  ImageIcon,
} from "@/components/ui/icons";
import { GalleryPhoto } from "@/types";

interface GalleryLightboxProps {
  photo: GalleryPhoto | null;
  photos: GalleryPhoto[];
  onClose: () => void;
  onSelectPhoto: (photo: GalleryPhoto) => void;
}

/**
 * GalleryLightbox — Popup Dialog Foto Galeri Klasik & Rata (Client Component)
 * - Dimensi flat & konsisten (tidak berubah-ubah ukurannya saat ganti foto).
 * - Tombol-tombol ikonik minimalis sesuai gaya UI CafeSite (rounded-full hairline border).
 * - Tidak tertutup navbar / sticky CTA mobile (z-[100]).
 * - Teks mengalir natural di bawah foto tanpa card terpisah.
 */
export function GalleryLightbox({
  photo,
  photos,
  onClose,
  onSelectPhoto,
}: GalleryLightboxProps) {
  const currentIndex = photo ? photos.findIndex((p) => p.id === photo.id) : -1;
  const totalPhotos = photos.length;

  // Keyboard navigation (Escape, ArrowLeft, ArrowRight) & body scroll lock
  useEffect(() => {
    if (!photo) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        if (currentIndex > 0) {
          onSelectPhoto(photos[currentIndex - 1]);
        } else {
          onSelectPhoto(photos[totalPhotos - 1]);
        }
      } else if (e.key === "ArrowRight") {
        if (currentIndex < totalPhotos - 1) {
          onSelectPhoto(photos[currentIndex + 1]);
        } else {
          onSelectPhoto(photos[0]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [photo, currentIndex, photos, totalPhotos, onClose, onSelectPhoto]);

  if (!photo) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      onSelectPhoto(photos[currentIndex - 1]);
    } else {
      onSelectPhoto(photos[totalPhotos - 1]);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < totalPhotos - 1) {
      onSelectPhoto(photos[currentIndex + 1]);
    } else {
      onSelectPhoto(photos[0]);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.title || "Detail Foto"}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 overflow-y-auto backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Box Popup: Dimensi Stabil & Flat (max-w-md sm:max-w-lg) */}
      <div
        className="relative w-full max-w-md sm:max-w-lg rounded-md border border-charcoal-border/60 bg-charcoal p-4 sm:p-5 shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Popup: Judul Kiri, Tombol Tutup Icon-Only di Kanan */}
        <div className="flex items-center justify-between border-b border-charcoal-border/40 pb-3">
          <div className="pr-3">
            <p className="text-[11px] font-medium uppercase tracking-widest text-terracotta">
              {photo.category}
            </p>
            <h3 className="font-serif text-base font-medium text-offwhite sm:text-lg leading-tight mt-0.5">
              {photo.title}
            </h3>
          </div>

          {/* Tombol Tutup Icon-Only sesuai gaya konsisten website */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup popup"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-charcoal-border/70 text-offwhite-muted transition-colors hover:border-offwhite/60 hover:text-offwhite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Frame Foto Utama: Flat Aspect Ratio (16:10) — Tidak Berubah Ukuran Saat Navigasi */}
        <div className="relative mt-3.5 flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-md border border-charcoal-border/50 bg-charcoal-lighter">
          {photo.src ? (
            <Image
              src={photo.src}
              alt={photo.alt || photo.title || "Detail foto galeri"}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
              <ImageIcon className="h-8 w-8 text-charcoal-muted" />
              <p className="font-serif text-xs text-offwhite-muted">
                {photo.title}
              </p>
            </div>
          )}
        </div>

        {/* Keterangan Teks Mengalir Natural di Bawah Foto */}
        <div className="mt-3.5">
          <p className="text-xs sm:text-sm leading-relaxed text-offwhite-muted min-h-[2.75rem]">
            {photo.caption}
          </p>
        </div>

        {/* Footer Navigasi: Ikon Sederhana & Angka Counter Monospace */}
        <div className="mt-4 flex items-center justify-between border-t border-charcoal-border/40 pt-3">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Foto sebelumnya"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-charcoal-border/60 text-offwhite-muted transition-colors hover:border-offwhite/60 hover:text-offwhite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>

          <span className="font-mono text-xs text-offwhite-darker">
            {currentIndex + 1} / {totalPhotos}
          </span>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Foto selanjutnya"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-charcoal-border/60 text-offwhite-muted transition-colors hover:border-offwhite/60 hover:text-offwhite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
