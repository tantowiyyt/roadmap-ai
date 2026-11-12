import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ujian, BATAS_LULUS } from '../data/ujian.js'
import { levels, levelById } from '../data/levels.js'
import { roadmap, roadmapByLevel } from '../roadmap.js'
import RichText from '../components/RichText.jsx'
import Quiz from '../components/Quiz.jsx'
import StatistikBelajar from './StatistikBelajar.jsx'
import { catatJawaban, ringkasanUlang, soalJatuhTempo, dengarUlang, hapusSemuaUlang } from '../ulang.js'

// Skor terbaik disimpan di browser ini saja: { [levelId]: { terbaik, lulus, tanggal } }
const KUNCI = 'roadmap-ai-ujian'
const bacaSkor = () => {
  try { return JSON.parse(localStorage.getItem(KUNCI)) || {} } catch { return {} }
}
const simpanSkor = (data) => {
  try { localStorage.setItem(KUNCI, JSON.stringify(data)) } catch { /* penyimpanan diblokir: abaikan */ }
}

// id materi → { phase, topic } untuk tautan "pelajari lagi"
const lokasi = Object.fromEntries(roadmap.flatMap((p) => p.topics.map((t) => [t.id, { phase: p, topic: t }])))
const persen = (x) => `${Math.round(x * 100)}%`

// Sub-menu halaman ujian
function SubMenu({ aktif }) {
  const [n, setN] = useState(() => ringkasanUlang().jatuhTempo)
  useEffect(() => dengarUlang(() => setN(ringkasanUlang().jatuhTempo)), [])
  return (
    <nav className="subtabs" aria-label="Bagian halaman ujian">
      <a href="#/ujian" className={aktif === 'ujian' ? 'active' : ''}>🎓 Ujian per level</a>
      <a href="#/ujian/acak" className={aktif === 'acak' ? 'active' : ''}>🔀 Latihan acak</a>
      <a href="#/ujian/ulang" className={aktif === 'ulang' ? 'active' : ''}>🧠 Ulang soal{n > 0 && <span className="badge-angka">{n}</span>}</a>
      <a href="#/ujian/pencapaian" className={aktif === 'pencapaian' ? 'active' : ''}>📜 Pencapaian & sertifikat</a>
      <a href="#/ujian/statistik" className={aktif === 'statistik' ? 'active' : ''}>📊 Statistik belajar</a>
    </nav>
  )
}

export default function UjianPage({ levelId, onOpenTopic, done = {} }) {
  const [skor, setSkor] = useState(bacaSkor)
  const catat = (id, nilai) => {
    setSkor((lama) => {
      const sebelum = lama[id]
      const baru = {
        ...lama,
        [id]: {
          terbaik: Math.max(nilai, sebelum?.terbaik ?? 0),
          lulus: (sebelum?.lulus ?? false) || nilai >= BATAS_LULUS,
          tanggal: new Date().toISOString().slice(0, 10),
        },
      }
      simpanSkor(baru)
      return baru
    })
  }

  if (levelId && ujian[levelId]) {
    return <Ujian key={levelId} level={levelById[levelId]} soal={ujian[levelId]} onSelesai={(n) => catat(levelId, n)} onOpenTopic={onOpenTopic} />
  }
  if (levelId === 'ulang') return <div className="page ujian"><SubMenu aktif="ulang" /><UlangSoal /></div>
  if (levelId === 'acak') return <div className="page ujian"><SubMenu aktif="acak" /><LatihanAcak /></div>
  if (levelId === 'statistik') return <div className="page ujian"><SubMenu aktif="statistik" /><StatistikBelajar /></div>
  if (levelId === 'pencapaian') return <div className="page ujian"><SubMenu aktif="pencapaian" /><Pencapaian skor={skor} done={done} /></div>

  return (
    <div className="page ujian">
      <div className="page-head">
        <h2>🎓 Ujian akhir per level</h2>
        <p className="muted">
          Soal berbasis kasus yang menggabungkan materi satu level. Lulus jika nilaimu minimal {persen(BATAS_LULUS)}.
          Setiap jawaban salah disertai pembahasan dan tautan ke materi yang perlu dipelajari lagi.
        </p>
      </div>
      <SubMenu aktif="ujian" />
      <div className="ujian-grid">
        {levels.map((l) => {
          const s = skor[l.id]
          const tahap = roadmapByLevel.find((g) => g.level.id === l.id)?.phases ?? []
          return (
            <a key={l.id} className={`ujian-kartu ${s?.lulus ? 'lulus' : ''}`} href={`#/ujian/${l.id}`} style={{ '--lvl': l.color }}>
              <span className="ujian-kartu-head">
                <span className="ujian-ikon" aria-hidden>{l.icon}</span>
                <span>
                  <span className="ujian-level">Level {levelById[l.id].order}</span>
                  <strong>{l.name}</strong>
                </span>
                {s?.lulus && <span className="ujian-lencana">✓ Lulus</span>}
              </span>
              <span className="muted small">{tahap.map((p) => p.title).join(' · ')}</span>
              <span className="ujian-kartu-foot">
                <span className="small">{ujian[l.id].length} soal</span>
                <span className="small">{s ? <>Skor terbaik <strong>{persen(s.terbaik)}</strong></> : 'Belum dicoba'}</span>
                <span className="ujian-mulai">{s ? 'Ulangi →' : 'Mulai →'}</span>
              </span>
            </a>
          )
        })}
      </div>
    </div>
  )
}

function Ujian({ level, soal, onSelesai, onOpenTopic }) {
  const [jawab, setJawab] = useState({}) // indeks soal → indeks pilihan
  const [i, setI] = useState(0)
  const [selesai, setSelesai] = useState(false)
  const q = soal[i]
  const terjawab = Object.keys(jawab).length

  const kumpulkan = () => {
    soal.forEach((s, k) => { if (jawab[k] !== undefined) catatJawaban(s, jawab[k] === s.answer, `Ujian ${level.name}`) })  // catat ke 🧠 Ulang soal
    const benar = soal.filter((s, k) => jawab[k] === s.answer).length
    onSelesai(benar / soal.length)
    setSelesai(true)
    window.scrollTo(0, 0)
  }
  const ulangi = () => { setJawab({}); setI(0); setSelesai(false) }

  if (selesai) {
    const benar = soal.filter((s, k) => jawab[k] === s.answer).length
    const nilai = benar / soal.length
    const lulus = nilai >= BATAS_LULUS
    const salah = soal.map((s, k) => ({ s, k })).filter(({ s, k }) => jawab[k] !== s.answer)
    return (
      <div className="page ujian" style={{ '--lvl': level.color }}>
        <a className="back" href="#/ujian">← Semua ujian</a>
        <div className={`card ujian-hasil ${lulus ? 'lulus' : 'gagal'}`}>
          <span className="ujian-hasil-ikon" aria-hidden>{lulus ? '🎉' : '💪'}</span>
          <div>
            <span className="ujian-level">{level.icon} Ujian level {level.name}</span>
            <h2>{lulus ? 'Selamat, kamu lulus!' : 'Belum lulus, sedikit lagi!'}</h2>
            <p className="ujian-nilai"><strong>{persen(nilai)}</strong> <span className="muted">({benar} dari {soal.length} benar · batas lulus {persen(BATAS_LULUS)})</span></p>
            <div className="ujian-bar" aria-hidden><span style={{ width: persen(nilai) }} /><i style={{ left: persen(BATAS_LULUS) }} /></div>
          </div>
        </div>

        {salah.length > 0 ? (
          <section className="ujian-bahas">
            <h3 className="proyek-h">Pembahasan {salah.length} soal yang salah</h3>
            {salah.map(({ s, k }) => {
              const lok = lokasi[s.topik]
              return (
                <article key={k} className="ujian-bahas-item">
                  <p><strong>{k + 1}.</strong> <RichText text={s.q} /></p>
                  <p className="ujian-jwb salah">✗ Jawabanmu: {jawab[k] === undefined ? <em>tidak dijawab</em> : <RichText text={s.options[jawab[k]]} />}</p>
                  <p className="ujian-jwb benar">✓ Jawaban benar: <RichText text={s.options[s.answer]} /></p>
                  <p className="muted"><RichText text={s.why} /></p>
                  {lok && (
                    <button className="link ujian-pelajari" onClick={() => onOpenTopic(lok.phase.id, lok.topic.id)}>
                      📚 Pelajari lagi: {lok.topic.title} →
                    </button>
                  )}
                </article>
              )
            })}
          </section>
        ) : (
          <p className="tip-box">Sempurna, semua jawaban benar. Lanjutkan ke level berikutnya! 🚀</p>
        )}

        <div className="pager">
          <button onClick={ulangi}>↺ Ulangi ujian</button>
          <a className="btn primary" href="#/ujian">Pilih ujian lain →</a>
        </div>
      </div>
    )
  }

  return (
    <div className="page ujian" style={{ '--lvl': level.color }}>
      <a className="back" href="#/ujian">← Semua ujian</a>
      <div className="card ujian-soal">
        <div className="ujian-soal-head">
          <span className="ujian-level">{level.icon} Ujian level {level.name}</span>
          <span className="muted small">Soal {i + 1} dari {soal.length} · {terjawab} terjawab</span>
        </div>
        <div className="ujian-titik" role="tablist" aria-label="Lompat ke soal">
          {soal.map((_, k) => (
            <button key={k} role="tab" aria-selected={k === i} aria-label={`Soal ${k + 1}`}
              className={`${k === i ? 'aktif' : ''} ${jawab[k] !== undefined ? 'isi' : ''}`} onClick={() => setI(k)}>
              {k + 1}
            </button>
          ))}
        </div>

        <p className="ujian-pertanyaan"><RichText text={q.q} /></p>
        <div className="ujian-pilihan" role="radiogroup">
          {q.options.map((opt, j) => (
            <button key={j} role="radio" aria-checked={jawab[i] === j}
              className={`ujian-opsi ${jawab[i] === j ? 'dipilih' : ''}`} onClick={() => setJawab({ ...jawab, [i]: j })}>
              <span className="ujian-huruf">{'ABCD'[j]}</span>
              <span><RichText text={opt} /></span>
            </button>
          ))}
        </div>

        <div className="ujian-nav">
          <button onClick={() => setI(i - 1)} disabled={i === 0}>← Sebelumnya</button>
          {i < soal.length - 1 ? (
            <button className="primary" onClick={() => setI(i + 1)}>Berikutnya →</button>
          ) : (
            <button className="primary" onClick={kumpulkan}>
              {terjawab < soal.length ? `Selesai (${soal.length - terjawab} belum dijawab)` : 'Selesai & lihat nilai'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------------- Latihan acak dari semua kuis tahap ----------------
function acak(daftar) { // Fisher–Yates dengan Math.random: urutan berbeda setiap kali
  const a = [...daftar]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function LatihanAcak() {
  const [lvl, setLvl] = useState('semua')
  const [jumlah, setJumlah] = useState(10)
  const pool = roadmap
    .filter((p) => lvl === 'semua' || p.level.id === lvl)
    .flatMap((p) => (p.quiz || []).map((q) => ({ ...q, tahap: p.title })))
  const [set, setSet] = useState(() => ({ id: 0, soal: acak(pool).slice(0, jumlah) }))
  const baru = () => setSet((s) => ({ id: s.id + 1, soal: acak(pool).slice(0, jumlah) }))

  return (
    <div className="card acak">
      <div className="acak-head">
        <div>
          <h3 className="proyek-h">🔀 Latihan acak</h3>
          <p className="muted small">Soal diambil acak dari kuis semua tahap ({pool.length} soal tersedia untuk pilihan ini). Jawaban langsung dinilai beserta pembahasannya.</p>
        </div>
        <button className="primary" onClick={baru}>🔀 Acak soal baru</button>
      </div>
      <div className="chips">
        <button className={`chip ${lvl === 'semua' ? 'active' : ''}`} onClick={() => setLvl('semua')}>Semua level</button>
        {levels.map((l) => (
          <button key={l.id} className={`chip ${lvl === l.id ? 'active' : ''}`} onClick={() => setLvl(l.id)}>{l.icon} {l.name}</button>
        ))}
        <span className="acak-pisah" aria-hidden />
        {[5, 10, 20].map((n) => (
          <button key={n} className={`chip ${jumlah === n ? 'active' : ''}`} onClick={() => setJumlah(n)}>{n} soal</button>
        ))}
      </div>
      <p className="muted small">Pilihan level dan jumlah soal berlaku saat menekan "Acak soal baru".</p>
      <Quiz key={set.id} questions={set.soal} />
    </div>
  )
}

// ---------------- Ringkasan pencapaian & sertifikat ----------------
const KUNCI_NAMA = 'roadmap-ai-nama'
const bacaNama = () => { try { return localStorage.getItem(KUNCI_NAMA) || '' } catch { return '' } }
const bacaProyekSelesai = () => {
  try { return (JSON.parse(localStorage.getItem('roadmap-ai-proyek-selesai')) || []).length } catch { return 0 }
}
const tanggalIndo = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

function Pencapaian({ skor, done }) {
  const [nama, setNama] = useState(bacaNama)
  const [cetak, setCetak] = useState(null)
  const ubahNama = (v) => {
    setNama(v)
    try { localStorage.setItem(KUNCI_NAMA, v) } catch { /* abaikan */ }
  }

  // Cetak hanya sertifikat yang dipilih (lihat CSS @media print)
  useEffect(() => {
    if (!cetak) return
    document.body.classList.add('mencetak')
    const selesai = () => { document.body.classList.remove('mencetak'); setCetak(null) }
    window.addEventListener('afterprint', selesai, { once: true })
    const t = setTimeout(() => window.print(), 50)
    return () => { clearTimeout(t); window.removeEventListener('afterprint', selesai); document.body.classList.remove('mencetak') }
  }, [cetak])

  const perLevel = roadmapByLevel.map(({ level, phases }) => {
    const materi = phases.flatMap((p) => p.topics.map((t) => t.id))
    const selesai = materi.filter((id) => done[id]).length
    return { level, phases, total: materi.length, selesai, hasil: skor[level.id] }
  })
  const totalMateri = perLevel.reduce((n, l) => n + l.total, 0)
  const totalSelesai = perLevel.reduce((n, l) => n + l.selesai, 0)
  const lulus = perLevel.filter((l) => l.hasil?.lulus)

  return (
    <div className="pencapaian">
      <div className="card pencapaian-ringkas">
        <label className="pencapaian-nama">
          <span className="small muted">Nama untuk sertifikat (tersimpan di browser ini)</span>
          <input value={nama} onChange={(e) => ubahNama(e.target.value)} placeholder="Tulis nama lengkapmu" maxLength={60} />
        </label>
        <div className="pencapaian-angka">
          <div><strong>{totalSelesai}/{totalMateri}</strong><span>materi selesai</span></div>
          <div><strong>{lulus.length}/{levels.length}</strong><span>ujian level lulus</span></div>
          <div><strong>{bacaProyekSelesai()}</strong><span>proyek dikerjakan</span></div>
        </div>
      </div>

      <section className="pencapaian-level">
        <h3 className="proyek-h">Progres per level</h3>
        {perLevel.map(({ level, total, selesai, hasil }) => (
          <div key={level.id} className="pl-baris" style={{ '--lvl': level.color }}>
            <span className="pl-nama">{level.icon} {level.name}</span>
            <span className="pl-bar" role="img" aria-label={`${selesai} dari ${total} materi selesai`}><span style={{ width: `${(selesai / total) * 100}%` }} /></span>
            <span className="small muted pl-angka">{selesai}/{total} materi</span>
            <span className={`pl-ujian ${hasil?.lulus ? 'lulus' : ''}`}>
              {hasil ? (hasil.lulus ? `✓ Lulus · ${persen(hasil.terbaik)}` : `Ujian ${persen(hasil.terbaik)}`) : <a href={`#/ujian/${level.id}`}>Ikuti ujian →</a>}
            </span>
          </div>
        ))}
      </section>

      <section className="pencapaian-sertifikat">
        <h3 className="proyek-h">📜 Sertifikat</h3>
        {lulus.length === 0 && (
          <p className="tip-box">Sertifikat sebuah level muncul setelah kamu lulus ujian akhir level itu (nilai minimal {persen(BATAS_LULUS)}).</p>
        )}
        {lulus.map(({ level, phases, hasil }) => (
          <div key={level.id} className="sertifikat-wrap">
            <Sertifikat level={level} phases={phases} hasil={hasil} nama={nama} />
            <button onClick={() => setCetak(level.id)} disabled={!nama.trim()}>
              🖨️ {nama.trim() ? 'Cetak / simpan sebagai PDF' : 'Isi nama dulu untuk mencetak'}
            </button>
          </div>
        ))}
      </section>

      {/* Salinan khusus cetak, langsung di bawah <body> agar halaman lain tidak ikut tercetak */}
      {cetak && createPortal(
        <div className="cetak-portal">
          {lulus.filter((l) => l.level.id === cetak).map(({ level, phases, hasil }) => (
            <Sertifikat key={level.id} level={level} phases={phases} hasil={hasil} nama={nama} />
          ))}
        </div>,
        document.body,
      )}
    </div>
  )
}

function Sertifikat({ level, phases, hasil, nama }) {
  return (
    <article className="sertifikat" style={{ '--lvl': level.color }}>
      <span className="sert-badge" aria-hidden>{level.icon}</span>
      <span className="sert-judul">Sertifikat Penyelesaian Belajar Mandiri</span>
      <span className="sert-kecil">diberikan kepada</span>
      <strong className="sert-nama">{nama.trim() || 'Nama Kamu'}</strong>
      <span className="sert-kecil">yang telah lulus</span>
      <strong className="sert-level">Ujian Akhir Level {levelById[level.id].order}: {level.name}</strong>
      <span className="sert-tahap">{phases.map((p) => p.title).join(' · ')}</span>
      <span className="sert-skor">Skor terbaik {persen(hasil.terbaik)} · {tanggalIndo(hasil.tanggal)}</span>
      <span className="sert-app">Roadmap Belajar AI</span>
      <span className="sert-catatan">Dibuat otomatis oleh aplikasi sebagai bukti belajar mandiri, bukan sertifikat resmi dari lembaga mana pun.</span>
    </article>
  )
}

// ---------------- 🧠 Ulang soal (pengulangan berjarak) ----------------
const LABEL_KOTAK = ['Hari ini', 'Besok', '3 hari', '7 hari', '14 hari', 'Dikuasai']

function UlangSoal() {
  const [ringkas, setRingkas] = useState(() => ringkasanUlang())
  const [sesi, setSesi] = useState(null) // { id, soal[] } saat sedang mengulang
  useEffect(() => dengarUlang(() => setRingkas(ringkasanUlang())), [])

  const mulai = () => {
    const daftar = soalJatuhTempo().map((e) => ({ ...e.soal, tahap: e.sumber }))
    setSesi({ id: Date.now(), soal: daftar })
  }
  const hapus = () => {
    if (window.confirm('Hapus semua data Ulang soal? Riwayat soal yang pernah salah akan hilang.')) { hapusSemuaUlang(); setSesi(null) }
  }

  return (
    <div className="card ulang">
      <div className="acak-head">
        <div>
          <h3 className="proyek-h">🧠 Ulang soal</h3>
          <p className="muted small">
            Soal yang pernah salah di kuis, latihan acak, atau ujian otomatis masuk ke sini. Setiap jawaban benar membuat soal
            pindah ke kotak berikutnya dan muncul lagi dengan jarak lebih lama; jawaban salah mengembalikannya ke kotak pertama.
          </p>
        </div>
        {!sesi && ringkas.jatuhTempo > 0 && <button className="primary" onClick={mulai}>▶ Ulang {ringkas.jatuhTempo} soal hari ini</button>}
      </div>

      <div className="ulang-kotak" role="list" aria-label="Isi kotak pengulangan">
        {ringkas.perKotak.map((n, k) => (
          <div key={k} role="listitem" className={`uk ${k === 5 ? 'dikuasai' : ''} ${n ? 'isi' : ''}`}>
            <strong>{n}</strong>
            <span>{k < 5 ? `Kotak ${k + 1}` : '✓'}</span>
            <small>{LABEL_KOTAK[k]}</small>
          </div>
        ))}
      </div>

      {sesi ? (
        <>
          <Quiz key={sesi.id} questions={sesi.soal} sumber="Ulang soal" />
          <div className="actions">
            <button onClick={() => setSesi(null)}>Selesai mengulang</button>
            {ringkas.jatuhTempo > 0 && <button onClick={mulai}>Ulang lagi yang masih jatuh tempo ({ringkas.jatuhTempo})</button>}
          </div>
        </>
      ) : ringkas.total === 0 ? (
        <p className="tip-box">Belum ada soal yang perlu diulang. Kerjakan kuis tahap, latihan acak, atau ujian; soal yang salah akan muncul di sini.</p>
      ) : ringkas.jatuhTempo === 0 ? (
        <p className="tip-box">🎉 Tidak ada soal yang jatuh tempo hari ini.{ringkas.besok > 0 && ` Besok ada ${ringkas.besok} soal untuk diulang.`}</p>
      ) : null}

      {ringkas.total > 0 && !sesi && (
        <button className="link ulang-hapus" onClick={hapus}>Hapus semua data ulang</button>
      )}
    </div>
  )
}
