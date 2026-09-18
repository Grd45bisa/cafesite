"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { StickyMobileCTA } from "./StickyMobileCTA";
import { usePublicContent } from "./PublicContentProvider";
import type { SiteShellProps } from "@/types";

export function SiteShell({ children, footer, floatingContact }: SiteShellProps): React.JSX.Element {
  const pathname = usePathname();
  const { configured } = usePublicContent();
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/dashboard") || pathname.startsWith("/auth");
  const isOrder = pathname.startsWith("/order");
  if (isAdmin) return <main id="main-content">{children}</main>;
  return <>
    <header><Navbar /></header>
    <main id="main-content" className={isOrder ? "pt-16" : "pt-16 pb-20 md:pb-0"}>
      {!configured && !isOrder && <aside className="border-b border-charcoal-border bg-espresso px-5 py-2 text-center text-xs leading-relaxed text-offwhite-muted">Pratinjau CafeSite · Menu, foto, dan informasi lokasi masih contoh. <Link href="/order" className="text-latte underline underline-offset-4">Jelajahi menu pesanan</Link></aside>}
      {children}
    </main>
    {!isOrder && <>{footer}{floatingContact}<StickyMobileCTA /></>}
  </>;
}
