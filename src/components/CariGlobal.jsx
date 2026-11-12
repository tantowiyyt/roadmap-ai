import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { roadmap } from '../roadmap.js'
import { algorithms } from '../data/algorithms.js'
import { glosarium } from '../data/glosarium.js'

// 🔍 Pencarian global: materi, algoritma, istilah kamus, proyek, dan halaman dalam satu kotak.
// Dibuka lewat tombol di baris tab, Ctrl/⌘+K, atau tombol "/" (selama tidak sedang mengetik).

// Huruf kecil, tanpa aksen, tanpa tanda markdown sederhana
const normal = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[*_`#>]/g, '').toLowerCase()
const teksDari = (x) => (Array.isArray(x) ? x.flat(3).map(teksDari).join(' ') : typeof x === 'string' ? x : '')

const HALAMAN = [
  { judul: 'Roadmap', ket: 'Daftar tahap & materi belajar', ikon: '🗺️', hash: '#/roadmap', kata: 'beranda awal tahap materi progres' },
  { judul: 'Ensiklopedia algoritma', ket: '18 algoritma dengan animasi cara kerja', ikon: '🧠', hash: '#/algoritma', kata: 'algoritma animasi' },
  { judul: 'Bank proyek', ket: 'Ide proyek per tahap + cara mendapatkan dataset', ikon: '🛠️', hash: '#/proyek', kata: 'proyek portofolio' },
  { judul: 'Panduan mencari & membuat dataset', ket: 'Sumber data siap pakai, data Indonesia, membuat dataset sendiri', ikon: '🗂️', hash: '#/proyek/dataset', kata: 'dataset data kaggle bps scraping survei' },
  { judul: 'Ujian akhir per level', ket: '12 soal per level, lulus ≥ 75%', ikon: '🎓', hash: '#/ujian', kata: 'ujian tes level' },
  { judul: 'Latihan acak', ket: 'Soal acak dari semua kuis tahap', ikon: '🔀', hash: '#/ujian/acak', kata: 'kuis soal latihan acak' },
  { judul: 'Ulang soal', ket: 'Ulangi soal yang pernah salah (pengulangan berjarak)', ikon: '🧠', hash: '#/ujian/ulang', kata: 'ulang review salah leitner' },
  { judul: 'Statistik belajar', ket: 'Streak, kalender aktivitas, rekap mingguan', ikon: '📊', hash: '#/ujian/statistik', kata: 'statistik streak aktivitas grafik kalender' },
  { judul: 'Pencapaian & sertifikat', ket: 'Ringkasan progres dan sertifikat per level', ikon: '📜', hash: '#/ujian/pencapaian', kata: 'sertifikat pencapaian cetak pdf' },
  { judul: 'Kamus istilah', ket: 'Arti istilah AI + versi bahasa bayi', ikon: '📖', hash: '#/kamus', kata: 'kamus glosarium istilah arti' },
  { judul: 'Playground Python', ket: 'Tulis dan jalankan kode Python bebas', ikon: '🧪', hash: '#/playground', kata: 'playground python kode coba' },
]

// Indeks dibuat sekali. `utama` = judul/nama (bobot tinggi), `isi` = teks lain yang ikut dicari.
const indeksMateri = roadmap.flatMap((p) => p.topics.map((t) => ({
  jenis: 'materi', id: t.id, judul: t.title, ket: t.summary, sumber: `${p.title} · ${p.level?.name || ''}`,
  ikon: '📘', fase: p.id,
  utama: normal(t.title), isi: normal([t.summary, teksDari(t.explain), teksDari(t.uses)].join(' ')),
})))
const indeksAlgo = algorithms.map((a) => ({
  jenis: 'algoritma', id: a.id, judul: a.name, ket: a.tagline, sumber: a.category, ikon: '🧠', hash: `#/algoritma/${a.id}`,
  utama: normal(a.name), isi: normal([a.tagline, a.category, teksDari(a.explain), teksDari(a.uses)].join(' ')),
}))
const indeksIstilah = glosarium.map((g) => ({
  jenis: 'istilah', id: g.id, judul: g.istilah, ket: g.arti, sumber: g.kategori, ikon: '📖', hash: `#/kamus/${g.id}`,
  utama: normal([g.istilah, ...(g.alias || [])].join(' ')), isi: normal([g.arti, g.bayi].join(' ')),
}))
const indeksHalaman = HALAMAN.map((h, i) => ({
  jenis: 'halaman', id: 'h' + i, ...h, sumber: 'Halaman', utama: normal(h.judul), isi: normal(h.ket + ' ' + h.kata),
}))

let indeksProyek = null // data proyek dimuat terpisah saat kotak cari pertama kali dibuka
const muatProyek = () => import('../data/proyek.js').then(({ proyek }) => {
  const namaTahap = Object.fromEntries(roadmap.map((p) => [p.id, p.title]))
  indeksProyek = proyek.map((x) => ({
    jenis: 'proyek', id: x.id, judul: x.judul, ket: x.ringkas, sumber: namaTahap[x.tahap] || 'Proyek', ikon: '🛠️', hash: `#/proyek/${x.id}`,
    utama: normal(x.judul), isi: normal([x.ringkas, teksDari(x.skill), x.dataset?.nama].join(' ')),
  }))
  return indeksProyek
})

const GRUP = [
  { jenis: 'materi', label: 'Materi' },
  { jenis: 'algoritma', label: 'Algoritma' },
  { jenis: 'istilah', label: 'Kamus istilah' },
  { jenis: 'proyek', label: 'Proyek' },
  { jenis: 'halaman', label: 'Halaman' },
]
const MAKS_PER_GRUP = 6

function skor(item, q, kata) {
  if (!kata.every((k) => item.utama.includes(k) || item.isi.includes(k))) return 0
  let s = 1
  if (item.utama === q) s += 200
  else if (item.utama.startsWith(q)) s += 120
  else if (item.utama.includes(q)) s += 70
  for (const k of kata) {
    if (item.utama.includes(k)) s += 20
    if (new RegExp(`(^|[^a-z0-9])${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(item.utama)) s += 10
  }
  return s
}

function cari(qMentah, proyekSiap) {
  const q = normal(qMentah).trim().replace(/\s+/g, ' ')
  if (!q) return []
  const kata = q.split(' ')
  const sumber = { materi: indeksMateri, algoritma: indeksAlgo, istilah: indeksIstilah, proyek: proyekSiap || [], halaman: indeksHalaman }
  return GRUP.map((g) => {
    const cocok = sumber[g.jenis]
      .map((item, i) => ({ item, s: skor(item, q, kata), i }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s || a.i - b.i)
    return { ...g, total: cocok.length, hasil: cocok.slice(0, MAKS_PER_GRUP).map((x) => x.item) }
  }).filter((g) => g.total > 0)
}

// Potongan teks di sekitar kata yang cocok (jika kata itu tidak ada di judul/keterangan)
function cuplikan(item, kata) {
  const ket = item.ket || ''
  if (!kata.length || kata.some((k) => normal(ket).includes(k) || item.utama.includes(k))) return ket
  const k = kata.find((x) => item.isi.includes(x))
  if (!k) return ket
  const i = item.isi.indexOf(k)
  const awal = Math.max(0, i - 50)
  return (awal > 0 ? '…' : '') + item.isi.slice(awal, i + 90).trim() + '…'
}

// Tandai kata yang dicari di dalam teks
function Sorot({ teks, kata }) {
  if (!teks || !kata.length) return teks || null
  const pola = new RegExp(`(${kata.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
  return String(teks).replace(/\*\*|`/g, '').split(pola).map((bagian, i) => (i % 2 ? <mark key={i}>{bagian}</mark> : bagian))
}

export function TombolCari({ onBuka }) {
  const mac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
  return (
    <button type="button" className="tombol-cari" onClick={onBuka} aria-label="Cari materi, algoritma, istilah, proyek" title={`Cari (${mac ? '⌘' : 'Ctrl'}+K atau /)`}>
      <span aria-hidden>🔍</span> <span className="tc-label">Cari</span>
      <kbd className="tc-kbd" aria-hidden>{mac ? '⌘' : 'Ctrl'} K</kbd>
    </button>
  )
}

// Pintasan keyboard global untuk membuka pencarian
export function usePintasanCari(buka) {
  useEffect(() => {
    const onKey = (e) => {
      const ketik = e.target.closest?.('input, textarea, select, [contenteditable="true"], .cm-editor')
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); buka() }
      else if (e.key === '/' && !ketik && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); buka() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [buka])
}

export default function CariGlobal({ terbuka, onTutup, onOpenTopic }) {
  const [q, setQ] = useState('')
  const [aktif, setAktif] = useState(0)
  const [proyekSiap, setProyekSiap] = useState(indeksProyek)
  const input = useRef(null)
  const daftar = useRef(null)
  const fokusSebelum = useRef(null)

  useEffect(() => {
    if (!terbuka) return
    fokusSebelum.current = document.activeElement
    setQ(''); setAktif(0)
    if (!indeksProyek) muatProyek().then(setProyekSiap).catch(() => {})
    const gulirLama = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => input.current?.focus())
    return () => { document.body.style.overflow = gulirLama; fokusSebelum.current?.focus?.() }
  }, [terbuka])

  const kata = useMemo(() => normal(q).trim().split(/\s+/).filter(Boolean), [q])
  const grup = useMemo(() => cari(q, proyekSiap), [q, proyekSiap])
  const datar = useMemo(() => grup.flatMap((g) => g.hasil), [grup])
  const totalSemua = grup.reduce((n, g) => n + g.total, 0)

  useEffect(() => { setAktif(0) }, [q])
  useEffect(() => {
    daftar.current?.querySelector(`[data-i="${aktif}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [aktif])

  if (!terbuka) return null

  const pilih = (item) => {
    onTutup()
    if (item.jenis === 'materi') onOpenTopic(item.fase, item.id)
    else window.location.hash = item.hash
  }

  const onKey = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); onTutup() }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setAktif((i) => Math.min(i + 1, datar.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setAktif((i) => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter' && datar[aktif]) { e.preventDefault(); pilih(datar[aktif]) }
    else if (e.key === 'Tab') { e.preventDefault(); input.current?.focus() } // fokus tetap di dalam kotak
  }

  let n = -1
  return createPortal(
    <div className="cari-latar" onMouseDown={(e) => { if (e.target === e.currentTarget) onTutup() }}>
      <div className="cari-kotak" role="dialog" aria-modal="true" aria-label="Pencarian" onKeyDown={onKey}>
        <div className="cari-kepala">
          <span aria-hidden className="cari-ikon">🔍</span>
          <input
            ref={input} type="search" value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Cari materi, algoritma, istilah, proyek…"
            role="combobox" aria-expanded={datar.length > 0} aria-controls="cari-hasil" aria-autocomplete="list"
            aria-activedescendant={datar[aktif] ? `cari-${aktif}` : undefined}
            autoComplete="off" spellCheck={false} enterKeyHint="search"
          />
          <button type="button" className="cari-tutup" onClick={onTutup} aria-label="Tutup pencarian">Esc</button>
        </div>

        <div className="cari-isi" ref={daftar} id="cari-hasil" role="listbox" aria-label="Hasil pencarian">
          {!kata.length && (
            <div className="cari-kosong">
              <p className="muted small">Coba ketik: <button className="cari-saran" onClick={() => setQ('overfitting')}>overfitting</button>{' '}
                <button className="cari-saran" onClick={() => setQ('pandas')}>pandas</button>{' '}
                <button className="cari-saran" onClick={() => setQ('regresi')}>regresi</button>{' '}
                <button className="cari-saran" onClick={() => setQ('dataset')}>dataset</button></p>
              <p className="cari-grup-judul">Halaman</p>
              <ul className="cari-daftar">
                {HALAMAN.map((h) => (
                  <li key={h.hash}><a className="cari-item" href={h.hash} onClick={onTutup}>
                    <span className="ci-ikon" aria-hidden>{h.ikon}</span>
                    <span className="ci-teks"><strong>{h.judul}</strong><span className="ci-ket">{h.ket}</span></span>
                  </a></li>
                ))}
              </ul>
            </div>
          )}

          {kata.length > 0 && !datar.length && (
            <div className="cari-kosong">
              <p><strong>Tidak ada hasil untuk “{q.trim()}”.</strong></p>
              <p className="muted small">Coba kata yang lebih pendek atau sinonimnya (mis. “klasifikasi” atau “classification”), atau cek ejaannya.</p>
            </div>
          )}

          {grup.map((g) => (
            <section key={g.jenis} aria-label={g.label}>
              <p className="cari-grup-judul">{g.label} <span>{g.total > g.hasil.length ? `${g.hasil.length} dari ${g.total}` : g.total}</span></p>
              <ul className="cari-daftar">
                {g.hasil.map((item) => {
                  n += 1
                  const i = n
                  return (
                    <li key={item.jenis + item.id}>
                      <button
                        type="button" id={`cari-${i}`} data-i={i} role="option" aria-selected={i === aktif}
                        className={`cari-item ${i === aktif ? 'aktif' : ''}`}
                        onMouseMove={() => i !== aktif && setAktif(i)} onClick={() => pilih(item)}
                      >
                        <span className="ci-ikon" aria-hidden>{item.ikon}</span>
                        <span className="ci-teks">
                          <strong><Sorot teks={item.judul} kata={kata} /></strong>
                          <span className="ci-ket"><Sorot teks={cuplikan(item, kata)} kata={kata} /></span>
                        </span>
                        <span className="ci-sumber">{item.sumber}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>

        <div className="cari-kaki muted" aria-hidden>
          {kata.length > 0 && datar.length > 0 && <span>{totalSemua} hasil</span>}
          <span><kbd>↑</kbd><kbd>↓</kbd> pilih</span><span><kbd>Enter</kbd> buka</span><span><kbd>Esc</kbd> tutup</span>
        </div>
      </div>
    </div>,
    document.body,
  )
}
