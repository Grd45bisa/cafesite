"use client";

import { useState } from "react";
import Image from "next/image";
import type { AdminFloor, AdminTable } from "@/types";
import AdminNotice from "../AdminNotice";
import { adminButtonClass, adminError } from "../admin-api";
import { qrPng, tableOrderUrl } from "./qr";

interface QrPrintAllProps { floors: AdminFloor[]; tables: AdminTable[]; }
export default function QrPrintAll({ floors, tables }: QrPrintAllProps): React.JSX.Element {
  const [codes, setCodes] = useState<Record<string, string>>({});
  const [preparing, setPreparing] = useState(false);
  const [error, setError] = useState("");
  async function prepare(): Promise<void> {
    setPreparing(true);
    setError("");
    try {
      const entries = await Promise.all(tables.map(async (table) => [table.id, await qrPng(tableOrderUrl(window.location.origin, table.id))] as const));
      setCodes(Object.fromEntries(entries));
      window.setTimeout(() => { window.print(); setCodes({}); }, 100);
    } catch (cause: unknown) { setError(`QR belum siap dicetak. ${adminError(cause)}`); }
    finally { setPreparing(false); }
  }
  return <><div className="grid gap-2"><button type="button" disabled={tables.length === 0 || preparing} className={adminButtonClass} onClick={() => void prepare()}>{preparing ? "Menyiapkan QR…" : "Cetak semua QR"}</button><AdminNotice message={error} error /></div>{Object.keys(codes).length > 0 && <div className="qr-print-section hidden grid-cols-2 gap-6 print:grid">{tables.map((table) => { const floor = floors.find((item) => item.id === table.floor_id); return <article key={table.id} className="qr-print-card border border-black p-5 text-center"><p className="text-sm">{floor?.name}</p><h1 className="mt-1 text-2xl font-bold">{table.label}</h1>{codes[table.id] && <Image unoptimized src={codes[table.id]} width={192} height={192} alt="" className="mx-auto mt-3 h-48 w-48" />}<p className="mt-2 text-xs">Pindai untuk memesan dari meja ini</p></article>; })}</div>}</>;
}
