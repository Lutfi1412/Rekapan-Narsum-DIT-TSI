// ============================================================================
// services/dataSource.js
// Dua sumber data untuk dashboard:
//   1. "local" -> file statis public/data.json (bawaan project ini)
//   2. "api"   -> GET / dari API publik rekapan narsum (URL di-hardcode,
//                 sengaja tidak lewat .env supaya bisa langsung dipakai)
//
// Bentuk data dari kedua sumber sengaja dibuat sama seperti public/data.json,
// hanya boleh ada tambahan field `id`.
// ============================================================================

/** URL API publik rekapan narsum (hardcode, bukan dari env). */
export const API_BASE_URL = "https://api-rekapan-narsum.vercel.app";

/** Sumber data default saat halaman pertama kali dibuka. */
export const DEFAULT_SOURCE = "api";

export const DATA_SOURCES = {
  local: {
    id: "local",
    label: "Data Lokal",
    hint: "public/data.json",
  },
  api: {
    id: "api",
    label: "API Publik",
    hint: `${API_BASE_URL}/`,
  },
};

const STORAGE_KEY = "narsum.dataSource";

/** Sumber data tersimpan (default: API publik). */
export function getSavedSource() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved && DATA_SOURCES[saved] ? saved : DEFAULT_SOURCE;
  } catch {
    return DEFAULT_SOURCE;
  }
}

export function saveSource(source) {
  try {
    localStorage.setItem(STORAGE_KEY, source);
  } catch {
    /* localStorage bisa diblokir; abaikan */
  }
}

/**
 * Pastikan bentuknya array seperti data.json dan setiap item punya `id`.
 * Tidak ada field lain yang ditambah/diubah.
 */
function withId(items, sourceLabel) {
  if (!Array.isArray(items)) {
    throw new Error(`Format respons ${sourceLabel} tidak dikenali (bukan array)`);
  }

  return items.map((item, index) => ({
    ...item,
    id: Number.isFinite(item?.id) ? item.id : index,
  }));
}

async function readJson(response, sourceLabel) {
  if (!response.ok) {
    throw new Error(`${sourceLabel} gagal dimuat (HTTP ${response.status})`);
  }
  return response.json();
}

/** Ambil public/data.json apa adanya. */
export async function fetchLocalData() {
  const response = await fetch("/data.json", { cache: "no-store" });
  const json = await readJson(response, "data.json");
  return withId(json, "data.json");
}

/** Ambil GET / dari API publik. */
export async function fetchApiData() {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
  } catch {
    throw new Error("Tidak dapat menghubungi API publik. Periksa koneksi internet.");
  }

  const json = await readJson(response, "API publik");
  return withId(json, "API publik");
}

/** Muat data sesuai sumber yang dipilih. */
export function loadDataSource(source) {
  return source === "api" ? fetchApiData() : fetchLocalData();
}
