import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BookOpen, PlayCircle, Paperclip, ChevronLeft, AlertCircle, ArrowRight } from 'lucide-react'
import PageHero from '../components/PageHero'
import { supabase } from '../lib/supabase'
import { youtubeId } from '../lib/youtube'

/**
 * A course as the student sees it: its published lessons in order. Row Level
 * Security returns nothing for courses the student isn't enrolled in or that
 * aren't published, which is why a null result means "not available".
 */
const COURSE_QUERY = `
  id,
  title,
  level,
  description,
  lessons ( id, title, youtube_url, position, lesson_files ( count ) )
`

export default function Course() {
  const { id } = useParams()
  const [course, setCourse] = useState(undefined)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabase) return
    let cancelled = false
    supabase
      .from('courses')
      .select(COURSE_QUERY)
      .eq('id', id)
      .order('position', { referencedTable: 'lessons' })
      .maybeSingle()
      .then(({ data, error: err }) => {
        if (cancelled) return
        if (err) {
          console.error('Loading course failed:', err)
          setError('معرفناش نحمّل الكورس دلوقتي. حدّث الصفحة وجرّب تاني.')
          return
        }
        setCourse(data)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const lessons = course?.lessons ?? []

  return (
    <div className="scs-page">
      <div className="scs-bgfx" />
      <div className="scs-glow scs-glow-blue" />
      <div className="scs-glow scs-glow-green" />

      <div className="scs-content">
        <section className="max-w-4xl mx-auto px-4 pt-8">
          <nav className="scs-crumbs">
            <Link to="/platform">منصتي</Link>
            <ChevronLeft size={14} />
            <span>{course?.title ?? 'الكورس'}</span>
          </nav>
        </section>

        {course === undefined && !error && (
          <p className="scs-auth-loading text-center py-24">// جاري تحميل الكورس...</p>
        )}

        {(error || course === null) && (
          <section className="max-w-lg mx-auto px-4 py-20">
            <p className="scs-form-error" role="alert">
              <AlertCircle size={15} />
              <span>{error || 'الكورس ده مش متاح لك دلوقتي. لو المفروض تكون مسجّل فيه، كلّمنا.'}</span>
            </p>
            <Link to="/platform" className="scs-btn-secondary mt-6">
              <ArrowRight size={15} />
              رجوع لمنصتي
            </Link>
          </section>
        )}

        {course && (
          <>
            <PageHero
              kicker={course.level || 'كورس'}
              kickerIcon={BookOpen}
              title={course.title}
              lead={course.description}
            />

            <section className="max-w-4xl mx-auto px-4 pb-20">
              <div className="scs-card scs-card-static p-6 md:p-8 scs-reveal is-visible">
                <div className="flex items-center justify-between mb-5">
                  <span className="scs-kicker">// الدروس</span>
                  <span className="scs-admin-meta">{lessons.length} درس</span>
                </div>

                {lessons.length === 0 ? (
                  <p className="scs-card-text text-center py-8">
                    الدروس لسه بتتجهّز. هتظهر هنا أول ما تتنشر.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {lessons.map((l, i) => {
                      const files = l.lesson_files?.[0]?.count ?? 0
                      return (
                        <Link
                          key={l.id}
                          to={`/platform/courses/${course.id}/lessons/${l.id}`}
                          className="scs-admin-row scs-admin-row-link"
                        >
                          <span className="scs-admin-index">{i + 1}</span>
                          <div className="min-w-0 flex-1">
                            <div className="scs-admin-title">{l.title}</div>
                            <div className="scs-admin-meta flex items-center gap-3 mt-0.5">
                              {youtubeId(l.youtube_url) && (
                                <span className="inline-flex items-center gap-1">
                                  <PlayCircle size={12} /> فيديو
                                </span>
                              )}
                              {files > 0 && (
                                <span className="inline-flex items-center gap-1">
                                  <Paperclip size={12} /> {files} ملف
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronLeft size={16} className="text-[var(--scs-text-soft)]" />
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
