// Isi panjang setiap materi (langkah & contoh kasus, pendalaman, bahasa bayi, latihan tambahan).
// Dimuat terpisah (dynamic import dari Lesson.jsx) saat pengguna pertama kali membuka materi,
// supaya halaman awal tidak perlu mengunduh semuanya. Materi di topics-extra/baru/baru2 menyimpan
// isinya langsung di objek materi; data di sini hanya melengkapi yang belum ada.
import { guidesPython } from './data/guides-python.js'
import { guidesData } from './data/guides-data.js'
import { guidesMl } from './data/guides-ml.js'
import { guidesAdvanced } from './data/guides-advanced.js'
import { deepPython } from './data/deep-python.js'
import { deepData } from './data/deep-data.js'
import { deepMl } from './data/deep-ml.js'
import { deepAdvanced } from './data/deep-advanced.js'
import { bayiMateri } from './data/bayi.js'
import { latihanTambahan } from './data/latihan-extra.js'

const guides = { ...guidesPython, ...guidesData, ...guidesMl, ...guidesAdvanced }
const deeps = { ...deepPython, ...deepData, ...deepMl, ...deepAdvanced }

const cache = new Map()

export function lengkapiMateri(t) {
  if (cache.has(t)) return cache.get(t)
  const extra = deeps[t.id] || {}
  const hasil = {
    ...t,
    ...guides[t.id],
    deep: extra.deep ?? t.deep,
    bayi: bayiMateri[t.id] ?? t.bayi,
    exercise: t.exercise ?? extra.exercise ?? latihanTambahan[t.id],   // latihan asli tidak ditimpa
  }
  cache.set(t, hasil)
  return hasil
}
