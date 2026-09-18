import type { Metadata } from "next";
import { MenuCategoryNav } from "@/components/menu/MenuCategoryNav";
import { MenuCategorySection } from "@/components/menu/MenuCategorySection";
import { MenuHeader } from "@/components/menu/MenuHeader";
import { MenuInquiryCTA } from "@/components/menu/MenuInquiryCTA";
import { MenuNotes } from "@/components/menu/MenuNotes";
import { menuCategories } from "@/data/menu";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Menu Kopi, Minuman & Makanan",
  description:
    "Menu lengkap CafeSite: biji kurasi single origin Nusantara, seduhan manual V60, racikan kopi susu, teh segar, hidangan hangat, hingga pastry pilihan. Dengan opsi Oat Milk dan preferensi manis sesuai selera.",
  path: "/menu",
  keywords: [
    "menu kopi",
    "kopi single origin",
    "es kopi susu",
    "kafe food & pastry",
    "menu snacking kafe",
  ],
});

/**
 * MenuPage — Halaman Daftar Menu Lengkap CafeSite (Server Component)
 * Komposisi bersih: MenuHeader → MenuCategoryNav → 5 Kategori Menu → MenuNotes → MenuInquiryCTA.
 * Murni tipografi restoran berkelas tanpa library eksternal.
 */
export default function MenuPage() {
  return (
    <>
      <MenuHeader />
      <MenuCategoryNav />
      {menuCategories.map((category, index) => (
        <MenuCategorySection
          key={category.id}
          category={category}
          index={index}
        />
      ))}
      <MenuNotes />
      <MenuInquiryCTA />
    </>
  );
}
