import CourseCard from '../components/CourseCard'

const levels = [
  { title: 'أول ثانوي', description: 'منهج أول ثانوي كامل بشرح مبسط.', icon: '📘' },
  { title: 'تانية ثانوي', description: 'منهج تانية ثانوي بأسلوب مركز.', icon: '📗' },
  { title: 'Grade 10', description: 'محتوى متوافق مع منهج Grade 10.', icon: '📙' },
]

export default function Baccalaureate() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">كورسات البكالوريا</h1>
      <p className="text-gray-600 text-center mb-10">اختر المستوى الدراسي بتاعك</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {levels.map((l) => (
          <CourseCard key={l.title} {...l} />
        ))}
      </div>
    </div>
  )
}
