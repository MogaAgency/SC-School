import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { LogIn, AlertCircle } from 'lucide-react'
import PageHero from '../components/PageHero'
import PasswordField from '../components/PasswordField'
import useAuth from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { describeAuthError, NOT_CONFIGURED } from '../lib/authErrors'

export default function Login() {
  const { user } = useAuth()
  const location = useLocation()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  // Already signed in (or just signed in): go where they were headed.
  if (user) return <Navigate to={location.state?.from || '/platform'} replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (busy) return
    if (!supabase) {
      setError(NOT_CONFIGURED)
      return
    }

    const data = Object.fromEntries(new FormData(e.currentTarget))
    setBusy(true)
    setError('')

    const { error: err } = await supabase.auth.signInWithPassword({
      email: data.email?.toString().trim(),
      password: data.password?.toString(),
    })

    setBusy(false)
    if (err) setError(describeAuthError(err))
    // On success AuthProvider picks up the session and the redirect above fires.
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
          lead="ادخل بالإيميل والباسورد اللي سجّلت بيهم."
        />

        <section className="max-w-md mx-auto px-4 pb-20">
          <div className="scs-card scs-card-static p-7 md:p-9 scs-reveal is-visible">
            <span className="scs-kicker block mb-3">// تسجيل الدخول</span>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
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

              <PasswordField id="password" label="الباسورد" autoComplete="current-password" minLength={1} />

              <div className="text-left">
                <Link to="/forgot-password" className="scs-text-link">
                  نسيت الباسورد؟
                </Link>
              </div>

              <button
                type="submit"
                className="scs-btn-primary w-full px-8 py-3"
                disabled={busy}
                style={busy ? { opacity: 0.7, cursor: 'wait' } : undefined}
              >
                {busy ? 'جاري الدخول...' : 'دخول'}
                <LogIn size={16} />
              </button>

              {error && (
                <p className="scs-form-error" role="alert">
                  <AlertCircle size={15} />
                  <span>{error}</span>
                </p>
              )}
            </form>

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
