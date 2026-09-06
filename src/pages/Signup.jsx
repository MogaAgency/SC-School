import { Link, Navigate } from 'react-router-dom'
import { UserPlus, Mail, AlertCircle } from 'lucide-react'
import PageHero from '../components/PageHero'
import OtpCodeForm from '../components/OtpCodeForm'
import useAuth from '../hooks/useAuth'
import useEmailOtp from '../hooks/useEmailOtp'

export default function Signup() {
  const { user } = useAuth()
  const otp = useEmailOtp()

  if (user) return <Navigate to="/platform" replace />

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))

    // Honeypot: bots fill hidden fields, humans never see this one.
    if (data.botcheck) return

    const email = data.email?.toString().trim() ?? ''
    if (!email) return

    // The metadata lands in auth.users.raw_user_meta_data; the database
    // trigger in supabase/schema.sql copies it into profiles + students.
    otp.sendCode(email, {
      shouldCreateUser: true,
      data: {
        guardian_name: data.guardian_name?.toString().trim(),
        guardian_phone: data.guardian_phone?.toString().trim(),
        student_name: data.student_name?.toString().trim(),
        student_phone: data.student_phone?.toString().trim(),
        consent: Boolean(data.consent),
      },
    })
  }

  return (
    <div className="scs-page">
      <div className="scs-bgfx" />
      <div className="scs-glow scs-glow-blue" />
      <div className="scs-glow scs-glow-green" />

      <div className="scs-content">
        <PageHero
          kicker="منصة ولي الأمر"
          kickerIcon={UserPlus}
          title="حساب"
          accent="جديد"
          lead="سجّل بياناتك وبيانات الطالب مرة واحدة، وبعدها الدخول بكود على الإيميل من غير باسورد."
        />

        <section className="max-w-2xl mx-auto px-4 pb-20">
          <div className="scs-card scs-card-static p-7 md:p-9 scs-reveal is-visible">
            <span className="scs-kicker block mb-3">// إنشاء حساب</span>

            {otp.step === 'code' ? (
              <OtpCodeForm
                email={otp.email}
                busy={otp.busy}
                error={otp.error}
                onVerify={otp.verifyCode}
                onResend={otp.resend}
                onBack={otp.back}
              />
            ) : (
              <form className="grid sm:grid-cols-2 gap-5" onSubmit={handleSubmit}>
                <div>
                  <label className="scs-label" htmlFor="guardian_name">
                    اسم ولي الأمر
                  </label>
                  <input
                    id="guardian_name"
                    name="guardian_name"
                    type="text"
                    required
                    autoComplete="name"
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
                    autoComplete="tel"
                    dir="ltr"
                    className="scs-input text-right"
                    placeholder="+20 1XX XXX XXXX"
                  />
                </div>

                <div>
                  <label className="scs-label" htmlFor="student_name">
                    اسم الطالب
                  </label>
                  <input
                    id="student_name"
                    name="student_name"
                    type="text"
                    required
                    className="scs-input"
                    placeholder="اسم الطالب"
                  />
                </div>

                <div>
                  <label className="scs-label" htmlFor="student_phone">
                    رقم الطالب <span className="scs-optional">(اختياري)</span>
                  </label>
                  <input
                    id="student_phone"
                    name="student_phone"
                    type="tel"
                    dir="ltr"
                    className="scs-input text-right"
                    placeholder="+20 1XX XXX XXXX"
                  />
                </div>

                <div className="sm:col-span-2">
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
                  <span className="scs-field-hint">// ده الإيميل اللي هيوصله كود الدخول كل مرة</span>
                </div>

                <div className="sm:col-span-2">
                  <label className="scs-consent" htmlFor="consent">
                    <input id="consent" name="consent" type="checkbox" required />
                    <span>
                      أوافق على إن SC School تحتفظ بالبيانات دي عشان حساب المنصة ومتابعة الكورسات،
                      وقريت <Link to="/privacy">سياسة الخصوصية</Link>. الحساب ده لولي الأمر، وبيانات
                      الطالب بتتسجّل بموافقته.
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
                    disabled={otp.busy}
                    style={otp.busy ? { opacity: 0.7, cursor: 'wait' } : undefined}
                  >
                    {otp.busy ? 'جاري الإرسال...' : 'ابعتلي كود التفعيل'}
                    <Mail size={16} />
                  </button>

                  {otp.error && (
                    <p className="scs-form-error" role="alert">
                      <AlertCircle size={15} />
                      <span>{otp.error}</span>
                    </p>
                  )}
                </div>
              </form>
            )}

            <p className="scs-card-text text-center mt-7">
              عندك حساب؟{' '}
              <Link to="/login" className="scs-text-link">
                ادخل من هنا
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
