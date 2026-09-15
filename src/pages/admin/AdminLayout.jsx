import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'

const tabs = [
  { to: '/admin', label: 'الكورسات', match: (p) => p === '/admin' || p.startsWith('/admin/courses') },
  { to: '/admin/students', label: 'الطلاب', match: (p) => p.startsWith('/admin/students') },
]

export default function AdminLayout() {
  const { pathname } = useLocation()

  return (
    <div className="scs-page">
      <div className="scs-bgfx" />
      <div className="scs-glow scs-glow-blue" />

      <div className="scs-content">
        <section className="max-w-6xl mx-auto px-4 pt-10 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="scs-icon-wrap scs-tint-gold">
                <ShieldCheck size={20} />
              </span>
              <div>
                <span className="scs-kicker block">// لوحة التحكم</span>
                <h1 className="scs-h2 text-xl md:text-2xl">إدارة المنصة</h1>
              </div>
            </div>

            <nav className="scs-tabs">
              {tabs.map((t) => (
                <NavLink key={t.to} to={t.to} className={`scs-tab ${t.match(pathname) ? 'is-active' : ''}`}>
                  {t.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 pb-20">
          <Outlet />
        </section>
      </div>
    </div>
  )
}
