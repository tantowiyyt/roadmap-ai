import { useEffect, useMemo, useState } from 'react'
import { glosarium, kategoriIstilah } from '../data/glosarium.js'
import { roadmap } from '../roadmap.js'
import RichText from '../components/RichText.jsx'

// id materi → { phase, topic } untuk tautan "Dibahas di"
const lokasiMateri = Object.fromEntries(roadmap.flatMap((p) => p.topics.map((t) => [t.id, { phase: p, topic: t }])))
const urut = [...glosarium].sort((a, b) => a.istilah.localeCompare(b.istilah, 'id'))
const hurufAwal = (g) => g.istilah[0].toUpperCase()

export default function KamusPage({ istilahId, onOpenTopic }) {
  const [cari, setCari] = useState('')
  const [kat, setKat] = useState('Semua')
  const [bayiSaja, setBayiSaja] = useState(false)

  const daftar = useMemo(() => {
    const q = cari.trim().toLowerCase()
    return urut.filter((g) => (kat === 'Semua' || g.kategori === kat) &&
      (!q || [g.istilah, ...g.alias, g.arti, g.bayi].join(' ').toLowerCase().includes(q)))
  }, [cari, kat])

  const kelompok = useMemo(() => {
    const m = new Map()
    for (const g of daftar) {
      const h = hurufAwal(g)
      if (!m.has(h)) m.set(h, [])
      m.get(h).push(g)
    }
    return [...m]
  }, [daftar])

  // Dibuka dari tautan "Lihat di kamus": gulir ke istilah itu dan sorot
  useEffect(() => {
    if (!istilahId) return
    setCari(''); setKat('Semua')
    const t = setTimeout(() => {
      const el = document.getElementById(`istilah-${istilahId}`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 80)
    return () => clearTimeout(t)
  }, [istilahId])

  return (
    <div className="page kamus">
      <div className="page-head">
        <h2>📖 Kamus Istilah</h2>
        <p className="muted">
          {glosarium.length} istilah dari seluruh materi, masing-masing dengan arti singkat dan <strong>👶 bahasa bayi</strong>:
          penjelasan paling sederhana memakai perumpamaan sehari-hari.
        </p>
      </div>

      <div className="filters">
        <input type="search" placeholder="Cari istilah… (mis. overfitting, embedding, gradien)" value={cari} onChange={(e) => setCari(e.target.value)} />
        <div className="chips">
          {['Semua', ...kategoriIstilah].map((c) => (
            <button key={c} className={`chip ${kat === c ? 'active' : ''}`} onClick={() => setKat(c)}>{c}</button>
          ))}
        </div>
        <div className="kamus-bar">
          <label className="saklar">
            <input type="checkbox" checked={bayiSaja} onChange={(e) => setBayiSaja(e.target.checked)} />
            <span>👶 Tampilkan bahasa bayi saja</span>
          </label>
          <nav className="huruf" aria-label="Lompat ke huruf">
            {kelompok.map(([h]) => <a key={h} href={`#/kamus`} onClick={(e) => { e.preventDefault(); document.getElementById(`huruf-${h}`)?.scrollIntoView({ behavior: 'smooth' }) }}>{h}</a>)}
          </nav>
        </div>
        {daftar.length > 0 && (cari.trim() || kat !== 'Semua') && (
          <p className="muted small kamus-jumlah">Menampilkan {daftar.length} dari {glosarium.length} istilah</p>
        )}
      </div>

      {daftar.length === 0 && (
        <div className="kamus-kosong">
          <span aria-hidden>🔍</span>
          <p><strong>Istilah tidak ditemukan.</strong></p>
          <p className="muted">Coba kata lain, atau cari dengan bahasa Inggris (mis. "loss", "layer").</p>
          <button className="small-btn" onClick={() => { setCari(''); setKat('Semua') }}>Hapus pencarian &amp; filter</button>
        </div>
      )}

      {kelompok.map(([h, isi]) => (
        <section key={h} className="kamus-grup" id={`huruf-${h}`}>
          <h3 className="kamus-huruf">{h} <span className="kamus-huruf-n">{isi.length} istilah</span></h3>
          <div className={`kamus-grid ${bayiSaja ? 'bayi-saja' : ''}`}>
            {isi.map((g) => {
              const lok = g.topik && lokasiMateri[g.topik]
              return (
                <article key={g.id} id={`istilah-${g.id}`} className={`kamus-kartu ${istilahId === g.id ? 'sorot' : ''}`}>
                  <div className="ki-head">
                    <strong className="kamus-nama">{g.istilah}</strong>
                    <span className="tag ki-kat">{g.kategori}</span>
                  </div>
                  {g.alias.length > 0 && !bayiSaja && <p className="ki-alias">juga disebut: {g.alias.join(', ')}</p>}
                  {!bayiSaja && <p className="ki-arti"><RichText text={g.arti} /></p>}
                  <p className="ki-bayi kamus-bayi"><span aria-hidden>👶</span> <span>{bayiSaja ? g.bayi : <><strong>Bahasa bayi:</strong> {g.bayi}</>}</span></p>
                  {lok && !bayiSaja && (
                    <button className="link kamus-materi" onClick={() => onOpenTopic(lok.phase.id, lok.topic.id)}>
                      {lok.phase.level.icon} Dibahas di: {lok.topic.title} →
                    </button>
                  )}
                </article>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
