import React from "react";
import Link from "next/link";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  isExternal?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * Komponen UI Button dasar CafeSite (Server Component)
 * Mendukung rendering sebagai elemen <button> atau <a>/<Link> secara semantik
 * Menggunakan token Tailwind resmi tanpa hardcode HEX
 */
export function Button({
  variant = "solid",
  size = "md",
  href,
  isExternal = false,
  children,
  className = "",
  ...props
}: ButtonProps) {
  // Base classes: flexbox, typography, transiton, focus state
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta";

  // Variant styling sesuai karakter profesional & editorial
  const variantClasses = {
    solid:
      "bg-terracotta text-offwhite hover:bg-terracotta-hover shadow-sm rounded-md",
    outline:
      "bg-transparent border border-offwhite/40 text-offwhite hover:bg-offwhite/10 hover:border-offwhite rounded-md",
    ghost:
      "bg-transparent text-offwhite hover:bg-charcoal-light hover:text-offwhite rounded-md",
  };

  // Size variations dengan touch target minimal 44px di mobile
  const sizeClasses = {
    sm: "text-xs px-3.5 py-2 min-h-[40px] sm:min-h-[36px] gap-1.5",
    md: "text-sm px-5 py-2.5 min-h-[44px] gap-2",
    lg: "text-base px-6 py-3.5 min-h-[48px] gap-2.5",
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  // Render sebagai <a> eksternal jika URL dimulai dengan http atau wa.me
  if (href) {
    if (isExternal || href.startsWith("http") || href.startsWith("https://wa.me")) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClasses}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
