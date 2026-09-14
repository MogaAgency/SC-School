import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { KeyRound, AlertCircle } from 'lucide-react'
import PageHero from '../components/PageHero'
import PasswordField from '../components/PasswordField'
import useAuth from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { describeAuthError, NOT_CONFIGURED } from '../lib/authErrors'

/**
 * Where the reset-password email link lands. supabase-js reads the recovery
 * session out of the URL on load, which makes `user` non-null here; then the
 * new password is saved with updateUser.
 */
export default function ResetPassword() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (busy) return
    if (!supabase) {
      setError(NOT_CONFIGURED)
      return
    }

    const data = Object.fromEntries(new FormData(e.currentTarget))
    if (data.password !== data.confirm) {
      setError('الباسورد والتأكيد مش متطابقين.')
      return
    }

    setBusy(true)
    setError('')
    const { error: err } = await supabase.auth.updateUser({ password: data.password?.toString() })
    setBusy(false)

    if (err) {
      setError(describeAuthError(err))
      return
    }
    navigate('/platform', { replace: true })
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
          title="باسورد"
          accent="جديد"
          lead="اختار باسورد جديد لحسابك."
        />

        <section className="max-w-md mx-auto px-4 pb-20">
          <div className="scs-card scs-card-static p-7 md:p-9 scs-reveal is-visible">
            {loading ? (
              <p className="scs-auth-loading text-center">// جاري التحقق من اللينك...</p>
            ) : !user ? (
              <div className="flex flex-col items-center text-center py-6">
                <p className="scs-form-error max-w-sm" role="alert">
                  <AlertCircle size={15} />
                  <span>اللينك ده مش شغال أو انتهت صلاحيته. اطلب لينك جديد.</span>
                </p>
                <Link to="/forgot-password" className="scs-btn-secondary mt-6">
                  اطلب لينك جديد
                </Link>
              </div>
            ) : (
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <span className="scs-kicker block">// تغيير الباسورد</span>

                <PasswordField
                  id="password"
                  label="الباسورد الجديد"
                  autoComplete="new-password"
                  hint="// ٨ حروف أو أرقام على الأقل"
                />
                <PasswordField id="confirm" label="تأكيد الباسورد" autoComplete="new-password" />

                <button
                  type="submit"
                  className="scs-btn-primary w-full px-8 py-3"
                  disabled={busy}
                  style={busy ? { opacity: 0.7, cursor: 'wait' } : undefined}
                >
                  {busy ? 'جاري الحفظ...' : 'حفظ الباسورد'}
                  <KeyRound size={16} />
                </button>

                {error && (
                  <p className="scs-form-error" role="alert">
                    <AlertCircle size={15} />
                    <span>{error}</span>
                  </p>
                )}
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
