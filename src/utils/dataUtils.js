// ============================================================================
// dataUtils.js
// Kumpulan fungsi untuk membersihkan (normalisasi) dan menganalisis data
// mentah dari public/data.json (Rekapan_Narsum_DIT_TSI.json).
//
// CATATAN KUALITAS DATA (silakan cek ulang ke sumber data jika perlu):
// 1. Beberapa nilai teks pada sumber data punya spasi/enter tambahan
//    (mis. "Suratno\n") -> otomatis di-trim oleh normalizeData().
// 2. Ditemukan 1 baris dengan tahun salah ketik: "5 August 0202".
//    Karena seluruh baris lain berada pada rentang Januari-September 2026,
//    parseTanggal() akan mengoreksi tahun yang tidak valid (di luar 2000-2100)
//    menjadi 2026 agar baris tersebut tetap bisa dianalisis (bukan dibuang).
// 3. Ditemukan 2 ejaan nama yang mirip: "Yues Tadrik Hafiyan" dan
//    "Yues Tandrik Hafiyan" (kemungkinan orang yang sama, beda ejaan).
//    Keduanya SENGAJA TIDAK digabungkan otomatis agar analisis tetap jujur
//    terhadap data asli. Jika memang orang yang sama, perbaiki di sumber
//    data (public/data.json) lalu data di dashboard akan ikut ter-update.
// ============================================================================

/**
 * Parse string tanggal format "D MonthName YYYY" (mis. "8 January 2026")
 * menjadi objek Date. Mengoreksi tahun yang jelas tidak valid (typo).
 */
export function parseTanggal(raw) {
  if (!raw) return null
  const str = raw.trim()

  const direct = new Date(str)
  if (!isNaN(direct) && direct.getFullYear() >= 2000 && direct.getFullYear() <= 2100) {
    return direct
  }

  // Fallback: tahun tidak valid (mis. "0202") -> koreksi ke 2026
  const match = str.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{1,4})$/)
  if (match) {
    const [, day, month] = match
    const fixed = new Date(`${day} ${month} 2026`)
    if (!isNaN(fixed)) return fixed
  }

  return null
}

/** Format Date -> "8 Januari 2026" */
export function formatTanggal(date) {
  if (!date) return '-'
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** Format rentang tanggal, dipersingkat jika masih dalam bulan yang sama */
export function formatRentangTanggal(mulai, selesai) {
  if (!mulai || !selesai) return '-'
  if (mulai.toDateString() === selesai.toDateString()) return formatTanggal(mulai)

  const sameMonth = mulai.getMonth() === selesai.getMonth() && mulai.getFullYear() === selesai.getFullYear()
  if (sameMonth) return `${mulai.getDate()} - ${formatTanggal(selesai)}`

  return `${formatTanggal(mulai)} - ${formatTanggal(selesai)}`
}

/** Bersihkan & lengkapi data mentah dari JSON menjadi bentuk siap pakai */
export function normalizeData(raw) {
  return raw
    .map((item, idx) => {
      const nama = (item['Nama'] || '').trim()
      const instansi = (item['Instansi'] || '').trim()
      const topik = (item['Topik'] || '').trim()
      const lokasi = (item['Lokasi'] || '').trim()
      const mode = (item['Mode Pelaksanaan'] || '').trim()
      const tglMulai = parseTanggal(item['Tanggal Mulai'])
      const tglSelesai = parseTanggal(item['Tanggal Selesai'])
      const durasiHari =
        tglMulai && tglSelesai ? Math.round((tglSelesai - tglMulai) / 86400000) + 1 : null

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
        bulanKey: tglMulai
          ? `${tglMulai.getFullYear()}-${String(tglMulai.getMonth() + 1).padStart(2, '0')}`
          : null,
        bulanLabel: tglMulai
          ? tglMulai.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
          : '-',
      }
    })
    .filter((d) => d.nama)
}

/** Statistik ringkasan (kartu KPI) */
export function getStats(data) {
  const total = data.length
  const totalNarasumber = new Set(data.map((d) => d.nama)).size
  const totalInstansi = new Set(data.map((d) => d.instansi)).size
  const online = data.filter((d) => d.mode === 'Online').length
  const offline = data.filter((d) => d.mode === 'Offline').length

  const durasiList = data.filter((d) => d.durasiHari != null).map((d) => d.durasiHari)
  const avgDurasi = durasiList.length ? durasiList.reduce((a, b) => a + b, 0) / durasiList.length : 0

  const tanggalValid = data.filter((d) => d.tglMulai).map((d) => d.tglMulai)
  const tglMin = tanggalValid.length ? new Date(Math.min(...tanggalValid)) : null
  const tglMax = tanggalValid.length ? new Date(Math.max(...tanggalValid)) : null

  return { total, totalNarasumber, totalInstansi, online, offline, avgDurasi, tglMin, tglMax }
}

/** Jumlah kegiatan per narasumber, diurutkan terbanyak -> tersedikit */
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

    item.jumlah += 1;

    if (d.instansi) {
      item.instansi.add(d.instansi);
    }
  });

  return Array.from(map, ([nama, value]) => ({
    nama,
    jumlah: value.jumlah,
    jumlahInstansi: value.instansi.size,
  })).sort((a, b) => {
    // 1. Jumlah kegiatan terbesar
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

/** Distribusi mode pelaksanaan (untuk donut chart) */
export function getModeDistribution(data) {
  const online = data.filter((d) => d.mode === 'Online').length
  const offline = data.filter((d) => d.mode === 'Offline').length
  return [
    { name: 'Online', value: online },
    { name: 'Offline', value: offline },
  ]
}

/** Tren jumlah kegiatan per bulan, dipecah online vs offline */
export function getTrendBulanan(data) {
  const map = new Map()
  data.forEach((d) => {
    if (!d.bulanKey) return
    if (!map.has(d.bulanKey)) {
      map.set(d.bulanKey, { bulanKey: d.bulanKey, bulan: d.bulanLabel, online: 0, offline: 0 })
    }
    const row = map.get(d.bulanKey)
    if (d.mode === 'Online') row.online += 1
    else if (d.mode === 'Offline') row.offline += 1
  })
  return Array.from(map.values())
    .sort((a, b) => a.bulanKey.localeCompare(b.bulanKey))
    .map((r) => ({ ...r, total: r.online + r.offline }))
}

/** Top-N instansi yang paling sering meminta narasumber */
export function getTopInstansi(data, n = 10) {
  const map = new Map()
  data.forEach((d) => map.set(d.instansi, (map.get(d.instansi) || 0) + 1))
  return Array.from(map, ([instansi, jumlah]) => ({ instansi, jumlah }))
    .sort((a, b) => b.jumlah - a.jumlah)
    .slice(0, n)
}

const STOPWORDS = new Set([
  'dan', 'di', 'ke', 'dari', 'yang', 'untuk', 'pada', 'dengan', 'bagi', 'atau', 'ini', 'itu',
  'para', 'adalah', 'dalam', 'oleh', 'akan', 'dapat', 'serta', 'agar', 'guna', 'terhadap',
  'melalui', 'sebagai', 'atas', 'tahun', 'tentang', 'kepada', 'secara', 'lingkup',
  'juga', 'lebih', 'agar', 'dimohon', 'mohon',
])

/** Ekstraksi kata kunci paling sering muncul pada kolom Topik */
export function getTopikKeywords(data, n = 15) {
  const counter = new Map()
  data.forEach((d) => {
    const words = d.topik
      .toLowerCase()
      .replace(/[^a-z\s]/g, ' ')
      .split(/\s+/)
    words.forEach((w) => {
      if (w.length > 3 && !STOPWORDS.has(w)) {
        counter.set(w, (counter.get(w) || 0) + 1)
      }
    })
  })
  return Array.from(counter, ([kata, jumlah]) => ({ kata, jumlah }))
    .sort((a, b) => b.jumlah - a.jumlah)
    .slice(0, n)
}

/** Daftar unik nama narasumber (untuk dropdown filter), terurut alfabet */
export function getNamaList(data) {
  return Array.from(new Set(data.map((d) => d.nama))).sort((a, b) => a.localeCompare(b))
}
