import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import Home from './pages/Home'
import JobDetail from './pages/JobDetail'
import Apply from './pages/Apply'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminRoute from './components/AdminRoute'
import AboutUs from './pages/AboutUs'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/careers" element={<Home />} />
          <Route path="/jobs/:slug" element={<JobDetail />} />
          <Route path="/apply/:jobSlug" element={<Apply />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
