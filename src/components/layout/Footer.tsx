import Link from "next/link";
import { cafeInfo } from "@/data/cafe";
import { buildWhatsAppUrl } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

const footerNavLinks = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Location", href: "/location" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const waUrl = buildWhatsAppUrl(cafeInfo.whatsapp, "general");

  return (
    <footer className="bg-espresso border-t border-charcoal-border/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* ---------- Layout mobile: ringkas, alur baca cepat ---------- */}
        <div className="md:hidden">
          <Link
            href="/"
            className="inline-block font-serif text-2xl font-medium text-offwhite tracking-tight hover:text-terracotta-light transition-colors"
          >
            {cafeInfo.name}
          </Link>
          <p className="mt-2 text-sm text-offwhite-muted leading-relaxed">
            {cafeInfo.tagline}
          </p>

          <address className="not-italic mt-6 text-sm text-offwhite-muted leading-relaxed">
            {cafeInfo.address}, {cafeInfo.city}
          </address>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <ContactTile href={waUrl} label="WhatsApp">
              <WhatsAppIcon className="h-5 w-5 shrink-0" />
            </ContactTile>
            <ContactTile href={cafeInfo.instagramUrl} label="Instagram">
              <InstagramIconSmall />
            </ContactTile>
            <ContactTile href={cafeInfo.googleMapsUrl} label="Maps">
              <MapPinIconSmall />
            </ContactTile>
          </div>

          <nav
            aria-label="Navigasi footer"
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
          >
            {footerNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-offwhite-muted hover:text-offwhite transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* ---------- Layout desktop: 3 kolom ---------- */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          <div>
            <Link
              href="/"
              className="inline-block font-serif text-2xl font-medium text-offwhite tracking-tight hover:text-terracotta-light transition-colors"
            >
              {cafeInfo.name}
            </Link>
            <p className="mt-4 text-sm text-offwhite-muted leading-relaxed max-w-xs">
              {cafeInfo.tagline}
            </p>
          </div>

          <nav aria-label="Navigasi footer">
            <h3 className="text-xs uppercase tracking-widest text-offwhite-darker font-medium mb-4">
              Navigasi
            </h3>
            <ul className="space-y-2.5">
              {footerNavLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-offwhite-muted hover:text-offwhite transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-xs uppercase tracking-widest text-offwhite-darker font-medium mb-4">
              Kontak &amp; Lokasi
            </h3>
            <address className="not-italic space-y-3 text-sm text-offwhite-muted">
              <p className="leading-relaxed">
                {cafeInfo.address}
                <br />
                {cafeInfo.city}
              </p>
              <div className="space-y-2">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-offwhite hover:text-terracotta-light transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4 shrink-0" />
                  <span>{cafeInfo.whatsappFormatted}</span>
                </a>
                <a
                  href={cafeInfo.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-offwhite hover:text-terracotta-light transition-colors"
                >
                  <InstagramIconSmall />
                  <span>{cafeInfo.instagram}</span>
                </a>
                <a
                  href={cafeInfo.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-offwhite hover:text-terracotta-light transition-colors"
                >
                  <MapPinIconSmall />
                  <span>Petunjuk Arah</span>
                </a>
              </div>
            </address>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 pt-6 border-t border-charcoal-border/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-offwhite-darker">
              &copy; {currentYear} {cafeInfo.name}. All rights reserved.
            </p>
            <p className="text-xs text-charcoal-muted">
              Diseduh tiap hari di {cafeInfo.city}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ContactTile({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-1.5 rounded-md border border-charcoal-border/50 bg-charcoal-light/50 py-3 text-xs text-offwhite hover:border-terracotta/50 hover:text-terracotta-light transition-colors"
    >
      {children}
      <span>{label}</span>
    </a>
  );
}

/* Inline SVG icons — no dependency needed */

function InstagramIconSmall() {
  return (
    <svg className="w-5 h-5 shrink-0 md:w-4 md:h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function MapPinIconSmall() {
  return (
    <svg className="w-5 h-5 shrink-0 md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}