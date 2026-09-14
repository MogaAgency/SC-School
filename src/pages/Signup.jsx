import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { UserPlus, AlertCircle, MailCheck } from 'lucide-react'
import PageHero from '../components/PageHero'
import PasswordField from '../components/PasswordField'
import useAuth from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { describeAuthError, NOT_CONFIGURED } from '../lib/authErrors'

export default function Signup() {
  const { user } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  // Set when "Confirm email" is on in Supabase and the account needs a click
  // in the inbox before it can sign in.
  const [pendingEmail, setPendingEmail] = useState('')

  if (user) return <Navigate to="/platform" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (busy) return

    const data = Object.fromEntries(new FormData(e.currentTarget))

    // Honeypot: bots fill hidden fields, humans never see this one.
    if (data.botcheck) return

    if (!supabase) {
      setError(NOT_CONFIGURED)
      return
    }

    setBusy(true)
    setError('')

    const email = data.email?.toString().trim()
    const { data: result, error: err } = await supabase.auth.signUp({
      email,
      password: data.password?.toString(),
      options: {
        // Lands in auth.users.raw_user_meta_data; the database trigger in
        // supabase/schema.sql copies it into the students table.
        data: {
          name: data.name?.toString().trim(),
          phone: data.phone?.toString().trim(),
          guardian_name: data.guardian_name?.toString().trim(),
          guardian_phone: data.guardian_phone?.toString().trim(),
          consent: Boolean(data.consent),
        },
      },
    })

    setBusy(false)

    if (err) {
      setError(describeAuthError(err))
      return
    }

    // With email confirmation off Supabase returns a session and the
    // redirect above fires. With it on there is no session yet.
    if (!result.session) setPendingEmail(email)
  }

  return (
    <div className="scs-page">
      <div className="scs-bgfx" />
      <div className="scs-glow scs-glow-blue" />
      <div className="scs-glow scs-glow-green" />

      <div className="scs-content">
        <PageHero
          kicker="منصة الطالب"
          kickerIcon={UserPlus}
          title="حساب"
          accent="جديد"
          lead="سجّل بياناتك مرة واحدة، وبعدها الدخول بالإيميل والباسورد."
        />

        <section className="max-w-2xl mx-auto px-4 pb-20">
          <div className="scs-card scs-card-static p-7 md:p-9 scs-reveal is-visible">
            <span className="scs-kicker block mb-3">// إنشاء حساب</span>

            {pendingEmail ? (
              <div className="flex flex-col items-center text-center py-10">
                <div className="scs-icon-wrap scs-tint-green mb-5">
                  <MailCheck size={22} />
                </div>
                <h3 className="scs-card-title text-lg mb-2">أكّد الإيميل بتاعك</h3>
                <p className="scs-card-text max-w-sm">
                  بعتنالك رسالة على <span dir="ltr" className="scs-mono-inline">{pendingEmail}</span>.
                  اضغط على اللينك اللي فيها وبعدها ادخل بالإيميل والباسورد.
                </p>
                <Link to="/login" className="scs-btn-secondary mt-7">
                  روح لصفحة الدخول
                </Link>
              </div>
            ) : (
              <form className="grid sm:grid-cols-2 gap-5" onSubmit={handleSubmit}>
                <div>
                  <label className="scs-label" htmlFor="name">
                    اسم الطالب
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className="scs-input"
                    placeholder="اسمك بالكامل"
                  />
                </div>

                <div>
                  <label className="scs-label" htmlFor="phone">
                    رقم الطالب
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    dir="ltr"
                    className="scs-input text-right"
                    placeholder="01XX XXX XXXX"
                  />
                </div>

                <div>
                  <label className="scs-label" htmlFor="email">
                    البريد الإلكتروني
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    dir="ltr"
                    className="scs-input text-right"
                    placeholder="you@example.com"
                  />
                </div>

                <PasswordField
                  id="password"
                  label="الباسورد"
                  autoComplete="new-password"
                  hint="// ٨ حروف أو أرقام على الأقل"
                />

                <div className="sm:col-span-2 scs-form-divider">
                  <span className="scs-kicker">// بيانات ولي الأمر</span>
                  <p className="scs-card-text mt-1">
                    بنتواصل مع ولي الأمر لو فيه تأخير في الكورس أو أي ملاحظات على الطالب.
                  </p>
                </div>

                <div>
                  <label className="scs-label" htmlFor="guardian_name">
                    اسم ولي الأمر
                  </label>
                  <input
                    id="guardian_name"
                    name="guardian_name"
                    type="text"
                    required
                    className="scs-input"
                    placeholder="الاسم بالكامل"
                  />
                </div>

                <div>
                  <label className="scs-label" htmlFor="guardian_phone">
                    رقم ولي الأمر
                  </label>
                  <input
                    id="guardian_phone"
                    name="guardian_phone"
                    type="tel"
                    required
                    dir="ltr"
                    className="scs-input text-right"
                    placeholder="01XX XXX XXXX"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="scs-consent" htmlFor="consent">
                    <input id="consent" name="consent" type="checkbox" required />
                    <span>
                      أوافق على إن SC School تحتفظ بالبيانات دي عشان حساب المنصة ومتابعة الكورسات،
                      وتتواصل مع ولي الأمر عند الحاجة، وقريت{' '}
                      <Link to="/privacy">سياسة الخصوصية</Link>. لو سنك أقل من ١٨ سنة، التسجيل
                      بيكون بموافقة ولي الأمر.
                    </span>
                  </label>
                </div>

                {/* Honeypot — hidden from people, tempting to bots. */}
                <input
                  type="checkbox"
                  name="botcheck"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="scs-btn-primary w-full px-8 py-3"
                    disabled={busy}
                    style={busy ? { opacity: 0.7, cursor: 'wait' } : undefined}
                  >
                    {busy ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
                    <UserPlus size={16} />
                  </button>

                  {error && (
                    <p className="scs-form-error" role="alert">
                      <AlertCircle size={15} />
                      <span>{error}</span>
                    </p>
                  )}
                </div>
              </form>
            )}

            {!pendingEmail && (
              <p className="scs-card-text text-center mt-7">
                عندك حساب؟{' '}
                <Link to="/login" className="scs-text-link">
                  ادخل من هنا
                </Link>
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
