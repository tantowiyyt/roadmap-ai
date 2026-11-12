import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Ikon from './components/Ikon.jsx'
import { roadmap, roadmapByLevel, totalItems } from './roadmap.js'
import Lesson from './components/Lesson.jsx'
import Quiz from './components/Quiz.jsx'
import RichText from './components/RichText.jsx'
// Halaman selain Roadmap dimuat terpisah saat dibuka (halaman awal jadi lebih ringan)
const AlgorithmsPage = lazy(() => import('./pages/AlgorithmsPage.jsx'))
const PlaygroundPage = lazy(() => import('./pages/PlaygroundPage.jsx'))
const KamusPage = lazy(() => import('./pages/KamusPage.jsx'))
const ProyekPage = lazy(() => import('./pages/ProyekPage.jsx'))
const UjianPage = lazy(() => import('./pages/UjianPage.jsx'))
const MemuatHalaman = () => <div className="page halaman-memuat muted" role="status"><span className="runner-spin" aria-hidden /> Memuat halaman…</div>

// Jumlah ide proyek per tahap (untuk tautan di kotak "Proyek akhir tahap"); data proyek dimuat terpisah
function useJumlahProyek() {
  const [fn, setFn] = useState(() => () => 0)
  useEffect(() => {
    import('./pages/ProyekPage.jsx').then((m) => setFn(() => m.jumlahProyekTahap)).catch(() => {})
  }, [])
  return fn
}
import { ringkasanUlang, dengarUlang } from './ulang.js'
import { pilihanTema, bacaTema, pasangTema } from './tema.js'
import { unduhCadangan, pulihkanCadangan, hapusDataBelajar, mintaPenyimpananPermanen, statusPenyimpanan } from './cadangan.js'
import { catatMateri, hitungStreak, dengarAktivitas } from './aktivitas.js'
import { KartuDonasi, TombolDonasi } from './components/Donasi.jsx'
import CariGlobal, { TombolCari, usePintasanCari } from './components/CariGlobal.jsx'

const STORAGE_KEY = 'roadmap-ai-v1'
const projectKey = (phaseId) => `project:${phaseId}`
const validKeys = new Set(roadmap.flatMap((p) => [...p.topics.map((t) => t.id), projectKey(p.id)]))

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved && typeof saved === 'object') {
      return { done: saved.done || {}, notes: saved.notes || {}, active: saved.active }
    }
  } catch {
    // data rusak atau localStorage diblokir: mulai dari kosong
  }
  return { done: {}, notes: {}, active: undefined }
}

function phaseStats(phase, done) {
  const keys = [...phase.topics.map((t) => t.id), projectKey(phase.id)]
  const count = keys.filter((k) => done[k]).length
  return { count, total: keys.length, pct: Math.round((count / keys.length) * 100) }
}

// Routing sederhana berbasis hash: #/roadmap, #/algoritma(/<id>), #/proyek(/<id> | /dataset | /<id-tahap>), #/ujian(/<level> | /acak | /ulang | /pencapaian | /statistik), #/kamus(/<id>), #/playground
function useHashRoute() {
  const read = () => window.location.hash.replace(/^#\/?/, '').split('/')
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const onChange = () => {
      setRoute(read())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

// Tombol tema: Otomatis → Terang → Gelap
function TombolTema() {
  const [tema, setTema] = useState(bacaTema)
  const i = pilihanTema.findIndex((t) => t.id === tema)
  const kini = pilihanTema[i]
  const berikut = pilihanTema[(i + 1) % pilihanTema.length]
  const ganti = () => { pasangTema(berikut.id); setTema(berikut.id) }
  return (
    <button className="tombol-tema" onClick={ganti} title={`Tema: ${kini.label}. Klik untuk ${berikut.label}`} aria-label={`Tema ${kini.label}, ganti ke ${berikut.label}`}>
      <Ikon nama={kini.id} /> <span className="tema-label">{kini.label}</span>
    </button>
  )
}

// Jumlah soal 🧠 Ulang soal yang jatuh tempo hari ini (untuk angka di tab Ujian)
function useJatuhTempo() {
  const [n, setN] = useState(() => ringkasanUlang().jatuhTempo)
  useEffect(() => dengarUlang(() => setN(ringkasanUlang().jatuhTempo)), [])
  return n
}

// Cincin progres (SVG) untuk persentase
function ProgressRing({ pct, size = 84, stroke = 8, label }) {
  const r = (size - stroke) / 2
  const keliling = 2 * Math.PI * r
  return (
    <svg className="ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${pct}% selesai`}>
      <circle className="ring-track" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} />
      <circle
        className="ring-fill" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke}
        strokeDasharray={keliling} strokeDashoffset={keliling * (1 - pct / 100)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className="ring-text">{label ?? `${pct}%`}</text>
    </svg>
  )
}

// Streak 🔥 untuk chip di header
function useStreak() {
  const [s, setS] = useState(() => hitungStreak())
  useEffect(() => dengarAktivitas(() => setS(hitungStreak())), [])
  return s
}

export default function App() {
  const [section, param] = useHashRoute()
  const jatuhTempo = useJatuhTempo()
  const streak = useStreak()
  const jumlahProyekTahap = useJumlahProyek()
  const [cariBuka, setCariBuka] = useState(false)
  const bukaCari = useCallback(() => setCariBuka(true), [])
  usePintasanCari(bukaCari)
  const [state, setState] = useState(loadState)
  const [activeId, setActiveId] = useState(state.active || roadmap[0].id)
  const [openTopic, setOpenTopic] = useState(null)
  const [scrollTarget, setScrollTarget] = useState(null)
  const fileInput = useRef(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, active: activeId }))
    } catch {
      // abaikan jika penyimpanan tidak tersedia
    }
  }, [state, activeId])

  // Status penyimpanan permanen (ditampilkan di footer). Diminta setelah pengguna punya progres,
  // agar browser tidak menghapus data ini otomatis saat ruang penyimpanan menipis.
  const [permanen, setPermanen] = useState(null)
  useEffect(() => { statusPenyimpanan().then(setPermanen) }, [])
  const adaProgres = Object.keys(state.done).length > 0 || Object.keys(state.notes).length > 0
  useEffect(() => {
    if (adaProgres && permanen === false) mintaPenyimpananPermanen().then((ok) => { if (ok) setPermanen(true) })
  }, [adaProgres, permanen])

  // Di layar sempit daftar tahap berupa strip horizontal: geser agar tahap aktif terlihat
  useEffect(() => {
    document.querySelector('.phase-item.active')?.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [activeId, section])

  // Gulir ke topik/tahap setelah tampil
  useEffect(() => {
    if (!scrollTarget) return
    const el = document.getElementById(scrollTarget)
    if (!el) return // halaman roadmap belum tampil; coba lagi setelah route berubah
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setScrollTarget(null)
  }, [scrollTarget, section])

  const { done, notes } = state
  const phase = roadmap.find((p) => p.id === activeId) || roadmap[0]
  const phaseIndex = roadmap.indexOf(phase)
  const stats = phaseStats(phase, done)

  const totalTopics = roadmap.reduce((n, p) => n + p.topics.length, 0)
  const totalDone = Object.keys(done).filter((k) => done[k] && validKeys.has(k)).length
  const totalPct = Math.round((totalDone / totalItems) * 100)

  const next = useMemo(() => {
    for (const p of roadmap) {
      const t = p.topics.find((t) => !done[t.id])
      if (t) return { phase: p, topic: t }
      if (!done[projectKey(p.id)]) return { phase: p, topic: null }
    }
    return null
  }, [done])

  const toggle = (key) => {
    catatMateri(key, !done[key])  // 📊 statistik harian
    setState((s) => ({ ...s, done: { ...s.done, [key]: !s.done[key] } }))
  }

  const setAllInPhase = (value) => {
    ;[...phase.topics.map((t) => t.id), projectKey(phase.id)].forEach((k) => { if (!!done[k] !== value) catatMateri(k, value) })
    setState((s) => {
      const d = { ...s.done }
      phase.topics.forEach((t) => (d[t.id] = value))
      d[projectKey(phase.id)] = value
      return { ...s, done: d }
    })
  }

  const setNote = (text) =>
    setState((s) => ({ ...s, notes: { ...s.notes, [phase.id]: text } }))

  const goTo = (phaseId, topicId = null) => {
    if (section !== 'roadmap' && section !== '') window.location.hash = '#/roadmap'
    setActiveId(phaseId)
    setOpenTopic(topicId)
    setScrollTarget(topicId ? `topic-${topicId}` : 'detail')
  }

  // Ekspor SEMUA data (progres, catatan, ujian, ulang soal, proyek, nama, tema, playground) ke satu file
  const exportProgress = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, active: activeId }))  // pastikan versi terbaru ikut
    } catch { /* abaikan */ }
    unduhCadangan()
  }

  const importProgress = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    let isi
    try {
      isi = JSON.parse(await file.text())
    } catch {
      alert('File tidak bisa dibaca. Pilih file .json hasil "Ekspor semua data".')
      return
    }
    if (!confirm('Data di browser ini akan diganti dengan isi file cadangan. Lanjutkan?')) return
    try {
      const n = pulihkanCadangan(isi)
      alert(`Berhasil memulihkan ${n} jenis data. Halaman akan dimuat ulang.`)
      window.location.reload()  // semua halaman membaca ulang data dari penyimpanan
    } catch {
      alert('File tidak dikenali. Pilih file hasil "Ekspor semua data" dari aplikasi ini.')
    }
  }

  const resetAll = () => {
    if (confirm('Hapus SEMUA data belajar di browser ini (progres, catatan, skor ujian, Ulang soal, proyek, nama)? Tindakan ini tidak bisa dibatalkan. Sebaiknya ekspor dulu sebagai cadangan.')) {
      hapusDataBelajar()
      window.location.reload()
    }
  }

  const page = ['algoritma', 'proyek', 'ujian', 'playground', 'kamus'].includes(section) ? section : 'roadmap'

  return (
    <div className="app">
      <header className={`hero ${page !== 'roadmap' ? 'ringkas' : ''}`}>
        <div className="hero-text">
          <span className="hero-badge">🤖 Belajar AI dalam bahasa Indonesia</span>
          <h1>Roadmap Belajar AI</h1>
          <p>Dari Python dasar sampai membangun aplikasi AI, lengkap dengan kode yang bisa langsung dicoba di browser.</p>
          <div className="hero-stats">
            <span><strong>5</strong> level</span>
            <span><strong>{roadmap.length}</strong> tahap</span>
            <span><strong>{totalTopics}</strong> materi</span>
          </div>
        </div>
        <div className="hero-progress">
          <div className="hero-progress-text">
            <span className="hero-progress-title">Progres kamu</span>
            <strong>{totalDone} / {totalItems}<small>item selesai · {totalPct}%</small></strong>
            <span className="hero-bar" role="progressbar" aria-valuenow={totalPct} aria-valuemin={0} aria-valuemax={100} aria-label="Progres keseluruhan"><i style={{ width: `${totalPct}%` }} /></span>
            <a className={`hero-streak ${streak.hariIniAktif ? 'aktif' : ''}`} href="#/ujian/statistik"
              title={streak.sekarang === 0 ? 'Belajar hari ini untuk memulai streak' : streak.hariIniAktif ? 'Streak terjaga hari ini' : 'Belajar hari ini agar streak tidak putus'}>
              🔥 {streak.sekarang > 0 ? `${streak.sekarang} hari beruntun` : 'Mulai streak hari ini'}{streak.sekarang > 0 && !streak.hariIniAktif ? ' · lanjutkan hari ini' : ''}
            </a>
            {next && <span className="hero-level">{next.phase.level.icon} Sekarang di level {next.phase.level.name}</span>}
          </div>
        </div>
      </header>

      <div className="cari-baris-hp"><TombolCari onBuka={bukaCari} /></div>
      <nav className="tabs">
        <a href="#/roadmap" className={page === 'roadmap' ? 'active' : ''}><Ikon nama="roadmap" /> Roadmap</a>
        <a href="#/algoritma" className={page === 'algoritma' ? 'active' : ''}><Ikon nama="algoritma" /> Algoritma</a>
        <a href="#/proyek" className={page === 'proyek' ? 'active' : ''}><Ikon nama="proyek" /> Proyek</a>
        <a href="#/ujian" className={page === 'ujian' ? 'active' : ''}><Ikon nama="ujian" /> Ujian{jatuhTempo > 0 && <span className="badge-angka" title={`${jatuhTempo} soal perlu diulang hari ini`}>{jatuhTempo}</span>}</a>
        <a href="#/kamus" className={page === 'kamus' ? 'active' : ''}><Ikon nama="kamus" /> Kamus</a>
        <a href="#/playground" className={page === 'playground' ? 'active' : ''}><Ikon nama="playground" /> Playground</a>
        <span className="tabs-ujung">
          <span className="cari-di-tab"><TombolCari onBuka={bukaCari} /></span>
          <TombolTema />
        </span>
      </nav>
      <CariGlobal terbuka={cariBuka} onTutup={() => setCariBuka(false)} onOpenTopic={goTo} />

      <Suspense fallback={<MemuatHalaman />}>
        {page === 'algoritma' && <AlgorithmsPage algoId={param} onOpenTopic={goTo} />}
        {page === 'playground' && <PlaygroundPage />}
        {page === 'kamus' && <KamusPage istilahId={param} onOpenTopic={goTo} />}
        {page === 'proyek' && <ProyekPage param={param} onOpenTopic={goTo} />}
        {page === 'ujian' && <UjianPage levelId={param} onOpenTopic={goTo} done={done} />}
      </Suspense>

      {page === 'roadmap' && (
        <>
          {next ? (
            <button
              className="continue"
              style={{ '--lvl': next.phase.level.color }}
              onClick={() => goTo(next.phase.id, next.topic?.id)}
            >
              <span className="continue-icon">{next.phase.level.icon}</span>
              <span className="continue-text">
                <span className="continue-label">Lanjutkan belajar · {next.phase.level.name} · {next.phase.title}</span>
                <strong>{next.topic ? next.topic.title : 'Proyek akhir tahap'}</strong>
              </span>
              <span className="continue-go">Mulai →</span>
            </button>
          ) : (
            <div className="continue finished">🎉 Semua tahap selesai. Saatnya membangun proyekmu sendiri!</div>
          )}

          <div className="layout">
            <nav className="phases" aria-label="Daftar tahap per level">
              {roadmapByLevel.map(({ level, phases }) => (
                <div key={level.id} className="level-group" style={{ '--lvl': level.color }}>
                  <div className="level-head" title={level.desc}>
                    <span className="level-icon">{level.icon}</span>
                    <span className="level-name">
                      <span className="level-order">Level {level.order}</span>
                      <strong>{level.name}</strong>
                    </span>
                    <span className="level-en">{level.en}</span>
                  </div>
                  {phases.map((p) => {
                    const s = phaseStats(p, done)
                    return (
                      <button
                        key={p.id}
                        className={`phase-item ${p.id === phase.id ? 'active' : ''} ${s.pct === 100 ? 'complete' : ''}`}
                        onClick={() => goTo(p.id)}
                      >
                        <span className="phase-num">{s.pct === 100 ? '✓' : roadmap.indexOf(p) + 1}</span>
                        <span className="phase-info">
                          <span className="phase-title">{p.title}</span>
                          <span className="muted small">{p.duration}</span>
                          <span className="bar thin"><span className="bar-fill" style={{ width: `${s.pct}%` }} /></span>
                        </span>
                      </button>
                    )
                  })}
                  <a className="level-ujian" href={`#/ujian/${level.id}`}>
                    <span className="ujian-num" aria-hidden>🎓</span>
                    <span className="phase-info">
                      <span className="phase-title">Ujian akhir</span>
                      <span className="muted small">Level {level.name} · lulus ≥ 75%</span>
                    </span>
                  </a>
                </div>
              ))}
            </nav>

            <main className="detail" id="detail" style={{ '--lvl': phase.level.color }}>
              <div className="detail-head">
                <div className="detail-title">
                  <span className="tag level-tag">
                    {phase.level.icon} Level {phase.level.order} · {phase.level.name} · Tahap {phaseIndex + 1}
                  </span>
                  <h2>{phase.title}</h2>
                  <p>{phase.description}</p>
                  <div className="detail-chips">
                    <span>📚 {phase.topics.length} materi</span>
                    <span>⏱ {phase.duration}</span>
                    <span>🛠 1 proyek</span>
                  </div>
                </div>
                <div className="detail-stats">
                  <ProgressRing pct={stats.pct} size={76} stroke={7} label={`${stats.count}/${stats.total}`} />
                  <span className="muted small">selesai</span>
                </div>
              </div>

              <section>
                <div className="section-head">
                  <h3>Materi</h3>
                  <div className="actions">
                    <button className="small-btn" onClick={() => setAllInPhase(true)}>Tandai semua selesai</button>
                    <button className="small-btn" onClick={() => setAllInPhase(false)}>Kosongkan</button>
                  </div>
                </div>
                <p className="muted small">Klik judul materi untuk membuka penjelasan, contoh kode, dan latihan.</p>
                <ul className="topics">
                  {phase.topics.map((t, i) => {
                    const isOpen = openTopic === t.id
                    return (
                      <li key={t.id} id={`topic-${t.id}`} className={`${done[t.id] ? 'done' : ''} ${isOpen ? 'open' : ''}`}>
                        <div className="topic-row">
                          <input
                            type="checkbox"
                            aria-label={`Tandai ${t.title} selesai`}
                            checked={!!done[t.id]}
                            onChange={() => toggle(t.id)}
                          />
                          <span className="topic-idx" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                          <button
                            className="topic-title"
                            aria-expanded={isOpen}
                            onClick={() => setOpenTopic(isOpen ? null : t.id)}
                          >
                            <span className="topic-name">{t.title}</span>
                            {t.summary && <span className="muted small"><RichText text={t.summary} /></span>}
                          </button>
                          <span className="chev" aria-hidden>{isOpen ? '▴' : '▾'}</span>
                        </div>
                        {isOpen && <Lesson topic={t} done={!!done[t.id]} onToggle={() => toggle(t.id)} />}
                      </li>
                    )
                  })}
                </ul>
              </section>

              <section className={`project ${done[projectKey(phase.id)] ? 'done' : ''}`}>
                <h3>🛠 Proyek akhir tahap</h3>
                <label className="topic-row">
                  <input
                    type="checkbox"
                    checked={!!done[projectKey(phase.id)]}
                    onChange={() => toggle(projectKey(phase.id))}
                  />
                  <span>{phase.project}</span>
                </label>
                {jumlahProyekTahap(phase.id) > 0 && (
                  <a className="project-more" href={`#/proyek/${phase.id}`}>
                    🛠️ Lihat {jumlahProyekTahap(phase.id)} ide proyek untuk tahap ini, lengkap dengan cara mendapatkan datanya →
                  </a>
                )}
              </section>

              {phase.quiz?.length > 0 && (
                <section>
                  <h3>📝 Kuis singkat</h3>
                  <Quiz key={phase.id} questions={phase.quiz} sumber={phase.title} />
                </section>
              )}

              <section>
                <h3>Sumber belajar</h3>
                <ul className="resources">
                  {phase.resources.map((r) => (
                    <li key={r.url}>
                      <a href={r.url} target="_blank" rel="noreferrer">{r.label} ↗</a>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3>Catatan saya</h3>
                <textarea
                  rows={5}
                  placeholder="Tulis ringkasan, kode penting, atau hal yang masih bingung…"
                  value={notes[phase.id] || ''}
                  onChange={(e) => setNote(e.target.value)}
                />
              </section>

              <div className="pager">
                <button disabled={phaseIndex === 0} onClick={() => goTo(roadmap[phaseIndex - 1].id)}>
                  ← Tahap sebelumnya
                </button>
                <button
                  disabled={phaseIndex === roadmap.length - 1}
                  onClick={() => goTo(roadmap[phaseIndex + 1].id)}
                >
                  Tahap berikutnya →
                </button>
              </div>
            </main>
          </div>
        </>
      )}

      <KartuDonasi />

      <footer className="footer">
        <span className="muted small footer-simpan">
          Progres tersimpan otomatis di browser ini{permanen ? ' (penyimpanan permanen aktif ✓)' : ''}.
          Ekspor cadangan sesekali, terutama sebelum ganti perangkat atau menghapus data browser.
        </span>
        <div className="actions">
          <TombolDonasi />
          <button onClick={exportProgress} title="Unduh semua data belajar sebagai file cadangan">⬇️ Ekspor semua data</button>
          <button onClick={() => fileInput.current?.click()} title="Pulihkan dari file cadangan">⬆️ Impor data</button>
          <button className="danger" onClick={resetAll}>Reset</button>
          <input ref={fileInput} type="file" accept="application/json" hidden onChange={importProgress} />
        </div>
      </footer>
    </div>
  )
}
