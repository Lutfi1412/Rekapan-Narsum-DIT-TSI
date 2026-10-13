import { useMemo, useRef, useState } from "react";
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
 * Pilihan urutan.
 * field     : kolom utama yang diurutkan
 * secondary : kolom pembanding jika nilai field utama sama
 * dir       : "desc" = terbanyak, "asc" = tersedikit
 */
const SORT_OPTIONS = [
  {
    value: "kegiatan-desc",
    label: "Kegiatan terbanyak",
    field: "jumlah",
    secondary: "jumlahInstansi",
    dir: "desc",
  },
  {
    value: "kegiatan-asc",
    label: "Kegiatan tersedikit",
    field: "jumlah",
    secondary: "jumlahInstansi",
    dir: "asc",
  },
  {
    value: "instansi-desc",
    label: "Instansi terbanyak",
    field: "jumlahInstansi",
    secondary: "jumlah",
    dir: "desc",
  },
  {
    value: "instansi-asc",
    label: "Instansi tersedikit",
    field: "jumlahInstansi",
    secondary: "jumlah",
    dir: "asc",
  },
];

function sortNarasumber(data, sortValue) {
  const option =
    SORT_OPTIONS.find((o) => o.value === sortValue) ?? SORT_OPTIONS[0];
  const direction = option.dir === "asc" ? 1 : -1;

  return [...data].sort((a, b) => {
    // 1. Urutkan berdasarkan kolom utama
    if (a[option.field] !== b[option.field]) {
      return (a[option.field] - b[option.field]) * direction;
    }

    // 2. Jika sama, pakai kolom pembanding dengan arah yang sama
    if (a[option.secondary] !== b[option.secondary]) {
      return (a[option.secondary] - b[option.secondary]) * direction;
    }

    // 3. Jika masih sama, nama A-Z
    return a.nama.localeCompare(b.nama);
  });
}

export default function NarasumberChart({ data, onBarClick, activeNama }) {
  const [sortBy, setSortBy] = useState("kegiatan-desc");
  const scrollRef = useRef(null);

  const sortedData = useMemo(
    () => sortNarasumber(data, sortBy),
    [data, sortBy],
  );
  const chartHeight = Math.max(280, sortedData.length * 45);

  const isInstansiSort = sortBy.startsWith("instansi");

  // TOTAL KEGIATAN (biru)
  const barKegiatan = (
    <Bar
      key="kegiatan"
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
  );

  // TOTAL INSTANSI (oranye)
  const barInstansi = (
    <Bar
      key="instansi"
      dataKey="jumlahInstansi"
      name="Total Instansi"
      radius={[0, 8, 8, 0]}
    >
      {sortedData.map((entry) => (
        <Cell key={`instansi-${entry.nama}`} fill="orange" />
      ))}
    </Bar>
  );

  function handleSortChange(e) {
    setSortBy(e.target.value);

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

        <label className="chart-sort">
          <span>Urutkan</span>
          <select value={sortBy} onChange={handleSortChange}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
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
                formatter={(value, name) => {
                  if (name === "Total Instansi") {
                    return [`${value} instansi`, name];
                  }

                  return [`${value} kegiatan`, name];
                }}
              />

              {/* Urutan bar mengikuti jenis sort:
                  sort kegiatan → biru di atas, oranye di bawah
                  sort instansi → oranye di atas, biru di bawah */}
              {isInstansiSort
                ? [barInstansi, barKegiatan]
                : [barKegiatan, barInstansi]}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
