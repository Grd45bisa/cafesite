import { Container } from "@/components/ui/Container";

/**
 * MenuNotes Section — Catatan Katering, Alergen & Modifikasi (Server Component)
 * Menginformasikan ketersediaan susu alternatif dan preferensi seduhan.
 */
export function MenuNotes() {
  return (
    <section
      id="menu-notes"
      aria-label="Catatan Menu"
      className="border-b border-charcoal-border/30 bg-charcoal py-12 md:py-16"
    >
      <Container size="default">
        {/* // TODO: konfirmasi ke client saat onboarding data final mengenai ketersediaan alergen & regulasi pajak */}
        <div className="mx-auto max-w-3xl rounded-md border border-charcoal-border/50 bg-charcoal-light/30 p-6 sm:p-8">
          <span className="mb-2 block text-xs font-medium uppercase tracking-widest text-terracotta">
            Catatan &amp; Opsi Tambahan
          </span>
          <h3 className="font-serif text-lg font-medium text-offwhite sm:text-xl">
            Bisa Disesuaiin, Kok
          </h3>
          <div className="mt-4 space-y-2.5 text-sm leading-relaxed text-offwhite-muted">
            <p>
              • Minuman berbasis espresso bisa ganti susu Oat Milk, tambah
              Rp 6.000.
            </p>
            <p>
              • Manisnya atur sesuai selera, gula arennya bisa dimisah.
              Ngomong aja pas pesen.
            </p>
            <p>
              • Semua dibuat pas pesanan masuk. Kalau ada alergi atau
              pantangan, tinggal info ke barista.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
