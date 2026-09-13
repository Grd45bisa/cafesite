"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cafeInfo } from "@/data/cafe";
import { buildWhatsAppUrl } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Location", href: "/location" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Transparan → solid scroll behavior (threshold ~16px)
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 16);
    }
    handleScroll(); // Check on mount
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Close menu on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const waUrl = buildWhatsAppUrl(cafeInfo.whatsapp, "general");

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
          isMenuOpen
            ? "bg-charcoal border-b border-charcoal-border/50"
            : isScrolled
            ? "bg-charcoal/95 backdrop-blur-md shadow-lg border-b border-charcoal-border/50"
            : "bg-transparent border-b border-transparent"
        }`}
        role="navigation"
        aria-label="Navigasi utama"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo / Brand */}
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center gap-2 text-offwhite font-serif text-xl md:text-2xl font-medium tracking-tight hover:text-terracotta-light transition-colors"
            >
              {cafeInfo.name}
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "text-terracotta"
                        : "text-offwhite-muted hover:text-offwhite"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-terracotta rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Hamburger (>= 44x44px touch target) */}
            <button
              type="button"
              className="md:hidden flex items-center justify-center w-11 h-11 text-offwhite hover:text-terracotta-light transition-colors rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-panel"
              aria-label={isMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            >
              <div className="relative w-5 h-4 flex flex-col justify-between">
                <span
                  className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 origin-center ${
                    isMenuOpen ? "rotate-45 translate-y-[7px]" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-full bg-current rounded-full transition-all duration-200 ${
                    isMenuOpen ? "opacity-0 scale-x-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 origin-center ${
                    isMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      <div
        id="mobile-nav-panel"
        className={`md:hidden fixed inset-x-0 top-16 bottom-0 z-[60] bg-charcoal transition-all duration-300 ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-4"
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className="flex h-full flex-col overflow-y-auto overscroll-contain px-6 pt-6 pb-[calc(env(safe-area-inset-bottom)+3rem)]">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                    isActive
                      ? "text-terracotta bg-charcoal-light"
                      : "text-offwhite hover:text-terracotta-light hover:bg-charcoal-light/50"
                  }`}
                  tabIndex={isMenuOpen ? 0 : -1}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile CTA & Info — Pushed to bottom with generous breathing space */}
          <div className="mt-auto pt-8 pb-2 space-y-4 border-t border-charcoal-border/40">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="flex items-center justify-center gap-2.5 w-full py-3 px-5 text-sm font-medium bg-terracotta text-offwhite rounded-md hover:bg-terracotta-hover transition-colors"
              tabIndex={isMenuOpen ? 0 : -1}
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Chat WhatsApp</span>
            </a>

            <div className="flex items-start justify-between gap-4 px-1 text-xs text-offwhite-muted">
              <div>
                <p className="font-medium text-offwhite">{cafeInfo.address}</p>
                <p className="text-offwhite-darker">{cafeInfo.city}</p>
              </div>
              <a
                href={cafeInfo.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                tabIndex={isMenuOpen ? 0 : -1}
                className="shrink-0 inline-flex items-center gap-1 font-medium text-latte hover:text-latte-light transition-colors py-0.5"
              >
                <span>Buka Maps</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
