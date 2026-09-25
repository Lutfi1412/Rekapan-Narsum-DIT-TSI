import { useMemo, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react'
import { formatRentangTanggal } from '../utils/dataUtils'

const COLUMNS = [
  { key: 'nama', label: 'Narasumber' },
  { key: 'instansi', label: 'Instansi' },
  { key: 'topik', label: 'Topik' },
  { key: 'tglMulai', label: 'Tanggal' },
  { key: 'mode', label: 'Mode' },
]

const PAGE_SIZE = 10

export default function DataTable({ data, onSelect }) {
  const [sortKey, setSortKey] = useState('tglMulai')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)

  const sorted = useMemo(() => {
    const copy = [...data]
    copy.sort((a, b) => {
      let va = a[sortKey]
      let vb = b[sortKey]
      if (va instanceof Date) va = va ? va.getTime() : 0
      if (vb instanceof Date) vb = vb ? vb.getTime() : 0
      if (typeof va === 'string') va = va.toLowerCase()
      if (typeof vb === 'string') vb = vb.toLowerCase()
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return copy
  }, [data, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageData = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(1)
  }

  return (
    <section className="chart-card">
      <h3>Data Lengkap Kegiatan</h3>
      <p className="chart-hint">Klik baris untuk detail. Klik header kolom untuk mengurutkan.</p>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th key={col.key} onClick={() => toggleSort(col.key)}>
                  <span>
                    {col.label}
                    {sortKey === col.key && (sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((item) => (
              <tr key={item.id} onClick={() => onSelect(item)}>
                <td>{item.nama}</td>
                <td className="cell-truncate" title={item.instansi}>
                  {item.instansi}
                </td>
                <td className="cell-truncate" title={item.topik}>
                  {item.topik}
                </td>
                <td>{formatRentangTanggal(item.tglMulai, item.tglSelesai)}</td>
                <td>
                  <span className={`badge ${item.mode === 'Online' ? 'badge-online' : 'badge-offline'}`}>{item.mode}</span>
                </td>
              </tr>
            ))}
            {!pageData.length && (
              <tr>
                <td colSpan={5} className="empty-state">
                  Tidak ada data yang cocok dengan filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1}>
          <ChevronLeft size={14} /> Sebelumnya
        </button>
        <span>
          Halaman {safePage} dari {totalPages}
        </span>
        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}>
          Selanjutnya <ChevronRight size={14} />
        </button>
      </div>
    </section>
  )
}
