import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProgrammingCourses from './pages/ProgrammingCourses'
import Baccalaureate from './pages/Baccalaureate'
import About from './pages/About'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Platform from './pages/Platform'
import Course from './pages/Course'
import Lesson from './pages/Lesson'
import AdminLayout from './pages/admin/AdminLayout'
import AdminCourses from './pages/admin/AdminCourses'
import AdminCourse from './pages/admin/AdminCourse'
import AdminStudents from './pages/admin/AdminStudents'
import AdminStudent from './pages/admin/AdminStudent'
import AdminQuiz from './pages/admin/AdminQuiz'
import AdminScores from './pages/admin/AdminScores'
import AuthProvider from './components/AuthProvider'
import RequireAuth from './components/RequireAuth'
import RequireAdmin from './components/RequireAdmin'

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col" dir="rtl" lang="ar">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/programming-courses" element={<ProgrammingCourses />} />
            <Route path="/baccalaureate" element={<Baccalaureate />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route element={<RequireAuth />}>
              <Route path="/platform" element={<Platform />} />
              <Route path="/platform/courses/:id" element={<Course />} />
              <Route path="/platform/courses/:id/lessons/:lessonId" element={<Lesson />} />
            </Route>
            <Route element={<RequireAdmin />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminCourses />} />
                <Route path="courses/:id" element={<AdminCourse />} />
                <Route path="courses/:id/scores" element={<AdminScores />} />
                <Route path="courses/:id/lessons/:lessonId/quiz" element={<AdminQuiz />} />
                <Route path="students" element={<AdminStudents />} />
                <Route path="students/:id" element={<AdminStudent />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
