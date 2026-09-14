import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { UserPlus, Mail, AlertCircle } from 'lucide-react'
import PageHero from '../components/PageHero'
import OtpCodeForm from '../components/OtpCodeForm'
import useAuth from '../hooks/useAuth'
import useEmailOtp from '../hooks/useEmailOtp'
import { normalizePhone, isValidPhone } from '../lib/phone'

export default function Signup() {
  const { user } = useAuth()
  const otp = useEmailOtp()
  const [phoneError, setPhoneError] = useState('')

  if (user) return <Navigate to="/platform" replace />

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))

    // Honeypot: bots fill hidden fields, humans never see this one.
    if (data.botcheck) return

    const email = data.email?.toString().trim() ?? ''
    if (!email) return

    const phone = normalizePhone(data.phone)
    const guardianPhone = normalizePhone(data.guardian_phone)
    if (!isValidPhone(phone) || !isValidPhone(guardianPhone)) {
      setPhoneError('اكتب رقم موبايل صحيح، مثلًا 0100 123 4567 أو +20 100 123 4567.')
      return
    }
    setPhoneError('')

    // The metadata lands in auth.users.raw_user_meta_data; the database
    // trigger in supabase/schema.sql copies it into the students table.
    otp.sendCode(email, {
      shouldCreateUser: true,
      data: {
        name: data.name?.toString().trim(),
        phone,
        guardian_name: data.guardian_name?.toString().trim(),
        guardian_phone: guardianPhone,
        consent: Boolean(data.consent),
      },
    })
  }

  const error = phoneError || otp.error

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
          lead="سجّل بياناتك مرة واحدة، وبعدها الدخول بكود على الإيميل من غير باسورد."
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
                    disabled={otp.busy}
                    style={otp.busy ? { opacity: 0.7, cursor: 'wait' } : undefined}
                  >
                    {otp.busy ? 'جاري الإرسال...' : 'ابعتلي كود التفعيل'}
                    <Mail size={16} />
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
