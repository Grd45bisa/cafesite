import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";

export default function PublicLayout({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main id="main-content" className="pt-16 pb-20 md:pb-0">
        {children}
      </main>
      <Footer />
      <FloatingWhatsApp />
      <StickyMobileCTA />
    </>
  );
}