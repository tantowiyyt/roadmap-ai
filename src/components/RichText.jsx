import { TeksBeristilah } from './Istilah.jsx'

// Teks sederhana dengan `kode` dan **tebal**.
// Di dalam <LingkupIstilah>, istilah dari kamus otomatis bisa diklik untuk melihat artinya.
export default function RichText({ text }) {
  const parts = String(text).split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
  return parts.map((p, i) => {
    if (p.startsWith('`') && p.endsWith('`')) return <code key={i}>{p.slice(1, -1)}</code>
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}><TeksBeristilah teks={p.slice(2, -2)} /></strong>
    return p ? <TeksBeristilah key={i} teks={p} /> : null
  })
}
