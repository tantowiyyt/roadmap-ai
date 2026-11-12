// Pengulangan berjarak (sistem kotak Leitner) untuk soal yang pernah salah.
// - Soal yang dijawab SALAH di mana pun (kuis tahap, latihan acak, ujian) masuk kotak 1 dan jatuh tempo hari ini.
// - Setiap jawaban BENAR menaikkan kotak; jarak ulang makin panjang: kotak 1 = hari ini, 2 = besok, 3 = 3 hari,
//   4 = 7 hari, 5 = 14 hari. Benar di kotak 5 → "dikuasai" (kotak 6, tidak diulang lagi).
// - Salah lagi → kembali ke kotak 1.
// Data hanya di browser ini (localStorage). Salinan soal ikut disimpan agar bisa ditampilkan ulang.

import { catatSoal } from './aktivitas.js'

const KUNCI = 'roadmap-ai-ulang'
export const JARAK_HARI = { 1: 0, 2: 1, 3: 3, 4: 7, 5: 14 }
export const KOTAK_DIKUASAI = 6
const EVENT = 'ulang-berubah'

// Id soal = hash teks pertanyaan (stabil walaupun urutan pilihan berubah)
export function idSoal(teks) {
  let h = 2166136261
  for (const c of teks) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0
  return h.toString(36)
}

const hariIni = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const tambahHari = (n) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function bacaUlang() {
  try { return JSON.parse(localStorage.getItem(KUNCI)) || {} } catch { return {} }
}
function simpan(data) {
  try { localStorage.setItem(KUNCI, JSON.stringify(data)) } catch { /* penyimpanan diblokir */ }
  window.dispatchEvent(new Event(EVENT))
}

// Catat satu jawaban. `soal` = { q, options, answer, why }, `sumber` = asal soal (mis. nama tahap).
export function catatJawaban(soal, benar, sumber = '') {
  catatSoal(benar) // untuk 📊 Statistik belajar
  const data = bacaUlang()
  const id = idSoal(soal.q)
  const lama = data[id]
  if (!benar) {
    data[id] = {
      soal: { q: soal.q, options: soal.options, answer: soal.answer, why: soal.why, topik: soal.topik },
      sumber: lama?.sumber || sumber,
      kotak: 1,
      jatuhTempo: hariIni(),
      salah: (lama?.salah ?? 0) + 1,
      benar: lama?.benar ?? 0,
    }
  } else if (lama && lama.kotak < KOTAK_DIKUASAI) {
    const kotak = lama.kotak + 1
    data[id] = { ...lama, kotak, benar: lama.benar + 1, jatuhTempo: kotak >= KOTAK_DIKUASAI ? null : tambahHari(JARAK_HARI[kotak]) }
  } else {
    return // benar & belum pernah salah: tidak perlu diulang
  }
  simpan(data)
}

export function soalJatuhTempo(data = bacaUlang()) {
  const hari = hariIni()
  return Object.entries(data)
    .filter(([, e]) => e.kotak < KOTAK_DIKUASAI && e.jatuhTempo <= hari)
    .map(([id, e]) => ({ id, ...e }))
}

export function ringkasanUlang(data = bacaUlang()) {
  const isi = Object.values(data)
  const perKotak = [1, 2, 3, 4, 5, 6].map((k) => isi.filter((e) => e.kotak === k).length)
  const besok = tambahHari(1)
  return {
    total: isi.length,
    jatuhTempo: soalJatuhTempo(data).length,
    besok: isi.filter((e) => e.kotak < KOTAK_DIKUASAI && e.jatuhTempo === besok).length,
    perKotak,
  }
}

export function hapusSemuaUlang() {
  simpan({})
}

// Hook kecil: berlangganan perubahan (juga dari tab lain lewat event 'storage')
export function dengarUlang(cb) {
  const onStorage = (e) => { if (e.key === KUNCI) cb() }
  window.addEventListener(EVENT, cb)
  window.addEventListener('storage', onStorage)
  return () => { window.removeEventListener(EVENT, cb); window.removeEventListener('storage', onStorage) }
}
