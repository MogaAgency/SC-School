import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

/** A password input with a show/hide toggle, styled like the other inputs. */
export default function PasswordField({
  id,
  name = id,
  label,
  autoComplete,
  placeholder = '••••••••',
  minLength = 8,
  hint,
}) {
  const [shown, setShown] = useState(false)

  return (
    <div>
      <label className="scs-label" htmlFor={id}>
        {label}
      </label>
      <div className="scs-pw-wrap">
        <input
          id={id}
          name={name}
          type={shown ? 'text' : 'password'}
          required
          minLength={minLength}
          autoComplete={autoComplete}
          dir="ltr"
          className="scs-input text-right"
          placeholder={placeholder}
        />
        <button
          type="button"
          className="scs-pw-toggle"
          onClick={() => setShown((v) => !v)}
          aria-label={shown ? 'إخفاء الباسورد' : 'إظهار الباسورد'}
        >
          {shown ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
      {hint && <span className="scs-field-hint">{hint}</span>}
    </div>
  )
}
