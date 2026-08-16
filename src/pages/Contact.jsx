import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Check, AlertCircle } from 'lucide-react'
import PageHero from '../components/PageHero'
import useReveal from '../hooks/useReveal'
import { programmingCourseNames } from '../data/programmingCourses'

const channels = [
  {
    icon: Mail,
    label: 'البريد الإلكتروني',
    value: 'info@sc-school.com',
    href: 'mailto:info@sc-school.com',
    tint: 'blue',
  },
  {
    icon: Phone,
    label: 'اتصل بينا',
    value: '+20 102 007 0616',
    href: 'tel:+201020070616',
    tint: 'green',
  },
  {
    icon: MessageCircle,
    label: 'واتساب',
    value: '+20 102 007 0616',
    href: 'https://wa.me/201020070616',
    tint: 'gold',
  },
]

const tracks = [
  'مسار البرمجة',
  'مسار البكالوريا',
  'مش متأكد — محتاج ترشيح',
]

const PROGRAMMING_TRACK = 'مسار البرمجة'
const BAC_TRACK = 'مسار البكالوريا'

const bacLevels = ['أولى ثانوي', 'تانية ثانوي']

/**
 * The field under the track picker: a course list for البرمجة, a school
 * year for البكالوريا, and the plain age input for anything else.
 */
const fieldByTrack = {
  [PROGRAMMING_TRACK]: {
    id: 'course',
    label: 'الكورس المهتم بيه',
    options: programmingCourseNames,
  },
  [BAC_TRACK]: {
    id: 'level',
    label: 'السنة الدراسية',
    options: bacLevels,
  },
}

// Tolerate the quotes/whitespace that survive a copy-paste into a hosting
// dashboard — Web3Forms rejects the whole request over a stray newline.
const ACCESS_KEY = (import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ?? '')
  .trim()
  .replace(/^['"]|['"]$/g, '')

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default function Contact() {
  useReveal()
  // 'idle' | 'sending' | 'sent' | 'error'
  const [status, setStatus] = useState('idle')
  // starts empty so picking any track visibly swaps the field below it
  const [track, setTrack] = useState('')

  const trackField = fieldByTrack[track]
  const sending = status === 'sending'

  const resetForm = () => {
    setTrack('')
    setStatus('idle')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (sending) return

    const data = Object.fromEntries(new FormData(e.currentTarget))

    // Honeypot: bots fill hidden fields, humans never see this one.
    if (data.botcheck) return

    if (!ACCESS_KEY) {
      console.error('VITE_WEB3FORMS_ACCESS_KEY is not set — the form cannot send.')
      setStatus('error')
      return
    }

    if (!UUID_RE.test(ACCESS_KEY)) {
      console.error(
        `VITE_WEB3FORMS_ACCESS_KEY is not a valid UUID (got ${ACCESS_KEY.length} chars: ` +
          `"${ACCESS_KEY}"). Check the value saved on the host for stray quotes, spaces ` +
          'or a copied "KEY=" prefix.',
      )
      setStatus('error')
      return
    }

    setStatus('sending')

    // Arabic keys so the notification email reads properly.
    const answer = trackField
      ? { [trackField.label]: data[trackField.id] }
      : { 'سن الطالب': data.age || 'مش محدد' }

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `طلب جديد من الموقع — ${data.track}`,
          from_name: 'SC School Website',
          name: data.name,
          email: data.email,
          'رقم الموبايل': data.phone,
          'المسار المهتم بيه': data.track,
          ...answer,
          'الرسالة': data.message || '—',
        }),
      })

      const result = await res.json()
      if (!res.ok || !result.success) throw new Error(result.message || 'submission failed')

      setStatus('sent')
    } catch (err) {
      console.error('Web3Forms submission failed:', err)
      setStatus('error')
    }
  }

  return (
    <div className="scs-page">
      <div className="scs-bgfx" />
      <div className="scs-glow scs-glow-blue" />
      <div className="scs-glow scs-glow-green" />

      <div className="scs-content">
        <PageHero
          kicker="بنرد خلال ٢٤ ساعة"
          kickerIcon={Clock}
          title="تواصل"
          accent="معانا"
          lead="سيبلنا بياناتك وهنكلّمك نرشّحلك المسار المناسب، أو كلّمنا على طول على أي رقم من دول."
        />

        <section className="max-w-6xl mx-auto px-4 pb-20">
          <div className="grid lg:grid-cols-5 gap-6 items-start">
            {/* Form */}
            <div className="lg:col-span-3 scs-card scs-card-static p-7 md:p-9 scs-reveal is-visible">
              <span className="scs-kicker block mb-3">// ابعتلنا رسالة</span>
              <h2 className="scs-h2 text-xl md:text-2xl mb-6">املأ البيانات وهنرجعلك</h2>

              {status === 'sent' ? (
                <div className="flex flex-col items-center text-center py-10">
                  <div className="scs-icon-wrap scs-tint-green mb-5">
                    <Check size={22} />
                  </div>
                  <h3 className="scs-card-title text-lg mb-2">وصلتنا رسالتك ✅</h3>
                  <p className="scs-card-text max-w-sm">
                    شكرًا لتواصلك مع SC School، هنرد عليك في أقرب وقت خلال ٢٤ ساعة.
                  </p>
                  <button type="button" className="scs-btn-secondary mt-7" onClick={resetForm}>
                    ابعت رسالة تانية
                  </button>
                </div>
              ) : (
                <form className="grid sm:grid-cols-2 gap-5" onSubmit={handleSubmit}>
                  <div>
                    <label className="scs-label" htmlFor="name">
                      الاسم
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="scs-input"
                      placeholder="اسم الطالب أو ولي الأمر"
                    />
                  </div>

                  <div>
                    <label className="scs-label" htmlFor="phone">
                      رقم الموبايل
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      dir="ltr"
                      className="scs-input text-right"
                      placeholder="+20 1XX XXX XXXX"
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
                      dir="ltr"
                      className="scs-input text-right"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="scs-label" htmlFor="track">
                      المسار المهتم بيه
                    </label>
                    <select
                      id="track"
                      name="track"
                      required
                      className="scs-select"
                      value={track}
                      onChange={(e) => setTrack(e.target.value)}
                    >
                      <option value="" disabled>
                        اختار المسار
                      </option>
                      {tracks.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {trackField ? (
                    <div key={trackField.id}>
                      <label className="scs-label" htmlFor={trackField.id}>
                        {trackField.label}
                      </label>
                      <select
                        id={trackField.id}
                        name={trackField.id}
                        className="scs-select"
                        defaultValue={trackField.options[0]}
                      >
                        {trackField.options.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="scs-label" htmlFor="age">
                        سن الطالب
                      </label>
                      <input
                        id="age"
                        name="age"
                        type="number"
                        min="9"
                        max="18"
                        className="scs-input"
                        placeholder="من ٩ لـ ١٨"
                      />
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <label className="scs-label" htmlFor="message">
                      رسالتك
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="scs-textarea"
                      placeholder="اكتب استفسارك هنا..."
                    />
                    <span className="scs-field-hint">
                      // كل البيانات دي بتستخدم للتواصل معاك بس
                    </span>
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
                      disabled={sending}
                      style={sending ? { opacity: 0.7, cursor: 'wait' } : undefined}
                    >
                      {sending ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                      <Send size={16} />
                    </button>

                    {status === 'error' && (
                      <p className="scs-form-error" role="alert">
                        <AlertCircle size={15} />
                        <span>
                          حصلت مشكلة والرسالة مااتبعتتش. جرّب تاني، أو كلّمنا على واتساب{' '}
                          <a href="https://wa.me/201020070616" target="_blank" rel="noreferrer">
                            من هنا
                          </a>
                          .
                        </span>
                      </p>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* Channels */}
            <div className="lg:col-span-2 flex flex-col gap-4 scs-reveal is-visible" data-delay="1">
              {channels.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  className="scs-channel"
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                >
                  <span className={`scs-icon-wrap scs-tint-${c.tint}`}>
                    <c.icon size={20} />
                  </span>
                  <span>
                    <span className="scs-channel-label">{c.label}</span>
                    <span className="scs-channel-value">{c.value}</span>
                  </span>
                </a>
              ))}

              <div className="scs-card scs-card-static p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="scs-icon-wrap scs-tint-blue">
                    <Clock size={20} />
                  </span>
                  <h3 className="scs-card-title text-base">مواعيد العمل</h3>
                </div>
                <ul className="scs-list">
                  <li className="scs-list-item">
                    <Check size={16} />
                    <span>السبت — الخميس · ١٠ ص إلى ٨ م</span>
                  </li>
                  <li className="scs-list-item">
                    <Check size={16} />
                    <span>الجمعة · إجازة</span>
                  </li>
                </ul>
              </div>

              <div className="scs-card scs-card-static p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="scs-icon-wrap scs-tint-gold">
                    <MapPin size={20} />
                  </span>
                  <h3 className="scs-card-title text-base">مقر المدرسة</h3>
                </div>
                <p className="scs-card-text">
                  الحصص متاحة أونلاين لكل المحافظات، وحضوريًا في المقر بمواعيد محددة.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
