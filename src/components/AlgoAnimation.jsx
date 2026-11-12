import { useEffect, useMemo, useState } from 'react'
import RichText from './RichText.jsx'
import { animations } from '../animations/index.js'
import { W, H } from '../animations/kit.jsx'

const KECEPATAN = [0.5, 1, 2]

// Simbol kecil untuk legenda, memakai bentuk & warna yang sama dengan animasi
function SimbolLegenda({ item }) {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden>
      {item.c === 0 && <circle className="an-mark an-c0" cx="9" cy="7" r="5" />}
      {item.c === 1 && <rect className="an-mark an-c1" x="4" y="2" width="10" height="10" rx="1.5" />}
      {item.c === 2 && <polygon className="an-mark an-c2" points="9,1 15,12 3,12" />}
      {item.line && <line className="an-line an-model" x1="1" y1="7" x2="17" y2="7" />}
      {item.dash && <line className="an-resid" x1="1" y1="7" x2="17" y2="7" />}
      {item.band && <rect className="an-band" x="1" y="3" width="16" height="8" />}
      {item.star && <polygon className="an-mark an-cn" points="9,1 11,5.5 16,6 12,9 13.5,13.5 9,11 4.5,13.5 6,9 2,6 7,5.5" />}
      {item.cross && <text className="an-centroid-x" x="9" y="11" textAnchor="middle" style={{ fill: 'var(--text)' }}>✕</text>}
      {item.noise && <text className="an-noise" x="9" y="12" textAnchor="middle">×</text>}
      {item.node && <circle className="an-node" cx="9" cy="7" r="5.5" />}
      {item.cell && <rect className={item.cell} x="2" y="1" width="12" height="12" rx="2" />}
      {item.path && <line className="an-path" x1="1" y1="7" x2="17" y2="7" />}
      {item.trail && <line className="an-trail" x1="1" y1="7" x2="17" y2="7" />}
      {item.attn && <line className="an-attn" x1="1" y1="7" x2="17" y2="7" strokeWidth="4" />}
    </svg>
  )
}

export default function AlgoAnimation({ algoId }) {
  const build = animations[algoId]
  const data = useMemo(() => (build ? build() : null), [build])
  const [i, setI] = useState(0)
  const [main, setMain] = useState(false)
  const [kecepatan, setKecepatan] = useState(1)

  const n = data?.frames.length ?? 0
  useEffect(() => {
    if (!main) return undefined
    if (i >= n - 1) { setMain(false); return undefined }
    const t = setTimeout(() => setI((v) => v + 1), (data.frames[i].ms ?? 2600) / kecepatan)
    return () => clearTimeout(t)
  }, [main, i, n, kecepatan, data])

  if (!data) return null
  const f = data.frames[Math.min(i, n - 1)]
  const ke = (v) => { setI(Math.max(0, Math.min(n - 1, v))) }
  const tekanTombol = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); ke(i + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); ke(i - 1) }
    if (e.key === ' ') { e.preventDefault(); setMain((m) => !m) }
  }

  return (
    <section className="anim" tabIndex={0} onKeyDown={tekanTombol} aria-label="Animasi cara kerja algoritma">
      <div className="anim-head">
        <h4>🎬 Animasi cara kerja</h4>
        <span className="muted small">Langkah {i + 1} dari {n}</span>
      </div>

      <div className="anim-stage">
        <svg className="anim-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Langkah ${i + 1}`}>
          {f.el}
        </svg>
      </div>

      <div className="anim-caption" aria-live="polite">
        <span className="anim-step">{i + 1}</span>
        <p><RichText text={f.caption} /></p>
      </div>

      <div className="anim-progress" aria-hidden>
        {data.frames.map((_, k) => (
          <button key={k} tabIndex={-1} className={`anim-dot ${k === i ? 'on' : k < i ? 'done' : ''}`} onClick={() => ke(k)} />
        ))}
      </div>

      <div className="anim-controls">
        <button onClick={() => ke(0)} disabled={i === 0} title="Ke awal" aria-label="Ke awal">⏮</button>
        <button onClick={() => ke(i - 1)} disabled={i === 0} title="Langkah sebelumnya (←)" aria-label="Langkah sebelumnya">◀</button>
        <button
          className="primary anim-play"
          onClick={() => { if (i >= n - 1) setI(0); setMain(!main) }}
          aria-label={main ? 'Jeda' : 'Putar'}
        >
          {main ? '⏸ Jeda' : i >= n - 1 ? '↻ Ulangi' : '▶ Putar'}
        </button>
        <button onClick={() => ke(i + 1)} disabled={i >= n - 1} title="Langkah berikutnya (→)" aria-label="Langkah berikutnya">▶</button>
        <span className="anim-speed">
          {KECEPATAN.map((k) => (
            <button key={k} className={`chip ${kecepatan === k ? 'active' : ''}`} onClick={() => setKecepatan(k)}>{String(k).replace('.', ',')}×</button>
          ))}
        </span>
      </div>

      {data.legend && (
        <div className="anim-legend">
          {data.legend.map((it) => (
            <span key={it.label}><SimbolLegenda item={it} />{it.label}</span>
          ))}
        </div>
      )}
    </section>
  )
}
