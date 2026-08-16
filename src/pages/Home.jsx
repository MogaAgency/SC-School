import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Terminal,
  Users,
  Code2,
  TrendingUp,
  GraduationCap,
  Blocks,
  Bot,
  Globe,
  Shield,
  Cpu,
  Star,
  ArrowLeft,
  Quote,
  Sparkles,
} from 'lucide-react'
import CourseCard from '../components/CourseCard'
import useReveal from '../hooks/useReveal'

const tickerItems = [
  'Scratch',
  'Robotics',
  'Web Development',
  'Programming',
  'Cyber Security',
  'AI',
  'Python',
  'Baccalaureate',
  'Mobile Applications',
]

const features = [
  {
    icon: Users,
    title: 'مدربين متخصصين',
    text: 'مش مجرد مبرمجين، مدربين اتخصصوا في تعليم الأطفال والشباب البرمجة خطوة بخطوة.',
  },
  {
    icon: Code2,
    title: 'تعلّم بالمشاريع',
    text: 'كل كورس مبني على مشروع حقيقي بيشتغل قدام الطالب، مش شرح نظري وبس.',
  },
  {
    icon: TrendingUp,
    title: 'مسار متدرّج حسب السن',
    text: 'من سكراتش البصري لحد الذكاء الاصطناعي، خطوة ورا خطوة من غير قفزات.',
  },
  {
    icon: GraduationCap,
    title: 'بكالوريا منفصلة',
    text: '٣ مستويات بكالوريا بمنهج مستقل تمامًا عن مسار البرمجة.',
  },
]

const courses = [
  {
    category: 'programming',
    icon: Blocks,
    title: 'Scratch',
    description: 'أول خطوة في البرمجة بطريقة بصرية وسهلة، مناسبة للمبتدئين تمامًا.',
    badge: 'مبتدئ',
    detail: '٨ أسابيع',
  },
  {
    category: 'programming',
    icon: Bot,
    title: 'Robotics',
    description: 'بناء وبرمجة روبوتات حقيقية بإيدك، وتشوف نتيجة شغلك بتتحرك قدامك.',
    badge: 'عملي',
    detail: '١٠ أسابيع',
  },
  {
    category: 'programming',
    icon: Globe,
    title: 'Web Development',
    description: 'بناء مواقع من الصفر بـ HTML وCSS وJavaScript خطوة بخطوة.',
    badge: 'متوسط',
    detail: '١٢ أسبوع',
  },
  {
    category: 'programming',
    icon: Code2,
    title: 'Programming',
    description: 'أساسيات البرمجة والتفكير المنطقي بلغة برمجة حقيقية.',
    badge: 'أساسي',
    detail: '٨ أسابيع',
  },
  {
    category: 'programming',
    icon: Shield,
    title: 'Cyber Security',
    description: 'أمن المعلومات وحماية البيانات بمقدمة عملية مناسبة للسن.',
    badge: 'متقدم',
    detail: '٦ أسابيع',
  },
  {
    category: 'programming',
    icon: Cpu,
    title: 'AI & Machine Learning',
    description: 'مدخل عملي لعالم الـ AI، وبناء أول موديل ذكاء اصطناعي بسيط.',
    badge: 'متقدم',
    detail: '١٠ أسابيع',
  },
  {
    category: 'bac',
    icon: GraduationCap,
    title: 'BAC-101 · أول ثانوي',
    description: 'منهج بكالوريا متكامل لأول ثانوي مع حل نماذج امتحانات فعلية.',
    badge: 'مستوى ١',
    detail: 'سنة دراسية',
  },
  {
    category: 'bac',
    icon: GraduationCap,
    title: 'BAC-102 · تانية ثانوي',
    description: 'استكمال المنهج بتركيز على نقاط الضعف الشائعة عند الطلاب.',
    badge: 'مستوى ٢',
    detail: 'سنة دراسية',
  },
  {
    category: 'bac',
    icon: GraduationCap,
    title: 'Grade 10',
    description: 'منهج بمعايير دولية لطلاب الشهادات الأجنبية في نفس السن.',
    badge: 'دولي',
    detail: 'سنة دراسية',
  },
]

const journey = [
  { icon: Blocks, title: 'Scratch', text: 'أول تلامس مع البرمجة', tint: 'blue' },
  { icon: Code2, title: 'Programming', text: 'أساسيات المنطق البرمجي', tint: 'green' },
  { icon: Globe, title: 'Web Development', text: 'بناء أول موقع حقيقي', tint: 'blue' },
  { icon: Bot, title: 'Robotics', text: 'من الشاشة للواقع', tint: 'green' },
  { icon: Shield, title: 'Cyber Security', text: 'حماية اللي بنيته', tint: 'blue' },
  { icon: Cpu, title: 'AI', text: 'أول موديل AI بإيدك', tint: 'green' },
]

const testimonials = [
  {
    text: 'ابني كان خايف من الكمبيوتر، دلوقتي بيعمل مشاريعه لوحده. المدربين صبورين جدًا معاه.',
    name: 'أم يوسف',
    role: 'ولية أمر',
  },
  {
    text: 'الأسلوب العملي فرّق معايا جدًا، بقيت أفهم البرمجة مش بحفظها زي المدرسة.',
    name: 'مريم',
    role: 'طالبة، مسار Web Development',
  },
  {
    text: 'مستوى البكالوريا ساعدني أرفع درجاتي وأفهم المنهج صح من غير ضغط أو حفظ.',
    name: 'أحمد',
    role: 'طالب، BAC-102',
  },
]

const terminalScript = [
  '$ sc-school --init student',
  '> جاري تجهيز مسار التعلّم الخاص بيك...',
  '',
  '✓ Scratch            done',
  '✓ Programming         done',
  '✓ Web Development     done',
  '▹ Robotics            running...',
  '',
  'console.log("Hello, SC School!")',
  '> Hello, SC School! 🚀',
].join('\n')

const iconTints = ['blue', 'green', 'gold']

const trackLinks = {
  programming: { to: '/programming-courses', label: 'كل كورسات البرمجة' },
  bac: { to: '/baccalaureate', label: 'كل مستويات البكالوريا' },
}

function TerminalLine({ line }) {
  let cls = ''
  if (line.startsWith('✓')) cls = 'scs-term-ok'
  else if (line.startsWith('▹')) cls = 'scs-term-pending'
  else if (line.startsWith('>')) cls = 'scs-term-out'
  else if (line.startsWith('$')) cls = 'scs-term-cmd'
  return <span className={cls}>{line}</span>
}

function TerminalWindow() {
  const [typedCount, setTypedCount] = useState(0)

  useEffect(() => {
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      setTypedCount(terminalScript.length)
      return
    }

    const interval = setInterval(() => {
      setTypedCount((prev) => {
        if (prev >= terminalScript.length) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 22)

    return () => clearInterval(interval)
  }, [])

  const lines = terminalScript.slice(0, typedCount).split('\n')
  const done = typedCount >= terminalScript.length

  return (
    <div className="scs-terminal-frame">
      <div className="scs-terminal">
        <div className="flex items-center gap-2 scs-terminal-bar">
          <span className="scs-dot scs-dot-red" />
          <span className="scs-dot scs-dot-yellow" />
          <span className="scs-dot scs-dot-green" />
          <span className="scs-terminal-title mr-2">sc-school — zsh</span>
          <span className="scs-terminal-status mr-auto">
            <Sparkles size={11} /> live
          </span>
        </div>
        <pre className="scs-terminal-body">
          {lines.map((line, i) => (
            <span key={i}>
              <TerminalLine line={line} />
              {i < lines.length - 1 ? '\n' : null}
            </span>
          ))}
          <span className={`scs-cursor ${done ? 'is-idle' : ''}`}> </span>
        </pre>
      </div>
    </div>
  )
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('programming')

  useReveal()

  const visibleCourses = useMemo(
    () => courses.filter((c) => c.category === activeTab),
    [activeTab],
  )

  return (
    <div className="scs-page">
      <div className="scs-bgfx" />
      <div className="scs-glow scs-glow-blue" />
      <div className="scs-glow scs-glow-green" />

      <div className="scs-content">
        {/* Hero */}
        <section
          id="top"
          className="max-w-6xl mx-auto px-4 pt-16 md:pt-24 pb-16 grid md:grid-cols-2 gap-12 items-center"
        >
          <div className="scs-reveal is-visible">
            <span className="scs-kicker-badge mb-6">
              <Terminal size={13} />
              SC-SCHOOL.COM · تعليم برمجة حقيقي لسن ٩-١٨
            </span>
            <h1 className="scs-h1 text-4xl md:text-5xl mb-6">
              من أول بلوك في Scratch
              <br />
              لحد أول <span className="scs-accent">موديل ذكاء اصطناعي</span>
            </h1>
            <p className="scs-lead text-lg mb-9 max-w-lg">
              منصة SC School بتقدّم مسار برمجة متدرّج حسب السن، وكورسات بكالوريا منفصلة، بأسلوب
              عملي قائم على مشاريع حقيقية مش الحفظ.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <Link to="/contact" className="scs-btn-primary px-7 py-3">
                احجز مكانك دلوقتي
                <ArrowLeft size={16} />
              </Link>
              <a href="#tracks" className="scs-btn-secondary px-7 py-3">
                شوف المسارات
              </a>
            </div>
            <div className="scs-stats flex flex-wrap gap-8 pt-6">
              <div>
                <div className="scs-stat-num">+500</div>
                <div className="scs-stat-label">طالب مسجّل</div>
              </div>
              <div>
                <div className="scs-stat-num">٦</div>
                <div className="scs-stat-label">مسارات برمجة</div>
              </div>
              <div>
                <div className="scs-stat-num">٣</div>
                <div className="scs-stat-label">مستويات بكالوريا</div>
              </div>
            </div>
          </div>

          <div className="scs-reveal is-visible" data-delay="1">
            <TerminalWindow />
          </div>
        </section>

        {/* Ticker */}
        <div className="scs-ticker" dir="ltr" aria-hidden="true">
          <div className="scs-ticker-inner">
            {[0, 1].map((copy) => (
              <span key={copy} className="scs-ticker-item">
                {tickerItems.map((item) => (
                  <span key={item} className="scs-ticker-item">
                    {item}
                    <span className="scs-ticker-sep">✦</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* Features */}
        <section id="features" className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center max-w-xl mx-auto mb-12 scs-reveal">
            <span className="scs-kicker block mb-3">// ليه SC SCHOOL</span>
            <h2 className="scs-h2 text-2xl md:text-3xl">مش مجرد كورسات، منهج متكامل</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div key={f.title} className="scs-card p-6 scs-reveal" data-delay={String(i)}>
                <div className={`scs-icon-wrap mb-5 scs-tint-${iconTints[i % 3]}`}>
                  <f.icon size={22} />
                </div>
                <h3 className="scs-card-title text-base mb-2">{f.title}</h3>
                <p className="scs-card-text">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tracks / Tabs */}
        <section id="tracks" className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center max-w-xl mx-auto mb-10 scs-reveal">
            <span className="scs-kicker block mb-3">// المسارات</span>
            <h2 className="scs-h2 text-2xl md:text-3xl mb-8">اختار مسارك</h2>
            <div className="scs-tabs">
              <button
                type="button"
                className={`scs-tab ${activeTab === 'programming' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('programming')}
              >
                مسار البرمجة
              </button>
              <button
                type="button"
                className={`scs-tab ${activeTab === 'bac' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('bac')}
              >
                مسار البكالوريا
              </button>
            </div>
          </div>

          <div key={activeTab} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleCourses.map((c, i) => (
              <CourseCard key={c.title} {...c} tint={iconTints[i % 3]} index={i} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to={trackLinks[activeTab].to} className="scs-btn-secondary px-7 py-3">
              {trackLinks[activeTab].label}
              <ArrowLeft size={16} />
            </Link>
          </div>
        </section>

        {/* Journey timeline */}
        <section id="journey" className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center max-w-xl mx-auto mb-14 scs-reveal">
            <span className="scs-kicker block mb-3">// رحلة الطالب</span>
            <h2 className="scs-h2 text-2xl md:text-3xl">من أول خطوة لحد الاحتراف</h2>
          </div>
          <div className="overflow-x-auto pb-4 -mx-4 px-4 scs-reveal" data-delay="1">
            <div className="scs-timeline-track grid grid-flow-col auto-cols-[9rem] gap-4 min-w-max md:grid-flow-row md:auto-cols-auto md:grid-cols-6 md:min-w-0">
              <div className="scs-timeline-dash hidden md:block" />
              {journey.map((step, i) => (
                <div
                  key={step.title}
                  className="scs-timeline-node flex flex-col items-center text-center gap-2"
                >
                  <span className="scs-node-step">0{i + 1}</span>
                  <div className={`scs-node-circle ${step.tint}`}>
                    <step.icon size={20} />
                  </div>
                  <div>
                    <div className="scs-node-title">{step.title}</div>
                    <div className="scs-node-desc">{step.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center max-w-xl mx-auto mb-12 scs-reveal">
            <span className="scs-kicker block mb-3">// آراء الطلاب وأولياء الأمور</span>
            <h2 className="scs-h2 text-2xl md:text-3xl">كلامهم مش كلامنا</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div key={t.name} className="scs-card p-6 scs-reveal" data-delay={String(i)}>
                <div className="flex items-center justify-between mb-4">
                  <div className="scs-stars flex gap-1">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} size={15} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <Quote size={26} className="scs-quote-mark" fill="currentColor" strokeWidth={0} />
                </div>
                <p className="scs-testimonial-text mb-5">{t.text}</p>
                <div className="flex items-center gap-3">
                  <span className="scs-avatar">{t.name.trim()[0]}</span>
                  <span>
                    <span className="scs-testimonial-name block">{t.name}</span>
                    <span className="scs-testimonial-role block">{t.role}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA banner */}
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <div className="scs-cta-banner rounded-3xl px-8 py-14 text-center scs-reveal">
            <h2 className="text-2xl md:text-3xl mb-4">جاهز تبدأ الليفل الأول؟</h2>
            <p className="scs-lead mb-8 max-w-md mx-auto">
              احجز مكانك دلوقتي وابدأ رحلتك من سكراتش لحد الذكاء الاصطناعي.
            </p>
            <Link to="/contact" className="scs-btn-primary px-8 py-3">
              احجز مكانك دلوقتي
              <ArrowLeft size={16} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
