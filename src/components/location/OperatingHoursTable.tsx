import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cafeInfo } from "@/data/cafe";
import { OpenStatusResult } from "@/lib/utils";

interface OperatingHoursTableProps {
  initialStatus: OpenStatusResult;
}

/**
 * OperatingHoursTable Section — Jam Buka (Server Component)
 * Satu kartu daftar 7 hari yang bersih dengan highlight hari aktif.
 * Dua kartu samping ("waktu terbaik", "tanggal merah") dihapus — digabung
 * jadi satu catatan kecil biar halaman lega.
 */
export function OperatingHoursTable({
  initialStatus,
}: OperatingHoursTableProps) {
  const currentDayName = initialStatus.todaySchedule?.day?.toLowerCase();

  return (
    <section
      id="operating-hours"
      aria-label="Jadwal Jam Operasional Kedai"
      className="border-b border-charcoal-border/30 bg-charcoal-darkest py-16 md:py-24"
    >
      <Container size="default">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="Jam Buka Kedai"
            title="Jam Buka Kami Tiap Hari"
            description="Buka tiap hari. Pagi buat yang ngejar kerjaan, malem buat yang mau ngobrol lama."
            align="left"
          />

          <div className="rounded-md border border-charcoal-border/50 bg-charcoal-light/30 p-2 sm:p-3">
            <div className="divide-y divide-charcoal-border/30">
              {cafeInfo.openingHours.map((schedule) => {
                const isToday =
                  schedule.day.toLowerCase() === currentDayName;

                return (
                  <div
                    key={schedule.day}
                    className={`flex items-center justify-between rounded-md px-3.5 py-3 sm:px-4 ${
                      isToday
                        ? "border border-terracotta/40 bg-terracotta/10"
                        : "hover:bg-charcoal-light/40"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-sm font-medium ${
                          isToday ? "text-terracotta" : "text-offwhite"
                        }`}
                      >
                        {schedule.day}
                      </span>
                      {isToday && (
                        <span className="rounded bg-terracotta px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-offwhite">
                          Hari Ini
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-3">
                      <span
                        className={`font-mono text-sm tracking-tight ${
                          isToday
                            ? "font-medium text-offwhite"
                            : "text-offwhite-muted"
                        }`}
                      >
                        {schedule.hours}
                      </span>
                      {schedule.notes && (
                        <span className="text-[11px] text-offwhite-darker">
                          {schedule.notes}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-offwhite-darker">
            * Last order berlaku buat semua minuman dan makanan. Tanggal merah
            &amp; libur nasional kami tetap buka ikut jam weekend (07:00 –
            23:00), kecuali ada bebersih mesin atau acara internal — kabarnya
            dulu lewat IG Stories.
          </p>
        </div>
      </Container>
    </section>
  );
}