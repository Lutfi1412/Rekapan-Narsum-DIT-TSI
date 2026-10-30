// ============================================================================
// utils/exportXlsx.js
// Export data (hasil filter) ke file .xlsx memakai SheetJS.
// Kolom mengikuti data.json + kolom "No" berisi nomor urut.
// ============================================================================

/* SheetJS dimuat on-demand supaya bundle utama tetap ringan. */

const HEADERS = [
  "No",
  "Nama",
  "Instansi",
  "Topik",
  "Tanggal Mulai",
  "Tanggal Selesai",
  "Lokasi",
  "Mode Pelaksanaan",
];

const COLUMN_WIDTHS = [6, 24, 42, 60, 16, 16, 42, 18];

const DATE_COLUMNS = [4, 5]; // index kolom Tanggal Mulai & Tanggal Selesai

/** Nama file default: rekapan-narsum-YYYYMMDD-Nkegiatan.xlsx */
export function buildFilename(count) {
  const now = new Date();
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");

  return `rekapan-narsum-${stamp}-${count}kegiatan.xlsx`;
}

/** Normalisasi tanggal ke tengah malam UTC agar nilai sel bersih. */
function toDateCell(value) {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return "";
  return new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
}

/** Ubah data hasil normalisasi menjadi baris siap ekspor. */
export function buildRows(data) {
  return data.map((item, index) => ({
    No: index + 1,
    Nama: item.nama ?? "",
    Instansi: item.instansi ?? "",
    Topik: item.topik ?? "",
    "Tanggal Mulai": toDateCell(item.tglMulai),
    "Tanggal Selesai": toDateCell(item.tglSelesai),
    Lokasi: item.lokasi ?? "",
    "Mode Pelaksanaan": item.mode ?? "",
  }));
}

/**
 * Buat & unduh file xlsx.
 * @returns {string} nama file yang diunduh
 */
export async function exportToXlsx(data, options = {}) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Tidak ada data untuk diekspor");
  }

  const XLSX = await import("xlsx");
  const rows = buildRows(data);
  const worksheet = XLSX.utils.json_to_sheet(rows, {
    header: HEADERS,
    cellDates: true,
  });

  worksheet["!cols"] = COLUMN_WIDTHS.map((wch) => ({ wch }));

  // Format tanggal jadi dd-mm-yyyy agar rapi di Excel
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  for (let row = range.s.r + 1; row <= range.e.r; row += 1) {
    DATE_COLUMNS.forEach((col) => {
      const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })];
      if (cell && cell.t === "d") cell.z = "dd-mm-yyyy";
    });
  }

  worksheet["!autofilter"] = { ref: worksheet["!ref"] };
  worksheet["!freeze"] = { xSplit: "0", ySplit: "1" };

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Rekapan Narsum");

  const filename = options.filename || buildFilename(rows.length);
  XLSX.writeFile(workbook, filename);

  return filename;
}
