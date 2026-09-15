import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard,
  User,
  Users,
  Phone,
  Mail,
  BookOpen,
  GraduationCap,
  LogOut,
  AlertCircle,
  ArrowLeft,
  ChevronLeft,
} from 'lucide-react'
import PageHero from '../components/PageHero'
import useAuth from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

const statusLabels = {
  active: { text: 'جاري', tone: 'is-green' },
  completed: { text: 'مكتمل', tone: '' },
  paused: { text: 'متوقف مؤقتًا', tone: 'is-gold' },
}

/** One nested query: the student's row plus their enrollments. */
const STUDENT_QUERY = `
  name,
  phone,
  email,
  guardian_name,
  guardian_phone,
  enrollments (
    id,
    status,
    courses ( id, title, level, lessons ( count ) )
  )
`

function InfoRow({ icon: Icon, label, value, ltr }) {
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

export default function Platform() {
  const { user, signOut } = useAuth()
  const [student, setStudent] = useState(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'

  useEffect(() => {
    if (!supabase || !user) return
    let cancelled = false

    supabase
      .from('students')
      .select(STUDENT_QUERY)
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          console.error('Loading the student failed:', error)
          setStatus('error')
          return
        }
        setStudent(data)
        setStatus('ready')
      })

    return () => {
      cancelled = true
    }
  }, [user])

  const enrollments = student?.enrollments ?? []
  const firstName = student?.name?.trim().split(/\s+/)[0]

  return (
    <div className="scs-page">
      <div className="scs-bgfx" />
      <div className="scs-glow scs-glow-blue" />
      <div className="scs-glow scs-glow-green" />

      <div className="scs-content">
        <PageHero
          kicker="منصة الطالب"
          kickerIcon={LayoutDashboard}
          title={firstName ? `أهلًا ${firstName}` : 'أهلًا بيك'}
          accent="في منصتك"
          lead="من هنا بتتابع كورساتك ودروسك. أي تعديل في بياناتك أو إضافة كورس كلّمنا وهنظبطها."
        >
          <button type="button" className="scs-btn-secondary mt-8 px-6" onClick={signOut}>
            تسجيل الخروج
            <LogOut size={15} />
          </button>
        </PageHero>

        <section className="max-w-6xl mx-auto px-4 pb-20">
          {status === 'loading' && <p className="scs-auth-loading text-center">// جاري تحميل بياناتك...</p>}

          {status === 'error' && (
            <p className="scs-form-error max-w-lg mx-auto" role="alert">
              <AlertCircle size={15} />
              <span>
                معرفناش نحمّل بياناتك دلوقتي. حدّث الصفحة، ولو المشكلة استمرت{' '}
                <Link to="/contact">كلّمنا</Link>.
              </span>
            </p>
          )}

          {status === 'ready' && !student && (
            <p className="scs-form-error max-w-lg mx-auto" role="alert">
              <AlertCircle size={15} />
              <span>
                الحساب ده لسه ماتربطش ببيانات طالب. <Link to="/contact">كلّمنا</Link> وهنظبطه.
              </span>
            </p>
          )}

          {status === 'ready' && student && (
            <div className="grid lg:grid-cols-5 gap-6 items-start">
              {/* Enrollments — the main thing a student comes here for */}
              <div className="lg:col-span-3 scs-card scs-card-static p-7 md:p-9 scs-reveal is-visible">
                <span className="scs-kicker block mb-3">// الكورسات</span>
                <h2 className="scs-h2 text-xl md:text-2xl mb-6">كورساتك</h2>

                {enrollments.length === 0 ? (
                  <div className="flex flex-col items-center text-center py-8">
                    <div className="scs-icon-wrap scs-tint-gold mb-5">
                      <BookOpen size={22} />
                    </div>
                    <h3 className="scs-card-title text-lg mb-2">لسه مفيش كورسات مسجّلة</h3>
                    <p className="scs-card-text max-w-sm">
                      أول ما تتفق معانا على كورس هيظهر هنا بمستواه ومواعيده. لو عايز تبدأ، كلّمنا
                      وهنرشّحلك المسار المناسب.
                    </p>
                    <Link to="/contact" className="scs-btn-primary mt-7 px-7">
                      احجز مكانك
                      <ArrowLeft size={16} />
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {enrollments.map((en) => {
                      const st = statusLabels[en.status] ?? statusLabels.active
                      // `courses` is null while the school keeps the course unpublished.
                      const course = en.courses
                      const lessonCount = course?.lessons?.[0]?.count ?? 0
                      const body = (
                        <>
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="scs-card-title text-base">{course?.title ?? 'كورس قيد التجهيز'}</h3>
                            <span className={`scs-badge-pill ${st.tone}`}>{st.text}</span>
                          </div>
                          <ul className="scs-list mt-3">
                            <InfoRow icon={GraduationCap} label="المستوى" value={course?.level} />
                            {course && (
                              <InfoRow icon={BookOpen} label="الدروس" value={`${lessonCount} درس`} />
                            )}
                          </ul>
                          {course && (
                            <span className="scs-enrollment-cta">
                              افتح الكورس
                              <ChevronLeft size={14} />
                            </span>
                          )}
                        </>
                      )
                      return course ? (
                        <Link key={en.id} to={`/platform/courses/${course.id}`} className="scs-enrollment scs-enrollment-link">
                          {body}
                        </Link>
                      ) : (
                        <div key={en.id} className="scs-enrollment">
                          {body}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Account details */}
              <div className="lg:col-span-2 flex flex-col gap-4 scs-reveal is-visible" data-delay="1">
                <div className="scs-card scs-card-static p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="scs-icon-wrap scs-tint-green">
                      <User size={20} />
                    </span>
                    <h2 className="scs-card-title text-base">بياناتك</h2>
                  </div>
                  <ul className="scs-list">
                    <InfoRow icon={User} label="الاسم" value={student.name} />
                    <InfoRow icon={Phone} label="الموبايل" value={student.phone} ltr />
                    <InfoRow icon={Mail} label="الإيميل" value={student.email ?? user.email} ltr />
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
                    <InfoRow icon={User} label="الاسم" value={student.guardian_name} />
                    <InfoRow icon={Phone} label="الموبايل" value={student.guardian_phone} ltr />
                  </ul>
                  <p className="scs-card-text mt-4 text-xs">
                    بنتواصل مع ولي الأمر لو فيه تأخير في الكورس أو أي ملاحظات.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
