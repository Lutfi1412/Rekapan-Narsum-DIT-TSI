import { useEffect, useMemo, useState } from 'react'
import {
  normalizeData,
  getStats,
  getKegiatanPerNarasumber,
  getModeDistribution,
  getTrendBulanan,
  getTopInstansi,
  getTopikKeywords,
  getNamaList,
} from '../utils/dataUtils'

const INITIAL_FILTERS = { search: '', mode: 'all', nama: 'all' }

/**
 * Hook utama dashboard: mengambil data.json dari folder public,
 * menormalisasinya, lalu menyediakan data terfilter + semua agregat
 * yang dipakai kartu statistik, chart, linimasa, dan tabel.
 */
export function useNarasumberData() {
  const [rawData, setRawData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState(INITIAL_FILTERS)

  useEffect(() => {
    fetch('/data.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => setRawData(normalizeData(json)))
      .catch((err) => setError(err.message || 'Terjadi kesalahan saat memuat data'))
      .finally(() => setLoading(false))
  }, [])

  const filteredData = useMemo(() => {
    const q = filters.search.trim().toLowerCase()
    return rawData.filter((d) => {
      if (filters.mode !== 'all' && d.mode !== filters.mode) return false
      if (filters.nama !== 'all' && d.nama !== filters.nama) return false
      if (q) {
        const haystack = `${d.nama} ${d.instansi} ${d.topik} ${d.lokasi}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [rawData, filters])

  const namaList = useMemo(() => getNamaList(rawData), [rawData])
  const stats = useMemo(() => getStats(filteredData), [filteredData])
  const perNarasumber = useMemo(() => getKegiatanPerNarasumber(filteredData), [filteredData])
  const modeDistribution = useMemo(() => getModeDistribution(filteredData), [filteredData])
  const trendBulanan = useMemo(() => getTrendBulanan(filteredData), [filteredData])
  const topInstansi = useMemo(() => getTopInstansi(filteredData), [filteredData])
  const topikKeywords = useMemo(() => getTopikKeywords(filteredData), [filteredData])

  function updateFilter(patch) {
    setFilters((prev) => ({ ...prev, ...patch }))
  }

  function resetFilters() {
    setFilters(INITIAL_FILTERS)
  }

  return {
    loading,
    error,
    rawData,
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
  }
}
