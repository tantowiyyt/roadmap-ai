// Tema tampilan: 'auto' (ikut sistem), 'light', atau 'dark'.
// Disimpan di localStorage dan dipasang sebagai atribut data-theme di <html>.
// index.html juga memasangnya sebelum React dimuat agar tidak ada kedipan warna.
const KUNCI = 'roadmap-ai-tema'

export const pilihanTema = [
  { id: 'auto', ikon: '🖥️', label: 'Otomatis' },
  { id: 'light', ikon: '☀️', label: 'Terang' },
  { id: 'dark', ikon: '🌙', label: 'Gelap' },
]

export function bacaTema() {
  try {
    const t = localStorage.getItem(KUNCI)
    return t === 'light' || t === 'dark' ? t : 'auto'
  } catch {
    return 'auto'
  }
}

export function pasangTema(tema) {
  const html = document.documentElement
  if (tema === 'light' || tema === 'dark') html.dataset.theme = tema
  else delete html.dataset.theme
  try { localStorage.setItem(KUNCI, tema) } catch { /* penyimpanan diblokir: tema tetap berlaku sampai halaman ditutup */ }
}
