import { Link } from 'react-router-dom'
import { Mail, Phone } from 'lucide-react'
import logo from '../assets/logo-light.png'

const quickLinks = [
  { to: '/programming-courses', label: 'كورسات البرمجة' },
  { to: '/baccalaureate', label: 'البكالوريا' },
  { to: '/about', label: 'عن Smart Core School' },
  { to: '/contact', label: 'تواصل معنا' },
  { to: '/privacy', label: 'سياسة الخصوصية' },
]

export default function Footer() {
  return (
    <footer className="scs-footer">
      <div className="max-w-6xl mx-auto px-4 py-12 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="SC School" className="h-10 w-auto" />
            <span className="scs-footer-name">Smart Core School</span>
          </div>
          <p className="scs-card-text max-w-xs">
            منصة تعليمية بتقدّم كورسات برمجة للأطفال والشباب من سن ٩ إلى ١٨، بالإضافة لكورسات
            البكالوريا.
          </p>
        </div>

        <div>
          <h4 className="scs-footer-title mb-3">روابط سريعة</h4>
          <ul className="flex flex-col gap-2">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="scs-footer-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="scs-footer-title mb-3">تواصل معنا</h4>
          <ul className="flex flex-col gap-2">
            <li>
              <a href="mailto:info@sc-school.com" className="scs-footer-link inline-flex items-center gap-2">
                <Mail size={14} />
                <span dir="ltr">info@sc-school.com</span>
              </a>
            </li>
            <li>
              <a href="tel:+201125125501" className="scs-footer-link inline-flex items-center gap-2">
                <Phone size={14} />
                <span dir="ltr">+20 112 512 5501</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.09]">
        <p className="scs-footer-copy max-w-6xl mx-auto px-4 py-5 text-center">
          © {new Date().getFullYear()} SC-School.com — جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  )
}
