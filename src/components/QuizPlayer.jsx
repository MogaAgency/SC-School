import { useState } from 'react'
import { ClipboardCheck, Check, X, RotateCcw, AlertCircle, Trophy } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { percent } from '../lib/quiz'

/**
 * The quiz at the bottom of a lesson. Questions arrive without answers;
 * grading happens in the database via submit_quiz(), which returns the
 * score and the correct indexes so the corrections can be shown.
 */
export default function QuizPlayer({ quiz, best, onSubmitted }) {
  const questions = quiz.quiz_questions ?? []
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(-1))
  const [result, setResult] = useState(null) // { score, total, correct[] }
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const allAnswered = answers.every((a) => a >= 0)

  const choose = (qi, oi) => {
    if (result) return
    setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)))
  }

  const submit = async () => {
    if (busy || !allAnswered) return
    setBusy(true)
    setError('')
    const { data, error: err } = await supabase.rpc('submit_quiz', {
      p_quiz_id: quiz.id,
      p_answers: answers,
    })
    setBusy(false)
    if (err) {
      console.error('submit_quiz failed:', err)
      setError('معرفناش نصحّح الاختبار دلوقتي. جرّب تاني.')
      return
    }
    const row = Array.isArray(data) ? data[0] : data
    setResult(row)
    onSubmitted?.(row)
  }

  const retry = () => {
    setAnswers(Array(questions.length).fill(-1))
    setResult(null)
    setError('')
  }

  if (questions.length === 0) return null

  return (
    <div className="scs-card scs-card-static p-6 md:p-8 scs-reveal is-visible">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <span className="scs-icon-wrap scs-tint-gold">
            <ClipboardCheck size={20} />
          </span>
          <div>
            <span className="scs-kicker block">// اختبار</span>
            <h2 className="scs-card-title text-lg">{quiz.title}</h2>
          </div>
        </div>
        {best && (
          <span className="scs-badge-pill is-green">
            أحسن نتيجة: {best.best}/{best.total}
          </span>
        )}
      </div>

      {result && (
        <div className={`scs-quiz-result ${percent(result.score, result.total) >= 50 ? 'is-pass' : ''}`}>
          <Trophy size={20} />
          <div>
            <strong>
              نتيجتك {result.score} من {result.total}
            </strong>
            <span>{percent(result.score, result.total)}٪ · الإجابات الصح متعلّمة تحت</span>
          </div>
        </div>
      )}

      <ol className="flex flex-col gap-5">
        {questions.map((q, qi) => (
          <li key={q.id} className="scs-quiz-q">
            <p className="scs-quiz-prompt">
              <span className="scs-admin-index">{qi + 1}</span>
              {q.prompt}
            </p>
            <div className="flex flex-col gap-2">
              {(q.options ?? []).map((opt, oi) => {
                const chosen = answers[qi] === oi
                const isCorrect = result ? result.correct[qi] === oi : false
                const isWrong = result ? chosen && !isCorrect : false
                return (
                  <label
                    key={oi}
                    className={`scs-quiz-option ${chosen ? 'is-chosen' : ''} ${isCorrect ? 'is-correct' : ''} ${isWrong ? 'is-wrong' : ''}`}
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      checked={chosen}
                      onChange={() => choose(qi, oi)}
                      disabled={Boolean(result)}
                    />
                    <span className="flex-1">{opt}</span>
                    {isCorrect && <Check size={16} />}
                    {isWrong && <X size={16} />}
                  </label>
                )
              })}
            </div>
          </li>
        ))}
      </ol>

      {error && (
        <p className="scs-form-error mt-5" role="alert">
          <AlertCircle size={15} />
          <span>{error}</span>
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        {result ? (
          <button type="button" className="scs-btn-secondary" onClick={retry}>
            <RotateCcw size={15} />
            حاول تاني
          </button>
        ) : (
          <button
            type="button"
            className="scs-btn-primary px-7"
            onClick={submit}
            disabled={busy || !allAnswered}
            style={busy ? { opacity: 0.7, cursor: 'wait' } : undefined}
          >
            {busy ? 'جاري التصحيح...' : 'صحّح إجاباتي'}
            <ClipboardCheck size={16} />
          </button>
        )}
        {!result && !allAnswered && (
          <span className="scs-field-hint self-center">// جاوب على كل الأسئلة الأول</span>
        )}
      </div>
    </div>
  )
}
