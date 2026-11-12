// Cadangan (ekspor/impor) SEMUA data aplikasi di browser ini, plus permintaan penyimpanan permanen.
// Semua data memakai kunci localStorage berawalan "roadmap-ai-":
//   roadmap-ai-v1 (progres & catatan), -ujian, -ulang, -proyek-selesai, -nama, -tema, -playground

const AWALAN = 'roadmap-ai-'
const VERSI = 2

function semuaKunci() {
  const kunci = []
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k?.startsWith(AWALAN)) kunci.push(k)
    }
  } catch { /* penyimpanan diblokir */ }
  return kunci.sort()
}

// Buat isi file cadangan
export function buatCadangan() {
  const data = {}
  for (const k of semuaKunci()) data[k] = localStorage.getItem(k)
  return { aplikasi: 'roadmap-belajar-ai', versi: VERSI, dibuat: new Date().toISOString(), data }
}

// Unduh file cadangan bernama roadmap-ai-cadangan-YYYY-MM-DD.json
export function unduhCadangan() {
  const isi = buatCadangan()
  const blob = new Blob([JSON.stringify(isi, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `roadmap-ai-cadangan-${isi.dibuat.slice(0, 10)}.json`
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  return Object.keys(isi.data).length
}

// Pulihkan dari isi file. Mendukung format baru (versi 2) dan format lama ({ done, notes }).
// Mengembalikan jumlah jenis data yang dipulihkan; melempar Error jika file tidak dikenali.
export function pulihkanCadangan(obj) {
  if (obj && obj.aplikasi === 'roadmap-belajar-ai' && obj.data && typeof obj.data === 'object') {
    const entri = Object.entries(obj.data).filter(([k, v]) => k.startsWith(AWALAN) && typeof v === 'string')
    if (!entri.length) throw new Error('kosong')
    for (const [k, v] of entri) localStorage.setItem(k, v)
    return entri.length
  }
  if (obj && (obj.done || obj.notes)) { // file ekspor versi lama: hanya progres roadmap & catatan
    localStorage.setItem(AWALAN + 'v1', JSON.stringify({ done: obj.done || {}, notes: obj.notes || {} }))
    return 1
  }
  throw new Error('format tidak dikenal')
}

// Hapus semua data belajar (tema tampilan dibiarkan)
export function hapusDataBelajar() {
  for (const k of semuaKunci()) if (k !== AWALAN + 'tema') localStorage.removeItem(k)
}

// Minta browser menyimpan data secara permanen (tidak dihapus otomatis saat ruang penyimpanan menipis).
// Dipanggil sekali per sesi, setelah pengguna mulai menyimpan progres.
let sudahDiminta = false
export async function mintaPenyimpananPermanen() {
  if (sudahDiminta || !navigator.storage?.persist) return null
  sudahDiminta = true
  try {
    if (await navigator.storage.persisted()) return true
    return await navigator.storage.persist()
  } catch {
    return null
  }
}

export async function statusPenyimpanan() {
  try {
    return navigator.storage?.persisted ? await navigator.storage.persisted() : null
  } catch {
    return null
  }
}
