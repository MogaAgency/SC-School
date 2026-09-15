import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, ArrowUp, ArrowDown, Trash2, Pencil, Plus, Save, X, ClipboardCheck } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { fail } from '../../lib/report'
import { one } from '../../lib/quiz'
import { Pill, ErrorBox, Loading, Empty, Field } from '../../components/admin/ui'

const QUIZ_QUERY = 'id, title, is_published, quiz_questions(id, prompt, options, position, created_at, quiz_answers(correct_index))'

// ------------------------------------------------------------ question form

function QuestionForm({ initial, busy, onSave, onCancel }) {
  const initialOptions = initial?.options ?? []
  const [options, setOptions] = useState(() => [0, 1, 2, 3].map((i) => initialOptions[i] ?? ''))
  const [correct, setCorrect] = useState(initial?.correct ?? 0)

  const filled = options.map((o) => o.trim())
  const count = filled.filter(Boolean).length
  // options must be contiguous from the top and the correct one must be filled
  const contiguous = filled.every((o, i) => o || filled.slice(i).every((x) => !x))
  const valid = count >= 2 && contiguous && Boolean(filled[correct])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!valid) return
    const prompt = new FormData(e.currentTarget).get('prompt')?.toString().trim() ?? ''
    if (!prompt) return
    onSave({ prompt, options: filled.filter(Boolean), correct })
  }

  return (
    <form className="scs-lesson-form flex flex-col gap-4" onSubmit={handleSubmit}>
      <Field id="prompt" label="السؤال">
        <textarea id="prompt" name="prompt" rows={2} required className="scs-textarea" style={{ minHeight: '4rem' }} defaultValue={initial?.prompt ?? ''} />
      </Field>

      <div>
        <span className="scs-label">الاختيارات، وعلّم على الإجابة الصح</span>
        <div className="flex flex-col gap-2">
          {options.map((opt, i) => (
            <label key={i} className={`scs-quiz-option scs-quiz-option-edit ${correct === i ? 'is-chosen' : ''}`}>
              <input type="radio" name="correct" checked={correct === i} onChange={() => setCorrect(i)} disabled={!opt.trim()} />
              <input
                type="text"
                className="scs-input"
                placeholder={i < 2 ? `الاختيار ${i + 1}` : `الاختيار ${i + 1} (اختياري)`}
                value={opt}
                onChange={(e) => setOptions((prev) => prev.map((o, j) => (j === i ? e.target.value : o)))}
              />
            </label>
          ))}
        </div>
        <span className="scs-field-hint">
          // {count < 2 ? 'اكتب اختيارين على الأقل' : !contiguous ? 'املأ الاختيارات بالترتيب من فوق' : !filled[correct] ? 'علّم على إجابة صح مكتوبة' : 'تمام'}
        </span>
      </div>

      <div className="flex gap-3">
        <button type="submit" className="scs-btn-primary px-6" disabled={busy || !valid}>
          {initial ? 'حفظ السؤال' : 'إضافة السؤال'}
          <Save size={15} />
        </button>
        <button type="button" className="scs-btn-secondary px-5" onClick={onCancel}>
          إلغاء
          <X size={15} />
        </button>
      </div>
    </form>
  )
}

// ------------------------------------------------------------------ page

export default function AdminQuiz() {
  const { id: courseId, lessonId } = useParams()
  const [lesson, setLesson] = useState(undefined)
  const [quiz, setQuiz] = useState(undefined) // undefined loading, null none yet
  const [editing, setEditing] = useState(null) // null | 'new' | question id
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const load = useCallback(async () => {
    const [les, qz] = await Promise.all([
      supabase.from('lessons').select('id, title, courses(id, title)').eq('id', lessonId).maybeSingle(),
      supabase
        .from('quizzes')
        .select(QUIZ_QUERY)
        .eq('lesson_id', lessonId)
        .order('position', { referencedTable: 'quiz_questions' })
        .order('created_at', { referencedTable: 'quiz_questions' })
        .maybeSingle(),
    ])
    if (les.error) setError(fail('Loading lesson', les.error))
    else setLesson(les.data)
    if (qz.error) setError(fail('Loading quiz', qz.error))
    else setQuiz(qz.data)
  }, [lessonId])

  useEffect(() => {
    load()
  }, [load])

  const questions = (quiz?.quiz_questions ?? []).map((q) => ({
    ...q,
    correct: one(q.quiz_answers)?.correct_index ?? null,
  }))

  const createQuiz = async () => {
    if (busy) return
    setBusy(true)
    setError('')
    const { error: err } = await supabase.from('quizzes').insert({ lesson_id: lessonId })
    setBusy(false)
    if (err) setError(fail('Creating quiz', err))
    else load()
  }

  const saveQuiz = async (e) => {
    e.preventDefault()
    if (busy) return
    const data = Object.fromEntries(new FormData(e.currentTarget))
    setBusy(true)
    setError('')
    setSaved(false)
    const { error: err } = await supabase
      .from('quizzes')
      .update({ title: data.title.toString().trim() || 'اختبار الدرس', is_published: Boolean(data.is_published) })
      .eq('id', quiz.id)
    setBusy(false)
    if (err) setError(fail('Saving quiz', err))
    else {
      setSaved(true)
      load()
    }
  }

  const deleteQuiz = async () => {
    if (!window.confirm('هتمسح الاختبار بكل أسئلته ونتايج الطلاب فيه. متأكد؟')) return
    const { error: err } = await supabase.from('quizzes').delete().eq('id', quiz.id)
    if (err) setError(fail('Deleting quiz', err))
    else load()
  }

  const saveQuestion = async ({ prompt, options, correct }) => {
    if (busy) return
    setBusy(true)
    setError('')

    let questionId = editing
    if (editing === 'new') {
      const { data, error: err } = await supabase
        .from('quiz_questions')
        .insert({ quiz_id: quiz.id, prompt, options, position: questions.length })
        .select('id')
        .single()
      if (err) {
        setBusy(false)
        setError(fail('Adding question', err))
        return
      }
      questionId = data.id
    } else {
      const { error: err } = await supabase.from('quiz_questions').update({ prompt, options }).eq('id', editing)
      if (err) {
        setBusy(false)
        setError(fail('Saving question', err))
        return
      }
    }

    const { error: ansErr } = await supabase
      .from('quiz_answers')
      .upsert({ question_id: questionId, correct_index: correct }, { onConflict: 'question_id' })
    setBusy(false)
    if (ansErr) {
      setError(fail('Saving answer', ansErr))
      return
    }
    setEditing(null)
    load()
  }

  const moveQuestion = async (index, dir) => {
    const other = index + dir
    if (other < 0 || other >= questions.length) return
    const results = await Promise.all([
      supabase.from('quiz_questions').update({ position: other }).eq('id', questions[index].id),
      supabase.from('quiz_questions').update({ position: index }).eq('id', questions[other].id),
    ])
    const err = results.find((r) => r.error)?.error
    if (err) setError(fail('Reordering questions', err))
    else load()
  }

  const removeQuestion = async (q) => {
    if (!window.confirm('هتمسح السؤال ده. متأكد؟')) return
    const { error: err } = await supabase.from('quiz_questions').delete().eq('id', q.id)
    if (err) setError(fail('Deleting question', err))
    else load()
  }

  if (lesson === undefined || quiz === undefined) return <Loading />
  if (lesson === null) {
    return (
      <Empty>
        الدرس ده مش موجود. <Link to={`/admin/courses/${courseId}`} className="scs-text-link">رجوع للكورس</Link>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <nav className="scs-crumbs">
        <Link to="/admin">الكورسات</Link>
        <span>/</span>
        <Link to={`/admin/courses/${courseId}`}>{lesson.courses?.title ?? 'الكورس'}</Link>
        <span>/</span>
        <span>{lesson.title}</span>
        <span>/</span>
        <span>الاختبار</span>
      </nav>

      <ErrorBox>{error}</ErrorBox>

      {quiz === null ? (
        <div className="scs-card scs-card-static p-8 text-center">
          <div className="scs-icon-wrap scs-tint-gold mx-auto mb-4">
            <ClipboardCheck size={22} />
          </div>
          <h2 className="scs-card-title text-lg mb-2">مفيش اختبار للدرس ده لسه</h2>
          <p className="scs-card-text max-w-sm mx-auto mb-6">
            الاختبار بيظهر للطالب في آخر الدرس بعد ما تنشره. أسئلة اختيار من متعدد، وبيتصحّح فورًا.
          </p>
          <button type="button" className="scs-btn-primary px-7" onClick={createQuiz} disabled={busy}>
            إنشاء اختبار
            <Plus size={16} />
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-6 items-start">
          <div className="lg:col-span-2 scs-card scs-card-static p-6 md:p-7">
            <span className="scs-kicker block mb-3">// إعدادات الاختبار</span>
            <form className="flex flex-col gap-4" onSubmit={saveQuiz} key={quiz.id + quiz.title}>
              <Field id="title" label="اسم الاختبار">
                <input id="title" name="title" type="text" className="scs-input" defaultValue={quiz.title} />
              </Field>
              <label className="scs-consent" htmlFor="is_published">
                <input id="is_published" name="is_published" type="checkbox" defaultChecked={quiz.is_published} />
                <span>منشور، بيظهر للطلاب في آخر الدرس</span>
              </label>
              <button type="submit" className="scs-btn-primary w-full" disabled={busy}>
                حفظ
                <Save size={15} />
              </button>
              {saved && <p className="scs-form-info">اتحفظ.</p>}
            </form>
            <button type="button" className="scs-text-link mt-5 inline-flex items-center gap-1" onClick={deleteQuiz}>
              <Trash2 size={14} />
              مسح الاختبار بالكامل
            </button>
          </div>

          <div className="lg:col-span-3 scs-card scs-card-static p-6 md:p-7">
            <div className="flex items-center justify-between mb-4">
              <span className="scs-kicker">// الأسئلة</span>
              <div className="flex items-center gap-3">
                <span className="scs-admin-meta">{questions.length} سؤال</span>
                {editing === null && (
                  <button type="button" className="scs-btn-primary px-4 py-2 text-sm" onClick={() => setEditing('new')}>
                    سؤال جديد
                    <Plus size={15} />
                  </button>
                )}
              </div>
            </div>

            {editing === 'new' && (
              <QuestionForm initial={null} busy={busy} onSave={saveQuestion} onCancel={() => setEditing(null)} />
            )}

            {questions.length === 0 && editing !== 'new' ? (
              <Empty>لسه مفيش أسئلة. اضغط "سؤال جديد".</Empty>
            ) : (
              <ol className="flex flex-col gap-2.5 mt-2">
                {questions.map((q, i) =>
                  editing === q.id ? (
                    <li key={q.id} className="scs-admin-row flex-col items-stretch">
                      <QuestionForm initial={q} busy={busy} onSave={saveQuestion} onCancel={() => setEditing(null)} />
                    </li>
                  ) : (
                    <li key={q.id} className="scs-admin-row items-start">
                      <span className="scs-admin-index mt-1">{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <div className="scs-admin-title whitespace-normal">{q.prompt}</div>
                        <ul className="mt-2 flex flex-col gap-1">
                          {(q.options ?? []).map((opt, oi) => (
                            <li key={oi} className={`scs-quiz-option-mini ${q.correct === oi ? 'is-correct' : ''}`}>
                              {opt}
                            </li>
                          ))}
                        </ul>
                        {q.correct === null && <span className="scs-field-hint">// الإجابة الصح مش محفوظة، عدّل السؤال</span>}
                      </div>
                      <div className="scs-admin-actions">
                        <button type="button" className="scs-icon-btn" onClick={() => moveQuestion(i, -1)} disabled={i === 0} aria-label="لفوق">
                          <ArrowUp size={16} />
                        </button>
                        <button type="button" className="scs-icon-btn" onClick={() => moveQuestion(i, 1)} disabled={i === questions.length - 1} aria-label="لتحت">
                          <ArrowDown size={16} />
                        </button>
                        <button type="button" className="scs-icon-btn" onClick={() => setEditing(q.id)} aria-label="تعديل">
                          <Pencil size={16} />
                        </button>
                        <button type="button" className="scs-icon-btn is-danger" onClick={() => removeQuestion(q)} aria-label="مسح">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </li>
                  ),
                )}
              </ol>
            )}

            <div className="mt-5 flex items-center gap-3">
              <Pill on={quiz.is_published} />
              <Link to={`/admin/courses/${courseId}`} className="scs-text-link inline-flex items-center gap-1">
                <ArrowRight size={14} />
                رجوع للكورس
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
