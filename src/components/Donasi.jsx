import { DONASI } from '../config.js'

// Username Saweria hanya boleh huruf, angka, titik, garis bawah, dan tanda hubung
const username = /^[A-Za-z0-9._-]{2,40}$/.test(DONASI.saweria) ? DONASI.saweria : ''
export const tautanSaweria = username ? `https://saweria.co/${encodeURIComponent(username)}` : ''

// Tombol kecil (mis. di footer)
export function TombolDonasi() {
  if (!tautanSaweria) return null
  return (
    <a className="btn donasi-btn" href={tautanSaweria} target="_blank" rel="noopener noreferrer">
      ☕ Dukung via Saweria
    </a>
  )
}

// Kartu ajakan donasi
export function KartuDonasi() {
  if (!tautanSaweria) return null
  return (
    <section className="donasi-kartu">
      <span className="donasi-ikon" aria-hidden>☕</span>
      <div className="donasi-teks">
        <strong>{DONASI.judul}</strong>
        <p>{DONASI.pesan}</p>
      </div>
      <a className="donasi-cta" href={tautanSaweria} target="_blank" rel="noopener noreferrer">
        Traktir via Saweria ↗
      </a>
    </section>
  )
}
