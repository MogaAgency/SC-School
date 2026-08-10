const nodes = [
  { age: '٩+', title: 'Scratch', color: '#A9D96B', dark: false },
  { age: '١٠+', title: 'Robotics', color: '#3FA55E', dark: true },
  { age: '١٢+', title: 'Web Dev', color: '#E4F3E5', dark: false },
  { age: '١٣+', title: 'Programming', color: '#3FA55E', dark: true },
  { age: '١٥+', title: 'Cyber Security', color: '#152A52', dark: true },
  { age: '١٧+', title: 'AI', color: '#3FA55E', dark: true },
]

const positions = [
  [70, 40],
  [190, 120],
  [70, 200],
  [190, 280],
  [70, 360],
  [190, 440],
]

export default function SkillPath() {
  return (
    <svg
      viewBox="0 0 260 500"
      className="w-full max-w-[280px] mx-auto"
      role="img"
      aria-label="مسار الكورسات من سن ٩ إلى ١٨"
    >
      {positions.slice(0, -1).map((p, i) => {
        const [x1, y1] = p
        const [x2, y2] = positions[i + 1]
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#152A52"
            strokeOpacity="0.2"
            strokeWidth="2.5"
            strokeDasharray="1 10"
            strokeLinecap="round"
          />
        )
      })}
      {nodes.map((n, i) => {
        const [x, y] = positions[i]
        return (
          <g key={n.title}>
            <circle cx={x} cy={y} r="30" fill={n.color} />
            <text
              x={x}
              y={y - 2}
              textAnchor="middle"
              fontFamily="Fredoka"
              fontSize="11"
              fontWeight="600"
              fill={n.dark ? '#FBF9F1' : '#152A52'}
            >
              {n.title}
            </text>
            <text
              x={x}
              y={y + 12}
              textAnchor="middle"
              fontFamily="Space Mono"
              fontSize="9"
              fill={n.dark ? '#FBF9F1' : '#152A52'}
              opacity="0.75"
            >
              {n.age}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
