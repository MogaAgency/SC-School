import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Paperclip, Download, AlertCircle, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { youtubeEmbedUrl } from '../lib/youtube'
import { summarizeAttempts } from '../lib/quiz'
import QuizPlayer from '../components/QuizPlayer'

const BUCKET = 'lesson-files'

const LESSON_QUERY = `
  id,
  title,
  youtube_url,
  content,
  position,
  course_id,
  courses ( id, title ),
  lesson_files ( id, name, path, size )
`

const formatSize = (bytes) => {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Blank lines separate paragraphs; single newlines stay as line breaks. */
function Prose({ text }) {
  const paragraphs = (text ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
  if (paragraphs.length === 0) return null
  return (
    <div className="scs-prose">
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  )
}

export default function Lesson() {
  const { id: courseId, lessonId } = useParams()
  const [lesson, setLesson] = useState(undefined)
  const [siblings, setSiblings] = useState([])
  const [quiz, setQuiz] = useState(null)
  const [best, setBest] = useState(null)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState('')

  useEffect(() => {
    if (!supabase) return
    let cancelled = false

    Promise.all([
      supabase
        .from('lessons')
        .select(LESSON_QUERY)
        .eq('id', lessonId)
        .eq('course_id', courseId)
        .maybeSingle(),
      supabase.from('lessons').select('id, title, position').eq('course_id', courseId).order('position'),
      // The quiz arrives without correct answers; RLS hides it until published.
      supabase
        .from('quizzes')
        .select('id, title, quiz_questions(id, prompt, options, position, created_at)')
        .eq('lesson_id', lessonId)
        .order('position', { referencedTable: 'quiz_questions' })
        .order('created_at', { referencedTable: 'quiz_questions' })
        .maybeSingle(),
    ]).then(([one, all, qz]) => {
      if (cancelled) return
      if (one.error || all.error || qz.error) {
        console.error('Loading lesson failed:', one.error ?? all.error ?? qz.error)
        setError('معرفناش نحمّل الدرس دلوقتي. حدّث الصفحة وجرّب تاني.')
        return
      }
      setLesson(one.data)
      setSiblings(all.data ?? [])
      setQuiz(qz.data)
    })

    return () => {
      cancelled = true
    }
  }, [courseId, lessonId])

  // Own attempts (RLS limits the rows to the signed-in student).
  const quizId = quiz?.id ?? null
  useEffect(() => {
    if (!supabase || !quizId) {
      setBest(null)
      return
    }
    let cancelled = false
    supabase
      .from('quiz_attempts')
      .select('quiz_id, score, total, created_at')
      .eq('quiz_id', quizId)
      .then(({ data, error: err }) => {
        if (cancelled) return
        if (err) console.error('Loading attempts failed:', err)
        setBest(summarizeAttempts(data ?? [])[quizId] ?? null)
      })
    return () => {
      cancelled = true
    }
  }, [quizId])

  const onSubmitted = (row) => {
    setBest((prev) => {
      if (!prev) return { best: row.score, total: row.total, attempts: 1, last: new Date().toISOString() }
      return {
        ...prev,
        attempts: prev.attempts + 1,
        best: Math.max(prev.best, row.score),
        total: row.total,
      }
    })
  }

  const index = siblings.findIndex((l) => l.id === lessonId)
  const prev = index > 0 ? siblings[index - 1] : null
  const next = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null
  const embed = youtubeEmbedUrl(lesson?.youtube_url)
  const files = lesson?.lesson_files ?? []

  // Files are private; a signed link valid for two minutes is created on
  // click, with a Content-Disposition that keeps the original file name.
  const download = async (f) => {
    if (downloading) return
    setDownloading(f.id)
    setError('')
    const { data, error: err } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(f.path, 120, { download: f.name })
    setDownloading('')
    if (err || !data?.signedUrl) {
      console.error('Signed URL failed:', err)
      setError('معرفناش نجهّز الملف للتحميل. جرّب تاني.')
      return
    }
    window.location.assign(data.signedUrl)
  }

  const lessonLink = (l) => `/platform/courses/${courseId}/lessons/${l.id}`

  return (
    <div className="scs-page">
      <div className="scs-bgfx" />
      <div className="scs-glow scs-glow-blue" />

      <div className="scs-content">
        <section className="max-w-4xl mx-auto px-4 pt-8 pb-6">
          <nav className="scs-crumbs">
            <Link to="/platform">منصتي</Link>
            <ChevronLeft size={14} />
            <Link to={`/platform/courses/${courseId}`}>{lesson?.courses?.title ?? 'الكورس'}</Link>
            <ChevronLeft size={14} />
            <span>{lesson?.title ?? 'الدرس'}</span>
          </nav>
        </section>

        {lesson === undefined && !error && (
          <p className="scs-auth-loading text-center py-24">// جاري تحميل الدرس...</p>
        )}

        {lesson === null && (
          <section className="max-w-lg mx-auto px-4 py-20">
            <p className="scs-form-error" role="alert">
              <AlertCircle size={15} />
              <span>الدرس ده مش متاح لك دلوقتي.</span>
            </p>
            <Link to={`/platform/courses/${courseId}`} className="scs-btn-secondary mt-6">
              <ArrowRight size={15} />
              رجوع للكورس
            </Link>
          </section>
        )}

        {lesson && (
          <section className="max-w-4xl mx-auto px-4 pb-20 flex flex-col gap-6">
            <div className="scs-reveal is-visible">
              <span className="scs-kicker block mb-2">
                // الدرس {index >= 0 ? index + 1 : ''}
                {siblings.length ? ` من ${siblings.length}` : ''}
              </span>
              <h1 className="scs-h1 text-2xl md:text-3xl">{lesson.title}</h1>
            </div>

            {embed && (
              <div className="scs-video scs-reveal is-visible">
                <iframe
                  src={embed}
                  title={lesson.title}
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            )}

            {lesson.content?.trim() && (
              <div className="scs-card scs-card-static p-6 md:p-8 scs-reveal is-visible">
                <span className="scs-kicker block mb-4">// الشرح</span>
                <Prose text={lesson.content} />
              </div>
            )}

            {files.length > 0 && (
              <div className="scs-card scs-card-static p-6 md:p-8 scs-reveal is-visible">
                <span className="scs-kicker block mb-4">// الملفات</span>
                <ul className="flex flex-col gap-2">
                  {files.map((f) => (
                    <li key={f.id}>
                      <button
                        type="button"
                        className="scs-file-row scs-file-row-btn w-full"
                        onClick={() => download(f)}
                        disabled={Boolean(downloading)}
                      >
                        <Paperclip size={14} />
                        <span className="truncate flex-1 text-right" dir="ltr">
                          {f.name}
                        </span>
                        <span className="scs-admin-meta">{formatSize(f.size)}</span>
                        <Download size={15} className={downloading === f.id ? 'animate-pulse' : ''} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {error && (
              <p className="scs-form-error" role="alert">
                <AlertCircle size={15} />
                <span>{error}</span>
              </p>
            )}

            {quiz && <QuizPlayer key={quiz.id} quiz={quiz} best={best} onSubmitted={onSubmitted} />}

            {!embed && !lesson.content?.trim() && files.length === 0 && !quiz && (
              <p className="scs-card-text text-center py-6">محتوى الدرس لسه بيتجهّز.</p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              {prev ? (
                <Link to={lessonLink(prev)} className="scs-btn-secondary">
                  <ChevronRight size={15} />
                  الدرس السابق
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link to={lessonLink(next)} className="scs-btn-primary">
                  الدرس التالي
                  <ChevronLeft size={15} />
                </Link>
              ) : (
                <Link to={`/platform/courses/${courseId}`} className="scs-btn-primary">
                  رجوع للكورس
                  <ChevronLeft size={15} />
                </Link>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
