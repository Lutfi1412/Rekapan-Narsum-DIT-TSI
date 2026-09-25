import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function TrendChart({ data }) {
  return (
    <div className="chart-card chart-card-wide">
      <h3>Tren Kegiatan per Bulan</h3>
      <p className="chart-hint">Distribusi Online vs Offline tiap bulan (Jan - Sep 2026)</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 4, right: 16, bottom: 4, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="bulan" tick={{ fontSize: 12 }} stroke="var(--text-muted)" />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="var(--text-muted)" />
          <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }} />
          <Legend />
          <Bar dataKey="online" name="Online" stackId="a" fill="#10b981" />
          <Bar dataKey="offline" name="Offline" stackId="a" fill="#f59e0b" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
