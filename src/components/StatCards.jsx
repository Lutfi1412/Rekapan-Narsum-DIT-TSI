import {
  Building2,
  CalendarCheck2,
  Timer,
  Users,
  Wifi,
  CalendarDays,
  CircleUserRound,
  Building,
  Speech,
  Video,
} from "lucide-react";

export default function StatCards({ stats }) {
  const items = [
    {
      icon: CalendarDays,
      label: "Total Kegiatan",
      value: stats.total,
      accent: "indigo",
    },
    {
      icon: CircleUserRound,
      label: "Narasumber Aktif",
      value: stats.totalNarasumber,
      accent: "violet",
    },
    {
      icon: Building,
      label: "Instansi Mitra",
      value: stats.totalInstansi,
      accent: "blue",
    },
    {
      icon: Video,
      label: "Online",
      value: `${stats.online}`,
      accent: "emerald",
    },
    {
      icon: Speech,
      label: "Offline",
      value: `${stats.offline}`,
      accent: "amber",
    },
  ];

  return (
    <section className="stat-cards">
      {items.map((it) => {
        const Icon = it.icon;
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
        );
      })}
    </section>
  );
}
