import { useState } from 'react'
import { Link } from 'react-router-dom'
import { KeyRound, Mail, AlertCircle, MailCheck } from 'lucide-react'
import PageHero from '../components/PageHero'
import { supabase } from '../lib/supabase'
import { describeAuthError, NOT_CONFIGURED } from '../lib/authErrors'

export default function ForgotPassword() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [sentTo, setSentTo] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (busy) return
    if (!supabase) {
      setError(NOT_CONFIGURED)
      return
    }

    const email = new FormData(e.currentTarget).get('email')?.toString().trim() ?? ''
    setBusy(true)
    setError('')

    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      // The link in the email lands here with a recovery session in the URL.
      // The origin must be in Supabase → Authentication → URL Configuration.
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setBusy(false)
    if (err) {
      setError(describeAuthError(err))
      return
    }
    // Supabase answers the same whether or not the email exists, so we do too.
    setSentTo(email)
  }

  return (
    <div className="scs-page">
      <div className="scs-bgfx" />
      <div className="scs-glow scs-glow-blue" />
      <div className="scs-glow scs-glow-green" />

      <div className="scs-content">
        <PageHero
          kicker="منصة الطالب"
          kickerIcon={KeyRound}
          title="نسيت"
          accent="الباسورد؟"
          lead="اكتب الإيميل اللي سجّلت بيه وهنبعتلك لينك تعمل بيه باسورد جديد."
        />

        <section className="max-w-md mx-auto px-4 pb-20">
          <div className="scs-card scs-card-static p-7 md:p-9 scs-reveal is-visible">
            {sentTo ? (
              <div className="flex flex-col items-center text-center py-6">
                <div className="scs-icon-wrap scs-tint-green mb-5">
                  <MailCheck size={22} />
                </div>
                <h3 className="scs-card-title text-lg mb-2">بص في الإيميل</h3>
                <p className="scs-card-text max-w-sm">
                  لو <span dir="ltr" className="scs-mono-inline">{sentTo}</span> مسجّل عندنا، هتوصلك
                  رسالة فيها لينك. لو مش لاقيها بص في فولدر الـ Spam.
                </p>
                <Link to="/login" className="scs-btn-secondary mt-7">
                  رجوع للدخول
                </Link>
              </div>
            ) : (
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <span className="scs-kicker block">// استرجاع الباسورد</span>
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
                  disabled={busy}
                  style={busy ? { opacity: 0.7, cursor: 'wait' } : undefined}
                >
                  {busy ? 'جاري الإرسال...' : 'ابعتلي اللينك'}
                  <Mail size={16} />
                </button>

                {error && (
                  <p className="scs-form-error" role="alert">
                    <AlertCircle size={15} />
                    <span>{error}</span>
                  </p>
                )}

                <p className="scs-card-text text-center">
                  افتكرته؟{' '}
                  <Link to="/login" className="scs-text-link">
                    ارجع للدخول
                  </Link>
                </p>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
