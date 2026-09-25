import { CalendarDays, MapPin, Wifi, WifiOff } from "lucide-react";
import { formatRentangTanggal } from "../utils/dataUtils";

export default function Timeline({ data, onSelect }) {
  const sorted = [...data]
    .filter((d) => d.tglMulai)
    .sort((a, b) => b.tglMulai - a.tglMulai);

  const groups = [];
  let currentKey = null;
  sorted.forEach((item) => {
    if (item.bulanKey !== currentKey) {
      groups.push({
        bulanKey: item.bulanKey,
        bulanLabel: item.bulanLabel,
        items: [],
      });
      currentKey = item.bulanKey;
    }
    groups[groups.length - 1].items.push(item);
  });

  return (
    <section className="chart-card">
      <h3>Linimasa Kegiatan</h3>
      <p className="chart-hint">
        Diurutkan berdasarkan tanggal, dikelompokkan per bulan. Klik kegiatan
        untuk detail.
      </p>
      <div className="timeline-scroll">
        {groups.map((g) => (
          <div key={g.bulanKey} className="timeline-group">
            <div className="timeline-month">{g.bulanLabel}</div>
            {g.items.map((item) => (
              <button
                className="timeline-item"
                key={item.id}
                onClick={() => onSelect(item)}
              >
                <div
                  className={`timeline-dot ${item.mode === "Online" ? "dot-online" : "dot-offline"}`}
                />
                <div className="timeline-content">
                  <div className="timeline-top">
                    <span className="timeline-nama">{item.nama}</span>
                    <span
                      className={`badge ${item.mode === "Online" ? "badge-online" : "badge-offline"}`}
                    >
                      {item.mode === "Online" ? (
                        <Wifi size={12} />
                      ) : (
                        <WifiOff size={12} />
                      )}{" "}
                      {item.mode}
                    </span>
                  </div>
                  <p className="timeline-topik">{item.topik}</p>
                  <div className="timeline-meta">
                    <span>
                      <CalendarDays size={12} />{" "}
                      {formatRentangTanggal(item.tglMulai, item.tglSelesai)}
                    </span>
                    <span>
                      <MapPin size={12} />{" "}
                      {item.lokasi === "Daring"
                        ? "Daring"
                        : item.lokasi.split(",")[0]}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ))}
        {!sorted.length && (
          <p className="empty-state">
            Tidak ada kegiatan yang cocok dengan filter.
          </p>
        )}
      </div>
    </section>
  );
}
