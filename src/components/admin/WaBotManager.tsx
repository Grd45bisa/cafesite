"use client";

import { useEffect, useState } from "react";
import type { RagIngestJob } from "@/types";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { adminButtonClass, adminSecondaryClass, adminError, adminRequest } from "./admin-api";

const statuses: Record<RagIngestJob["status"], string> = { pending: "◷ Menunggu", processing: "↻ Diproses", done: "✓ Selesai", failed: "! Gagal" };

export default function WaBotManager(): React.JSX.Element {
  const [jobs, setJobs] = useState<RagIngestJob[]>([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploaded, setUploaded] = useState<{ file_path: string; source: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    async function poll(): Promise<void> {
      try {
        const result = await adminRequest<{ data: RagIngestJob[] }>("wabot");
        if (!cancelled) { setJobs(result.data); setLoading(false); }
      } catch (cause) { if (!cancelled) { setError(adminError(cause)); setLoading(false); } }
      if (!cancelled) timer = setTimeout(() => void poll(), 5000);
    }
    void poll();
    return () => { cancelled = true; clearTimeout(timer); };
  }, []);

  async function enqueue(record: { file_path: string; source: string }): Promise<void> {
    await adminRequest("wabot", { method: "POST", body: JSON.stringify(record) });
    setUploaded(null);
    setMessage("Dokumen diterima, sedang diproses asisten bot…");
  }
  async function upload(file: File): Promise<void> {
    setBusy(true); setError(""); setMessage("");
    try {
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      const isMd = file.type === "text/markdown" || file.name.toLowerCase().endsWith(".md");
      if (!isPdf && !isMd) throw new Error("Pilih file PDF (.pdf) atau Markdown (.md).");
      if (file.size > 10 * 1024 * 1024) throw new Error("Ukuran file maksimal 10 MB.");
      const ext = isPdf ? ".pdf" : ".md";
      if (isPdf && (await file.slice(0, 5).text()) !== "%PDF-") throw new Error("File harus berupa PDF yang valid.");
      if (isMd && !(await file.text()).trim()) throw new Error("File Markdown tidak boleh kosong.");
      const rawStem = file.name.slice(0, -ext.length);
      const stem = rawStem.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9._-]/g, "").replace(/^[^a-z0-9]+/, "");
      if (!stem || stem.length > 76) throw new Error(`Gunakan nama file 1–76 karakter sebelum ${ext}, dengan huruf atau angka.`);
      const source = `${stem}${ext}`;
      const file_path = `rag/${Date.now()}-${crypto.randomUUID()}-${source}`;
      const client = getBrowserSupabase();
      if (!client) throw new Error("Supabase belum tersedia.");
      const contentType = isPdf ? "application/pdf" : "text/markdown";
      const { error: uploadError } = await client.storage.from("wa-bot-rag").upload(file_path, file, { contentType, upsert: false });
      if (uploadError) throw new Error("Dokumen belum berhasil diunggah. Periksa akses modul dan koneksi.");
      const record = { file_path, source };
      setUploaded(record);
      await enqueue(record);
    } catch (cause) { setError(adminError(cause)); }
    finally { setBusy(false); }
  }
  async function action(method: "PATCH" | "DELETE", job: RagIngestJob): Promise<void> {
    if (method === "DELETE" && !window.confirm(`Hapus ${job.source} beserta seluruh percobaan dan pengetahuan dari dokumen ini?`)) return;
    setBusy(true); setError(""); setMessage("");
    try {
      await adminRequest("wabot", { method, body: JSON.stringify({ id: job.id, source: job.source }) });
      setMessage(method === "DELETE" ? "Dokumen dan pengetahuannya sudah dihapus." : "Dokumen masuk antrean untuk diproses ulang.");
      const result = await adminRequest<{ data: RagIngestJob[] }>("wabot");
      setJobs(result.data);
    } catch (cause) { setError(adminError(cause)); }
    finally { setBusy(false); }
  }
  return (
    <section aria-label="Dokumen asisten WhatsApp" className="min-w-0 space-y-6">
      <section className="rounded-2xl border border-charcoal-border bg-charcoal p-5 md:p-6">
        <h2 className="font-serif text-2xl">Pengetahuan asisten</h2>
        <p className="mt-2 text-sm leading-6 text-offwhite-muted">Dokumen (PDF atau Markdown .md) di sini jadi sumber pengetahuan asisten WhatsApp. Re-upload nama yang sama akan mengganti isi.</p>
        <label htmlFor="rag-file" className="mt-5 block text-sm text-latte">Unggah PDF atau Markdown (.md) · maksimal 10 MB · berisi teks</label>
        <input id="rag-file" type="file" accept=".pdf,.md,application/pdf,text/markdown,text/plain" disabled={busy || uploaded !== null} className="mt-3 block min-h-11 w-full min-w-0 text-sm text-offwhite file:mr-3 file:rounded-lg file:border-0 file:bg-charcoal-light file:px-3 file:py-3 file:text-offwhite" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; if (file) void upload(file); }} />
        {busy && <p role="status" className="mt-3 text-sm text-latte">Sedang menyimpan…</p>}
        {uploaded && !busy && <button className={`${adminButtonClass} mt-3`} onClick={() => { setBusy(true); setError(""); void enqueue(uploaded).catch((cause: unknown) => setError(adminError(cause))).finally(() => setBusy(false)); }}>Coba daftarkan dokumen kembali</button>}
        {message && <p role="status" className="mt-3 text-sm text-latte">{message}</p>}
        {error && <p role="alert" className="mt-3 break-words text-sm text-terracotta-light">{error}</p>}
      </section>
      <section aria-label="Status dokumen" className="min-w-0 overflow-x-auto rounded-2xl border border-charcoal-border">
        <table className="w-full text-left text-sm">
          <caption className="p-4 text-left text-offwhite-muted">Status dokumen diperbarui setiap 5 detik.</caption>
          <thead className="bg-charcoal text-latte"><tr><th scope="col" className="p-4">File</th><th scope="col" className="p-4">Status</th><th scope="col" className="p-4">Tindakan</th></tr></thead>
          <tbody>{jobs.map((job) => <tr key={job.id} className="border-t border-charcoal-border align-top">
            <td className="max-w-48 break-words p-4"><p>{job.source}</p><time dateTime={job.updated_at} className="mt-2 block text-xs text-offwhite-darker">{new Date(job.updated_at).toLocaleString("id-ID")}</time></td>
            <td className="max-w-64 p-4"><span className={`inline-block rounded-lg bg-charcoal-light px-2 py-1 ${job.status === "failed" ? "text-terracotta-light" : "text-latte"}`}>{statuses[job.status]}</span>{job.status === "failed" && <p className="mt-2 break-words text-xs text-terracotta-light">{job.error}</p>}</td>
            <td className="p-4"><div className="flex flex-wrap gap-2">{["done", "failed"].includes(job.status) && <button disabled={busy} className={adminSecondaryClass} onClick={() => void action("PATCH", job)}>Proses ulang</button>}<button disabled={busy} className={adminSecondaryClass} onClick={() => void action("DELETE", job)}>Hapus</button></div></td>
          </tr>)}</tbody>
        </table>
        {!jobs.length && <p className="p-4 text-sm text-offwhite-muted">{loading ? "Memuat dokumen…" : "Belum ada dokumen. Unggah PDF atau Markdown (.md) informasi kafe untuk asisten."}</p>}
      </section>
    </section>
  );
}
