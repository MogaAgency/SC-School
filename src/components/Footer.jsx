import logo from '../assets/logo-navy.png'

export default function Footer() {
  return (
    <footer className="bg-ink text-paper/70 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <img src={logo} alt="Smart Core School" className="h-16 w-auto mb-3 -mr-2" />
          <p className="text-sm text-paper/50">
            منصة تعليمية تقدم كورسات برمجة للأطفال والشباب من سن ٩ إلى ١٨، بالإضافة إلى كورسات البكالوريا.
          </p>
        </div>
        <div>
          <h4 className="font-display text-paper font-medium mb-2">روابط سريعة</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="/programming-courses" className="hover:text-green-light">كورسات البرمجة</a></li>
            <li><a href="/baccalaureate" className="hover:text-green-light">البكالوريا</a></li>
            <li><a href="/about" className="hover:text-green-light">عن Smart Core School</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-paper font-medium mb-2">تواصل معنا</h4>
          <p className="text-sm text-paper/50 font-mono">info@sc-school.com</p>
        </div>
      </div>
      <div className="border-t border-paper/10 text-center text-xs text-paper/40 py-4">
        © {new Date().getFullYear()} Smart Core School. جميع الحقوق محفوظة.
      </div>
    </footer>
  )
}
