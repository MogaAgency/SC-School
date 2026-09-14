const messages = {
  badCredentials: 'الإيميل أو الباسورد غلط. جرّب تاني.',
  alreadyRegistered: 'الإيميل ده مسجّل قبل كده. ادخل من صفحة الدخول أو استخدم "نسيت الباسورد".',
  weakPassword: 'الباسورد لازم يكون ٨ حروف أو أرقام على الأقل.',
  notConfirmed: 'لسه ماأكدتش الإيميل. افتح الرسالة اللي بعتناهالك واضغط على اللينك.',
  rateLimit: 'حاولت كتير في وقت قصير. استنى دقيقة وجرّب تاني.',
  sessionExpired: 'اللينك ده انتهت صلاحيته. اطلب لينك جديد.',
  notConfigured: 'المنصة مش متظبطة على السيرفر ده. كلّمنا لو المشكلة استمرت.',
  generic: 'حصلت مشكلة. جرّب تاني، أو كلّمنا لو استمرت.',
}

/** Turns a Supabase auth error into a short Arabic message for the form. */
export function describeAuthError(err) {
  const code = err?.code ?? ''
  const msg = (err?.message ?? '').toLowerCase()

  if (code === 'invalid_credentials' || msg.includes('invalid login credentials')) {
    return messages.badCredentials
  }
  if (code === 'user_already_exists' || msg.includes('already registered')) {
    return messages.alreadyRegistered
  }
  if (code === 'weak_password' || msg.includes('password should be')) return messages.weakPassword
  if (code === 'email_not_confirmed') return messages.notConfirmed
  if (code.startsWith('over_') || msg.includes('rate limit') || msg.includes('security purposes')) {
    return messages.rateLimit
  }
  if (code === 'session_not_found' || code === 'otp_expired' || msg.includes('expired')) {
    return messages.sessionExpired
  }
  console.error('Unhandled auth error:', err)
  return messages.generic
}

export const NOT_CONFIGURED = messages.notConfigured
