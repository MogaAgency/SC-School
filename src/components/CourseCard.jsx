export default function CourseCard({
  icon: Icon,
  title,
  description,
  badge,
  detail,
  tint = 'blue',
  index = 0,
}) {
  return (
    <div
      className="scs-card p-6 flex flex-col scs-pop"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div className="flex items-start justify-between mb-5">
        <div className={`scs-icon-wrap scs-tint-${tint}`}>{Icon ? <Icon size={22} /> : null}</div>
        {badge && <span className="scs-badge-pill">{badge}</span>}
      </div>
      <h3 className="scs-card-title text-base mb-2">{title}</h3>
      {description && <p className="scs-card-text mb-5 flex-1">{description}</p>}
      {detail && <span className="scs-course-detail">{detail}</span>}
    </div>
  )
}
