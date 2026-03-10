import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HiMenu, HiX } from 'react-icons/hi'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path ? 'active' : ''

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          NCC <span className="logo-accent">Group</span>
        </Link>
        <button className="mobile-menu-btn" onClick={() => setOpen(!open)}>
          {open ? <HiX /> : <HiMenu />}
        </button>
        <div className={`navbar-links ${open ? 'open' : ''}`}>
          <Link to="/" className={isActive('/')} onClick={() => setOpen(false)}>Home</Link>
          <Link to="/careers" className={isActive('/careers')} onClick={() => setOpen(false)}>Careers</Link>
          <Link to="/about" className={isActive('/about')} onClick={() => setOpen(false)}>About Us</Link>
          <Link to="/admin/login" className={isActive('/admin/login')} onClick={() => setOpen(false)}>Admin</Link>
        </div>
      </div>
    </nav>
  )
}
