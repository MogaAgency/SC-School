import CourseCard from '../components/CourseCard'

const courses = [
  { title: 'Robotics', description: 'تعلم أساسيات الروبوتات والتحكم فيها بشكل عملي.', icon: '🤖' },
  { title: 'Scratch', description: 'أول خطوة في البرمجة بطريقة بصرية وسهلة للمبتدئين.', icon: '🧩' },
  { title: 'Web Development', description: 'بناء مواقع الويب من الصفر باستخدام HTML وCSS وJavaScript.', icon: '💻' },
  { title: 'Programming', description: 'أساسيات البرمجة والتفكير المنطقي بلغات برمجية حديثة.', icon: '👨‍💻' },
  { title: 'Cyber Security', description: 'مقدمة في أمن المعلومات وحماية البيانات.', icon: '🛡️' },
  { title: 'AI ', description: 'مدخل إلى الذكاء الاصطناعي وتعلم الآلة بشكل مبسط.', icon: '🧠' },
]

export default function ProgrammingCourses() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">كورسات البرمجة</h1>
      <p className="text-gray-600 text-center mb-10">من سن 9 إلى 18 سنة</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((c) => (
          <CourseCard key={c.title} {...c} />
        ))}
      </div>
    </div>
  )
}
