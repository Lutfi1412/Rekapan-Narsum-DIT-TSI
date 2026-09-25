import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function NarasumberChart({ data, onBarClick, activeNama }) {
  const chartHeight = Math.max(280, data.length * 45);

  return (
    <div className="chart-card">
      <h3>Jumlah Kegiatan per Narasumber</h3>

      <p className="chart-hint">
        Klik salah satu batang untuk memfilter seluruh dashboard
      </p>

      <div className="narasumber-chart-scroll">
        <div className="narasumber-chart-inner" style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
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
                {data.map((entry) => (
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

              {/* TOTAL INSTANSI */}
              <Bar
                dataKey="jumlahInstansi"
                name="Total Instansi"
                radius={[0, 8, 8, 0]}
              >
                {data.map((entry) => (
                  <Cell key={`instansi-${entry.nama}`} fill="orange" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
