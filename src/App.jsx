import { useEffect, useState } from 'react'
import { useNarasumberData } from './hooks/useNarasumberData'
import Header from './components/Header'
import StatCards from './components/StatCards'
import FilterBar from './components/FilterBar'
import NarasumberChart from './components/NarasumberChart'
import ModeDonutChart from './components/ModeDonutChart'
import TrendChart from './components/TrendChart'
import InstansiChart from './components/InstansiChart'
import TopikKeywords from './components/TopikKeywords'
import Timeline from './components/Timeline'
import DataTable from './components/DataTable'
import DetailModal from './components/DetailModal'

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const {
    loading,
    error,
    filteredData,
    filters,
    updateFilter,
    resetFilters,
    namaList,
    stats,
    perNarasumber,
    modeDistribution,
    trendBulanan,
    topInstansi,
    topikKeywords,
  } = useNarasumberData()

  if (loading) {
    return (
      <div className="state-screen">
        <div className="spinner" />
        <p>Memuat data narasumber...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="state-screen">
        <p>Gagal memuat data: {error}</p>
        <p className="state-hint">
          Pastikan file <code>data.json</code> ada di folder <code>public/</code>.
        </p>
      </div>
    )
  }

  return (
    <div className="app">
      <Header theme={theme} onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))} stats={stats} />

      <main className="container">
        <StatCards stats={stats} />

        <FilterBar
          filters={filters}
          updateFilter={updateFilter}
          resetFilters={resetFilters}
          namaList={namaList}
          totalTampil={filteredData.length}
        />

        <section className="charts-grid">
          <NarasumberChart data={perNarasumber} onBarClick={(nama) => updateFilter({ nama })} activeNama={filters.nama} />
          <ModeDonutChart data={modeDistribution} onSliceClick={(mode) => updateFilter({ mode })} activeMode={filters.mode} />
          <TrendChart data={trendBulanan} />
          <InstansiChart data={topInstansi} />
        </section>

        <TopikKeywords data={topikKeywords} />

        <Timeline data={filteredData} onSelect={setSelected} />

        <DataTable data={filteredData} onSelect={setSelected} />
      </main>

      <footer className="footer">
        <p>Dashboard Narasumber Direktorat TSI &middot; {stats.total} kegiatan tercatat dalam data ini</p>
      </footer>

      {selected && <DetailModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
