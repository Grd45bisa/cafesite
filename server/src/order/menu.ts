import { createServiceRoleClient, type SupabaseConfig } from "../supabase/client";

export interface MenuEntry {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
  category: string;
}

interface MenuItemRow {
  id: string;
  data: { name?: unknown; price?: unknown; category?: unknown };
  is_available: boolean;
}

/**
 * Baca seluruh menu langsung dari tabel public.menu_items (bukan hardcode)
 * supaya harga dan ketersediaan selalu sinkron dengan dashboard admin.
 * Kolom `data` berupa jsonb {name, price, category, ...}.
 */
export async function fetchMenu(supabaseConfig: SupabaseConfig): Promise<MenuEntry[]> {
  const client = createServiceRoleClient(supabaseConfig);
  const { data, error } = await client.from("menu_items").select("id, data, is_available");

  if (error) {
    throw new Error(`Gagal membaca menu dari database: ${error.message}`);
  }

  const rows = (data ?? []) as MenuItemRow[];
  return rows.map((row) => ({
    id: row.id,
    name: typeof row.data.name === "string" ? row.data.name : row.id,
    price: typeof row.data.price === "number" ? row.data.price : 0,
    isAvailable: row.is_available,
    category: typeof row.data.category === "string" ? row.data.category : "",
  }));
}

export interface ParsedCartRequest {
  menuItemId: string;
  quantity: number;
}

export interface MenuMatchResult {
  matched: { entry: MenuEntry; quantity: number }[];
  unavailable: MenuEntry[];
  ambiguous: { query: string; candidates: MenuEntry[] }[];
  notFound: string[];
}

/**
 * Pecah teks bebas seperti "2 americano, 1 nasi goreng" atau
 * "es kopi susu 1 + nasi goreng 2" jadi potongan {query, quantity}.
 * Pola: angka boleh di depan ATAU di belakang nama item. Pemisah antar
 * item: koma, " + ", " dan ", atau baris baru.
 */
function splitCartText(text: string): { query: string; quantity: number }[] {
  const segments = text
    .split(/,|\+|\bdan\b|\n/i)
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);

  return segments.map((segment) => {
    const leadingMatch = segment.match(/^(\d{1,2})\s*[xX]?\s+(.+)$/);
    if (leadingMatch && leadingMatch[1] && leadingMatch[2]) {
      return { query: leadingMatch[2].trim(), quantity: Number(leadingMatch[1]) };
    }

    const trailingMatch = segment.match(/^(.+?)\s+(\d{1,2})$/);
    if (trailingMatch && trailingMatch[1] && trailingMatch[2]) {
      return { query: trailingMatch[1].trim(), quantity: Number(trailingMatch[2]) };
    }

    return { query: segment, quantity: 1 };
  });
}

function normalizeName(value: string): string {
  return value.toLowerCase().trim();
}

/**
 * Cocokkan tiap potongan teks ke entri menu yang tersedia (is_available).
 * - Cocok persis/contains unik -> masuk `matched`.
 * - Cocok tapi item sedang habis -> masuk `unavailable` (bukan matched).
 * - Beberapa kandidat cocok sekaligus -> masuk `ambiguous`, user diminta
 *   memilih salah satu secara eksplisit.
 * - Tidak ada yang cocok sama sekali -> masuk `notFound`.
 */
export function matchCartText(text: string, menu: MenuEntry[]): MenuMatchResult {
  const pieces = splitCartText(text);
  const result: MenuMatchResult = { matched: [], unavailable: [], ambiguous: [], notFound: [] };

  for (const piece of pieces) {
    const quantity = Math.min(20, Math.max(1, piece.quantity));
    const query = normalizeName(piece.query);
    if (query === "") continue;

    const exact = menu.filter((entry) => normalizeName(entry.name) === query);
    const contains = menu.filter((entry) => normalizeName(entry.name).includes(query));
    const candidates = exact.length > 0 ? exact : contains;

    if (candidates.length === 0) {
      result.notFound.push(piece.query);
      continue;
    }

    if (candidates.length > 1) {
      result.ambiguous.push({ query: piece.query, candidates });
      continue;
    }

    const entry = candidates[0];
    if (!entry) continue;

    if (!entry.isAvailable) {
      result.unavailable.push(entry);
      continue;
    }

    result.matched.push({ entry, quantity });
  }

  return result;
}
