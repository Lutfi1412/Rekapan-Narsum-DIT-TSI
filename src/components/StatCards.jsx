import { Building2, CalendarCheck2, Timer, Users, Wifi } from 'lucide-react'

export default function StatCards({ stats }) {
  const items = [
    { icon: CalendarCheck2, label: 'Total Kegiatan', value: stats.total, accent: 'indigo' },
    { icon: Users, label: 'Narasumber Aktif', value: stats.totalNarasumber, accent: 'violet' },
    { icon: Building2, label: 'Instansi Mitra', value: stats.totalInstansi, accent: 'blue' },
    { icon: Wifi, label: 'Online : Offline', value: `${stats.online} : ${stats.offline}`, accent: 'emerald' },
    { icon: Timer, label: 'Rata-rata Durasi', value: `${stats.avgDurasi.toFixed(1)} hari`, accent: 'amber' },
  ]

  return (
    <section className="stat-cards">
      {items.map((it) => {
        const Icon = it.icon
        return (
          <div className={`stat-card accent-${it.accent}`} key={it.label}>
            <div className="stat-icon">
              <Icon size={20} />
            </div>
            <div>
              <p className="stat-value">{it.value}</p>
              <p className="stat-label">{it.label}</p>
            </div>
          </div>
        )
      })}
    </section>
  )
}
