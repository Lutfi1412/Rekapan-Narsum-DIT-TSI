import { Cloud, HardDrive, LayoutDashboard, Moon, Sun } from 'lucide-react'
import { formatTanggal } from '../utils/dataUtils'
import { API_BASE_URL } from '../services/dataSource'

export default function Header({ theme, onToggleTheme, stats, source, onChangeSource }) {
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

        <div className="header-actions">
          <div className="source-switch" role="group" aria-label="Sumber data">
            <button
              type="button"
              className={source === 'local' ? 'active' : ''}
              onClick={() => onChangeSource('local')}
              title="Ambil data dari public/data.json"
              aria-pressed={source === 'local'}
            >
              <HardDrive size={14} />
              Lokal
            </button>
            <button
              type="button"
              className={source === 'api' ? 'active' : ''}
              onClick={() => onChangeSource('api')}
              title={`Ambil data dari API publik: ${API_BASE_URL}/`}
              aria-pressed={source === 'api'}
            >
              <Cloud size={14} />
              API
            </button>
          </div>

          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label="Ganti tema tampilan"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>
    </header>
  )
}
