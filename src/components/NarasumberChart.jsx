import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function NarasumberChart({ data, onBarClick, activeNama }) {
  return (
    <div className="chart-card">
      <h3>Jumlah Kegiatan per Narasumber</h3>
      <p className="chart-hint">Klik salah satu batang untuk memfilter seluruh dashboard</p>
      <ResponsiveContainer width="100%" height={Math.max(280, data.length * 26)}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 4 }}>
          <XAxis type="number" allowDecimals={false} stroke="var(--text-muted)" fontSize={12} />
          <YAxis type="category" dataKey="nama" width={150} tick={{ fontSize: 12 }} stroke="var(--text-muted)" />
          <Tooltip
            cursor={{ fill: 'var(--hover-bg)' }}
            contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
            formatter={(value) => [`${value} kegiatan`, 'Jumlah']}
          />
          <Bar
            dataKey="jumlah"
            radius={[0, 8, 8, 0]}
            cursor="pointer"
            onClick={(entry) => onBarClick(entry.nama === activeNama ? 'all' : entry.nama)}
          >
            {data.map((entry) => (
              <Cell
                key={entry.nama}
                fill={activeNama === 'all' || entry.nama === activeNama ? 'var(--color-primary)' : 'var(--color-primary-soft)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
