import { Link } from 'react-router-dom'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import PageHero from '../components/PageHero'
import useReveal from '../hooks/useReveal'

const sections = [
  {
    title: 'البيانات اللي بنجمعها',
    body: 'لما تملأ فورم التواصل بنجمع الاسم، رقم الموبايل، البريد الإلكتروني، المسار أو الكورس اللي مهتم بيه، سن الطالب أو سنته الدراسية، ونص رسالتك. مفيش أي بيانات تانية بتتجمع، ومش بنستخدم كوكيز للتتبّع أو الإعلانات.',
  },
  {
    title: 'بنستخدمها في إيه',
    body: 'البيانات دي بتستخدم لغرض واحد بس: إننا نرد عليك ونرشّحلك المسار المناسب ونظبط معاك مواعيد الحصص. مش بنبيع بياناتك ولا بنشاركها مع أي جهة تانية لأغراض تسويقية.',
  },
  {
    title: 'بتروح فين',
    body: 'الفورم بيبعت البيانات عن طريق خدمة Web3Forms، وهي بتحوّلها لإيميل المدرسة. يعني بياناتك بتعدّي على مزوّد الخدمة ده وبتتخزّن في بريدنا. الإيميل بطبيعته مش مشفّر من الطرف للطرف، فياريت ما تبعتش أي بيانات حساسة (زي أرقام بطاقات أو مستندات رسمية) من خلال الفورم.',
  },
  {
    title: 'حساب المنصة',
    body: 'لو عملت حساب على منصة الطالب بنحتفظ باسم الطالب ورقمه وإيميله، واسم ورقم ولي الأمر، وبنضيف عليهم الكورسات اللي الطالب مسجّل فيها. بيانات ولي الأمر بنستخدمها بس عشان نتواصل معاه لو فيه تأخير في الكورس أو ملاحظات على الطالب. البيانات دي بتتخزّن على خدمة Supabase على سيرفرات في أوروبا، ومحمية بحيث كل طالب يشوف بياناته هو بس. الباسورد بيتخزّن مشفّر عند Supabase ومحدش يقدر يقراه، حتى إحنا.',
  },
  {
    title: 'بيانات الطلاب أقل من ١٨ سنة',
    body: 'الكورسات موجّهة لسن ٩ لـ ١٨، وبالتالي جزء من البيانات بتخص قاصرين. الفورم لازم يملأه ولي الأمر أو يكون بموافقته، وإحنا بنكتفي بأقل قدر من البيانات المطلوبة للتواصل وتحديد المستوى المناسب.',
  },
  {
    title: 'مدة الاحتفاظ وحقوقك',
    body: 'بنحتفظ برسائل التواصل طول ما فيه تواصل قائم بخصوص الكورسات، وبحساب المنصة طول ما الحساب مفتوح. تقدر في أي وقت تطلب تشوف بياناتك أو تعدّلها أو تمسح حسابك بالكامل، وابعتلنا على info@sc-school.com وهننفّذ الطلب.',
  },
]

export default function Privacy() {
  useReveal()

  return (
    <div className="scs-page">
      <div className="scs-bgfx" />
      <div className="scs-glow scs-glow-blue" />
      <div className="scs-glow scs-glow-green" />

      <div className="scs-content">
        <PageHero
          kicker="آخر تحديث: سبتمبر ٢٠٢٦"
          kickerIcon={ShieldCheck}
          title="سياسة"
          accent="الخصوصية"
          lead="صفحة مختصرة وواضحة عن البيانات اللي بناخدها منك، بتروح فين، وإزاي تقدر تمسحها في أي وقت."
        />

        <section className="max-w-3xl mx-auto px-4 pb-16">
          <div className="flex flex-col gap-5">
            {sections.map((s, i) => (
              <div key={s.title} className="scs-card scs-card-static p-7 scs-reveal" data-delay={String(i % 3)}>
                <h2 className="scs-card-title text-lg mb-3">{s.title}</h2>
                <p className="scs-card-text">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-20 text-center">
          <Link to="/contact" className="scs-btn-secondary px-7 py-3">
            رجوع لصفحة التواصل
            <ArrowLeft size={16} />
          </Link>
        </section>
      </div>
    </div>
  )
}
