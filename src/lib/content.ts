import "server-only";
import { cache } from "react";
import { cafeInfo } from "@/data/cafe";
import { menuItems } from "@/data/menu";
import { galleryPhotos } from "@/data/gallery";
import { testimonials } from "@/data/testimonials";
import { locationFaqs, transportGuides } from "@/data/location";
import { getServiceSupabase } from "@/lib/supabase/server";
import type { PublicContent, MenuItem } from "@/types";

/** Request-scoped memoization: admin saves are visible on the next navigation. */
export const getPublicContent = cache(async (): Promise<PublicContent> => {
  const fallback: PublicContent = {
    cafe: cafeInfo, menu: menuItems, gallery: galleryPhotos,
    testimonials: [], faq: locationFaqs, location: transportGuides, configured: false,
  };
  const db = getServiceSupabase();
  if (!db) return fallback;
  const [menuResult, contentResult] = await Promise.all([
    db.from("menu_items").select("id,data,is_available,sort_order").order("sort_order"),
    db.from("content").select("key,data"),
  ]);
  if (menuResult.error || contentResult.error) {
    // Do not quietly display stale example prices during a database outage.
    throw new Error("Data kafe belum dapat dimuat. Silakan coba beberapa saat lagi.");
  }
  const entries = Object.fromEntries((contentResult.data ?? []).map(row => [row.key, row.data]));
  return {
    cafe: entries.cafe ?? cafeInfo,
    menu: (menuResult.data ?? []).map(row => ({ ...row.data, id: row.id, isAvailable: row.is_available }) as MenuItem),
    gallery: entries.gallery ?? [], testimonials: entries.testimonials ?? [],
    faq: entries.faq ?? [], location: entries.location ?? [], configured: true,
  };
});

export async function getCafeInfo(): Promise<PublicContent["cafe"]> { return (await getPublicContent()).cafe; }
export async function getMenuItems(): Promise<MenuItem[]> { return (await getPublicContent()).menu; }

// Local examples remain in data/*.ts for review. Never seed invented reviews as real endorsements.
export const exampleTestimonialCount = testimonials.length;
