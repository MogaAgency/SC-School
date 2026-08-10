import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Menu,
  X,
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
import logo from '../assets/logo-light.png'

const navLinks = [
  { href: '#features', label: 'ليه SC School' },
  { href: '#tracks', label: 'المسارات' },
  { href: '#journey', label: 'رحلة الطالب' },
  { href: '#testimonials', label: 'آراء الطلاب' },
]

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
    text: 'أول خطوة في البرمجة بطريقة بصرية وسهلة، مناسبة للمبتدئين تمامًا.',
    badge: 'مبتدئ',
    detail: '٨ أسابيع',
  },
  {
    category: 'programming',
    icon: Bot,
    title: 'Robotics',
    text: 'بناء وبرمجة روبوتات حقيقية بإيدك، وتشوف نتيجة شغلك بتتحرك قدامك.',
    badge: 'عملي',
    detail: '١٠ أسابيع',
  },
  {
    category: 'programming',
    icon: Globe,
    title: 'Web Development',
    text: 'بناء مواقع من الصفر بـ HTML وCSS وJavaScript خطوة بخطوة.',
    badge: 'متوسط',
    detail: '١٢ أسبوع',
  },
  {
    category: 'programming',
    icon: Code2,
    title: 'Programming',
    text: 'أساسيات البرمجة والتفكير المنطقي بلغة برمجة حقيقية.',
    badge: 'أساسي',
    detail: '٨ أسابيع',
  },
  {
    category: 'programming',
    icon: Shield,
    title: 'Cyber Security',
    text: 'أمن المعلومات وحماية البيانات بمقدمة عملية مناسبة للسن.',
    badge: 'متقدم',
    detail: '٦ أسابيع',
  },
  {
    category: 'programming',
    icon: Cpu,
    title: 'AI & Machine Learning',
    text: 'مدخل عملي لعالم الـ AI، وبناء أول موديل ذكاء اصطناعي بسيط.',
    badge: 'متقدم',
    detail: '١٠ أسابيع',
  },
  {
    category: 'bac',
    icon: GraduationCap,
    title: 'BAC-101 · أول ثانوي',
    text: 'منهج بكالوريا متكامل لأول ثانوي مع حل نماذج امتحانات فعلية.',
    badge: 'مستوى ١',
    detail: 'سنة دراسية',
  },
  {
    category: 'bac',
    icon: GraduationCap,
    title: 'BAC-102 · تانية ثانوي',
    text: 'استكمال المنهج بتركيز على نقاط الضعف الشائعة عند الطلاب.',
    badge: 'مستوى ٢',
    detail: 'سنة دراسية',
  },
  {
    category: 'bac',
    icon: GraduationCap,
    title: 'Grade 10',
    text: 'منهج بمعايير دولية لطلاب الشهادات الأجنبية في نفس السن.',
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

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.scs-reveal')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeTab, setActiveTab] = useState('programming')

  useReveal()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const visibleCourses = useMemo(
    () => courses.filter((c) => c.category === activeTab),
    [activeTab],
  )

  return (
    <div className="scs-landing" dir="rtl" lang="ar">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@700;800;900&family=Tajawal:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

        html { scroll-behavior: smooth; }

        .scs-landing {
          --scs-bg: #071021;
          --scs-panel: #0e2542;
          --scs-panel-light: #123157;
          --scs-text: #f2f6fb;
          --scs-text-soft: #93aac2;
          --scs-blue: #4a90d9;
          --scs-blue-16: rgba(74, 144, 217, 0.16);
          --scs-green: #5fd068;
          --scs-green-14: rgba(95, 208, 104, 0.14);
          --scs-gold: #ffc145;
          --scs-gold-12: rgba(255, 193, 69, 0.12);
          --scs-border: rgba(255, 255, 255, 0.09);
          --scs-font-display: 'Cairo', sans-serif;
          --scs-font-body: 'Tajawal', sans-serif;
          --scs-font-mono: 'JetBrains Mono', monospace;
          position: relative;
          background: var(--scs-bg);
          color: var(--scs-text);
          font-family: var(--scs-font-body);
          overflow-x: hidden;
        }

        .scs-landing ::selection { background: rgba(95, 208, 104, 0.3); color: var(--scs-text); }
        .scs-landing a:focus-visible,
        .scs-landing button:focus-visible {
          outline: 2px solid var(--scs-green);
          outline-offset: 3px;
          border-radius: 6px;
        }
        .scs-landing section[id] { scroll-margin-top: 90px; }

        .scs-bgfx {
          position: absolute;
          inset: 0;
          height: 1500px;
          z-index: 0;
          pointer-events: none;
          background-image:
            linear-gradient(var(--scs-border) 1px, transparent 1px),
            linear-gradient(90deg, var(--scs-border) 1px, transparent 1px);
          background-size: 56px 56px;
          -webkit-mask-image: linear-gradient(to bottom, black 0%, black 15%, transparent 85%);
          mask-image: linear-gradient(to bottom, black 0%, black 15%, transparent 85%);
          opacity: 0.7;
        }

        .scs-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.35;
          z-index: 0;
          pointer-events: none;
        }
        .scs-glow-blue { background: var(--scs-blue); top: -120px; right: -80px; width: 420px; height: 420px; animation: scs-drift 14s ease-in-out infinite alternate; }
        .scs-glow-green { background: var(--scs-green); top: 260px; left: -120px; width: 380px; height: 380px; animation: scs-drift 18s ease-in-out infinite alternate-reverse; }

        @keyframes scs-drift {
          from { transform: translate3d(0, 0, 0) scale(1); }
          to { transform: translate3d(30px, 40px, 0) scale(1.08); }
        }

        .scs-content { position: relative; z-index: 1; }

        /* ---------- reveal on scroll ---------- */
        .scs-reveal {
          opacity: 0;
          transform: translateY(26px);
          transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .scs-reveal.is-visible { opacity: 1; transform: none; }
        .scs-reveal[data-delay='1'] { transition-delay: 0.1s; }
        .scs-reveal[data-delay='2'] { transition-delay: 0.2s; }
        .scs-reveal[data-delay='3'] { transition-delay: 0.3s; }

        /* ---------- navbar ---------- */
        .scs-navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(7, 16, 33, 0.72);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid transparent;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .scs-navbar.is-scrolled {
          border-bottom-color: var(--scs-border);
          box-shadow: 0 12px 40px -20px rgba(0, 0, 0, 0.7);
        }
        .scs-brand-name {
          font-family: var(--scs-font-display);
          font-weight: 800;
          color: var(--scs-text);
          font-size: 1rem;
          line-height: 1.15;
        }
        .scs-brand-sub {
          font-family: var(--scs-font-mono);
          font-size: 0.62rem;
          color: var(--scs-text-soft);
          letter-spacing: 0.04em;
        }
        .scs-nav-link {
          position: relative;
          font-family: var(--scs-font-body);
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--scs-text-soft);
          transition: color 0.2s ease;
          padding-bottom: 4px;
        }
        .scs-nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 0;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, var(--scs-green), var(--scs-blue));
          transition: width 0.25s ease;
        }
        .scs-nav-link:hover { color: var(--scs-text); }
        .scs-nav-link:hover::after { width: 100%; }

        /* ---------- buttons ---------- */
        .scs-btn-primary {
          font-family: var(--scs-font-display);
          font-weight: 700;
          font-size: 0.9rem;
          background: linear-gradient(135deg, #6edb77, var(--scs-green) 55%, #45bd52);
          color: #04140a;
          border-radius: 999px;
          padding: 0.65rem 1.4rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 8px 24px -8px rgba(95, 208, 104, 0.5);
          white-space: nowrap;
        }
        .scs-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 34px -8px rgba(95, 208, 104, 0.65); }
        .scs-btn-primary svg { transition: transform 0.2s ease; }
        .scs-btn-primary:hover svg { transform: translateX(-3px); }

        .scs-btn-secondary {
          font-family: var(--scs-font-display);
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--scs-text);
          border: 1.5px solid var(--scs-border);
          border-radius: 999px;
          padding: 0.65rem 1.4rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
        }
        .scs-btn-secondary:hover { border-color: var(--scs-green); color: var(--scs-green); background: rgba(95, 208, 104, 0.06); }

        .scs-icon-btn {
          color: var(--scs-text);
          padding: 0.4rem;
          border-radius: 8px;
        }
        .scs-icon-btn:hover { background: var(--scs-panel-light); }

        .scs-mobile-menu {
          background: var(--scs-panel);
          border-top: 1px solid var(--scs-border);
        }

        /* ---------- hero ---------- */
        .scs-kicker-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--scs-font-mono);
          font-size: 0.7rem;
          color: var(--scs-gold);
          background: var(--scs-gold-12);
          border: 1px solid rgba(255, 193, 69, 0.25);
          border-radius: 999px;
          padding: 0.35rem 0.85rem;
        }

        .scs-h1 {
          font-family: var(--scs-font-display);
          font-weight: 900;
          color: var(--scs-text);
          line-height: 1.18;
          letter-spacing: -0.01em;
        }
        .scs-accent {
          background: linear-gradient(100deg, var(--scs-green) 20%, var(--scs-blue) 90%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .scs-lead {
          font-family: var(--scs-font-body);
          color: var(--scs-text-soft);
          line-height: 1.85;
        }

        .scs-stats { border-top: 1px solid var(--scs-border); }
        .scs-stat-num { font-family: var(--scs-font-mono); color: var(--scs-green); font-weight: 600; font-size: 1.35rem; }
        .scs-stat-label { font-family: var(--scs-font-body); color: var(--scs-text-soft); font-size: 0.78rem; }

        /* ---------- terminal ---------- */
        .scs-terminal-frame {
          padding: 1px;
          border-radius: 17px;
          background: linear-gradient(135deg, rgba(74, 144, 217, 0.55), rgba(255, 255, 255, 0.06) 40%, rgba(255, 255, 255, 0.06) 60%, rgba(95, 208, 104, 0.55));
          box-shadow:
            0 30px 70px -30px rgba(0, 0, 0, 0.65),
            0 0 90px -30px rgba(74, 144, 217, 0.35);
        }
        .scs-terminal {
          background: var(--scs-panel);
          border-radius: 16px;
          overflow: hidden;
        }
        .scs-terminal-bar {
          background: var(--scs-panel-light);
          border-bottom: 1px solid var(--scs-border);
          padding: 0.7rem 1rem;
        }
        .scs-dot { width: 0.7rem; height: 0.7rem; border-radius: 50%; display: inline-block; }
        .scs-dot-red { background: #ff5f56; }
        .scs-dot-yellow { background: #ffbd2e; }
        .scs-dot-green { background: #27c93f; }
        .scs-terminal-title { font-family: var(--scs-font-mono); color: var(--scs-text-soft); font-size: 0.72rem; }
        .scs-terminal-status {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-family: var(--scs-font-mono);
          font-size: 0.62rem;
          color: var(--scs-green);
        }
        .scs-terminal-body {
          font-family: var(--scs-font-mono);
          font-size: 0.8rem;
          color: var(--scs-text-soft);
          padding: 1.4rem;
          line-height: 1.9;
          white-space: pre-wrap;
          word-break: break-word;
          min-height: 280px;
          direction: ltr;
          text-align: left;
          margin: 0;
        }
        .scs-term-cmd { color: var(--scs-text); }
        .scs-term-out { color: var(--scs-blue); }
        .scs-term-ok { color: var(--scs-green); }
        .scs-term-pending { color: var(--scs-gold); }
        .scs-cursor {
          display: inline-block;
          width: 0.5em;
          height: 1em;
          background: var(--scs-green);
          margin-inline-start: 2px;
          vertical-align: text-bottom;
          animation: scs-blink 1s steps(1) infinite;
        }

        @keyframes scs-blink { 50% { opacity: 0; } }

        /* ---------- ticker ---------- */
        .scs-ticker {
          border-top: 1px solid var(--scs-border);
          border-bottom: 1px solid var(--scs-border);
          overflow: hidden;
          -webkit-mask-image: linear-gradient(90deg, transparent, black 12%, black 88%, transparent);
          mask-image: linear-gradient(90deg, transparent, black 12%, black 88%, transparent);
        }
        .scs-ticker-inner {
          display: flex;
          align-items: center;
          gap: 2.75rem;
          width: max-content;
          padding: 0.9rem 0;
          animation: scs-marquee 32s linear infinite;
        }
        .scs-ticker:hover .scs-ticker-inner { animation-play-state: paused; }
        .scs-ticker-item {
          font-family: var(--scs-font-mono);
          font-size: 0.78rem;
          color: var(--scs-text-soft);
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 2.75rem;
        }
        .scs-ticker-sep { color: var(--scs-green); font-size: 0.6rem; }

        @keyframes scs-marquee { to { transform: translateX(-50%); } }

        /* ---------- sections ---------- */
        .scs-kicker {
          font-family: var(--scs-font-display);
          font-weight: 700;
          font-size: 0.78rem;
          letter-spacing: 0.04em;
          color: var(--scs-gold);
        }
        .scs-h2 { font-family: var(--scs-font-display); font-weight: 800; color: var(--scs-text); }
        .scs-sub { font-family: var(--scs-font-body); color: var(--scs-text-soft); }

        /* ---------- cards ---------- */
        .scs-card {
          position: relative;
          overflow: hidden;
          background: var(--scs-panel);
          border: 1px solid var(--scs-border);
          border-radius: 18px;
          transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
        }
        .scs-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 8%;
          right: 8%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(95, 208, 104, 0.6), rgba(74, 144, 217, 0.6), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .scs-card:hover {
          transform: translateY(-5px);
          border-color: rgba(95, 208, 104, 0.35);
          background: var(--scs-panel-light);
          box-shadow: 0 24px 50px -28px rgba(0, 0, 0, 0.7);
        }
        .scs-card:hover::before { opacity: 1; }

        .scs-icon-wrap {
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.25s ease;
        }
        .scs-card:hover .scs-icon-wrap { transform: scale(1.08) rotate(-3deg); }
        .scs-tint-blue { background: var(--scs-blue-16); color: var(--scs-blue); }
        .scs-tint-green { background: var(--scs-green-14); color: var(--scs-green); }
        .scs-tint-gold { background: var(--scs-gold-12); color: var(--scs-gold); }

        .scs-card-title { font-family: var(--scs-font-display); font-weight: 700; color: var(--scs-text); }
        .scs-card-text { font-family: var(--scs-font-body); color: var(--scs-text-soft); font-size: 0.9rem; line-height: 1.75; }

        /* ---------- tabs ---------- */
        .scs-tabs {
          background: var(--scs-panel);
          border: 1px solid var(--scs-border);
          border-radius: 999px;
          padding: 0.3rem;
          display: inline-flex;
          gap: 0.25rem;
        }
        .scs-tab {
          font-family: var(--scs-font-display);
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--scs-text-soft);
          padding: 0.55rem 1.3rem;
          border-radius: 999px;
          transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
        }
        .scs-tab.is-active {
          background: linear-gradient(135deg, #6edb77, var(--scs-green) 60%);
          color: #04140a;
          box-shadow: 0 6px 18px -6px rgba(95, 208, 104, 0.55);
        }
        .scs-tab:not(.is-active):hover { color: var(--scs-text); }

        .scs-pop { animation: scs-pop-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }
        @keyframes scs-pop-in {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: none; }
        }

        .scs-badge-pill {
          font-family: var(--scs-font-mono);
          font-size: 0.65rem;
          color: var(--scs-blue);
          background: var(--scs-blue-16);
          border-radius: 999px;
          padding: 0.2rem 0.65rem;
        }
        .scs-course-detail {
          font-family: var(--scs-font-mono);
          font-size: 0.72rem;
          color: var(--scs-text-soft);
          border-top: 1px dashed var(--scs-border);
          padding-top: 0.8rem;
          display: block;
        }

        /* ---------- timeline ---------- */
        .scs-timeline-track { position: relative; }
        .scs-timeline-dash {
          position: absolute;
          top: 2.6rem;
          left: 4%;
          right: 4%;
          height: 2px;
          background: repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.18) 0 9px, transparent 9px 18px);
          z-index: 0;
        }
        .scs-node-step {
          font-family: var(--scs-font-mono);
          font-size: 0.62rem;
          color: var(--scs-gold);
          letter-spacing: 0.1em;
        }
        .scs-node-circle {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--scs-panel);
          position: relative;
          z-index: 1;
          border-width: 2px;
          border-style: solid;
          flex-shrink: 0;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .scs-node-circle.blue { border-color: var(--scs-blue); color: var(--scs-blue); }
        .scs-node-circle.green { border-color: var(--scs-green); color: var(--scs-green); }
        .scs-timeline-node:hover .scs-node-circle { transform: scale(1.12); }
        .scs-timeline-node:hover .scs-node-circle.blue { box-shadow: 0 0 24px -4px rgba(74, 144, 217, 0.6); }
        .scs-timeline-node:hover .scs-node-circle.green { box-shadow: 0 0 24px -4px rgba(95, 208, 104, 0.6); }
        .scs-node-title { font-family: var(--scs-font-display); font-weight: 700; color: var(--scs-text); font-size: 0.85rem; }
        .scs-node-desc { font-family: var(--scs-font-body); color: var(--scs-text-soft); font-size: 0.75rem; }

        /* ---------- testimonials ---------- */
        .scs-quote-mark { color: var(--scs-blue); opacity: 0.35; }
        .scs-stars { color: var(--scs-gold); }
        .scs-testimonial-text { font-family: var(--scs-font-body); color: var(--scs-text); font-size: 0.92rem; line-height: 1.85; }
        .scs-testimonial-name { font-family: var(--scs-font-display); font-weight: 700; color: var(--scs-text); font-size: 0.85rem; }
        .scs-testimonial-role { font-family: var(--scs-font-mono); color: var(--scs-text-soft); font-size: 0.7rem; }
        .scs-avatar {
          width: 2.4rem;
          height: 2.4rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--scs-font-display);
          font-weight: 800;
          font-size: 0.95rem;
          background: var(--scs-blue-16);
          color: var(--scs-blue);
          flex-shrink: 0;
        }

        /* ---------- CTA banner ---------- */
        .scs-cta-banner {
          position: relative;
          overflow: hidden;
          background: linear-gradient(120deg, rgba(74, 144, 217, 0.22), rgba(95, 208, 104, 0.22));
          border: 1px solid var(--scs-border);
        }
        .scs-cta-banner::before,
        .scs-cta-banner::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.4;
          pointer-events: none;
        }
        .scs-cta-banner::before { width: 260px; height: 260px; background: var(--scs-blue); top: -100px; right: -60px; }
        .scs-cta-banner::after { width: 260px; height: 260px; background: var(--scs-green); bottom: -110px; left: -60px; }
        .scs-cta-banner > * { position: relative; z-index: 1; }
        .scs-cta-banner h2 { font-family: var(--scs-font-display); font-weight: 900; color: var(--scs-text); }

        /* ---------- footer ---------- */
        .scs-footer { border-top: 1px solid var(--scs-border); }
        .scs-footer-name { font-family: var(--scs-font-display); font-weight: 800; color: var(--scs-text); font-size: 0.95rem; }
        .scs-footer-copy { font-family: var(--scs-font-mono); font-size: 0.72rem; color: var(--scs-text-soft); }

        /* ---------- reduced motion ---------- */
        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          .scs-landing * { animation: none !important; transition: none !important; }
          .scs-cursor { opacity: 1; }
          .scs-reveal { opacity: 1; transform: none; }
        }
      `}</style>

      <div className="scs-bgfx" />
      <div className="scs-glow scs-glow-blue" />
      <div className="scs-glow scs-glow-green" />

      <div className="scs-content">
        {/* Navbar */}
        <header className={`scs-navbar ${scrolled ? 'is-scrolled' : ''}`}>
          <nav className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
            <a href="#top" className="flex items-center gap-2">
              <img src={logo} alt="SC School" className="h-10 w-auto" />
              <span className="hidden sm:flex flex-col leading-tight">
                <span className="scs-brand-name">Smart Core School</span>
                <span className="scs-brand-sub">SC-SCHOOL.COM</span>
              </span>
            </a>

            <ul className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="scs-nav-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="hidden md:block">
              <Link to="/contact" className="scs-btn-primary">
                احجز مكانك
              </Link>
            </div>

            <button
              type="button"
              className="md:hidden scs-icon-btn"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="فتح القائمة"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </nav>

          {menuOpen && (
            <div className="md:hidden scs-mobile-menu px-4 py-4">
              <ul className="flex flex-col gap-4 mb-4">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="scs-nav-link block"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="scs-btn-primary w-full">
                احجز مكانك
              </Link>
            </div>
          )}
        </header>

        {/* Hero */}
        <section id="top" className="max-w-6xl mx-auto px-4 pt-16 md:pt-24 pb-16 grid md:grid-cols-2 gap-12 items-center">
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
              <div
                key={c.title}
                className="scs-card p-6 flex flex-col scs-pop"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`scs-icon-wrap scs-tint-${iconTints[i % 3]}`}>
                    <c.icon size={22} />
                  </div>
                  <span className="scs-badge-pill">{c.badge}</span>
                </div>
                <h3 className="scs-card-title text-base mb-2">{c.title}</h3>
                <p className="scs-card-text mb-5 flex-1">{c.text}</p>
                <span className="scs-course-detail">{c.detail}</span>
              </div>
            ))}
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
                <div key={step.title} className="scs-timeline-node flex flex-col items-center text-center gap-2">
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

        {/* Footer */}
        <footer className="scs-footer">
          <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="SC School" className="h-9 w-auto" />
              <span className="scs-footer-name">Smart Core School</span>
            </div>
            <p className="scs-footer-copy">
              © {new Date().getFullYear()} SC-School.com — جميع الحقوق محفوظة.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
