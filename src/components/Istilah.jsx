import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { istilahById, polaIstilah, idDariTeks } from '../data/glosarium.js'
import RichText from './RichText.jsx'

// Lingkup penyorotan istilah: setiap istilah hanya disorot pada kemunculan PERTAMA di dalam satu lingkup
// (mis. satu materi), supaya teks tidak penuh garis bawah.
const LingkupContext = createContext(null)

export function LingkupIstilah({ children }) {
  const sudah = new Set() // dibuat ulang setiap render agar urutan sorotan konsisten
  return <LingkupContext.Provider value={sudah}>{children}</LingkupContext.Provider>
}

// Memecah teks biasa dan membungkus istilah yang dikenali dengan <Istilah>
export function TeksBeristilah({ teks }) {
  const sudah = useContext(LingkupContext)
  if (!sudah) return teks
  const hasil = []
  let akhir = 0
  for (const m of teks.matchAll(polaIstilah)) {
    const id = idDariTeks(m[1])
    if (!id || sudah.has(id)) continue
    sudah.add(id)
    if (m.index > akhir) hasil.push(teks.slice(akhir, m.index))
    hasil.push(<Istilah key={m.index} id={id}>{m[1]}</Istilah>)
    akhir = m.index + m[1].length
  }
  if (!hasil.length) return teks
  if (akhir < teks.length) hasil.push(teks.slice(akhir))
  return hasil
}

// Kata yang bisa diklik / disorot untuk menampilkan arti + bahasa bayi
export function Istilah({ id, children }) {
  const g = istilahById[id]
  const [buka, setBuka] = useState(false)
  const [kunci, setKunci] = useState(false)
  const [posisi, setPosisi] = useState(null)
  const tombol = useRef(null)
  const popup = useRef(null)

  useLayoutEffect(() => {
    if (!buka || !tombol.current) return
    const r = tombol.current.getBoundingClientRect()
    const lebar = Math.min(320, window.innerWidth - 24)
    const kiri = Math.max(12, Math.min(r.left + r.width / 2 - lebar / 2, window.innerWidth - lebar - 12))
    const tinggi = popup.current?.offsetHeight ?? 180
    const bawah = r.bottom + 8 + tinggi < window.innerHeight
    setPosisi({ left: kiri, top: bawah ? r.bottom + 8 : r.top - 8 - tinggi, width: lebar })
  }, [buka])

  useEffect(() => {
    if (!buka) return undefined
    const tutup = (e) => {
      if (e.type === 'keydown' && e.key !== 'Escape') return
      if (e.type === 'pointerdown' && (popup.current?.contains(e.target) || tombol.current?.contains(e.target))) return
      setBuka(false); setKunci(false)
    }
    const gulir = () => { if (!kunci) setBuka(false) }
    document.addEventListener('pointerdown', tutup)
    document.addEventListener('keydown', tutup)
    window.addEventListener('scroll', gulir, true)
    return () => {
      document.removeEventListener('pointerdown', tutup)
      document.removeEventListener('keydown', tutup)
      window.removeEventListener('scroll', gulir, true)
    }
  }, [buka, kunci])

  if (!g) return children
  return (
    <>
      <button
        ref={tombol}
        type="button"
        className={`istilah ${buka ? 'on' : ''}`}
        aria-expanded={buka}
        onMouseEnter={() => setBuka(true)}
        onMouseLeave={() => { if (!kunci) setBuka(false) }}
        onFocus={() => setBuka(true)}
        onBlur={() => { if (!kunci) setBuka(false) }}
        onClick={() => { setKunci(!kunci || !buka); setBuka(!kunci || !buka) }}
      >
        {children}
      </button>
      {buka && createPortal(
        <div ref={popup} className="istilah-pop" role="tooltip" style={posisi ?? { left: -9999, top: 0, width: 320 }}
          onMouseEnter={() => setBuka(true)} onMouseLeave={() => { if (!kunci) setBuka(false) }}>
          <KartuIstilah g={g} ringkas />
        </div>,
        document.body,
      )}
    </>
  )
}

// Kotak penjelasan versi bahasa bayi untuk satu materi / algoritma
export function KotakBayi({ data }) {
  if (!data) return null
  return (
    <div className="kotak-bayi">
      <div className="kb-head"><span className="kb-ikon" aria-hidden>👶</span><strong>Versi bahasa bayi</strong></div>
      <p><RichText text={data.cerita} /></p>
      {data.intinya && <p className="kb-intinya"><span aria-hidden>💡</span> <span><strong>Intinya:</strong> {data.intinya}</span></p>}
    </div>
  )
}

// Isi kartu istilah (dipakai di popup, kotak "istilah di materi ini", dan halaman Kamus)
export function KartuIstilah({ g, ringkas = false, tanpaBayi = false, tanpaJudul = false }) {
  return (
    <LingkupContext.Provider value={null}>
    <div className="kartu-istilah">
      {!tanpaJudul && <div className="ki-head">
        <strong>{g.istilah}</strong>
        <span className="tag ki-kat">{g.kategori}</span>
      </div>}
      <p className="ki-arti"><RichText text={g.arti} /></p>
      {!tanpaBayi && <p className="ki-bayi"><span aria-hidden>👶</span> <span><strong>Bahasa bayi:</strong> {g.bayi}</span></p>}
      {ringkas && <a className="ki-link" href={`#/kamus/${g.id}`}>Lihat di kamus →</a>}
    </div>
    </LingkupContext.Provider>
  )
}
