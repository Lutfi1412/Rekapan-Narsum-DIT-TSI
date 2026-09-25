import { RotateCcw, Search } from 'lucide-react'

export default function FilterBar({ filters, updateFilter, resetFilters, namaList, totalTampil }) {
  return (
    <section className="filter-bar">
      <div className="filter-search">
        <Search size={16} />
        <input
          type="text"
          placeholder="Cari nama, instansi, atau topik..."
          value={filters.search}
          onChange={(e) => updateFilter({ search: e.target.value })}
        />
      </div>

      <select value={filters.mode} onChange={(e) => updateFilter({ mode: e.target.value })}>
        <option value="all">Semua Mode</option>
        <option value="Online">Online</option>
        <option value="Offline">Offline</option>
      </select>

      <select value={filters.nama} onChange={(e) => updateFilter({ nama: e.target.value })}>
        <option value="all">Semua Narasumber</option>
        {namaList.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>

      <button className="btn-reset" onClick={resetFilters}>
        <RotateCcw size={14} /> Reset
      </button>

      <span className="filter-count">{totalTampil} kegiatan ditemukan</span>
    </section>
  )
}
