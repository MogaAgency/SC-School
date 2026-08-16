import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import logo from '../assets/logo-light.png'

const links = [
  { to: '/', label: 'الرئيسية' },
  { to: '/programming-courses', label: 'كورسات البرمجة' },
  { to: '/baccalaureate', label: 'البكالوريا' },
  { to: '/about', label: 'عن المدرسة' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [pathname])

  const navClass = ({ isActive }) => `scs-nav-link ${isActive ? 'is-active' : ''}`

  return (
    <header className={`scs-navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <nav className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="SC School" className="h-10 w-auto" />
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="scs-brand-name">Smart Core School</span>
            <span className="scs-brand-sub">SC-SCHOOL.COM</span>
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-7">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} end={link.to === '/'} className={navClass}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Link to="/contact" className="scs-btn-primary">
            احجز مكانك
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden scs-icon-btn"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="فتح القائمة"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden scs-mobile-menu px-4 py-4">
          <ul className="flex flex-col gap-4 mb-4">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) => `${navClass({ isActive })} block`}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <Link to="/contact" className="scs-btn-primary w-full">
            احجز مكانك
          </Link>
        </div>
      )}
    </header>
  )
}
