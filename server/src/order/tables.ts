import { createServiceRoleClient, type SupabaseConfig } from "../supabase/client";

export interface AvailableTable {
  id: string;
  label: string;
  floorName: string;
}

interface TableRow {
  id: string;
  label: string;
  status: string;
  floor_id: string;
}

interface FloorRow {
  id: string;
  name: string;
}

/**
 * Ambil meja berstatus 'available' saja (bukan occupied/dirty), dilengkapi
 * nama lantai untuk ditampilkan ke pelanggan saat memilih meja dine-in.
 */
export async function fetchAvailableTables(supabaseConfig: SupabaseConfig): Promise<AvailableTable[]> {
  const client = createServiceRoleClient(supabaseConfig);

  const [tablesResult, floorsResult] = await Promise.all([
    client.from("cafe_tables").select("id, label, status, floor_id").eq("status", "available"),
    client.from("floors").select("id, name"),
  ]);

  if (tablesResult.error) {
    throw new Error(`Gagal membaca daftar meja: ${tablesResult.error.message}`);
  }
  if (floorsResult.error) {
    throw new Error(`Gagal membaca daftar lantai: ${floorsResult.error.message}`);
  }

  const floorNameById = new Map((floorsResult.data as FloorRow[]).map((floor) => [floor.id, floor.name]));
  const tables = tablesResult.data as TableRow[];

  return tables.map((table) => ({
    id: table.id,
    label: table.label,
    floorName: floorNameById.get(table.floor_id) ?? "",
  }));
}
