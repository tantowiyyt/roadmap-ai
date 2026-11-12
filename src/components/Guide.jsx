import RichText from './RichText.jsx'
import CodeRunner from './KodeLazy.jsx'

// Daftar langkah bernomor: [[judul, penjelasan], ...]
export function Steps({ steps, title = '🧭 Langkah-langkah' }) {
  return (
    <div className="lesson-block">
      <h4>{title}</h4>
      <ol className="step-list">
        {steps.map(([judul, isi], i) => (
          <li key={i}>
            <span className="step-num">{i + 1}</span>
            <div>
              <strong><RichText text={judul} /></strong>
              <p className="muted"><RichText text={isi} /></p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

// Contoh kasus: situasi → penyelesaian → hasil (+ kode opsional)
export function CaseStudy({ data }) {
  return (
    <div className="lesson-block case">
      <h4>💼 Contoh kasus: {data.title}</h4>
      <div className="case-part">
        <span className="case-label">Situasi</span>
        <p><RichText text={data.situation} /></p>
      </div>
      <div className="case-part">
        <span className="case-label">Penyelesaian</span>
        <ol>{data.steps.map((s, i) => <li key={i}><RichText text={s} /></li>)}</ol>
      </div>
      {data.code && (
        <div className="case-part">
          <span className="case-label">Kode lengkap (bisa dijalankan)</span>
          <CodeRunner code={data.code} />
        </div>
      )}
      <div className="case-part result">
        <span className="case-label">Hasil</span>
        <p><RichText text={data.result} /></p>
      </div>
    </div>
  )
}

// Pendalaman: konsep lebih dalam, contoh lanjutan, kesalahan umum, dan tips
export function DeepDive({ deep }) {
  if (!deep) return null
  return (
    <div className="lesson-block deep">
      {deep.concepts?.length > 0 && (
        <div className="deep-part">
          <span className="case-label">Konsep di balik layar</span>
          <ol className="concept-list">
            {deep.concepts.map(([judul, isi], i) => (
              <li key={i} className="deep-concept">
                <span className="concept-num">{i + 1}</span>
                <div>
                  <strong><RichText text={judul} /></strong>
                  {[].concat(isi).map((p, j) => <p key={j}><RichText text={p} /></p>)}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {deep.examples?.map((e, i) => (
        <div key={i} className="deep-part">
          <span className="case-label">{e.runnable === false ? '📄' : '▶'} Contoh lanjutan: {e.title}</span>
          <CodeRunner code={e.code} runnable={e.runnable !== false} note={e.note} file={e.file} />
        </div>
      ))}

      {deep.mistakes?.length > 0 && (
        <div className="deep-part">
          <span className="case-label">⚠️ Kesalahan umum</span>
          <div className="mistakes">
            <span className="mistake-head bad">✗ Yang sering salah</span>
            <span className="mistake-head good">✓ Yang benar</span>
            {deep.mistakes.map(([salah, benar], i) => (
              <div key={i} className="mistake-row">
                <div className="bad"><span className="mistake-tag">✗ Salah</span><RichText text={salah} /></div>
                <div className="good"><span className="mistake-tag">✓ Benar</span><RichText text={benar} /></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {deep.tips?.length > 0 && (
        <div className="deep-part tips">
          <span className="case-label">✅ Praktik terbaik</span>
          <ul className="check-list">{deep.tips.map((t, i) => <li key={i}><RichText text={t} /></li>)}</ul>
        </div>
      )}
    </div>
  )
}

// Soal cek pemahaman; jawaban disembunyikan sampai diklik
export function CheckQuestions({ items }) {
  if (!items?.length) return null
  return (
    <div className="lesson-block">
      <h4>🧩 Cek pemahaman</h4>
      <p className="muted small">Jawab dulu dalam kepala atau di kertas, lalu klik pertanyaannya untuk mencocokkan.</p>
      {items.map(([q, a], i) => (
        <details key={i} className="check">
          <summary><span className="check-num">{i + 1}</span><span className="check-q"><RichText text={q} /></span></summary>
          <p><RichText text={a} /></p>
        </details>
      ))}
    </div>
  )
}
