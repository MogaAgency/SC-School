import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, LogIn, LogOut, LayoutDashboard } from 'lucide-react'
import logo from '../assets/logo-light.png'
import useAuth from '../hooks/useAuth'

const links = [
  { to: '/', label: 'الرئيسية' },
  { to: '/programming-courses', label: 'كورسات البرمجة' },
  { to: '/baccalaureate', label: 'البكالوريا' },
  { to: '/about', label: 'عن المدرسة' },
]

/** The account buttons: log in when signed out, my platform + log out when signed in. */
function AccountActions({ user, signOut, block }) {
  const width = block ? 'w-full' : ''
  if (user) {
    return (
      <>
        <Link to="/platform" className={`scs-btn-primary ${width}`}>
          <LayoutDashboard size={15} />
          منصتي
        </Link>
        <button type="button" className={`scs-btn-secondary ${width}`} onClick={signOut}>
          <LogOut size={15} />
          خروج
        </button>
      </>
    )
  }
  return (
    <>
      <Link to="/login" className={`scs-btn-secondary ${width}`}>
        <LogIn size={15} />
        الدخول للمنصة
      </Link>
      <Link to="/contact" className={`scs-btn-primary ${width}`}>
        احجز مكانك
      </Link>
    </>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const { user, signOut } = useAuth()

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

        <div className="hidden md:flex items-center gap-3">
          <AccountActions user={user} signOut={signOut} />
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
          <div className="flex flex-col gap-3">
            <AccountActions user={user} signOut={signOut} block />
          </div>
        </div>
      )}
    </header>
  )
}
