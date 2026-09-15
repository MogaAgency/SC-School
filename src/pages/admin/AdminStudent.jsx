import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, User, Users, Phone, Mail, CalendarDays, UserPlus, UserMinus } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { fail } from '../../lib/report'
import { ErrorBox, Loading, Empty, StatusSelect } from '../../components/admin/ui'

const SELECT = '*, enrollments(id, status, schedule, starts_on, courses(id, title, level))'

function Row({ icon: Icon, label, value, ltr }) {
  if (!value) return null
  return (
    <li className="scs-info-row">
      <Icon size={15} />
      <span className="scs-info-label">{label}</span>
      <span className="scs-info-value" dir={ltr ? 'ltr' : undefined}>
        {value}
      </span>
    </li>
  )
}

export default function AdminStudent() {
  const { id } = useParams()
  const [student, setStudent] = useState(undefined)
  const [courses, setCourses] = useState([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    const [stu, crs] = await Promise.all([
      supabase.from('students').select(SELECT).eq('id', id).maybeSingle(),
      supabase.from('courses').select('id, title, level').order('position'),
    ])
    if (stu.error) setError(fail('Loading student', stu.error))
    else setStudent(stu.data)
    if (crs.error) setError(fail('Loading courses', crs.error))
    else setCourses(crs.data)
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  const enrolled = new Set((student?.enrollments ?? []).map((e) => e.courses?.id))
  const available = courses.filter((c) => !enrolled.has(c.id))

  const enroll = async (e) => {
    e.preventDefault()
    if (busy) return
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    if (!data.course_id) return
    setBusy(true)
    setError('')
    const { error: err } = await supabase.from('enrollments').insert({
      student_id: id,
      course_id: data.course_id,
      schedule: data.schedule?.toString().trim() || null,
    })
    setBusy(false)
    if (err) setError(fail('Enrolling student', err))
    else {
      form.reset()
      load()
    }
  }

  const setStatus = async (en, status) => {
    const { error: err } = await supabase.from('enrollments').update({ status }).eq('id', en.id)
    if (err) setError(fail('Updating enrollment', err))
    else load()
  }

  const unenroll = async (en) => {
    if (!window.confirm(`هتشيل الطالب من كورس "${en.courses?.title ?? ''}". متأكد؟`)) return
    const { error: err } = await supabase.from('enrollments').delete().eq('id', en.id)
    if (err) setError(fail('Removing enrollment', err))
    else load()
  }

  if (student === undefined) return <Loading />
  if (student === null) {
    return (
      <Empty>
        الطالب ده مش موجود. <Link to="/admin/students" className="scs-text-link">رجوع للطلاب</Link>
      </Empty>
    )
  }

  const joined = student.created_at ? new Date(student.created_at).toLocaleDateString('ar-EG') : ''

  return (
    <div className="flex flex-col gap-6">
      <Link to="/admin/students" className="scs-text-link inline-flex items-center gap-1 self-start">
        <ArrowRight size={14} />
        كل الطلاب
      </Link>

      <ErrorBox>{error}</ErrorBox>

      <div className="grid lg:grid-cols-5 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="scs-card scs-card-static p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="scs-icon-wrap scs-tint-green">
                <User size={20} />
              </span>
              <h2 className="scs-card-title text-base">{student.name || 'طالب'}</h2>
            </div>
            <ul className="scs-list">
              <Row icon={Phone} label="الموبايل" value={student.phone} ltr />
              <Row icon={Mail} label="الإيميل" value={student.email} ltr />
              <Row icon={CalendarDays} label="سجّل في" value={joined} />
            </ul>
          </div>

          <div className="scs-card scs-card-static p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="scs-icon-wrap scs-tint-blue">
                <Users size={20} />
              </span>
              <h2 className="scs-card-title text-base">ولي الأمر</h2>
            </div>
            <ul className="scs-list">
              <Row icon={User} label="الاسم" value={student.guardian_name} />
              <Row icon={Phone} label="الموبايل" value={student.guardian_phone} ltr />
            </ul>
          </div>
        </div>

        <div className="lg:col-span-3 scs-card scs-card-static p-6 md:p-7">
          <span className="scs-kicker block mb-4">// الكورسات المسجّل فيها</span>

          <form className="flex flex-col sm:flex-row gap-3 mb-5" onSubmit={enroll}>
            <select name="course_id" className="scs-select flex-1" required defaultValue="">
              <option value="" disabled>
                اختار كورس…
              </option>
              {available.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                  {c.level ? ` — ${c.level}` : ''}
                </option>
              ))}
            </select>
            <input name="schedule" type="text" className="scs-input sm:w-52" placeholder="المواعيد (اختياري)" />
            <button type="submit" className="scs-btn-primary px-4" disabled={busy || available.length === 0} aria-label="تسجيل">
              <UserPlus size={16} />
            </button>
          </form>

          {(student.enrollments ?? []).length === 0 ? (
            <Empty>الطالب مش مسجّل في أي كورس لسه.</Empty>
          ) : (
            <div className="flex flex-col gap-2.5">
              {student.enrollments.map((en) => (
                <div key={en.id} className="scs-admin-row">
                  <div className="min-w-0">
                    <Link to={`/admin/courses/${en.courses?.id}`} className="scs-admin-title">
                      {en.courses?.title ?? '—'}
                    </Link>
                    <div className="scs-admin-meta">
                      {en.courses?.level || 'بدون مستوى'}
                      {en.schedule ? ` · ${en.schedule}` : ''}
                    </div>
                  </div>
                  <div className="scs-admin-actions items-center gap-2">
                    <StatusSelect value={en.status} onChange={(v) => setStatus(en, v)} />
                    <button type="button" className="scs-icon-btn is-danger" onClick={() => unenroll(en)} aria-label="إزالة">
                      <UserMinus size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
