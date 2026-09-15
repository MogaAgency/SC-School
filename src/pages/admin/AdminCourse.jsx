import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Trash2,
  Pencil,
  Plus,
  Save,
  X,
  Paperclip,
  Upload,
  UserPlus,
  UserMinus,
  ClipboardCheck,
  BarChart3,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { fail } from '../../lib/report'
import { youtubeId, youtubeThumb } from '../../lib/youtube'
import { one } from '../../lib/quiz'
import { Pill, ErrorBox, Loading, Empty, Field, StatusSelect } from '../../components/admin/ui'

const BUCKET = 'lesson-files'

const formatSize = (bytes) => {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Storage object keys should stay ASCII; the original name is kept in the row. */
const safeFileName = (name) => name.replace(/[^A-Za-z0-9._-]+/g, '_')

// ---------------------------------------------------------------- lesson form

function LessonForm({ initial, busy, onSave, onCancel }) {
  const [url, setUrl] = useState(initial?.youtube_url ?? '')
  const thumb = youtubeThumb(url)
  const badUrl = url.trim() !== '' && !youtubeId(url)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (badUrl) return
    const data = Object.fromEntries(new FormData(e.currentTarget))
    onSave({
      title: data.title.toString().trim(),
      youtube_url: url.trim(),
      content: data.content.toString(),
      is_published: Boolean(data.is_published),
    })
  }

  return (
    <form className="scs-lesson-form flex flex-col gap-4" onSubmit={handleSubmit}>
      <Field id="lesson_title" label="عنوان الدرس">
        <input id="lesson_title" name="title" type="text" required className="scs-input" defaultValue={initial?.title ?? ''} />
      </Field>

      <Field
        id="lesson_url"
        label="لينك الفيديو على YouTube"
        hint={badUrl ? '// اللينك ده مش لينك YouTube' : '// ينفع عادي أو Unlisted، مش Private'}
      >
        <div className="flex gap-3 items-start">
          <input
            id="lesson_url"
            name="youtube_url"
            type="url"
            dir="ltr"
            className="scs-input text-right flex-1"
            placeholder="https://youtu.be/…"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          {thumb && <img src={thumb} alt="" className="scs-thumb" />}
        </div>
      </Field>

      <Field id="lesson_content" label="شرح الدرس" hint="// نص عادي، وكل سطر فاضي بيعمل فقرة جديدة">
        <textarea id="lesson_content" name="content" rows={6} className="scs-textarea" defaultValue={initial?.content ?? ''} />
      </Field>

      <label className="scs-consent" htmlFor="lesson_published">
        <input id="lesson_published" name="is_published" type="checkbox" defaultChecked={initial?.is_published ?? false} />
        <span>منشور للطلاب المسجّلين</span>
      </label>

      <div className="flex gap-3">
        <button type="submit" className="scs-btn-primary px-6" disabled={busy || badUrl}>
          {initial ? 'حفظ التعديلات' : 'إضافة الدرس'}
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

// ------------------------------------------------------------------- page

export default function AdminCourse() {
  const { id } = useParams()
  const [course, setCourse] = useState(undefined) // undefined loading, null missing
  const [lessons, setLessons] = useState(null)
  const [enrollments, setEnrollments] = useState(null)
  const [students, setStudents] = useState([])
  const [editing, setEditing] = useState(null) // null | 'new' | lesson id
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const loadCourse = useCallback(async () => {
    const { data, error: err } = await supabase.from('courses').select('*').eq('id', id).maybeSingle()
    if (err) setError(fail('Loading course', err))
    else setCourse(data)
  }, [id])

  const loadLessons = useCallback(async () => {
    const { data, error: err } = await supabase
      .from('lessons')
      .select('*, lesson_files(id, name, path, size), quizzes(id, is_published, quiz_questions(count))')
      .eq('course_id', id)
      .order('position')
      .order('created_at')
    if (err) setError(fail('Loading lessons', err))
    else setLessons(data)
  }, [id])

  const loadEnrollments = useCallback(async () => {
    const [enr, stu] = await Promise.all([
      supabase
        .from('enrollments')
        .select('id, status, students(id, name, phone)')
        .eq('course_id', id)
        .order('created_at'),
      supabase.from('students').select('id, name, phone').order('name'),
    ])
    if (enr.error) setError(fail('Loading enrollments', enr.error))
    else setEnrollments(enr.data)
    if (stu.error) setError(fail('Loading students', stu.error))
    else setStudents(stu.data)
  }, [id])

  useEffect(() => {
    loadCourse()
    loadLessons()
    loadEnrollments()
  }, [loadCourse, loadLessons, loadEnrollments])

  // ---- course details

  const saveCourse = async (e) => {
    e.preventDefault()
    if (busy) return
    const data = Object.fromEntries(new FormData(e.currentTarget))
    setBusy(true)
    setError('')
    setSaved(false)
    const { error: err } = await supabase
      .from('courses')
      .update({
        title: data.title.toString().trim(),
        level: data.level.toString().trim(),
        description: data.description.toString().trim(),
        is_published: Boolean(data.is_published),
      })
      .eq('id', id)
    setBusy(false)
    if (err) setError(fail('Saving course', err))
    else {
      setSaved(true)
      loadCourse()
    }
  }

  // ---- lessons

  const saveLesson = async (values) => {
    if (busy) return
    setBusy(true)
    setError('')
    const query =
      editing === 'new'
        ? supabase.from('lessons').insert({ ...values, course_id: id, position: lessons?.length ?? 0 })
        : supabase.from('lessons').update(values).eq('id', editing)
    const { error: err } = await query
    setBusy(false)
    if (err) {
      setError(fail('Saving lesson', err))
      return
    }
    setEditing(null)
    loadLessons()
  }

  const toggleLesson = async (l) => {
    const { error: err } = await supabase.from('lessons').update({ is_published: !l.is_published }).eq('id', l.id)
    if (err) setError(fail('Publishing lesson', err))
    else loadLessons()
  }

  const moveLesson = async (index, dir) => {
    const other = index + dir
    if (other < 0 || other >= lessons.length) return
    const results = await Promise.all([
      supabase.from('lessons').update({ position: other }).eq('id', lessons[index].id),
      supabase.from('lessons').update({ position: index }).eq('id', lessons[other].id),
    ])
    const err = results.find((r) => r.error)?.error
    if (err) setError(fail('Reordering lessons', err))
    else loadLessons()
  }

  const removeLesson = async (l) => {
    if (!window.confirm(`هتمسح درس "${l.title}" وكل ملفاته. متأكد؟`)) return
    const paths = (l.lesson_files ?? []).map((f) => f.path)
    if (paths.length) {
      const { error: sErr } = await supabase.storage.from(BUCKET).remove(paths)
      if (sErr) {
        setError(fail('Deleting lesson files', sErr))
        return
      }
    }
    const { error: err } = await supabase.from('lessons').delete().eq('id', l.id)
    if (err) setError(fail('Deleting lesson', err))
    else loadLessons()
  }

  // ---- files

  const uploadFiles = async (lesson, fileList) => {
    if (busy || !fileList?.length) return
    setBusy(true)
    setError('')
    for (const file of fileList) {
      const path = `${id}/${lesson.id}/${Date.now()}-${safeFileName(file.name)}`
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file)
      if (upErr) {
        setError(fail(`Uploading ${file.name}`, upErr))
        break
      }
      const { error: rowErr } = await supabase
        .from('lesson_files')
        .insert({ lesson_id: lesson.id, name: file.name, path, size: file.size })
      if (rowErr) {
        setError(fail(`Saving ${file.name}`, rowErr))
        break
      }
    }
    setBusy(false)
    loadLessons()
  }

  const removeFile = async (f) => {
    if (!window.confirm(`هتمسح ملف "${f.name}". متأكد؟`)) return
    const { error: sErr } = await supabase.storage.from(BUCKET).remove([f.path])
    if (sErr) {
      setError(fail('Deleting file', sErr))
      return
    }
    const { error: err } = await supabase.from('lesson_files').delete().eq('id', f.id)
    if (err) setError(fail('Deleting file row', err))
    else loadLessons()
  }

  // ---- enrollment

  const enrolledIds = new Set((enrollments ?? []).map((e) => e.students?.id))
  const available = students.filter((s) => !enrolledIds.has(s.id))

  const enroll = async (e) => {
    e.preventDefault()
    if (busy) return
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    if (!data.student_id) return
    setBusy(true)
    setError('')
    const { error: err } = await supabase.from('enrollments').insert({
      course_id: id,
      student_id: data.student_id,
    })
    setBusy(false)
    if (err) setError(fail('Enrolling student', err))
    else {
      form.reset()
      loadEnrollments()
    }
  }

  const setStatus = async (en, status) => {
    const { error: err } = await supabase.from('enrollments').update({ status }).eq('id', en.id)
    if (err) setError(fail('Updating enrollment', err))
    else loadEnrollments()
  }

  const unenroll = async (en) => {
    if (!window.confirm(`هتشيل ${en.students?.name ?? 'الطالب'} من الكورس ده. متأكد؟`)) return
    const { error: err } = await supabase.from('enrollments').delete().eq('id', en.id)
    if (err) setError(fail('Removing enrollment', err))
    else loadEnrollments()
  }

  // ---- render

  if (course === undefined) return <Loading />
  if (course === null) {
    return (
      <Empty>
        الكورس ده مش موجود. <Link to="/admin" className="scs-text-link">رجوع للكورسات</Link>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/admin" className="scs-text-link inline-flex items-center gap-1">
          <ArrowRight size={14} />
          كل الكورسات
        </Link>
        <Link to={`/admin/courses/${id}/scores`} className="scs-btn-secondary px-4 py-2 text-sm">
          <BarChart3 size={15} />
          نتائج الاختبارات
        </Link>
      </div>

      <ErrorBox>{error}</ErrorBox>

      <div className="grid lg:grid-cols-5 gap-6 items-start">
        {/* Course details */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="scs-card scs-card-static p-6 md:p-7">
            <span className="scs-kicker block mb-3">// بيانات الكورس</span>
            <form className="flex flex-col gap-4" onSubmit={saveCourse} key={course.id + course.title}>
              <Field id="title" label="اسم الكورس">
                <input id="title" name="title" type="text" required className="scs-input" defaultValue={course.title} />
              </Field>
              <Field id="level" label="المستوى">
                <input id="level" name="level" type="text" className="scs-input" defaultValue={course.level} />
              </Field>
              <Field id="description" label="وصف قصير">
                <textarea id="description" name="description" rows={3} className="scs-textarea" style={{ minHeight: '5rem' }} defaultValue={course.description} />
              </Field>
              <label className="scs-consent" htmlFor="is_published">
                <input id="is_published" name="is_published" type="checkbox" defaultChecked={course.is_published} />
                <span>منشور، الطلاب المسجّلين يقدروا يشوفوه</span>
              </label>
              <button type="submit" className="scs-btn-primary w-full" disabled={busy}>
                حفظ
                <Save size={15} />
              </button>
              {saved && <p className="scs-form-info">اتحفظ.</p>}
            </form>
          </div>

          {/* Enrolled students */}
          <div className="scs-card scs-card-static p-6 md:p-7">
            <div className="flex items-center justify-between mb-4">
              <span className="scs-kicker">// الطلاب المسجّلين</span>
              {enrollments && <span className="scs-admin-meta">{enrollments.length} طالب</span>}
            </div>

            <form className="flex gap-3 mb-5" onSubmit={enroll}>
              <select name="student_id" className="scs-select min-w-0 flex-1" required defaultValue="">
                <option value="" disabled>
                  اختار طالب…
                </option>
                {available.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {s.phone}
                  </option>
                ))}
              </select>
              <button type="submit" className="scs-btn-primary px-4 shrink-0" disabled={busy || available.length === 0} aria-label="تسجيل">
                <UserPlus size={16} />
              </button>
            </form>

            {!enrollments ? (
              <Loading />
            ) : enrollments.length === 0 ? (
              <Empty>مفيش طلاب مسجّلين في الكورس ده لسه.</Empty>
            ) : (
              <div className="flex flex-col gap-2.5">
                {enrollments.map((en) => (
                  <div key={en.id} className="scs-admin-row">
                    <div className="min-w-0">
                      <Link to={`/admin/students/${en.students?.id}`} className="scs-admin-title">
                        {en.students?.name ?? '—'}
                      </Link>
                      <div className="scs-admin-meta" dir="ltr">
                        {en.students?.phone}
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

        {/* Lessons */}
        <div className="lg:col-span-3 scs-card scs-card-static p-6 md:p-7">
          <div className="flex items-center justify-between mb-4">
            <span className="scs-kicker">// الدروس</span>
            {editing === null && (
              <button type="button" className="scs-btn-primary px-4 py-2 text-sm" onClick={() => setEditing('new')}>
                درس جديد
                <Plus size={15} />
              </button>
            )}
          </div>

          {editing === 'new' && (
            <LessonForm initial={null} busy={busy} onSave={saveLesson} onCancel={() => setEditing(null)} />
          )}

          {!lessons ? (
            <Loading />
          ) : lessons.length === 0 && editing !== 'new' ? (
            <Empty>لسه مفيش دروس. اضغط "درس جديد".</Empty>
          ) : (
            <div className="flex flex-col gap-2.5 mt-4">
              {lessons.map((l, i) =>
                editing === l.id ? (
                  <div key={l.id} className="scs-admin-row flex-col items-stretch">
                    <LessonForm initial={l} busy={busy} onSave={saveLesson} onCancel={() => setEditing(null)} />

                    <div className="scs-lesson-files">
                      <div className="flex items-center justify-between mb-2">
                        <span className="scs-admin-meta">
                          <Paperclip size={12} className="inline ml-1" />
                          الملفات المرفقة
                        </span>
                        <label className="scs-btn-secondary px-3 py-1.5 text-xs cursor-pointer">
                          <Upload size={13} />
                          رفع ملف
                          <input
                            type="file"
                            multiple
                            className="hidden"
                            accept=".pdf,.zip,.pptx,.docx,.xlsx,.txt,image/*"
                            onChange={(e) => {
                              uploadFiles(l, e.target.files)
                              e.target.value = ''
                            }}
                            disabled={busy}
                          />
                        </label>
                      </div>
                      {(l.lesson_files ?? []).length === 0 ? (
                        <span className="scs-field-hint">// مفيش ملفات. الحد الأقصى ٢٥ MB للملف.</span>
                      ) : (
                        <ul className="flex flex-col gap-1.5">
                          {l.lesson_files.map((f) => (
                            <li key={f.id} className="scs-file-row">
                              <Paperclip size={13} />
                              <span className="truncate" dir="ltr">
                                {f.name}
                              </span>
                              <span className="scs-admin-meta">{formatSize(f.size)}</span>
                              <button type="button" className="scs-icon-btn is-danger mr-auto" onClick={() => removeFile(f)} aria-label="مسح الملف">
                                <Trash2 size={14} />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ) : (
                  <div key={l.id} className="scs-admin-row">
                    <span className="scs-admin-index">{i + 1}</span>
                    <div className="min-w-0">
                      <div className="scs-admin-title">{l.title}</div>
                      <div className="scs-admin-meta">
                        {youtubeId(l.youtube_url) ? 'فيديو' : 'بدون فيديو'} · {(l.lesson_files ?? []).length} ملف
                        {(() => {
                          const q = one(l.quizzes)
                          if (!q) return ' · بدون اختبار'
                          const n = q.quiz_questions?.[0]?.count ?? 0
                          return ` · اختبار ${n} سؤال${q.is_published ? '' : ' (مخفي)'}`
                        })()}
                      </div>
                    </div>
                    <Pill on={l.is_published} />
                    <div className="scs-admin-actions">
                      <Link to={`/admin/courses/${id}/lessons/${l.id}/quiz`} className="scs-icon-btn" aria-label="الاختبار" title="الاختبار">
                        <ClipboardCheck size={16} />
                      </Link>
                      <button type="button" className="scs-icon-btn" onClick={() => moveLesson(i, -1)} disabled={i === 0} aria-label="لفوق">
                        <ArrowUp size={16} />
                      </button>
                      <button type="button" className="scs-icon-btn" onClick={() => moveLesson(i, 1)} disabled={i === lessons.length - 1} aria-label="لتحت">
                        <ArrowDown size={16} />
                      </button>
                      <button type="button" className="scs-icon-btn" onClick={() => toggleLesson(l)} aria-label={l.is_published ? 'إخفاء' : 'نشر'}>
                        {l.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button type="button" className="scs-icon-btn" onClick={() => setEditing(l.id)} aria-label="تعديل">
                        <Pencil size={16} />
                      </button>
                      <button type="button" className="scs-icon-btn is-danger" onClick={() => removeLesson(l)} aria-label="مسح">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
