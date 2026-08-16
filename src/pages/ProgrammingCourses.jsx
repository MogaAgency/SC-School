import { Link } from 'react-router-dom'
import { Blocks, Bot, Globe, Code2, Shield, Cpu, Terminal, ArrowLeft } from 'lucide-react'
import CourseCard from '../components/CourseCard'
import PageHero from '../components/PageHero'
import useReveal from '../hooks/useReveal'
import { programmingCourses } from '../data/programmingCourses'

const journey = [
  { icon: Blocks, title: 'Scratch', text: 'أول تلامس مع البرمجة', tint: 'blue' },
  { icon: Code2, title: 'Programming', text: 'أساسيات المنطق البرمجي', tint: 'green' },
  { icon: Globe, title: 'Web Development', text: 'بناء أول موقع حقيقي', tint: 'blue' },
  { icon: Bot, title: 'Robotics', text: 'من الشاشة للواقع', tint: 'green' },
  { icon: Shield, title: 'Cyber Security', text: 'حماية اللي بنيته', tint: 'blue' },
  { icon: Cpu, title: 'AI', text: 'أول موديل AI بإيدك', tint: 'green' },
]

const tints = ['blue', 'green', 'gold']

export default function ProgrammingCourses() {
  useReveal()

  return (
    <div className="scs-page">
      <div className="scs-bgfx" />
      <div className="scs-glow scs-glow-blue" />
      <div className="scs-glow scs-glow-green" />

      <div className="scs-content">
        <PageHero
          kicker="مسار البرمجة · من سن ٩ لـ ١٨"
          kickerIcon={Terminal}
          title="كورسات"
          accent="البرمجة"
          lead="ستة كورسات متدرّجة، كل واحد مبني على مشاريع حقيقية بتشتغل قدام الطالب — مش شرح نظري وبس."
        />

        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {programmingCourses.map((c, i) => (
              <CourseCard key={c.title} {...c} tint={tints[i % 3]} index={i} />
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="text-center max-w-xl mx-auto mb-14 scs-reveal">
            <span className="scs-kicker block mb-3">// ترتيب المسار</span>
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

        <section className="max-w-6xl mx-auto px-4 pb-20">
          <div className="scs-cta-banner rounded-3xl px-8 py-14 text-center scs-reveal">
            <h2 className="text-2xl md:text-3xl mb-4">مش عارف تبدأ منين؟</h2>
            <p className="scs-lead mb-8 max-w-md mx-auto">
              كلّمنا وهنرشّحلك الكورس المناسب لسن ابنك ومستواه الحالي.
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
