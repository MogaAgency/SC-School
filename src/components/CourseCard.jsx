export default function CourseCard({ title, description, icon, tint = 'mint' }) {
  const tints = {
    mint: 'bg-mint',
    green: 'bg-green-light/40',
    navy: 'bg-ink/5',
  }

  return (
    <div className="group relative bg-white rounded-3xl border-2 border-ink/10 p-6 hover:border-green transition-all duration-200 hover:-translate-y-1">
      <div
        className={`w-14 h-14 rounded-2xl ${tints[tint]} flex items-center justify-center text-2xl mb-4`}
      >
        {icon}
      </div>
      <h3 className="font-display font-semibold text-lg text-ink mb-1">{title}</h3>
      {description && <p className="text-sm text-ink-soft leading-relaxed">{description}</p>}
    </div>
  )
}
