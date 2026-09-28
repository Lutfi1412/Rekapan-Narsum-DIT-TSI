import { useState } from "react";
import {
  Boxes,
  Building2,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  Monitor,
  PackageSearch,
  Shapes,
  ShieldCheck,
  User,
} from "lucide-react";
import { formatRentangTanggal } from "../utils/dataUtils";

const ICONS = {
  Boxes,
  ClipboardCheck,
  Monitor,
  PackageSearch,
  Shapes,
  ShieldCheck,
};

const formatPersen = (n) =>
  n.toLocaleString("id-ID", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

function KategoriRow({ kat, maxJumlah, open, onToggle, onSelect, index }) {
  const Icon = ICONS[kat.icon] || Shapes;
  const lebar = maxJumlah ? (kat.jumlah / maxJumlah) * 100 : 0;

  return (
    <div
      className={`kat-row ${open ? "open" : ""}`}
      style={{ "--kat-color": kat.color }}
    >
      <button
        className="kat-head"
        onClick={onToggle}
        disabled={!kat.jumlah}
        aria-expanded={open}
      >
        <span className="kat-icon" style={{ background: kat.color }}>
          <Icon size={20} />
        </span>
        <span className="kat-body">
          <span className="kat-top">
            <span className="kat-label">{kat.label}</span>
            <span className="kat-stat">
              <strong>{kat.jumlah}</strong>
              <span className="kat-unit">undangan</span>
              <span className="kat-pct">{formatPersen(kat.persen)}%</span>
            </span>
          </span>
          <span className="kat-track">
            <span
              className="kat-fill"
              style={{
                width: `${lebar}%`,
                background: kat.color,
                animationDelay: `${index * 70}ms`,
              }}
            />
          </span>
        </span>
        <ChevronDown className="kat-chevron" size={18} />
      </button>

      {open && (
        <ul className="kat-list">
          {kat.items.map((item) => (
            <li key={item.id}>
              <button className="kat-item" onClick={() => onSelect(item)}>
                <span className="kat-item-title">{item.topik}</span>
                <span className="kat-item-meta">
                  <span>
                    <Building2 size={12} /> {item.instansi}
                  </span>
                  <span>
                    <CalendarDays size={12} />{" "}
                    {formatRentangTanggal(item.tglMulai, item.tglSelesai)}
                  </span>
                  <span>
                    <User size={12} /> {item.nama}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function TopikTerbanyak({ data, onSelect }) {
  const [openId, setOpenId] = useState(null);
  const { utama, lainnya, total } = data;
  const semua = [...utama, ...lainnya];
  const maxJumlah = Math.max(0, ...semua.map((k) => k.jumlah));

  const renderGroup = (title, list, offset) => (
    <>
      <div className="kat-group-title">
        {title} <span className="kat-group-count">{list.length} kategori</span>
      </div>
      {list.map((kat, i) => (
        <KategoriRow
          key={kat.id}
          kat={kat}
          index={offset + i}
          maxJumlah={maxJumlah}
          open={openId === kat.id && kat.jumlah > 0}
          onToggle={() => setOpenId((cur) => (cur === kat.id ? null : kat.id))}
          onSelect={onSelect}
        />
      ))}
    </>
  );

  return (
    <section className="chart-card">
      <h3>Topik Terbanyak</h3>
      <p className="chart-hint">
        {semua.length} kategori topik ({utama.length} kategori utama) dari{" "}
        {total} undangan. Klik kategori untuk melihat judul topik &amp;
        instansinya, lalu klik salah satu untuk detail lengkap.
      </p>
      {renderGroup("Kategori Utama", utama, 0)}
      {renderGroup("Kategori Lainnya", lainnya, utama.length)}
    </section>
  );
}
