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
          <div key={i} className="quiz-q">
            <p><strong>{i + 1}.</strong> <RichText text={q.q} /></p>
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
              <p className={`quiz-why ${chosen === q.answer ? 'right' : 'wrong'}`}>
                {chosen === q.answer ? '✅ Benar! ' : '❌ Kurang tepat. '}
                {q.why}
                {chosen !== q.answer && <span className="quiz-ulang"> Soal ini masuk 🧠 Ulang soal.</span>}
              </p>
            )}
          </div>
        )
      })}
      {answered > 0 && (
        <div className="quiz-score">
          <span>Skor: <strong>{correct}/{questions.length}</strong></span>
          <button onClick={() => setAnswers({})}>Ulangi kuis</button>
        </div>
      )}
    </div>
  )
}
