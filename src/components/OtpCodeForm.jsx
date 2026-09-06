import { useState } from 'react'
import { KeyRound, AlertCircle, ArrowRight } from 'lucide-react'

const CODE_RE = /^\d{6}$/

/**
 * Second step of the email login: the 6-digit code input. Shared by the
 * login and signup pages so both behave identically.
 */
export default function OtpCodeForm({ email, busy, error, onVerify, onResend, onBack }) {
  const [code, setCode] = useState('')
  const [resent, setResent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!CODE_RE.test(code)) return
    onVerify(code)
  }

  const handleResend = async () => {
    setResent(false)
    const ok = await onResend()
    if (ok) setResent(true)
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <p className="scs-card-text">
        بعتنالك كود من ٦ أرقام على <span dir="ltr" className="scs-mono-inline">{email}</span>. اكتبه
        هنا عشان تدخل. لو مش لاقيه، بص في فولدر الـ Spam.
      </p>

      <div>
        <label className="scs-label" htmlFor="otp">
          كود الدخول
        </label>
        <input
          id="otp"
          name="otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{6}"
          maxLength={6}
          required
          autoFocus
          dir="ltr"
          className="scs-input scs-otp-input"
          placeholder="••••••"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
        />
      </div>

      <button
        type="submit"
        className="scs-btn-primary w-full px-8 py-3"
        disabled={busy || !CODE_RE.test(code)}
        style={busy ? { opacity: 0.7, cursor: 'wait' } : undefined}
      >
        {busy ? 'جاري التحقق...' : 'تأكيد الكود'}
        <KeyRound size={16} />
      </button>

      {error && (
        <p className="scs-form-error" role="alert">
          <AlertCircle size={15} />
          <span>{error}</span>
        </p>
      )}

      {resent && !error && (
        <p className="scs-form-info" role="status">
          اتبعت كود جديد. الكود القديم مابقاش شغال.
        </p>
      )}

      <div className="flex items-center justify-between gap-4 text-sm">
        <button type="button" className="scs-text-link" onClick={handleResend} disabled={busy}>
          ابعت الكود تاني
        </button>
        <button type="button" className="scs-text-link inline-flex items-center gap-1" onClick={onBack}>
          <ArrowRight size={14} />
          غيّر الإيميل
        </button>
      </div>
    </form>
  )
}
