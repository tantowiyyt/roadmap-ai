import { useEffect, useMemo, useRef, useState } from 'react'
import CodeRunner from './KodeLazy.jsx'
import RichText from './RichText.jsx'
import { Steps, CaseStudy, DeepDive, CheckQuestions } from './Guide.jsx'
import { algorithms } from '../data/algorithms.js'
import { LingkupIstilah, KartuIstilah, KotakBayi } from './Istilah.jsx'
import { istilahById, istilahDalam } from '../data/glosarium.js'

const algoName = Object.fromEntries(algorithms.map((a) => [a.id, a.name]))

// Tahap yang teksnya statis: istilah di dalamnya disorot agar bisa diklik
const TAHAP_BERISTILAH = new Set(['pahami', 'langkah', 'dalam'])
const bungkus = (id, isi) => (TAHAP_BERISTILAH.has(id) ? <LingkupIstilah>{isi}</LingkupIstilah> : isi)

// Istilah kamus yang muncul di materi ini (untuk kotak "Istilah di materi ini")
function istilahMateri(topic) {
  const teks = [
    topic.title, topic.summary, ...(topic.explain || []), ...(topic.uses || []),
    ...(topic.steps || []).flat(), topic.case?.situation, ...(topic.deep?.concepts || []).flat(2),
  ].filter(Boolean).join(' ')
  return istilahDalam(teks).slice(0, 8).map((id) => istilahById[id])
}

// Satu materi dibagi menjadi tahapan belajar berurutan agar tidak menjadi satu halaman yang sangat panjang.
function buatTahapan(topic) {
  const ex = topic.exercise
  return [
    {
      id: 'pahami', icon: '📖', label: 'Pahami', ada: true,
      tujuan: 'Apa ini dan untuk apa dipakai?',
    },
    {
      id: 'langkah', icon: '🧭', label: 'Langkah & kasus', ada: !!(topic.steps || topic.case),
      tujuan: 'Bagaimana urutan mengerjakannya di dunia nyata?',
    },
    {
      id: 'kode', icon: '▶️', label: 'Coba kode', ada: !!topic.examples?.length,
      tujuan: 'Jalankan, ubah angkanya, lihat apa yang berubah.',
    },
    {
      id: 'dalam', icon: '🔬', label: 'Pendalaman', ada: !!topic.deep,
      tujuan: 'Cara kerja di balik layar dan jebakan yang sering terjadi.',
    },
    {
      id: 'uji', icon: '✍️', label: 'Uji diri', ada: !!(ex || topic.deep?.check?.length),
      tujuan: 'Pastikan kamu benar-benar paham sebelum lanjut.',
    },
  ].filter((t) => t.ada)
}

function hitungMenitBaca(topic) {
  const teks = JSON.stringify([topic.explain, topic.uses, topic.steps, topic.case?.situation, topic.deep?.concepts])
  return Math.max(3, Math.round(teks.split(/\s+/).length / 180) + (topic.examples?.length || 0) * 2)
}

// Isi panjang materi dimuat sekali (satu file terpisah) saat materi pertama kali dibuka
let muatDetail = null
const ambilDetail = () => (muatDetail ??= import('../materi-detail.js').catch((e) => { muatDetail = null; throw e }))

export default function Lesson(props) {
  const [mod, setMod] = useState(null)
  const [gagal, setGagal] = useState(false)
  const [coba, setCoba] = useState(0)
  useEffect(() => {
    let hidup = true
    setGagal(false)
    ambilDetail().then((m) => hidup && setMod(m)).catch(() => hidup && setGagal(true))
    return () => { hidup = false }
  }, [coba])
  const topic = useMemo(() => (mod ? mod.lengkapiMateri(props.topic) : null), [mod, props.topic])

  if (gagal) {
    return (
      <div className="lesson-memuat" role="alert">
        Isi materi gagal dimuat. Periksa koneksi internet, lalu{' '}
        <button className="small-btn" onClick={() => setCoba((n) => n + 1)}>coba lagi</button>
      </div>
    )
  }
  if (!topic) return <div className="lesson-memuat muted" role="status"><span className="runner-spin" aria-hidden /> Memuat materi…</div>
  return <IsiMateri {...props} topic={topic} />
}

function IsiMateri({ topic, done, onToggle }) {
  const tahapan = buatTahapan(topic)
  const [aktif, setAktif] = useState(0)
  const [dikunjungi, setDikunjungi] = useState(() => new Set([0]))
  const [semua, setSemua] = useState(false)
  const atas = useRef(null)
  const pertamaKali = useRef(true)

  useEffect(() => {
    if (pertamaKali.current) { pertamaKali.current = false; return }
    atas.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [aktif])

  const pindah = (i) => {
    setAktif(i)
    setDikunjungi((s) => new Set(s).add(i))
  }

  const isi = {
    pahami: <Pahami topic={topic} />,
    langkah: (
      <>
        {topic.steps && <Steps steps={topic.steps} />}
        {topic.case && <CaseStudy data={topic.case} />}
      </>
    ),
    kode: <Kode topic={topic} />,
    dalam: <DeepDive deep={topic.deep} />,
    uji: (
      <>
        <Latihan ex={topic.exercise} />
        <CheckQuestions items={topic.deep?.check} />
      </>
    ),
  }

  const tombolSelesai = (
    <button className={done ? '' : 'primary'} onClick={onToggle}>
      {done ? '↩ Tandai belum selesai' : '✓ Saya sudah paham materi ini'}
    </button>
  )

  if (semua) {
    return (
      <div className="lesson" ref={atas}>
        <div className="lesson-meta">
          <span className="muted small">⏱ ±{hitungMenitBaca(topic)} menit · semua bagian ditampilkan</span>
          <button className="link" onClick={() => setSemua(false)}>Tampilkan per tahap</button>
        </div>
        {tahapan.map((t) => (
          <section key={t.id} className="stage-all">
            <h4 className="stage-title">{t.icon} {t.label}</h4>
            {bungkus(t.id, isi[t.id])}
          </section>
        ))}
        <div className="lesson-done">{tombolSelesai}</div>
      </div>
    )
  }

  const t = tahapan[aktif]
  const berikut = tahapan[aktif + 1]
  return (
    <div className="lesson" ref={atas}>
      <div className="lesson-meta">
        <span className="muted small">⏱ ±{hitungMenitBaca(topic)} menit · {tahapan.length} tahap</span>
        <button className="link" onClick={() => setSemua(true)}>Tampilkan semua sekaligus</button>
      </div>

      <nav className="stepper" aria-label="Tahap belajar materi ini">
        {tahapan.map((s, i) => (
          <button
            key={s.id}
            className={`step-pill ${i === aktif ? 'active' : ''} ${dikunjungi.has(i) && i !== aktif ? 'seen' : ''}`}
            onClick={() => pindah(i)}
            aria-current={i === aktif ? 'step' : undefined}
          >
            <span className="pill-num">{dikunjungi.has(i) && i !== aktif ? '✓' : i + 1}</span>
            <span className="pill-label">{s.label}</span>
          </button>
        ))}
      </nav>

      <div className="stage-head">
        <h4>{t.icon} {t.label}</h4>
        <p className="muted small">{t.tujuan}</p>
      </div>

      <div className="stage-body">{bungkus(t.id, isi[t.id])}</div>

      <div className="stage-nav">
        <button disabled={aktif === 0} onClick={() => pindah(aktif - 1)}>← Sebelumnya</button>
        {berikut
          ? <button className="primary" onClick={() => pindah(aktif + 1)}>Lanjut: {berikut.label} →</button>
          : tombolSelesai}
      </div>
    </div>
  )
}

function Pahami({ topic }) {
  const istilah = istilahMateri(topic)
  return (
    <>
      <KotakBayi data={topic.bayi} />
      {topic.explain && (
        <div className="lesson-block prose">
          {topic.explain.map((p, i) => <p key={i}><RichText text={p} /></p>)}
        </div>
      )}
      {topic.uses && (
        <div className="lesson-block uses">
          <h4>🎯 Dipakai untuk apa?</h4>
          <ul className="check-list">{topic.uses.map((u, i) => <li key={i}><RichText text={u} /></li>)}</ul>
        </div>
      )}
      {istilah.length > 0 && (
        <div className="lesson-block istilah-materi">
          <h4>📚 Istilah di materi ini</h4>
          <p className="muted small">Kata bergaris titik-titik di teks juga bisa diklik. Klik istilah di bawah untuk melihat arti lengkapnya.</p>
          <div className="istilah-grid">
            {istilah.map((g) => (
              <details key={g.id} className="istilah-item">
                <summary>
                  <strong>{g.istilah}</strong>
                  <span className="muted small">👶 {g.bayi}</span>
                </summary>
                <KartuIstilah g={g} ringkas tanpaBayi tanpaJudul />
              </details>
            ))}
          </div>
        </div>
      )}
      {topic.algos && (
        <div className="lesson-block">
          <h4>🧠 Algoritma terkait</h4>
          <div className="chips">
            {topic.algos.map((id) => (
              <a key={id} className="chip" href={`#/algoritma/${id}`}>{algoName[id] || id}</a>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

function Kode({ topic }) {
  return (
    <>
      <p className="tip-box">💡 Klik <strong>Jalankan</strong>, lalu coba ubah satu angka atau teks dan jalankan lagi. Belajar paling cepat dari melihat apa yang berubah.</p>
      {topic.examples.map((e, i) => (
        <div key={i} className="lesson-block">
          <h4>{e.runnable === false ? '📄' : '▶'} {e.title}</h4>
          {e.runnable === false && <p className="muted small">Hanya ditampilkan: jalankan di komputer sendiri atau Google Colab.</p>}
          <CodeRunner code={e.code} runnable={e.runnable !== false} note={e.note} file={e.file} />
        </div>
      ))}
    </>
  )
}

function Latihan({ ex }) {
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  if (!ex) return null
  return (
    <div className="lesson-block exercise">
      <h4>✍️ Latihan</h4>
      <p><RichText text={ex.task} /></p>
      {ex.runnable === false ? (
        <p className="muted small">💻 Kerjakan latihan ini di komputermu sendiri (terminal, editor, atau Google Colab), lalu bandingkan dengan contoh jawaban.</p>
      ) : (
        <CodeRunner code={'# Tulis jawabanmu di sini lalu klik Jalankan\n'} minHeight="90px" />
      )}
      <div className="actions">
        <button onClick={() => setShowHint(!showHint)}>{showHint ? 'Sembunyikan petunjuk' : '💡 Petunjuk'}</button>
        <button onClick={() => setShowSolution(!showSolution)}>{showSolution ? 'Sembunyikan jawaban' : '🔑 Lihat jawaban'}</button>
      </div>
      {showHint && <p className="hint"><RichText text={ex.hint} /></p>}
      {showSolution && (
        <CodeRunner code={ex.solution} runnable={ex.runnable !== false} file={ex.file}
          note={ex.note || 'Contoh jawaban. Jawabanmu boleh berbeda selama hasilnya sesuai.'} />
      )}
    </div>
  )
}
