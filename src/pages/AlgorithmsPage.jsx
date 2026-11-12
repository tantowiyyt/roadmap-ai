import { lazy, Suspense, useMemo, useState } from 'react'
import { algorithms, categories, chooser } from '../data/algorithms.js'
import { roadmap } from '../roadmap.js'
import CodeRunner from '../components/KodeLazy.jsx'
import RichText from '../components/RichText.jsx'
import { Steps, CaseStudy } from '../components/Guide.jsx'
import { algoGuides } from '../data/algo-guides.js'
import { LingkupIstilah, KotakBayi } from '../components/Istilah.jsx'
import { bayiAlgoritma } from '../data/bayi.js'
import { levels, levelById, algoLevels } from '../data/levels.js'
import MiniAnim from '../animations/mini.jsx'

// Algoritma diurutkan dari level paling mudah (Pemula) sampai paling sulit (Ahli)
const sorted = algorithms
  .map((a) => ({ ...a, level: levelById[algoLevels[a.id]] }))
  .sort((a, b) => a.level.order - b.level.order)
// Animasi dimuat terpisah agar halaman awal tetap ringan
const AlgoAnimation = lazy(() => import('../components/AlgoAnimation.jsx'))

const byId = Object.fromEntries(sorted.map((a) => [a.id, a]))
const algoLevelList = levels.filter((l) => sorted.some((a) => a.level.id === l.id))

const LevelTag = ({ level }) => (
  <span className="tag level-tag" style={{ '--lvl': level.color }}>{level.icon} {level.name}</span>
)

// Ikon & warna per kategori agar kartu mudah dibedakan sekilas
const KATEGORI = {
  'Supervised · Regresi': { icon: '📈', color: '#0284c7' },
  'Supervised · Klasifikasi': { icon: '🏷️', color: '#4f46e5' },
  'Unsupervised': { icon: '🧩', color: '#0d9488' },
  'Deep Learning': { icon: '🧠', color: '#db2777' },
  'Pencarian & Reinforcement': { icon: '🎯', color: '#d97706' },
}
const kat = (c) => KATEGORI[c] || { icon: '🔹', color: '#4f46e5' }

// Topik roadmap yang membahas algoritma tertentu
const topicsFor = (algoId) =>
  roadmap.flatMap((p) =>
    p.topics.filter((t) => t.algos?.includes(algoId)).map((t) => ({ phase: p, topic: t })),
  )

export default function AlgorithmsPage({ algoId, onOpenTopic }) {
  const algo = byId[algoId]
  return algo ? <AlgoDetail algo={algo} onOpenTopic={onOpenTopic} /> : <AlgoList />
}

function AlgoList() {
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('Semua')
  const [lvl, setLvl] = useState('semua')

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return sorted.filter(
      (a) =>
        (cat === 'Semua' || a.category === cat) &&
        (lvl === 'semua' || a.level.id === lvl) &&
        (!q || [a.name, a.tagline, ...a.uses].join(' ').toLowerCase().includes(q)),
    )
  }, [query, cat, lvl])

  return (
    <div className="page">
      <div className="page-head">
        <h2>Ensiklopedia Algoritma</h2>
        <p className="muted">
          {algorithms.length} algoritma penting: cara kerja, kegunaan, kelebihan/kekurangan, dan kode yang bisa langsung dicoba.
        </p>
      </div>

      <section className="card">
        <h3>🧭 Masalahku apa, algoritmanya apa?</h3>
        <div className="chooser">
          {chooser.map((c) => (
            <div key={c.problem} className="chooser-row">
              <span>{c.problem}</span>
              <div className="chips">
                {c.algos.map((id) => (
                  <a key={id} className="chip" href={`#/algoritma/${id}`}>{byId[id].name}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="filters">
        <input
          type="search"
          placeholder="Cari algoritma atau kegunaan… (mis. spam, gambar, harga)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="chips">
          {['Semua', ...categories].map((c) => (
            <button key={c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
        <div className="chips">
          <button className={`chip ${lvl === 'semua' ? 'active' : ''}`} onClick={() => setLvl('semua')}>Semua level</button>
          {algoLevelList.map((l) => (
            <button key={l.id} className={`chip ${lvl === l.id ? 'active' : ''}`} onClick={() => setLvl(l.id)}>
              {l.icon} {l.name} <span className="muted">({l.en})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="algo-grid">
        {list.map((a) => (
          <a key={a.id} className="algo-card" href={`#/algoritma/${a.id}`} style={{ '--cat': kat(a.category).color }}>
            <span className="algo-mini"><MiniAnim id={a.id} /></span>
            <span className="algo-card-top">
              <span className="algo-icon">{kat(a.category).icon}</span>
              <LevelTag level={a.level} />
            </span>
            <strong className="algo-name">{a.name}</strong>
            <span className="algo-cat">{a.category}</span>
            <span className="muted small">{a.tagline}</span>
            <span className="algo-uses small">💡 {a.uses.slice(0, 2).join(' · ')}</span>
            <span className="algo-more">Pelajari →</span>
          </a>
        ))}
        {list.length === 0 && <p className="muted">Tidak ada algoritma yang cocok dengan pencarian.</p>}
      </div>
    </div>
  )
}

function AlgoDetail({ algo, onOpenTopic }) {
  const guide = algoGuides[algo.id]
  const related = topicsFor(algo.id)
  const idx = sorted.indexOf(algo)
  const prev = sorted[idx - 1]
  const next = sorted[idx + 1]

  return (
    <div className="page">
      <a className="back" href="#/algoritma">← Semua algoritma</a>
      <div className="card algo-detail" style={{ '--cat': kat(algo.category).color }}>
        <div className="algo-hero">
          <span className="algo-icon big">{kat(algo.category).icon}</span>
          <div>
            <span className="tags"><LevelTag level={algo.level} /><span className="tag cat-tag">{algo.category}</span></span>
            <h2>{algo.name}</h2>
            <p className="lead">{algo.tagline}</p>
          </div>
        </div>

        <KotakBayi data={bayiAlgoritma[algo.id]} />

        <LingkupIstilah>
          <section>
            <h4>📖 Apa itu?</h4>
            {algo.explain.map((p, i) => <p key={i}><RichText text={p} /></p>)}
          </section>
        </LingkupIstilah>

        <Suspense fallback={<div className="anim anim-loading muted small">Memuat animasi…</div>}>
          <AlgoAnimation key={algo.id} algoId={algo.id} />
        </Suspense>

        <LingkupIstilah>
          <section>
            <h4>⚙️ Cara kerja (konsep)</h4>
            <ol className="steps">{algo.steps.map((s, i) => <li key={i}><RichText text={s} /></li>)}</ol>
          </section>

          {guide && <Steps steps={guide.steps} title="🧭 Langkah penerapan (dari data sampai hasil)" />}
        </LingkupIstilah>

        <section className="uses">
          <h4>🎯 Dipakai untuk apa?</h4>
          <ul>{algo.uses.map((u, i) => <li key={i}>{u}</li>)}</ul>
        </section>

        <div className="proscons">
          <section className="pros">
            <h4>👍 Kelebihan</h4>
            <ul>{algo.pros.map((p, i) => <li key={i}>{p}</li>)}</ul>
          </section>
          <section className="cons">
            <h4>👎 Kekurangan</h4>
            <ul>{algo.cons.map((c, i) => <li key={i}>{c}</li>)}</ul>
          </section>
        </div>

        <section className="when">
          <h4>🤔 Kapan dipakai?</h4>
          <p>{algo.when}</p>
        </section>

        <section>
          <h4>▶ Contoh singkat</h4>
          <CodeRunner code={algo.code} />
        </section>

        {guide && <CaseStudy data={guide.case} />}

        {related.length > 0 && (
          <section>
            <h4>📚 Dibahas di roadmap</h4>
            <div className="chips">
              {related.map(({ phase, topic }) => (
                <button key={topic.id} className="chip" onClick={() => onOpenTopic(phase.id, topic.id)}>
                  {phase.title} → {topic.title}
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="pager">
        {prev ? <a className="btn" href={`#/algoritma/${prev.id}`}>← {prev.name}</a> : <span />}
        {next && <a className="btn" href={`#/algoritma/${next.id}`}>{next.name} →</a>}
      </div>
    </div>
  )
}
