import { AlertCircle } from 'lucide-react'

/** Small shared pieces for the admin pages. */

export function Pill({ on, onText = 'منشور', offText = 'مخفي' }) {
  return <span className={`scs-badge-pill ${on ? 'is-green' : 'is-muted'}`}>{on ? onText : offText}</span>
}

export function ErrorBox({ children }) {
  if (!children) return null
  return (
    <p className="scs-form-error" role="alert">
      <AlertCircle size={15} />
      <span>{children}</span>
    </p>
  )
}

export function Loading({ text = '// جاري التحميل...' }) {
  return <p className="scs-auth-loading text-center py-10">{text}</p>
}

export function Empty({ children }) {
  return <p className="scs-card-text text-center py-8">{children}</p>
}

/** Field wrapper so forms stay short. */
export function Field({ id, label, hint, children }) {
  return (
    <div>
      <label className="scs-label" htmlFor={id}>
        {label}
      </label>
      {children}
      {hint && <span className="scs-field-hint">{hint}</span>}
    </div>
  )
}

export function StatusSelect({ value, onChange, disabled }) {
  return (
    <select
      className="scs-select scs-select-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      aria-label="حالة التسجيل"
    >
      <option value="active">جاري</option>
      <option value="paused">متوقف مؤقتًا</option>
      <option value="completed">مكتمل</option>
    </select>
  )
}
