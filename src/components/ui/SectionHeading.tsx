import React from "react";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/**
 * Komponen UI SectionHeading dasar CafeSite (Server Component)
 * Menyajikan judul section semantik dengan eyebrow dan deskripsi pelengkap
 * Menggunakan font serif untuk heading dan sans untuk teks pendukung
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const alignClasses = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
  };

  return (
    <header className={`flex flex-col mb-8 md:mb-12 ${alignClasses[align]} ${className}`.trim()}>
      {eyebrow && (
        <span className="text-xs uppercase tracking-widest text-terracotta font-medium mb-2.5 inline-block">
          {eyebrow}
        </span>
      )}
      <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-offwhite leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-3.5 text-sm md:text-base text-offwhite-muted leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </header>
  );
}
