import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Check } from 'lucide-react'
import PageHero from '../components/PageHero'
import useReveal from '../hooks/useReveal'

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

export default function Contact() {
  useReveal()
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
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

              {sent ? (
                <div className="flex flex-col items-center text-center py-10">
                  <div className="scs-icon-wrap scs-tint-green mb-5">
                    <Check size={22} />
                  </div>
                  <h3 className="scs-card-title text-lg mb-2">وصلتنا رسالتك ✅</h3>
                  <p className="scs-card-text max-w-sm">
                    شكرًا لتواصلك مع SC School، هنرد عليك في أقرب وقت خلال ٢٤ ساعة.
                  </p>
                  <button
                    type="button"
                    className="scs-btn-secondary mt-7"
                    onClick={() => setSent(false)}
                  >
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
                    <select id="track" name="track" className="scs-select" defaultValue={tracks[0]}>
                      {tracks.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

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

                  <div className="sm:col-span-2">
                    <button type="submit" className="scs-btn-primary w-full px-8 py-3">
                      إرسال الرسالة
                      <Send size={16} />
                    </button>
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
