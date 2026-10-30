# Dashboard Narasumber Direktorat TSI

Dashboard interaktif untuk menganalisis data rekap narasumber.
Dibangun dengan **React 19 + Vite**, chart oleh **Recharts**, ikon oleh **lucide-react**,
export Excel oleh **SheetJS (xlsx)**.

Data bisa diambil dari dua sumber yang bisa diganti langsung dari header:

- **Lokal** — file `public/data.json` (bawaan project, isinya tidak diubah).
- **API Publik** — `GET /` dari API rekapan narsum yang sudah di-hosting, dengan bentuk
  respons yang disamakan dengan `public/data.json` (hanya ada tambahan `id`).

## Struktur Folder

```
narasumber-dashboard/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── public/
│   └── data.json              # data mentah (sumber data "Lokal")
└── src/
    ├── main.jsx                # entry point React
    ├── App.jsx                 # komposisi seluruh halaman
    ├── index.css                # design system (light/dark theme, responsive)
    ├── services/
    │   └── dataSource.js        # sumber data lokal (data.json) + API publik (URL hardcode)
    ├── utils/
    │   ├── dataUtils.js         # normalisasi data + semua fungsi analisis
    │   └── exportXlsx.js        # export data terfilter ke file .xlsx
    ├── hooks/
    │   └── useNarasumberData.js # muat data sesuai sumber + state filter + memoized analytics
    └── components/
        ├── Header.jsx            # judul + switch Lokal/API + toggle dark/light mode
        ├── StatCards.jsx         # 5 kartu ringkasan (KPI)
        ├── FilterBar.jsx         # pencarian + filter mode + filter narasumber + tombol export
        ├── NarasumberChart.jsx   # bar chart jumlah kegiatan per narasumber (klik = filter)
        ├── ModeDonutChart.jsx    # donut chart Online vs Offline (klik = filter)
        ├── TrendChart.jsx        # stacked bar chart tren bulanan
        ├── InstansiChart.jsx     # top 10 instansi peminta narasumber
        ├── TopikTerbanyak.jsx    # topik yang paling sering dibahas
        ├── Timeline.jsx          # linimasa kegiatan per bulan
        ├── DataTable.jsx         # tabel lengkap: sortable + pagination
        └── DetailModal.jsx       # detail kegiatan saat baris/kartu diklik
```

## Cara Menjalankan

1. Install dependency:
   ```bash
   npm install
   ```
2. Jalankan mode development:
   ```bash
   npm run dev
   ```
   lalu buka `http://localhost:5173`.
3. Build untuk produksi (hasil ada di folder `dist/`):
   ```bash
   npm run build
   npm run preview   # opsional, untuk mencoba hasil build
   ```

## Sumber Data: Lokal atau API Publik

Ada switch **Lokal | API** di kanan atas header.

- **Lokal** membaca `public/data.json` lewat `fetch('/data.json')`.
  File ini **tidak diubah** — tetap dipakai apa adanya.
- **API** adalah sumber **default** saat halaman pertama kali dibuka: `GET https://api-rekapan-narsum.vercel.app/`
  (endpoint publik, tanpa token). URL-nya **di-hardcode** di `src/services/dataSource.js`
  (konstanta `API_BASE_URL` / `DEFAULT_SOURCE`), sengaja tidak lewat `.env` supaya tinggal pakai dan
  gampang diganti kalau API pindah host.
- Pilihan sumber disimpan di `localStorage` (key `narsum.dataSource`), jadi saat halaman
  dibuka lagi sumber terakhir yang dipakai otomatis aktif kembali.
- Bentuk respons API dinormalisasi agar identik dengan `public/data.json`: setiap item diberi
  `id` (kalau API belum mengirimnya, dipakai index sebagai `id`), field lain tidak ditambah
  atau diubah. Karena itu semua chart, statistik, linimasa, dan tabel bekerja sama persis
  untuk kedua sumber.
- Kalau API gagal dimuat, halaman menampilkan pesan error beserta tombol **Coba lagi** dan
  **Pakai data lokal**, jadi dashboard tidak pernah blank.

Ganti URL API cukup di satu tempat:

```js
// src/services/dataSource.js
export const API_BASE_URL = "https://api-rekapan-narsum.vercel.app";
```

Endpoint yang dipakai (publik, tanpa login):

```bash
curl https://api-rekapan-narsum.vercel.app/
```

## Export ke Excel (.xlsx)

Tombol **Export XLSX** ada di filter bar, di samping tombol Reset.

- Yang diekspor adalah **data yang sedang tampil** — jadi kalau sedang memakai filter
  pencarian/mode/narasumber, file hanya berisi hasil filter itu. Angka pada tombol export
  menunjukkan jumlah kegiatan yang akan diekspor.
- Kolom file: `No`, `Nama`, `Instansi`, `Topik`, `Tanggal Mulai`, `Tanggal Selesai`,
  `Lokasi`, `Mode Pelaksanaan` — sama seperti data sumber, dengan `No` sebagai nomor urut.
- Tanggal ditulis sebagai tanggal Excel asli (bukan teks) dengan format `dd-mm-yyyy`,
  sehingga bisa diurutkan dan diformat ulang di Excel.
- Header sudah dibekukan (freeze) dan diberi autofilter, lebar kolom sudah diatur.
- Nama file otomatis: `rekapan-narsum-YYYYMMDD-<jumlah>kegiatan.xlsx`.
- SheetJS dimuat on-demand (`await import("xlsx")`) saat tombol diklik, jadi bundle awal
  tetap ringan.

## Analisis yang Tersedia di Dashboard

1. **Kartu ringkasan** — total kegiatan, jumlah narasumber aktif, jumlah instansi mitra,
   rasio online:offline, rata-rata durasi kegiatan.
2. **Jumlah kegiatan per narasumber** — siapa yang paling sering diminta jadi pembicara/pengajar.
   Klik salah satu batang untuk memfilter seluruh dashboard ke narasumber tersebut.
3. **Distribusi mode pelaksanaan** — proporsi Online vs Offline (donut chart, bisa diklik).
4. **Tren kegiatan per bulan** — pola naik-turun jumlah kegiatan per bulan, dipecah online/offline.
5. **Top 10 instansi peminta** — instansi/jabatan mana yang paling sering meminta narasumber DIT TSI.
6. **Topik terbanyak** — topik yang paling sering dibahas.
7. **Linimasa kegiatan** — daftar kronologis kegiatan, dikelompokkan per bulan.
8. **Tabel data lengkap** — bisa dicari, diurutkan per kolom, dan dipaginasi. Klik baris untuk
   melihat detail (termasuk link Google Maps untuk kegiatan offline).

Semua filter (pencarian, mode, narasumber) saling terhubung — mengubah satu filter akan
memperbarui kartu statistik, semua chart, linimasa, tabel, dan isi file export secara bersamaan.

## Catatan Kualitas Data

Data sumber punya beberapa ketidakkonsistenan kecil yang ditangani di `src/utils/dataUtils.js`
(silakan cek komentar di bagian atas file tersebut):

- Beberapa nilai teks punya spasi/baris baru tambahan (mis. `"Suratno\n"`) → otomatis di-*trim*.
- Satu baris data punya tahun salah ketik: `"5 August 0202"`. Karena seluruh data lain berada
  di rentang Januari–Oktober 2026, baris ini dikoreksi otomatis menjadi tahun 2026 agar
  tidak terbuang dari analisis.
- Ditemukan 2 ejaan nama yang mirip: **"Yues Tadrik Hafiyan"** dan **"Yues Tandrik Hafiyan"**
  (kemungkinan orang yang sama, beda ejaan di dua kegiatan berbeda). Keduanya **sengaja tidak
  digabung otomatis** supaya analisis tetap jujur terhadap data asli.
- Kolom **Instansi** berisi gabungan jabatan + institusi (mis. "Kepala Biro Keuangan,
  Sekretariat Jenderal, Kementerian Perindustrian"), sehingga chart "Top Instansi" dihitung
  apa adanya per baris teks (tidak diringkas jadi nama kementerian saja), karena mengelompokkan
  otomatis berisiko salah kelompok.

## Kustomisasi Cepat

- **URL API** — ubah `API_BASE_URL` di `src/services/dataSource.js`.
- **Warna** — ubah variabel CSS di bagian atas `src/index.css` (`--color-primary`, dll).
- **Jumlah baris tabel per halaman** — ubah `PAGE_SIZE` di `src/components/DataTable.jsx`.
- **Top-N instansi** — ubah parameter `n` pada pemanggilan `getTopInstansi`.
- **Nama file export** — ubah `buildFilename()` di `src/utils/exportXlsx.js`.

## Library yang Dipakai

| Library | Kegunaan |
|---|---|
| `react`, `react-dom` | UI |
| `vite`, `@vitejs/plugin-react` | build tool & dev server |
| `recharts` | bar chart, donut chart, stacked bar chart |
| `lucide-react` | ikon |
| `xlsx` (SheetJS) | export data ke file Excel `.xlsx` |

Styling tetap ditulis manual di `index.css` (tanpa Tailwind) supaya tidak ada risiko konflik
versi/konfigurasi saat `npm install`.
