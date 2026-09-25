export default function TopikKeywords({ data }) {
  if (!data.length) return null

  const max = Math.max(...data.map((d) => d.jumlah))
  const min = Math.min(...data.map((d) => d.jumlah))
  const scale = (n) => (max === min ? 16 : 13 + ((n - min) / (max - min)) * 18)

  return (
    <section className="chart-card">
      <h3>Topik yang Paling Sering Dibahas</h3>
      <p className="chart-hint">Kata kunci diekstrak otomatis dari kolom Topik — ukuran mengikuti frekuensi kemunculan</p>
      <div className="keyword-cloud">
        {data.map((d) => (
          <span key={d.kata} className="keyword-tag" style={{ fontSize: `${scale(d.jumlah)}px` }} title={`${d.jumlah} kemunculan`}>
            {d.kata}
          </span>
        ))}
      </div>
    </section>
  )
}
