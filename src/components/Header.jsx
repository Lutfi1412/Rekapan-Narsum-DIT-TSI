import { LayoutDashboard, Moon, Sun } from 'lucide-react'
import { formatTanggal } from '../utils/dataUtils'

export default function Header({ theme, onToggleTheme, stats }) {
  return (
    <header className="header">
      <div className="container header-inner">
        <div className="header-title">
          <div className="header-icon">
            <LayoutDashboard size={22} />
          </div>
          <div>
            <h1>Dashboard Narasumber Direktorat TSI</h1>
            <p className="header-subtitle">
              {stats.tglMin && stats.tglMax
                ? `Rekap kegiatan ${formatTanggal(stats.tglMin)} — ${formatTanggal(stats.tglMax)}`
                : 'Rekap kegiatan narasumber'}
            </p>
          </div>
        </div>
        <button className="theme-toggle" onClick={onToggleTheme} aria-label="Ganti tema tampilan">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </header>
  )
}
