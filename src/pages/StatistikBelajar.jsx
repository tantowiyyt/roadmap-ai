import { useEffect, useMemo, useRef, useState } from 'react'
import { bacaAktivitas, dengarAktivitas, hitungStreak, totalHari, tglKey, geserHari } from '../aktivitas.js'

const MINGGU = 26 // kalender ±6 bulan terakhir
const SEL = 12, JARAK = 3, KIRI = 26, ATAS = 18
const NAMA_HARI = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

// 0 = kosong, 1..4 = makin banyak aktivitas
const tingkat = (n) => (n === 0 ? 0 : n <= 2 ? 1 : n <= 5 ? 2 : n <= 10 ? 3 : 4)
const fmtTgl = (d, opsi = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) => d.toLocaleDateString('id-ID', opsi)

function rincian(h) {
  if (!totalHari(h)) return 'Belum ada aktivitas'
  const bagian = []
  if (h.m?.length) bagian.push(`${h.m.length} materi selesai`)
  if (h.s) bagian.push(`${h.s} soal (${h.b} benar)`)
  if (h.k) bagian.push(`${h.k}× kode dijalankan`)
  if (h.p?.length) bagian.push(`${h.p.length} proyek selesai`)
  return bagian.join(' · ')
}

// Jumlahkan aktivitas pada rentang hari [dari, sampai) relatif hari ini (0 = hari ini)
function jumlahRentang(data, dari, sampai) {
  const r = { m: 0, s: 0, b: 0, k: 0, p: 0, hari: 0 }
  for (let i = dari; i < sampai; i++) {
    const h = data[tglKey(geserHari(new Date(), -i))]
    if (!h) continue
    r.m += h.m?.length || 0; r.p += h.p?.length || 0; r.s += h.s || 0; r.b += h.b || 0; r.k += h.k || 0
    if (totalHari(h)) r.hari += 1
  }
  return r
}

function Kalender({ data }) {
  const [hover, setHover] = useState(null) // { x, y, d, h }
  const hariIni = new Date()
  const indeksHari = (d) => (d.getDay() + 6) % 7 // Senin = 0
  const mulai = geserHari(hariIni, -indeksHari(hariIni) - (MINGGU - 1) * 7)

  const sel = []
  const bulan = []
  for (let w = 0; w < MINGGU; w++) {
    const awalMinggu = geserHari(mulai, w * 7)
    if (w === 0 || awalMinggu.getDate() <= 7) bulan.push({ w, label: fmtTgl(awalMinggu, { month: 'short' }) })
    for (let r = 0; r < 7; r++) {
      const d = geserHari(mulai, w * 7 + r)
      if (d > hariIni) break
      const h = data[tglKey(d)]
      sel.push({ w, r, d, h, n: totalHari(h), kini: tglKey(d) === tglKey(hariIni) })
    }
  }
  // Label bulan pertama dibuang jika terlalu dekat dengan label berikutnya
  if (bulan.length > 1 && bulan[1].w - bulan[0].w < 3) bulan.shift()

  const lebar = KIRI + MINGGU * (SEL + JARAK)
  const tinggi = ATAS + 7 * (SEL + JARAK)
  // Posisi tooltip dihitung dari kotak yang ditunjuk relatif ke wadah (aman saat kalender digeser di HP)
  const tunjuk = (e, c) => {
    const wadah = e.currentTarget.closest('.stat-kalender').getBoundingClientRect()
    const kotak = e.currentTarget.getBoundingClientRect()
    const x = kotak.left + kotak.width / 2 - wadah.left
    setHover({ ...c, x: Math.min(Math.max(x, 110), wadah.width - 110), y: kotak.top - wadah.top })
  }
  // Di layar sempit kalender bisa digeser; mulai dari ujung kanan (minggu terbaru)
  const gulir = useRef(null)
  useEffect(() => { if (gulir.current) gulir.current.scrollLeft = gulir.current.scrollWidth }, [])

  return (
    <div className="stat-kalender" onMouseLeave={() => setHover(null)}>
      <div className="stat-gulir" ref={gulir} onScroll={() => setHover(null)} tabIndex={0} aria-label="Kalender aktivitas, bisa digeser">
      <svg viewBox={`0 0 ${lebar} ${tinggi}`} role="img" aria-label={`Kalender aktivitas ${MINGGU} minggu terakhir. Rincian per hari ada di tabel di bawah.`}>
        {bulan.map((b) => (
          <text key={b.w} x={KIRI + b.w * (SEL + JARAK)} y={11} className="stat-sumbu">{b.label}</text>
        ))}
        {[0, 2, 4].map((r) => (
          <text key={r} x={0} y={ATAS + r * (SEL + JARAK) + SEL - 2} className="stat-sumbu">{NAMA_HARI[r]}</text>
        ))}
        {sel.map((c) => (
          <rect
            key={c.w * 7 + c.r}
            x={KIRI + c.w * (SEL + JARAK)} y={ATAS + c.r * (SEL + JARAK)} width={SEL} height={SEL} rx={2.5}
            className={`stat-sel t${tingkat(c.n)} ${c.kini ? 'kini' : ''} ${hover && hover.d === c.d ? 'disorot' : ''}`}
            onMouseEnter={(e) => tunjuk(e, c)}
            onClick={(e) => tunjuk(e, c)}
          />
        ))}
      </svg>
      </div>
      {hover && (
        <div className="stat-tooltip" style={{ left: hover.x, top: hover.y }} role="status">
          <strong>{fmtTgl(hover.d)}</strong>
          <span>{rincian(hover.h)}</span>
        </div>
      )}
      <div className="stat-legenda" aria-hidden>
        <span>Sedikit</span>
        {[0, 1, 2, 3, 4].map((t) => <i key={t} className={`t${t}`} />)}
        <span>Banyak</span>
      </div>
    </div>
  )
}

function Ubin({ ikon, angka, label, sub }) {
  return (
    <div className="stat-ubin">
      <span className="stat-ubin-label">{ikon} {label}</span>
      <strong>{angka}</strong>
      {sub && <span className="stat-ubin-sub">{sub}</span>}
    </div>
  )
}

export default function StatistikBelajar() {
  const [data, setData] = useState(bacaAktivitas)
  useEffect(() => dengarAktivitas(() => setData(bacaAktivitas())), [])
  const streak = useMemo(() => hitungStreak(data), [data])
  const minggu = jumlahRentang(data, 0, 7)
  const mingguLalu = jumlahRentang(data, 7, 14)
  const akurasi = minggu.s ? Math.round((minggu.b / minggu.s) * 100) : null
  const kosong = streak.hariAktif === 0

  const empatBelas = Array.from({ length: 14 }, (_, i) => {
    const d = geserHari(new Date(), -i)
    return { d, h: data[tglKey(d)] }
  })

  return (
    <div className="statistik">
      <div className="card stat-kepala">
        <div>
          <h3 className="proyek-h">📊 Statistik belajar</h3>
          <p className="muted small">
            Dihitung otomatis sejak fitur ini ada: materi dan proyek yang dicentang selesai, soal yang dijawab (kuis, latihan acak,
            ujian, ulang soal), dan kode yang dijalankan. Satu aktivitas saja sudah cukup untuk menjaga streak hari itu.
          </p>
        </div>
        <div className={`stat-streak ${streak.hariIniAktif ? 'aktif' : ''}`}>
          <span className="stat-api" aria-hidden>🔥</span>
          <strong>{streak.sekarang}</strong>
          <span>hari beruntun</span>
          <em>{streak.hariIniAktif ? 'Hari ini sudah belajar ✓' : streak.sekarang > 0 ? 'Belajar hari ini agar tidak putus' : 'Belajar hari ini untuk memulai'}</em>
        </div>
      </div>

      {kosong && (
        <p className="tip-box">Belum ada aktivitas yang tercatat. Coba jalankan satu contoh kode, jawab kuis, atau centang materi yang sudah selesai, lalu kembali ke sini.</p>
      )}

      <div className="stat-ubin-grid">
        <Ubin ikon="🏆" label="Streak terpanjang" angka={`${streak.terpanjang} hari`} />
        <Ubin ikon="📅" label="Hari aktif (7 hari)" angka={`${minggu.hari}/7`} sub={`minggu lalu ${mingguLalu.hari}/7 · total ${streak.hariAktif} hari`} />
        <Ubin ikon="📚" label="Materi selesai (7 hari)" angka={minggu.m} sub={`minggu lalu ${mingguLalu.m}`} />
        <Ubin ikon="📝" label="Soal dijawab (7 hari)" angka={minggu.s} sub={akurasi === null ? `minggu lalu ${mingguLalu.s}` : `${akurasi}% benar · minggu lalu ${mingguLalu.s}`} />
        <Ubin ikon="▶️" label="Kode dijalankan (7 hari)" angka={minggu.k} sub={`minggu lalu ${mingguLalu.k}`} />
      </div>

      <section className="card">
        <h3 className="proyek-h">Kalender aktivitas · {MINGGU} minggu terakhir</h3>
        <p className="muted small">Setiap kotak satu hari; makin gelap, makin banyak aktivitas. Arahkan kursor atau ketuk kotak untuk melihat rinciannya.</p>
        <Kalender data={data} />
      </section>

      <details className="card stat-tabel">
        <summary>Rincian 14 hari terakhir (tabel)</summary>
        <div className="stat-tabel-gulir">
          <table>
            <thead>
              <tr><th>Tanggal</th><th>Materi</th><th>Soal (benar)</th><th>Kode</th><th>Proyek</th></tr>
            </thead>
            <tbody>
              {empatBelas.map(({ d, h }) => (
                <tr key={tglKey(d)} className={totalHari(h) ? '' : 'kosong'}>
                  <td>{fmtTgl(d, { weekday: 'short', day: 'numeric', month: 'short' })}</td>
                  <td>{h?.m?.length || 0}</td>
                  <td>{h?.s || 0} ({h?.b || 0})</td>
                  <td>{h?.k || 0}</td>
                  <td>{h?.p?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}
