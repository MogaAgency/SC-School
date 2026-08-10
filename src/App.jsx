import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProgrammingCourses from './pages/ProgrammingCourses'
import Baccalaureate from './pages/Baccalaureate'
import About from './pages/About'
import Contact from './pages/Contact'

function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<SiteLayout />}>
          <Route path="/programming-courses" element={<ProgrammingCourses />} />
          <Route path="/baccalaureate" element={<Baccalaureate />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
