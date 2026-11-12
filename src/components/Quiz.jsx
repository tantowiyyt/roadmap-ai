import { useState } from 'react'
import RichText from './RichText.jsx'
import { catatJawaban } from '../ulang.js'

// Setiap jawaban dicatat ke sistem 🧠 Ulang soal (soal yang salah akan dijadwalkan untuk diulang)
export default function Quiz({ questions, sumber = '' }) {
  const [answers, setAnswers] = useState({})
  const answered = Object.keys(answers).length
  const correct = questions.filter((q, i) => answers[i] === q.answer).length

  return (
    <div className="quiz">
      {questions.map((q, i) => {
        const chosen = answers[i]
        return (
          <div key={i} className={`quiz-q ${chosen === undefined ? '' : chosen === q.answer ? 'benar' : 'salah'}`}>
            <div className="quiz-q-head">
              <span className="quiz-no">Soal {i + 1} <span className="muted">/ {questions.length}</span></span>
              {chosen !== undefined && (
                <span className={`quiz-status ${chosen === q.answer ? 'right' : 'wrong'}`}>{chosen === q.answer ? 'Benar' : 'Salah'}</span>
              )}
            </div>
            <p className="quiz-tanya"><RichText text={q.q} /></p>
            <div className="quiz-options">
              {q.options.map((opt, j) => {
                let cls = ''
                if (chosen !== undefined) {
                  if (j === q.answer) cls = 'right'
                  else if (j === chosen) cls = 'wrong'
                }
                return (
                  <button
                    key={j}
                    className={`quiz-opt ${cls}`}
                    disabled={chosen !== undefined}
                    onClick={() => { setAnswers({ ...answers, [i]: j }); catatJawaban(q, j === q.answer, q.tahap || sumber) }}
                  >
                    <RichText text={opt} />
                  </button>
                )
              })}
            </div>
            {chosen !== undefined && (
              <div className={`quiz-why ${chosen === q.answer ? 'right' : 'wrong'}`}>
                <strong className="quiz-why-judul">{chosen === q.answer ? '✅ Benar!' : '❌ Kurang tepat'}</strong>
                <p>{q.why}</p>
                {chosen !== q.answer && <p className="quiz-ulang">🧠 Soal ini masuk daftar Ulang soal.</p>}
              </div>
            )}
          </div>
        )
      })}
      {answered > 0 && (
        <div className="quiz-score">
          <span>Skor kamu: <strong>{correct}/{questions.length}</strong> <span className="muted">· {answered} dari {questions.length} soal dijawab</span></span>
          <button onClick={() => setAnswers({})}>Ulangi kuis</button>
        </div>
      )}
    </div>
  )
}
