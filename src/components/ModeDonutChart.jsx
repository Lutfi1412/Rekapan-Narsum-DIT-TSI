import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = { Online: '#10b981', Offline: '#f59e0b' }

export default function ModeDonutChart({ data, onSliceClick, activeMode }) {
  const total = data.reduce((a, b) => a + b.value, 0)

  return (
    <div className="chart-card">
      <h3>Mode Pelaksanaan</h3>
      <p className="chart-hint">Klik bagian donat untuk memfilter seluruh dashboard</p>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={64}
            outerRadius={96}
            paddingAngle={3}
            cursor="pointer"
            onClick={(entry) => onSliceClick(entry.name === activeMode ? 'all' : entry.name)}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={COLORS[entry.name]}
                opacity={activeMode === 'all' || activeMode === entry.name ? 1 : 0.3}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} kegiatan (${total ? Math.round((value / total) * 100) : 0}%)`, name]}
            contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
