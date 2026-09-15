import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronLeft } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { fail } from '../../lib/report'
import { ErrorBox, Loading, Empty } from '../../components/admin/ui'

const SELECT = 'id, name, phone, email, guardian_name, guardian_phone, created_at, enrollments(count)'

export default function AdminStudents() {
  const [students, setStudents] = useState(null)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')

  useEffect(() => {
    supabase
      .from('students')
      .select(SELECT)
      .order('created_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setError(fail('Loading students', err))
        else setStudents(data)
      })
  }, [])

  const filtered = useMemo(() => {
    if (!students) return null
    const needle = q.trim().toLowerCase()
    if (!needle) return students
    return students.filter((s) =>
      [s.name, s.phone, s.email, s.guardian_name, s.guardian_phone]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(needle)),
    )
  }, [students, q])

  return (
    <div className="scs-card scs-card-static p-6 md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div>
          <span className="scs-kicker block">// الطلاب</span>
          {students && <span className="scs-admin-meta">{students.length} طالب مسجّل</span>}
        </div>
        <div className="relative w-full sm:w-72">
          <input
            type="search"
            className="scs-input pl-10"
            placeholder="ابحث بالاسم أو الرقم أو الإيميل"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Search size={16} className="scs-input-icon" />
        </div>
      </div>

      <ErrorBox>{error}</ErrorBox>

      {!filtered ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <Empty>{q ? 'مفيش نتائج للبحث ده.' : 'لسه مفيش طلاب مسجّلين.'}</Empty>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map((s) => (
            <Link key={s.id} to={`/admin/students/${s.id}`} className="scs-admin-row scs-admin-row-link">
              <div className="min-w-0 flex-1">
                <div className="scs-admin-title">{s.name || '—'}</div>
                <div className="scs-admin-meta">
                  <span dir="ltr">{s.phone}</span> · <span dir="ltr">{s.email}</span>
                </div>
              </div>
              <div className="hidden md:block min-w-0 flex-1">
                <div className="scs-admin-meta">ولي الأمر</div>
                <div className="scs-card-text text-sm truncate">
                  {s.guardian_name || '—'} <span dir="ltr">{s.guardian_phone}</span>
                </div>
              </div>
              <span className="scs-badge-pill">{s.enrollments?.[0]?.count ?? 0} كورس</span>
              <ChevronLeft size={16} className="text-[var(--scs-text-soft)]" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
