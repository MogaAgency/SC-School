import { useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

const messages = {
  unregistered: 'الإيميل ده مش مسجّل عندنا. اعمل حساب جديد الأول.',
  badCode: 'الكود غلط أو انتهت صلاحيته. جرّب تاني أو اطلب كود جديد.',
  rateLimit: 'طلبت كود من شوية. استنى دقيقة وجرّب تاني.',
  notConfigured: 'المنصة مش متظبطة على السيرفر ده. كلّمنا لو المشكلة استمرت.',
  generic: 'حصلت مشكلة. جرّب تاني، أو كلّمنا لو استمرت.',
}

/** Turns a Supabase auth error into a short Arabic message for the form. */
function describe(err) {
  const code = err?.code ?? ''
  const msg = (err?.message ?? '').toLowerCase()

  if (code === 'otp_disabled' || msg.includes('signups not allowed')) return messages.unregistered
  if (code === 'over_email_send_rate_limit' || code === 'over_request_rate_limit') {
    return messages.rateLimit
  }
  if (msg.includes('security purposes') || msg.includes('rate limit')) return messages.rateLimit
  if (code === 'otp_expired' || msg.includes('expired') || msg.includes('invalid')) {
    return messages.badCode
  }
  return messages.generic
}

/**
 * The two-step email code flow shared by login and signup:
 *   1. sendCode(email, options)  → Supabase emails a 6-digit code
 *   2. verifyCode(token)         → exchanges it for a session
 *
 * `options` is passed straight to signInWithOtp, so signup can set
 * `shouldCreateUser: true` plus the profile metadata, and login can set
 * `shouldCreateUser: false` to reject unknown emails.
 */
export default function useEmailOtp() {
  const [email, setEmail] = useState('')
  const [step, setStep] = useState('email') // 'email' | 'code'
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const lastOptions = useRef(undefined)

  const sendCode = async (address, options) => {
    if (busy) return false
    if (!supabase) {
      setError(messages.notConfigured)
      return false
    }

    setBusy(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithOtp({ email: address, options })
    setBusy(false)

    if (err) {
      console.error('signInWithOtp failed:', err)
      setError(describe(err))
      return false
    }

    lastOptions.current = options
    setEmail(address)
    setStep('code')
    return true
  }

  const verifyCode = async (token) => {
    if (busy || !supabase) return false

    setBusy(true)
    setError('')
    const { error: err } = await supabase.auth.verifyOtp({ email, token, type: 'email' })
    setBusy(false)

    if (err) {
      console.error('verifyOtp failed:', err)
      setError(describe(err))
      return false
    }
    return true
  }

  const resend = () => sendCode(email, lastOptions.current)

  const back = () => {
    setStep('email')
    setError('')
  }

  return { email, step, busy, error, sendCode, verifyCode, resend, back }
}
