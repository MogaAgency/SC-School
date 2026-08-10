import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/logo-light.png'

const links = [
  { to: '/', label: 'الرئيسية' },
  { to: '/programming-courses', label: 'كورسات البرمجة' },
  { to: '/baccalaureate', label: 'البكالوريا' },
  { to: '/about', label: 'عن Smart Core School' },
  { to: '/contact', label: 'تواصل معنا' },
]

export default function Navbar() {
  return (
    <header className="bg-paper/90 backdrop-blur sticky top-0 z-50 border-b border-ink/5">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Smart Core School" className="h-12 w-auto" />
        </Link>
        <ul className="flex gap-6">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? 'text-green-dark' : 'text-ink-soft hover:text-green-dark'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
