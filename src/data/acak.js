// Mengacak urutan pilihan soal secara deterministik (seed = teks soal):
// posisi jawaban benar bervariasi, tetapi selalu sama setiap kali halaman dibuka.
export function acakTetap(q, options, answer) {
  let h = 2166136261 // hash FNV-1a dari teks soal
  for (const c of q) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0
  const idx = options.map((_, i) => i)
  for (let i = idx.length - 1; i > 0; i--) { // Fisher–Yates dengan generator acak sederhana
    h = (Math.imul(h, 1664525) + 1013904223) >>> 0
    const j = h % (i + 1)
    ;[idx[i], idx[j]] = [idx[j], idx[i]]
  }
  return { options: idx.map((i) => options[i]), answer: idx.indexOf(answer) }
}
