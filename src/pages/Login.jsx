import { Link, Navigate, useLocation } from 'react-router-dom'
import { LogIn, Mail, AlertCircle } from 'lucide-react'
import PageHero from '../components/PageHero'
import OtpCodeForm from '../components/OtpCodeForm'
import useAuth from '../hooks/useAuth'
import useEmailOtp from '../hooks/useEmailOtp'

export default function Login() {
  const { user } = useAuth()
  const location = useLocation()
  const otp = useEmailOtp()

  // Already signed in (or just verified the code): go where they were headed.
  if (user) return <Navigate to={location.state?.from || '/platform'} replace />

  const handleEmailSubmit = (e) => {
    e.preventDefault()
    const email = new FormData(e.currentTarget).get('email')?.toString().trim() ?? ''
    if (!email) return
    // Unknown emails are rejected so the login page can't create accounts.
    otp.sendCode(email, { shouldCreateUser: false })
  }

  return (
    <div className="scs-page">
      <div className="scs-bgfx" />
      <div className="scs-glow scs-glow-blue" />
      <div className="scs-glow scs-glow-green" />

      <div className="scs-content">
        <PageHero
          kicker="منصة الطالب"
          kickerIcon={LogIn}
          title="الدخول"
          accent="للمنصة"
          lead="اكتب الإيميل اللي سجّلت بيه وهنبعتلك كود دخول. مفيش باسورد تفتكره."
        />

        <section className="max-w-md mx-auto px-4 pb-20">
          <div className="scs-card scs-card-static p-7 md:p-9 scs-reveal is-visible">
            <span className="scs-kicker block mb-3">// تسجيل الدخول</span>

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
              <form className="flex flex-col gap-5" onSubmit={handleEmailSubmit}>
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
                    autoFocus
                    dir="ltr"
                    className="scs-input text-right"
                    placeholder="you@example.com"
                  />
                </div>

                <button
                  type="submit"
                  className="scs-btn-primary w-full px-8 py-3"
                  disabled={otp.busy}
                  style={otp.busy ? { opacity: 0.7, cursor: 'wait' } : undefined}
                >
                  {otp.busy ? 'جاري الإرسال...' : 'ابعتلي كود الدخول'}
                  <Mail size={16} />
                </button>

                {otp.error && (
                  <p className="scs-form-error" role="alert">
                    <AlertCircle size={15} />
                    <span>
                      {otp.error}{' '}
                      {otp.error.includes('مش مسجّل') && (
                        <Link to="/signup">إنشاء حساب</Link>
                      )}
                    </span>
                  </p>
                )}
              </form>
            )}

            <p className="scs-card-text text-center mt-7">
              أول مرة هنا؟{' '}
              <Link to="/signup" className="scs-text-link">
                اعمل حساب جديد
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
