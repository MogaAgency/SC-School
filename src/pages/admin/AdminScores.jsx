import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { fail } from '../../lib/report'
import { one, summarizeAttempts, percent } from '../../lib/quiz'
import { ErrorBox, Loading, Empty } from '../../components/admin/ui'

/** Course scoreboard: every enrolled student against every quiz in the course. */
export default function AdminScores() {
  const { id } = useParams()
  const [course, setCourse] = useState(undefined)
  const [students, setStudents] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [attempts, setAttempts] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [crs, enr, les] = await Promise.all([
        supabase.from('courses').select('id, title').eq('id', id).maybeSingle(),
        supabase.from('enrollments').select('students(id, name)').eq('course_id', id),
        supabase
          .from('lessons')
          .select('id, title, position, quizzes(id, title, is_published)')
          .eq('course_id', id)
          .order('position'),
      ])
      if (cancelled) return
      const err = crs.error ?? enr.error ?? les.error
      if (err) {
        setError(fail('Loading scores', err))
        return
      }
      setCourse(crs.data)
      setStudents((enr.data ?? []).map((e) => e.students).filter(Boolean))

      const qz = (les.data ?? [])
        .map((l) => {
          const q = one(l.quizzes)
          return q ? { ...q, lessonTitle: l.title } : null
        })
        .filter(Boolean)
      setQuizzes(qz)

      if (qz.length) {
        const { data, error: aErr } = await supabase
          .from('quiz_attempts')
          .select('quiz_id, student_id, score, total, created_at')
          .in(
            'quiz_id',
            qz.map((q) => q.id),
          )
        if (cancelled) return
        if (aErr) setError(fail('Loading attempts', aErr))
        else setAttempts(data ?? [])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  if (course === undefined && !error) return <Loading />
  if (course === null) {
    return (
      <Empty>
        الكورس ده مش موجود. <Link to="/admin" className="scs-text-link">رجوع للكورسات</Link>
      </Empty>
    )
  }

  // { [studentId]: { [quizId]: summary } }
  const byStudent = {}
  for (const s of students) byStudent[s.id] = summarizeAttempts(attempts.filter((a) => a.student_id === s.id))

  return (
    <div className="flex flex-col gap-6">
      <Link to={`/admin/courses/${id}`} className="scs-text-link inline-flex items-center gap-1 self-start">
        <ArrowRight size={14} />
        {course?.title ?? 'الكورس'}
      </Link>

      <ErrorBox>{error}</ErrorBox>

      <div className="scs-card scs-card-static p-6 md:p-7">
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="scs-kicker block">// النتائج</span>
            <h2 className="scs-h2 text-lg">{course?.title}</h2>
          </div>
          <span className="scs-admin-meta">
            {students.length} طالب · {quizzes.length} اختبار
          </span>
        </div>

        {quizzes.length === 0 ? (
          <Empty>مفيش اختبارات في الكورس ده لسه. ضيف اختبار من صفحة أي درس.</Empty>
        ) : students.length === 0 ? (
          <Empty>مفيش طلاب مسجّلين في الكورس ده.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="scs-table">
              <thead>
                <tr>
                  <th>الطالب</th>
                  {quizzes.map((q) => (
                    <th key={q.id}>
                      <span className="block">{q.lessonTitle}</span>
                      <span className="scs-admin-meta font-normal">{q.is_published ? q.title : `${q.title} (مخفي)`}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <Link to={`/admin/students/${s.id}`} className="scs-admin-title">
                        {s.name || '—'}
                      </Link>
                    </td>
                    {quizzes.map((q) => {
                      const r = byStudent[s.id]?.[q.id]
                      if (!r) return <td key={q.id} className="scs-table-muted">—</td>
                      const p = percent(r.best, r.total)
                      return (
                        <td key={q.id}>
                          <span className={`scs-score ${p >= 50 ? 'is-pass' : 'is-fail'}`}>
                            {r.best}/{r.total}
                          </span>
                          <span className="scs-admin-meta block">
                            {p}٪ · {r.attempts} {r.attempts === 1 ? 'محاولة' : 'محاولات'}
                          </span>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
