import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useNarasumberData } from "./hooks/useNarasumberData";
import Header from "./components/Header";
import StatCards from "./components/StatCards";
import FilterBar from "./components/FilterBar";
import NarasumberChart from "./components/NarasumberChart";
import ModeDonutChart from "./components/ModeDonutChart";
import TrendChart from "./components/TrendChart";
import InstansiChart from "./components/InstansiChart";
import TopikTerbanyak from "./components/TopikTerbanyak";
import Timeline from "./components/Timeline";
import DataTable from "./components/DataTable";
import DetailModal from "./components/DetailModal";
import { exportToXlsx } from "./utils/exportXlsx";

export default function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );
  const [selected, setSelected] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const {
    loading,
    error,
    source,
    sourceInfo,
    changeSource,
    reload,
    loadedAt,
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
    kategoriTopik,
  } = useNarasumberData();

  async function handleExport() {
    if (!filteredData.length) return;

    try {
      setExporting(true);
      await exportToXlsx(filteredData);
      setExportMessage("XLSX diunduh");
      window.setTimeout(() => setExportMessage(""), 3500);
    } catch (err) {
      setExportMessage("Gagal export");
      window.setTimeout(() => setExportMessage(""), 3500);
      console.error(err);
    } finally {
      setExporting(false);
    }
  }

  if (loading) {
    return (
      <div className="state-screen">
        <div className="spinner" />
        <p>Memuat data narasumber...</p>
        <p className="state-hint">Sumber: {sourceInfo?.hint}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-screen">
        <p>Gagal memuat data: {error}</p>
        <p className="state-hint">
          Sumber aktif: <code>{sourceInfo?.hint}</code>
        </p>
        <div className="state-actions">
          <button className="btn-reset" onClick={reload}>
            <RefreshCw size={14} /> Coba lagi
          </button>
          {source !== "local" && (
            <button className="btn-reset" onClick={() => changeSource("local")}>
              Pakai data lokal
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header
        theme={theme}
        onToggleTheme={() =>
          setTheme((t) => (t === "light" ? "dark" : "light"))
        }
        stats={stats}
        source={source}
        onChangeSource={changeSource}
      />

      <main className="container">
        <StatCards stats={stats} />

        <FilterBar
          filters={filters}
          updateFilter={updateFilter}
          resetFilters={resetFilters}
          namaList={namaList}
          totalTampil={filteredData.length}
          onExport={handleExport}
          exporting={exporting}
          exportMessage={exportMessage}
          sourceInfo={sourceInfo}
        />

        <section className="charts-grid">
          <NarasumberChart
            data={perNarasumber}
            onBarClick={(nama) => updateFilter({ nama })}
            activeNama={filters.nama}
          />
          <ModeDonutChart
            data={modeDistribution}
            onSliceClick={(mode) => updateFilter({ mode })}
            activeMode={filters.mode}
          />
          <InstansiChart data={topInstansi} />
          <TrendChart data={trendBulanan} />
        </section>

        <TopikTerbanyak data={kategoriTopik} onSelect={setSelected} />

        <Timeline data={filteredData} onSelect={setSelected} />

        {/* <DataTable data={filteredData} onSelect={setSelected} /> */}
      </main>

      <footer className="footer">
        <p>
          Dashboard Narasumber Direktorat TSI &middot; {stats.total} kegiatan
          tercatat dalam data ini
        </p>
        <p className="footer-source">
          Sumber: {sourceInfo?.label}
          {loadedAt
            ? ` · dimuat ${loadedAt.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}`
            : ""}
          {" · "}
          <button type="button" className="link-button" onClick={reload}>
            muat ulang
          </button>
        </p>
      </footer>

      {selected && (
        <DetailModal item={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
