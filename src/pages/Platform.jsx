import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard,
  User,
  GraduationCap,
  Phone,
  Mail,
  BookOpen,
  LogOut,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react'
import PageHero from '../components/PageHero'
import useAuth from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

const statusLabels = {
  active: { text: 'جاري', tone: 'is-green' },
  completed: { text: 'مكتمل', tone: '' },
  paused: { text: 'متوقف مؤقتًا', tone: 'is-gold' },
}

/** One nested query: the profile, its students, and each student's enrollments. */
const PROFILE_QUERY = `
  guardian_name,
  guardian_phone,
  email,
  students (
    id,
    name,
    phone,
    enrollments (
      id,
      course,
      level,
      schedule,
      status,
      starts_on
    )
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
  const [profile, setProfile] = useState(null)
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'

  useEffect(() => {
    if (!supabase || !user) return
    let cancelled = false

    supabase
      .from('profiles')
      .select(PROFILE_QUERY)
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          console.error('Loading the profile failed:', error)
          setStatus('error')
          return
        }
        setProfile(data)
        setStatus('ready')
      })

    return () => {
      cancelled = true
    }
  }, [user])

  const students = profile?.students ?? []
  const firstName = profile?.guardian_name?.trim().split(/\s+/)[0]

  return (
    <div className="scs-page">
      <div className="scs-bgfx" />
      <div className="scs-glow scs-glow-blue" />
      <div className="scs-glow scs-glow-green" />

      <div className="scs-content">
        <PageHero
          kicker="منصة ولي الأمر"
          kickerIcon={LayoutDashboard}
          title={firstName ? `أهلًا ${firstName}` : 'أهلًا بيك'}
          accent="في منصتك"
          lead="من هنا بتتابع بيانات الطالب والكورسات المسجّل فيها. أي تعديل أو إضافة كورس كلّمنا وهنظبطها."
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

          {status === 'ready' && !profile && (
            <p className="scs-form-error max-w-lg mx-auto" role="alert">
              <AlertCircle size={15} />
              <span>
                الحساب ده لسه ماتربطش ببيانات ولي أمر. <Link to="/contact">كلّمنا</Link> وهنظبطه.
              </span>
            </p>
          )}

          {status === 'ready' && profile && (
            <div className="grid lg:grid-cols-5 gap-6 items-start">
              {/* Account details */}
              <div className="lg:col-span-2 flex flex-col gap-4 scs-reveal is-visible">
                <div className="scs-card scs-card-static p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="scs-icon-wrap scs-tint-blue">
                      <User size={20} />
                    </span>
                    <h2 className="scs-card-title text-base">ولي الأمر</h2>
                  </div>
                  <ul className="scs-list">
                    <InfoRow icon={User} label="الاسم" value={profile.guardian_name} />
                    <InfoRow icon={Phone} label="الموبايل" value={profile.guardian_phone} ltr />
                    <InfoRow icon={Mail} label="الإيميل" value={profile.email ?? user.email} ltr />
                  </ul>
                </div>

                {students.map((s) => (
                  <div key={s.id} className="scs-card scs-card-static p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="scs-icon-wrap scs-tint-green">
                        <GraduationCap size={20} />
                      </span>
                      <h2 className="scs-card-title text-base">الطالب</h2>
                    </div>
                    <ul className="scs-list">
                      <InfoRow icon={User} label="الاسم" value={s.name} />
                      <InfoRow icon={Phone} label="الموبايل" value={s.phone} ltr />
                    </ul>
                  </div>
                ))}
              </div>

              {/* Enrollments */}
              <div
                className="lg:col-span-3 scs-card scs-card-static p-7 md:p-9 scs-reveal is-visible"
                data-delay="1"
              >
                <span className="scs-kicker block mb-3">// الكورسات</span>
                <h2 className="scs-h2 text-xl md:text-2xl mb-6">الكورسات المسجّل فيها</h2>

                {students.every((s) => (s.enrollments ?? []).length === 0) ? (
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
                    {students.flatMap((s) =>
                      (s.enrollments ?? []).map((en) => {
                        const st = statusLabels[en.status] ?? statusLabels.active
                        return (
                          <div key={en.id} className="scs-enrollment">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="scs-card-title text-base">{en.course}</h3>
                                {students.length > 1 && (
                                  <span className="scs-enrollment-student">{s.name}</span>
                                )}
                              </div>
                              <span className={`scs-badge-pill ${st.tone}`}>{st.text}</span>
                            </div>
                            <ul className="scs-list mt-3">
                              <InfoRow icon={GraduationCap} label="المستوى" value={en.level} />
                              <InfoRow icon={BookOpen} label="المواعيد" value={en.schedule} />
                              <InfoRow icon={LayoutDashboard} label="البداية" value={en.starts_on} ltr />
                            </ul>
                          </div>
                        )
                      }),
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
