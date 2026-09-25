# Dashboard Narasumber Direktorat TSI

Dashboard interaktif untuk menganalisis data rekap narasumber (`Rekapan_Narsum_DIT_TSI.json`).
Dibangun dengan **React 19 + Vite**, chart oleh **Recharts**, ikon oleh **lucide-react**.

## Struktur Folder

```
narasumber-dashboard/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── public/
│   └── data.json              # data mentah (salin dari Rekapan_Narsum_DIT_TSI.json)
└── src/
    ├── main.jsx                # entry point React
    ├── App.jsx                 # komposisi seluruh halaman
    ├── index.css                # design system (light/dark theme, responsive)
    ├── utils/
    │   └── dataUtils.js         # normalisasi data + semua fungsi analisis
    ├── hooks/
    │   └── useNarasumberData.js # fetch data.json + state filter + memoized analytics
    └── components/
        ├── Header.jsx            # judul + toggle dark/light mode
        ├── StatCards.jsx         # 5 kartu ringkasan (KPI)
        ├── FilterBar.jsx         # pencarian + filter mode + filter narasumber
        ├── NarasumberChart.jsx   # bar chart jumlah kegiatan per narasumber (klik = filter)
        ├── ModeDonutChart.jsx    # donut chart Online vs Offline (klik = filter)
        ├── TrendChart.jsx        # stacked bar chart tren bulanan
        ├── InstansiChart.jsx     # top 10 instansi peminta narasumber
        ├── TopikKeywords.jsx     # tag cloud kata kunci topik
        ├── Timeline.jsx          # linimasa kegiatan per bulan
        ├── DataTable.jsx         # tabel lengkap: sortable + pagination
        └── DetailModal.jsx       # detail kegiatan saat baris/kartu diklik
```

## Cara Menjalankan

1. Buat folder project, lalu salin seluruh file sesuai struktur di atas
   (atau ekstrak file-file yang saya kirimkan ke lokasi yang sama).
2. Pastikan file data ada di **`public/data.json`** (sudah saya siapkan, isinya sama
   persis dengan `Rekapan_Narsum_DIT_TSI.json` yang kamu unggah — tidak diubah sedikit pun).
3. Install dependency:
   ```bash
   npm install
   ```
4. Jalankan mode development:
   ```bash
   npm run dev
   ```
   lalu buka `http://localhost:5173`.
5. Build untuk produksi (hasil ada di folder `dist/`):
   ```bash
   npm run build
   npm run preview   # opsional, untuk mencoba hasil build
   ```

## Analisis yang Tersedia di Dashboard

1. **Kartu ringkasan** — total kegiatan, jumlah narasumber aktif, jumlah instansi mitra,
   rasio online:offline, rata-rata durasi kegiatan.
2. **Jumlah kegiatan per narasumber** — siapa yang paling sering diminta jadi pembicara/pengajar.
   Klik salah satu batang untuk memfilter seluruh dashboard ke narasumber tersebut.
3. **Distribusi mode pelaksanaan** — proporsi Online vs Offline (donut chart, bisa diklik).
4. **Tren kegiatan per bulan** — pola naik-turun jumlah kegiatan Jan–Sep 2026, dipecah online/offline.
5. **Top 10 instansi peminta** — instansi/jabatan mana yang paling sering meminta narasumber DIT TSI.
6. **Kata kunci topik** — topik yang paling sering dibahas (SIMAN, RKBMN, BMN, PJJ, dll),
   diekstrak otomatis dari kolom Topik.
7. **Linimasa kegiatan** — daftar kronologis kegiatan, dikelompokkan per bulan.
8. **Tabel data lengkap** — bisa dicari, diurutkan per kolom, dan dipaginasi. Klik baris untuk
   melihat detail (termasuk link Google Maps untuk kegiatan offline).

Semua filter (pencarian, mode, narasumber) saling terhubung — mengubah satu filter akan
memperbarui kartu statistik, semua chart, linimasa, dan tabel secara bersamaan.

## Catatan Kualitas Data

Data sumber punya beberapa ketidakkonsistenan kecil yang ditangani di `src/utils/dataUtils.js`
(silakan cek komentar di bagian atas file tersebut):

- Beberapa nilai teks punya spasi/baris baru tambahan (mis. `"Suratno\n"`) → otomatis di-*trim*.
- Satu baris data punya tahun salah ketik: `"5 August 0202"`. Karena seluruh data lain berada
  di rentang Januari–September 2026, baris ini dikoreksi otomatis menjadi tahun 2026 agar
  tidak terbuang dari analisis.
- Ditemukan 2 ejaan nama yang mirip: **"Yues Tadrik Hafiyan"** dan **"Yues Tandrik Hafiyan"**
  (kemungkinan orang yang sama, beda ejaan di dua kegiatan berbeda). Keduanya **sengaja tidak
  digabung otomatis** supaya analisis tetap jujur terhadap data asli. Kalau memang orang yang
  sama, perbaiki langsung di `public/data.json` — dashboard akan otomatis mengikuti.
- Kolom **Instansi** berisi gabungan jabatan + institusi (mis. "Kepala Biro Keuangan,
  Sekretariat Jenderal, Kementerian Perindustrian"), sehingga chart "Top Instansi" dihitung
  apa adanya per baris teks (tidak diringkas jadi nama kementerian saja), karena mengelompokkan
  otomatis berisiko salah kelompok.

## Kustomisasi Cepat

- **Warna** — ubah variabel CSS di bagian atas `src/index.css` (`--color-primary`, dll).
- **Jumlah baris tabel per halaman** — ubah `PAGE_SIZE` di `src/components/DataTable.jsx`.
- **Jumlah kata kunci topik** — ubah parameter `n` pada pemanggilan `getTopikKeywords` di
  `src/hooks/useNarasumberData.js`.
- **Top-N instansi** — ubah parameter `n` pada `getTopInstansi`.

## Library yang Dipakai

| Library | Kegunaan |
|---|---|
| `react`, `react-dom` | UI |
| `vite`, `@vitejs/plugin-react` | build tool & dev server |
| `recharts` | bar chart, donut chart, stacked bar chart |
| `lucide-react` | ikon |

Tidak ada dependency tambahan di luar itu — semua styling ditulis manual di `index.css`
(tanpa Tailwind) supaya tidak ada risiko konflik versi/konfigurasi saat kamu `npm install`.
