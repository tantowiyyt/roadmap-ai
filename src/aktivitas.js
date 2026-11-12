// Catatan aktivitas belajar per hari (untuk 📊 Statistik belajar dan streak 🔥).
// Disimpan di localStorage 'roadmap-ai-aktivitas' (ikut ekspor/impor cadangan otomatis):
//   { 'YYYY-MM-DD': { m: [id materi selesai], p: [id proyek selesai], s: soal dijawab, b: soal benar, k: kode dijalankan } }
// Materi & proyek disimpan sebagai daftar id agar mencentang-hapus centang berulang tidak dihitung dobel.

const KUNCI = 'roadmap-ai-aktivitas'
const EVENT = 'aktivitas-berubah'
const SIMPAN_HARI = 400 // data lebih lama dari ini dibuang agar tidak menumpuk

export const tglKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export const geserHari = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x }
export const hariIni = () => tglKey(new Date())

export function bacaAktivitas() {
  try {
    const d = JSON.parse(localStorage.getItem(KUNCI))
    return d && typeof d === 'object' ? d : {}
  } catch { return {} }
}

function ubahHariIni(fn) {
  const data = bacaAktivitas()
  const k = hariIni()
  const h = { m: [], p: [], s: 0, b: 0, k: 0, ...data[k] }
  fn(h)
  data[k] = h
  const batas = tglKey(geserHari(new Date(), -SIMPAN_HARI))
  for (const t of Object.keys(data)) if (t < batas) delete data[t]
  try { localStorage.setItem(KUNCI, JSON.stringify(data)) } catch { /* penyimpanan diblokir */ }
  window.dispatchEvent(new Event(EVENT))
}

// Materi/proyek dicentang (selesai = true) atau dihapus centangnya (hanya menghapus catatan hari ini)
const ubahDaftar = (kunci) => (id, selesai = true) => ubahHariIni((h) => {
  const ada = h[kunci].includes(id)
  if (selesai && !ada) h[kunci] = [...h[kunci], id]
  if (!selesai && ada) h[kunci] = h[kunci].filter((x) => x !== id)
})
export const catatProyek = ubahDaftar('p')
// Item roadmap: proyek akhir tahap ('project:<tahap>') dihitung sebagai proyek, bukan materi
const catatMateriSaja = ubahDaftar('m')
export const catatMateri = (id, selesai = true) =>
  (String(id).startsWith('project:') ? catatProyek : catatMateriSaja)(id, selesai)
export const catatSoal = (benar) => ubahHariIni((h) => { h.s += 1; if (benar) h.b += 1 })
export const catatKode = () => ubahHariIni((h) => { h.k += 1 })

// Jumlah aktivitas satu hari (dipakai untuk warna kalender)
export const totalHari = (h) => (h ? (h.m?.length || 0) + (h.p?.length || 0) + (h.s || 0) + (h.k || 0) : 0)

// Streak: hari berturut-turut yang ada aktivitasnya. Jika hari ini belum ada aktivitas,
// streak dihitung sampai kemarin (masih bisa dilanjutkan hari ini).
export function hitungStreak(data = bacaAktivitas()) {
  const aktif = (d) => totalHari(data[tglKey(d)]) > 0
  let d = new Date()
  const hariIniAktif = aktif(d)
  if (!hariIniAktif) d = geserHari(d, -1)
  let sekarang = 0
  while (aktif(d)) { sekarang += 1; d = geserHari(d, -1) }

  const tanggal = Object.keys(data).filter((t) => totalHari(data[t]) > 0).sort()
  let terpanjang = 0, jalan = 0, sebelum = null
  for (const t of tanggal) {
    const tgl = new Date(t + 'T00:00:00')
    jalan = sebelum && tglKey(geserHari(sebelum, 1)) === t ? jalan + 1 : 1
    terpanjang = Math.max(terpanjang, jalan)
    sebelum = tgl
  }
  return { sekarang, terpanjang, hariIniAktif, hariAktif: tanggal.length }
}

export function dengarAktivitas(cb) {
  const onStorage = (e) => { if (e.key === KUNCI) cb() }
  window.addEventListener(EVENT, cb)
  window.addEventListener('storage', onStorage)
  return () => { window.removeEventListener(EVENT, cb); window.removeEventListener('storage', onStorage) }
}
