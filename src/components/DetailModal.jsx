import { Building2, CalendarDays, MapPin, User, Wifi, WifiOff, X } from 'lucide-react'
import { formatRentangTanggal } from '../utils/dataUtils'

export default function DetailModal({ item, onClose }) {
  const mapsUrl =
    item.mode === 'Offline' ? `https://www.google.com/maps/search/${encodeURIComponent(item.lokasi)}` : null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Tutup">
          <X size={18} />
        </button>

        <span className={`badge ${item.mode === 'Online' ? 'badge-online' : 'badge-offline'}`}>
          {item.mode === 'Online' ? <Wifi size={12} /> : <WifiOff size={12} />} {item.mode}
        </span>

        <h3>{item.topik}</h3>

        <ul className="modal-meta">
          <li>
            <User size={15} />
            <span>{item.nama}</span>
          </li>
          <li>
            <Building2 size={15} />
            <span>{item.instansi}</span>
          </li>
          <li>
            <CalendarDays size={15} />
            <span>
              {formatRentangTanggal(item.tglMulai, item.tglSelesai)}
              {item.durasiHari ? ` (${item.durasiHari} hari)` : ''}
            </span>
          </li>
          <li>
            <MapPin size={15} />
            <span>
              {item.lokasi}
              {mapsUrl && (
                <>
                  {' — '}
                  <a href={mapsUrl} target="_blank" rel="noreferrer" className="modal-map-link">
                    Lihat di peta
                  </a>
                </>
              )}
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
