import { Link } from 'react-router-dom'
import { GraduationCap, ArrowLeft, Check, FileText, Users, Target } from 'lucide-react'
import CourseCard from '../components/CourseCard'
import PageHero from '../components/PageHero'
import useReveal from '../hooks/useReveal'

const levels = [
  {
    icon: GraduationCap,
    title: 'BAC-101 · أول ثانوي',
    description: 'منهج بكالوريا متكامل لأول ثانوي مع حل نماذج امتحانات فعلية.',
    badge: 'مستوى ١',
    detail: 'سنة دراسية كاملة',
  },
  {
    icon: GraduationCap,
    title: 'BAC-102 · تانية ثانوي',
    description: 'استكمال المنهج بتركيز على نقاط الضعف الشائعة عند الطلاب.',
    badge: 'مستوى ٢',
    detail: 'سنة دراسية كاملة',
  },
  {
    icon: GraduationCap,
    title: 'Grade 10',
    description: 'منهج بمعايير دولية لطلاب الشهادات الأجنبية في نفس السن.',
    badge: 'دولي',
    detail: 'سنة دراسية كاملة',
  },
]

const highlights = [
  {
    icon: FileText,
    title: 'نماذج امتحانات حقيقية',
    text: 'تدريب مستمر على أسئلة بنفس نمط الامتحان الرسمي، مع مراجعة للحلول.',
  },
  {
    icon: Users,
    title: 'مجموعات صغيرة',
    text: 'عدد محدود لكل مجموعة عشان كل طالب ياخد وقت كافي مع المدرّس.',
  },
  {
    icon: Target,
    title: 'متابعة فردية',
    text: 'تقرير دوري لولي الأمر بمستوى الطالب ونقاط التحسّن المطلوبة.',
  },
]

const included = [
  'منهج مستقل تمامًا عن مسار البرمجة',
  'ملازم ومواد مراجعة قابلة للتحميل',
  'اختبار تحديد مستوى قبل البداية',
  'حصص مراجعة مكثّفة قبل الامتحانات',
]

const tints = ['blue', 'green', 'gold']

export default function Baccalaureate() {
  useReveal()

  return (
    <div className="scs-page">
      <div className="scs-bgfx" />
      <div className="scs-glow scs-glow-blue" />
      <div className="scs-glow scs-glow-green" />

      <div className="scs-content">
        <PageHero
          kicker="٣ مستويات · منهج مستقل"
          kickerIcon={GraduationCap}
          title="كورسات"
          accent="البكالوريا"
          lead="مسار دراسي منفصل تمامًا عن مسار البرمجة، بيتابع المنهج الرسمي خطوة بخطوة مع تدريب على الامتحانات."
        />

        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {levels.map((l, i) => (
              <CourseCard key={l.title} {...l} tint={tints[i % 3]} index={i} />
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="text-center max-w-xl mx-auto mb-12 scs-reveal">
            <span className="scs-kicker block mb-3">// ليه مسار البكالوريا</span>
            <h2 className="scs-h2 text-2xl md:text-3xl">مذاكرة بفهم، مش بحفظ</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {highlights.map((h, i) => (
              <div key={h.title} className="scs-card p-6 scs-reveal" data-delay={String(i)}>
                <div className={`scs-icon-wrap mb-5 scs-tint-${tints[i % 3]}`}>
                  <h.icon size={22} />
                </div>
                <h3 className="scs-card-title text-base mb-2">{h.title}</h3>
                <p className="scs-card-text">{h.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="scs-card scs-card-static p-8 md:p-10 grid md:grid-cols-2 gap-8 items-center scs-reveal">
            <div>
              <span className="scs-kicker block mb-3">// الكورس بيشمل</span>
              <h2 className="scs-h2 text-xl md:text-2xl mb-4">كل اللي الطالب محتاجه للسنة</h2>
              <p className="scs-card-text">
                الاشتراك بيغطّي السنة الدراسية كاملة، من أول اختبار تحديد المستوى لحد مراجعات آخر
                السنة.
              </p>
            </div>
            <ul className="scs-list">
              {included.map((item) => (
                <li key={item} className="scs-list-item">
                  <Check size={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 pb-20">
          <div className="scs-cta-banner rounded-3xl px-8 py-14 text-center scs-reveal">
            <h2 className="text-2xl md:text-3xl mb-4">عايز تعرف مستوى ابنك الحالي؟</h2>
            <p className="scs-lead mb-8 max-w-md mx-auto">
              احجز اختبار تحديد المستوى وهنرشّحلك المستوى المناسب قبل ما تشترك.
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
