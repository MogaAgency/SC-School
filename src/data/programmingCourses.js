import { Blocks, Bot, Globe, Code2, Shield, Cpu } from 'lucide-react'

/** Shared by the courses page and the contact form's course picker. */
export const programmingCourses = [
  {
    icon: Blocks,
    title: 'Scratch',
    description: 'أول خطوة في البرمجة بطريقة بصرية وسهلة، مناسبة للمبتدئين تمامًا.',
    badge: 'مبتدئ',
    detail: '٨ أسابيع · من سن ٩',
  },
  {
    icon: Bot,
    title: 'Robotics',
    description: 'بناء وبرمجة روبوتات حقيقية بإيدك، وتشوف نتيجة شغلك بتتحرك قدامك.',
    badge: 'عملي',
    detail: '١٠ أسابيع · من سن ١٠',
  },
  {
    icon: Globe,
    title: 'Web Development',
    description: 'بناء مواقع من الصفر بـ HTML وCSS وJavaScript خطوة بخطوة.',
    badge: 'متوسط',
    detail: '١٢ أسبوع · من سن ١٢',
  },
  {
    icon: Code2,
    title: 'Programming',
    description: 'أساسيات البرمجة والتفكير المنطقي بلغة برمجة حقيقية.',
    badge: 'أساسي',
    detail: '٨ أسابيع · من سن ١٣',
  },
  {
    icon: Shield,
    title: 'Cyber Security',
    description: 'أمن المعلومات وحماية البيانات بمقدمة عملية مناسبة للسن.',
    badge: 'متقدم',
    detail: '٦ أسابيع · من سن ١٥',
  },
  {
    icon: Cpu,
    title: 'AI & Machine Learning',
    description: 'مدخل عملي لعالم الـ AI، وبناء أول موديل ذكاء اصطناعي بسيط.',
    badge: 'متقدم',
    detail: '١٠ أسابيع · من سن ١٧',
  },
]

export const programmingCourseNames = programmingCourses.map((c) => c.title)
