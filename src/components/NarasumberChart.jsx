import { useMemo, useRef, useState } from "react";
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

/**
 * Urutkan berdasarkan jumlah kegiatan.
 * "desc" = terbanyak → tersedikit, "asc" = tersedikit → terbanyak.
 * Jika jumlah sama, urut nama A-Z.
 */
function sortNarasumber(data, direction) {
  const dir = direction === "asc" ? 1 : -1;

  return [...data].sort((a, b) => {
    if (a.jumlah !== b.jumlah) return (a.jumlah - b.jumlah) * dir;
    return a.nama.localeCompare(b.nama);
  });
}

export default function NarasumberChart({ data, onBarClick, activeNama }) {
  const [sortDir, setSortDir] = useState("desc");
  const scrollRef = useRef(null);

  const sortedData = useMemo(
    () => sortNarasumber(data, sortDir),
    [data, sortDir],
  );
  const chartHeight = Math.max(280, sortedData.length * 45);

  function handleSortChange(dir) {
    setSortDir(dir);

    // Kembalikan scroll ke atas agar urutan teratas langsung terlihat
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <div>
          <h3>Jumlah Kegiatan per Narasumber</h3>

          <p className="chart-hint">
            Klik salah satu batang untuk memfilter seluruh dashboard
          </p>
        </div>

        <div
          className="chart-sort-buttons"
          role="group"
          aria-label="Urutkan kegiatan"
        >
          <button
            type="button"
            className={`chart-sort-btn ${sortDir === "desc" ? "active" : ""}`}
            onClick={() => handleSortChange("desc")}
            title="Kegiatan terbanyak"
            aria-label="Kegiatan terbanyak"
            aria-pressed={sortDir === "desc"}
          >
            <ArrowDownWideNarrow size={18} />
          </button>

          <button
            type="button"
            className={`chart-sort-btn ${sortDir === "asc" ? "active" : ""}`}
            onClick={() => handleSortChange("asc")}
            title="Kegiatan tersedikit"
            aria-label="Kegiatan tersedikit"
            aria-pressed={sortDir === "asc"}
          >
            <ArrowUpNarrowWide size={18} />
          </button>
        </div>
      </div>

      <div className="narasumber-chart-scroll" ref={scrollRef}>
        <div className="narasumber-chart-inner" style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              layout="vertical"
              margin={{
                top: 4,
                right: 16,
                bottom: 4,
                left: 4,
              }}
              barCategoryGap="20%"
            >
              <XAxis
                type="number"
                allowDecimals={false}
                stroke="var(--text-muted)"
                fontSize={12}
              />

              <YAxis
                type="category"
                dataKey="nama"
                width={150}
                tick={{ fontSize: 12 }}
                stroke="var(--text-muted)"
              />

              <Tooltip
                cursor={{ fill: "var(--hover-bg)" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "none",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                }}
                formatter={(value, name) => [`${value} kegiatan`, name]}
              />

              {/* TOTAL KEGIATAN */}
              <Bar
                dataKey="jumlah"
                name="Total Kegiatan"
                radius={[0, 8, 8, 0]}
                cursor="pointer"
                onClick={(entry) =>
                  onBarClick(entry.nama === activeNama ? "all" : entry.nama)
                }
              >
                {sortedData.map((entry) => (
                  <Cell
                    key={entry.nama}
                    fill={
                      activeNama === "all" || activeNama === entry.nama
                        ? "var(--color-primary)"
                        : "var(--color-primary-soft)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
