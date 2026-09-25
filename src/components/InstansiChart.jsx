import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function truncate(str, n) {
  return str.length > n ? `${str.slice(0, n - 1)}…` : str
}

function InstansiTick({ x, y, payload }) {
  return (
    <text x={x - 4} y={y} dy={4} textAnchor="end" fontSize={11} fill="var(--text-muted)">
      {truncate(payload.value, 30)}
      <title>{payload.value}</title>
    </text>
  )
}

export default function InstansiChart({ data }) {
  return (
    <div className="chart-card chart-card-wide">
      <h3>Top 10 Instansi Peminta Narasumber</h3>
      <p className="chart-hint">Arahkan kursor ke label untuk melihat nama lengkap jabatan/instansi</p>
      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, bottom: 8, left: 4 }}>
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} stroke="var(--text-muted)" />
          <YAxis type="category" dataKey="instansi" width={210} tick={<InstansiTick />} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', maxWidth: 300 }}
            formatter={(value) => [`${value} kegiatan`, 'Jumlah']}
          />
          <Bar dataKey="jumlah" radius={[0, 8, 8, 0]} fill="var(--color-secondary)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
