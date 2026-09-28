// ============================================================================
// kategoriTopik.js
// Klasifikasi kolom "Topik" ke dalam 6 kategori (3 utama + 3 lainnya) untuk
// fitur "Topik Terbanyak".
//
// CARA KERJA
// - Setiap undangan/kegiatan dimasukkan ke SATU kategori saja (jadi total semua
//   kategori = total kegiatan dan persentasenya pas 100%).
// - Pencocokan memakai kata kunci pada judul topik (huruf besar/kecil diabaikan)
//   dan dicek berurutan sesuai PRIORITAS_KLASIFIKASI di bawah. Topik yang tidak
//   cocok dengan aturan mana pun masuk ke kategori "Lainnya".
//
// UBAH KATEGORI / KATA KUNCI: cukup edit KATEGORI_TOPIK (label, warna, pattern)
// dan PRIORITAS_KLASIFIKASI (urutan pengecekan).
// ============================================================================

export const KATEGORI_TOPIK = [
  // ----- Kategori utama -----
  {
    id: 'pengelolaan',
    label: 'Pengelolaan BMN',
    kelompok: 'utama',
    icon: 'Boxes',
    color: '#8b5cf6',
    pattern: /pengelolaan|tata kelola|penghapusan/,
  },
  {
    id: 'rkbmn',
    label: 'RKBMN',
    kelompok: 'utama',
    icon: 'ClipboardCheck',
    color: '#3b82f6',
    pattern: /rkbmn|rencana kebutuhan|perencanaan kebutuhan|rp3bmn/,
  },
  {
    id: 'wasdal',
    label: 'Wasdal',
    kelompok: 'utama',
    icon: 'ShieldCheck',
    color: '#14b8a6',
    pattern: /wasdal|pengawasan dan pengendalian|pengawasan, dan pengendalian/,
  },
  // ----- Kategori lainnya -----
  {
    id: 'inventarisasi',
    label: 'Inventarisasi Aset',
    kelompok: 'lainnya',
    icon: 'PackageSearch',
    color: '#f59e0b',
    pattern: /inventarisasi/,
  },
  {
    id: 'siman',
    label: 'Aplikasi SIMAN',
    kelompok: 'lainnya',
    icon: 'Monitor',
    color: '#06b6d4',
    pattern: /siman/,
  },
  {
    id: 'lainnya',
    label: 'Lainnya',
    kelompok: 'lainnya',
    icon: 'Shapes',
    color: '#64748b',
    pattern: null, // penampung semua topik yang tidak cocok aturan mana pun
  },
]

// Urutan pengecekan: kategori utama dicek lebih dulu, "Aplikasi SIMAN" paling
// akhir karena hampir semua judul menyebut SIMAN (jadi hanya menampung yang
// tidak masuk kategori lain).
const PRIORITAS_KLASIFIKASI = ['rkbmn', 'wasdal', 'pengelolaan', 'inventarisasi', 'siman']

const META_BY_ID = new Map(KATEGORI_TOPIK.map((k) => [k.id, k]))

/** Ambil metadata kategori (label, warna, dll) berdasarkan id */
export function getKategoriMeta(id) {
  return META_BY_ID.get(id) || META_BY_ID.get('lainnya')
}

/** Tentukan id kategori dari judul topik */
export function klasifikasiTopik(topik) {
  const t = (topik || '').toLowerCase()
  for (const id of PRIORITAS_KLASIFIKASI) {
    if (META_BY_ID.get(id).pattern.test(t)) return id
  }
  return 'lainnya'
}

/**
 * Hitung jumlah undangan per kategori (dari data yang sudah terfilter).
 * Mengembalikan { total, utama: [...], lainnya: [...] }.
 * Tiap kategori: { id, label, kelompok, icon, color, jumlah, persen, items }.
 */
export function getKategoriTopik(data) {
  const total = data.length
  const rows = KATEGORI_TOPIK.map(({ pattern, ...meta }) => ({ ...meta, items: [] }))
  const byId = new Map(rows.map((r) => [r.id, r]))

  data.forEach((d) => {
    const row = byId.get(d.kategori) || byId.get('lainnya')
    row.items.push(d)
  })

  rows.forEach((r) => {
    r.items.sort((a, b) => (a.tglMulai || 0) - (b.tglMulai || 0))
    r.jumlah = r.items.length
    r.persen = total ? (r.jumlah / total) * 100 : 0
  })

  const utama = rows.filter((r) => r.kelompok === 'utama').sort((a, b) => b.jumlah - a.jumlah)
  // "Lainnya" selalu di urutan paling bawah, sisanya urut terbanyak
  const lainnya = rows
    .filter((r) => r.kelompok === 'lainnya')
    .sort((a, b) => {
      if (a.id === 'lainnya') return 1
      if (b.id === 'lainnya') return -1
      return b.jumlah - a.jumlah
    })

  return { total, utama, lainnya }
}