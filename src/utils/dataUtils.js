// ============================================================================
// dataUtils.js
// Kumpulan fungsi untuk membersihkan (normalisasi) dan menganalisis data
// mentah dari public/data.json.
// ============================================================================

import { klasifikasiTopik } from "./kategoriTopik.js";

/**
 * Parse string tanggal format "D MonthName YYYY"
 * Contoh: "8 January 2026"
 *
 * Jika tahun tidak valid, misalnya "0202",
 * tahun akan dikoreksi menjadi 2026.
 */
export function parseTanggal(raw) {
  if (!raw) return null;

  const str = raw.trim();

  const direct = new Date(str);

  if (
    !isNaN(direct) &&
    direct.getFullYear() >= 2000 &&
    direct.getFullYear() <= 2100
  ) {
    return direct;
  }

  // Fallback untuk tahun yang salah, misalnya 0202
  const match = str.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{1,4})$/);

  if (match) {
    const [, day, month] = match;

    const fixed = new Date(`${day} ${month} 2026`);

    if (!isNaN(fixed)) {
      return fixed;
    }
  }

  return null;
}

/**
 * Format Date -> "8 Januari 2026"
 */
export function formatTanggal(date) {
  if (!date) return "-";

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Format rentang tanggal.
 *
 * Jika tanggal mulai dan selesai sama:
 * "8 Januari 2026"
 *
 * Jika masih dalam bulan yang sama:
 * "8 - 10 Januari 2026"
 *
 * Jika berbeda bulan:
 * "30 Januari 2026 - 2 Februari 2026"
 */
export function formatRentangTanggal(mulai, selesai) {
  if (!mulai || !selesai) return "-";

  if (mulai.toDateString() === selesai.toDateString()) {
    return formatTanggal(mulai);
  }

  const sameMonth =
    mulai.getMonth() === selesai.getMonth() &&
    mulai.getFullYear() === selesai.getFullYear();

  if (sameMonth) {
    return `${mulai.getDate()} - ${formatTanggal(selesai)}`;
  }

  return `${formatTanggal(mulai)} - ${formatTanggal(selesai)}`;
}

/**
 * Bersihkan dan lengkapi data mentah dari JSON
 * menjadi bentuk siap digunakan dashboard.
 */
export function normalizeData(raw) {
  return raw
    .map((item, idx) => {
      const nama = (item["Nama"] || "").trim();
      const instansi = (item["Instansi"] || "").trim();
      const topik = (item["Topik"] || "").trim();
      const lokasi = (item["Lokasi"] || "").trim();
      const mode = (item["Mode Pelaksanaan"] || "").trim();

      const tglMulai = parseTanggal(item["Tanggal Mulai"]);
      const tglSelesai = parseTanggal(item["Tanggal Selesai"]);

      const durasiHari =
        tglMulai && tglSelesai
          ? Math.round((tglSelesai - tglMulai) / 86400000) + 1
          : null;

      return {
        id: idx,
        nama,
        instansi,
        topik,
        lokasi,
        mode,
        tglMulai,
        tglSelesai,
        durasiHari,

        kategori: klasifikasiTopik(topik),

        bulanKey: tglMulai
          ? `${tglMulai.getFullYear()}-${String(
              tglMulai.getMonth() + 1
            ).padStart(2, "0")}`
          : null,

        bulanLabel: tglMulai
          ? tglMulai.toLocaleDateString("id-ID", {
              month: "short",
              year: "numeric",
            })
          : "-",
      };
    })
    .filter((d) => d.nama);
}

/**
 * Statistik ringkasan untuk kartu KPI.
 */
export function getStats(data) {
  const total = data.length;

  const totalNarasumber = new Set(
    data.map((d) => d.nama)
  ).size;

  const totalInstansi = new Set(
    data.map((d) => d.instansi)
  ).size;

  const online = data.filter(
    (d) => d.mode === "Online"
  ).length;

  const offline = data.filter(
    (d) => d.mode === "Offline"
  ).length;

  const durasiList = data
    .filter((d) => d.durasiHari != null)
    .map((d) => d.durasiHari);

  const avgDurasi = durasiList.length
    ? durasiList.reduce((a, b) => a + b, 0) / durasiList.length
    : 0;

  const tanggalValid = data
    .filter((d) => d.tglMulai)
    .map((d) => d.tglMulai);

  const tglMin = tanggalValid.length
    ? new Date(Math.min(...tanggalValid))
    : null;

  const tglMax = tanggalValid.length
    ? new Date(Math.max(...tanggalValid))
    : null;

  return {
    total,
    totalNarasumber,
    totalInstansi,
    online,
    offline,
    avgDurasi,
    tglMin,
    tglMax,
  };
}

/**
 * Jumlah kegiatan per narasumber.
 *
 * Urutan:
 * 1. Jumlah kegiatan terbesar
 * 2. Jika sama → jumlah instansi terbesar
 * 3. Jika masih sama → nama A-Z
 */
export function getKegiatanPerNarasumber(data) {
  const map = new Map();

  data.forEach((d) => {
    if (!map.has(d.nama)) {
      map.set(d.nama, {
        jumlah: 0,
        instansi: new Set(),
      });
    }

    const item = map.get(d.nama);

    // Total kegiatan
    item.jumlah += 1;

    // Total instansi unik
    if (d.instansi) {
      item.instansi.add(d.instansi);
    }
  });

  return Array.from(map, ([nama, value]) => ({
    nama,
    jumlah: value.jumlah,
    jumlahInstansi: value.instansi.size,
  })).sort((a, b) => {
    // 1. Kegiatan terbesar
    if (b.jumlah !== a.jumlah) {
      return b.jumlah - a.jumlah;
    }

    // 2. Jika kegiatan sama → instansi terbesar
    if (b.jumlahInstansi !== a.jumlahInstansi) {
      return b.jumlahInstansi - a.jumlahInstansi;
    }

    // 3. Jika semuanya sama → nama A-Z
    return a.nama.localeCompare(b.nama);
  });
}

/**
 * Distribusi mode pelaksanaan.
 */
export function getModeDistribution(data) {
  const online = data.filter(
    (d) => d.mode === "Online"
  ).length;

  const offline = data.filter(
    (d) => d.mode === "Offline"
  ).length;

  return [
    {
      name: "Online",
      value: online,
    },
    {
      name: "Offline",
      value: offline,
    },
  ];
}

/**
 * Tren jumlah kegiatan per bulan,
 * dipecah menjadi Online dan Offline.
 */
export function getTrendBulanan(data) {
  const map = new Map();

  data.forEach((d) => {
    if (!d.bulanKey) return;

    if (!map.has(d.bulanKey)) {
      map.set(d.bulanKey, {
        bulanKey: d.bulanKey,
        bulan: d.bulanLabel,
        online: 0,
        offline: 0,
      });
    }

    const row = map.get(d.bulanKey);

    if (d.mode === "Online") {
      row.online += 1;
    } else if (d.mode === "Offline") {
      row.offline += 1;
    }
  });

  return Array.from(map.values())
    .sort((a, b) =>
      a.bulanKey.localeCompare(b.bulanKey)
    )
    .map((r) => ({
      ...r,
      total: r.online + r.offline,
    }));
}

/**
 * Top-N instansi yang paling sering meminta narasumber.
 */
export function getTopInstansi(data, n = 10) {
  const map = new Map();

  data.forEach((d) => {
    map.set(
      d.instansi,
      (map.get(d.instansi) || 0) + 1
    );
  });

  return Array.from(
    map,
    ([instansi, jumlah]) => ({
      instansi,
      jumlah,
    })
  )
    .sort((a, b) => b.jumlah - a.jumlah)
    .slice(0, n);
}

/**
 * Daftar unik nama narasumber
 * untuk dropdown filter.
 */
export function getNamaList(data) {
  return Array.from(
    new Set(data.map((d) => d.nama))
  ).sort((a, b) =>
    a.localeCompare(b)
  );
}

/**
 * Stopwords untuk ekstraksi keyword topik.
 */
const STOPWORDS = new Set([
  "dan",
  "di",
  "ke",
  "dari",
  "yang",
  "untuk",
  "pada",
  "dengan",
  "bagi",
  "atau",
  "ini",
  "itu",
  "para",
  "adalah",
  "dalam",
  "oleh",
  "akan",
  "dapat",
  "serta",
  "agar",
  "guna",
  "terhadap",
  "melalui",
  "sebagai",
  "atas",
  "tahun",
  "tentang",
  "kepada",
  "secara",
  "lingkup",
  "juga",
  "lebih",
  "dimohon",
  "mohon",
]);

/**
 * Ekstraksi kata kunci paling sering muncul
 * pada kolom Topik.
 */
export function getTopikKeywords(data, n = 15) {
  const counter = new Map();

  data.forEach((d) => {
    const words = d.topik
      .toLowerCase()
      .replace(/[^a-z\s]/g, " ")
      .split(/\s+/);

    words.forEach((w) => {
      if (
        w.length > 3 &&
        !STOPWORDS.has(w)
      ) {
        counter.set(
          w,
          (counter.get(w) || 0) + 1
        );
      }
    });
  });

  return Array.from(
    counter,
    ([kata, jumlah]) => ({
      kata,
      jumlah,
    })
  )
    .sort((a, b) => b.jumlah - a.jumlah)
    .slice(0, n);
}