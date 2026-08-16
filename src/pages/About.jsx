import { Link } from 'react-router-dom'
import {
  Sparkles,
  Users,
  Code2,
  TrendingUp,
  GraduationCap,
  Target,
  Heart,
  ArrowLeft,
} from 'lucide-react'
import PageHero from '../components/PageHero'
import useReveal from '../hooks/useReveal'

const values = [
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
  {
    icon: Target,
    title: 'هدف واضح لكل حصة',
    text: 'كل حصة ليها مخرج محدد الطالب بيسيبها وهو عارف عمل إيه وليه.',
  },
  {
    icon: Heart,
    title: 'بيئة مشجّعة',
    text: 'مجموعات صغيرة ومساحة آمنة للطالب يجرّب ويغلط ويتعلّم من غير إحراج.',
  },
]

const stats = [
  { num: '+500', label: 'طالب مسجّل' },
  { num: '٦', label: 'مسارات برمجة' },
  { num: '٣', label: 'مستويات بكالوريا' },
  { num: '٩-١٨', label: 'الفئة العمرية' },
]

const tints = ['blue', 'green', 'gold']

export default function About() {
  useReveal()

  return (
    <div className="scs-page">
      <div className="scs-bgfx" />
      <div className="scs-glow scs-glow-blue" />
      <div className="scs-glow scs-glow-green" />

      <div className="scs-content">
        <PageHero
          kicker="SC-SCHOOL.COM · تأسّست لتعليم برمجة حقيقي"
          kickerIcon={Sparkles}
          title="عن"
          accent="Smart Core School"
          lead="منصة تعليمية بتعلّم البرمجة والتكنولوجيا للأطفال والشباب من سن ٩ لـ ١٨ سنة، وبتقدّم كمان محتوى متخصص لطلاب البكالوريا."
        />

        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="scs-card scs-card-static p-8 md:p-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center scs-reveal">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="scs-stat-num mb-1">{s.num}</div>
                <div className="scs-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="scs-card scs-card-static p-8 scs-reveal">
              <span className="scs-kicker block mb-3">// رسالتنا</span>
              <h2 className="scs-h2 text-xl md:text-2xl mb-4">نخلّي البرمجة مهارة، مش مادة</h2>
              <p className="scs-card-text">
                إحنا مؤمنين إن الطفل بيتعلّم البرمجة لما يشوف كوده شغّال قدامه، مش لما يحفظ تعريفات.
                عشان كده كل كورس عندنا بينتهي بمشروع الطالب بيبنيه بإيده ويعرضه على أهله.
              </p>
            </div>
            <div className="scs-card scs-card-static p-8 scs-reveal" data-delay="1">
              <span className="scs-kicker block mb-3">// إزاي بنشتغل</span>
              <h2 className="scs-h2 text-xl md:text-2xl mb-4">مسار واضح من أول يوم</h2>
              <p className="scs-card-text">
                بنبدأ باختبار تحديد مستوى بسيط، بنحدد المسار المناسب لسن الطالب، وبعدها بيمشي في
                خطوات متدرّجة مع متابعة دورية لولي الأمر بمستواه وتقدّمه.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="text-center max-w-xl mx-auto mb-12 scs-reveal">
            <span className="scs-kicker block mb-3">// قيمنا</span>
            <h2 className="scs-h2 text-2xl md:text-3xl">إيه اللي بيميّز SC School</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <div key={v.title} className="scs-card p-6 scs-reveal" data-delay={String(i % 3)}>
                <div className={`scs-icon-wrap mb-5 scs-tint-${tints[i % 3]}`}>
                  <v.icon size={22} />
                </div>
                <h3 className="scs-card-title text-base mb-2">{v.title}</h3>
                <p className="scs-card-text">{v.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 pb-20">
          <div className="scs-cta-banner rounded-3xl px-8 py-14 text-center scs-reveal">
            <h2 className="text-2xl md:text-3xl mb-4">حابب تعرف تفاصيل أكتر؟</h2>
            <p className="scs-lead mb-8 max-w-md mx-auto">
              كلّمنا وهنجاوب على كل أسئلتك عن المسارات والمواعيد والأسعار.
            </p>
            <Link to="/contact" className="scs-btn-primary px-8 py-3">
              تواصل معانا
              <ArrowLeft size={16} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
