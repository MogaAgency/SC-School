import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ArrowUp, ArrowDown, Eye, EyeOff, Trash2, Pencil } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { fail } from '../../lib/report'
import { Pill, ErrorBox, Loading, Empty, Field } from '../../components/admin/ui'

const SELECT = 'id, title, level, description, is_published, position, lessons(count), enrollments(count)'

const count = (rel) => rel?.[0]?.count ?? 0

export default function AdminCourses() {
  const [courses, setCourses] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const load = async () => {
    const { data, error: err } = await supabase
      .from('courses')
      .select(SELECT)
      .order('position')
      .order('created_at')
    if (err) {
      setError(fail('Loading courses', err))
      return
    }
    setCourses(data)
  }

  useEffect(() => {
    load()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (busy) return
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    setBusy(true)
    setError('')
    const { error: err } = await supabase.from('courses').insert({
      title: data.title.toString().trim(),
      level: data.level.toString().trim(),
      description: data.description.toString().trim(),
      position: courses?.length ?? 0,
    })
    setBusy(false)

    if (err) {
      setError(fail('Creating course', err))
      return
    }
    form.reset()
    load()
  }

  const togglePublish = async (c) => {
    const { error: err } = await supabase
      .from('courses')
      .update({ is_published: !c.is_published })
      .eq('id', c.id)
    if (err) setError(fail('Publishing course', err))
    else load()
  }

  // Positions are rewritten from the list index so duplicates self-heal.
  const move = async (index, dir) => {
    const other = index + dir
    if (other < 0 || other >= courses.length) return
    const results = await Promise.all([
      supabase.from('courses').update({ position: other }).eq('id', courses[index].id),
      supabase.from('courses').update({ position: index }).eq('id', courses[other].id),
    ])
    const err = results.find((r) => r.error)?.error
    if (err) setError(fail('Reordering courses', err))
    else load()
  }

  const remove = async (c) => {
    const ok = window.confirm(
      `هتمسح كورس "${c.title}" بكل دروسه وملفاته وتسجيلات الطلاب فيه. متأكد؟`,
    )
    if (!ok) return
    const { error: err } = await supabase.from('courses').delete().eq('id', c.id)
    if (err) setError(fail('Deleting course', err))
    else load()
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6 items-start">
      {/* New course */}
      <div className="lg:col-span-2 scs-card scs-card-static p-6 md:p-7">
        <span className="scs-kicker block mb-3">// كورس جديد</span>
        <form className="flex flex-col gap-4" onSubmit={handleCreate}>
          <Field id="title" label="اسم الكورس">
            <input id="title" name="title" type="text" required className="scs-input" placeholder="مثلًا: Scratch" />
          </Field>
          <Field id="level" label="المستوى">
            <input id="level" name="level" type="text" className="scs-input" placeholder="مبتدئ / متوسط / متقدم" />
          </Field>
          <Field id="description" label="وصف قصير">
            <textarea id="description" name="description" rows={3} className="scs-textarea" style={{ minHeight: '5rem' }} />
          </Field>
          <button type="submit" className="scs-btn-primary w-full" disabled={busy}>
            إضافة الكورس
            <Plus size={16} />
          </button>
          <span className="scs-field-hint">// الكورس بيتضاف مخفي، وتنشره لما دروسه تجهز</span>
        </form>
      </div>

      {/* Course list */}
      <div className="lg:col-span-3 scs-card scs-card-static p-6 md:p-7">
        <div className="flex items-center justify-between mb-4">
          <span className="scs-kicker">// كل الكورسات</span>
          {courses && <span className="scs-admin-meta">{courses.length} كورس</span>}
        </div>

        <ErrorBox>{error}</ErrorBox>

        {!courses ? (
          <Loading />
        ) : courses.length === 0 ? (
          <Empty>لسه مفيش كورسات. ضيف أول كورس من الفورم.</Empty>
        ) : (
          <div className="flex flex-col gap-2.5">
            {courses.map((c, i) => (
              <div key={c.id} className="scs-admin-row">
                <div className="min-w-0">
                  <Link to={`/admin/courses/${c.id}`} className="scs-admin-title">
                    {c.title}
                  </Link>
                  <div className="scs-admin-meta">
                    {c.level || 'بدون مستوى'} · {count(c.lessons)} درس · {count(c.enrollments)} طالب
                  </div>
                </div>
                <Pill on={c.is_published} />
                <div className="scs-admin-actions">
                  <button type="button" className="scs-icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label="لفوق">
                    <ArrowUp size={16} />
                  </button>
                  <button type="button" className="scs-icon-btn" onClick={() => move(i, 1)} disabled={i === courses.length - 1} aria-label="لتحت">
                    <ArrowDown size={16} />
                  </button>
                  <button type="button" className="scs-icon-btn" onClick={() => togglePublish(c)} aria-label={c.is_published ? 'إخفاء' : 'نشر'}>
                    {c.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <Link to={`/admin/courses/${c.id}`} className="scs-icon-btn" aria-label="تعديل">
                    <Pencil size={16} />
                  </Link>
                  <button type="button" className="scs-icon-btn is-danger" onClick={() => remove(c)} aria-label="مسح">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
