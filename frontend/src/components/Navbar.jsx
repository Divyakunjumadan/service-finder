import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import toast from 'react-hot-toast'

const UserNavbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-dark-800/80 backdrop-blur-md border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="text-xl font-bold gradient-text">Service Finder</span>
          </Link>
          <div className="hidden md:flex items-center gap-2">
            <Link to="/dashboard" className="sidebar-link text-sm">🏠 Home</Link>
            <Link to="/notifications" className="sidebar-link text-sm">🔔 Notifications</Link>
            <Link to="/history" className="sidebar-link text-sm">📜 History</Link>
            <Link to="/profile" className="sidebar-link text-sm">👤 Profile</Link>
            <button onClick={handleLogout} className="btn-secondary text-sm px-4 py-2 ml-2">Logout</button>
          </div>
          <button className="md:hidden text-slate-400" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-1">
            <Link to="/dashboard" className="sidebar-link" onClick={() => setMenuOpen(false)}>🏠 Home</Link>
            <Link to="/notifications" className="sidebar-link" onClick={() => setMenuOpen(false)}>🔔 Notifications</Link>
            <Link to="/history" className="sidebar-link" onClick={() => setMenuOpen(false)}>📜 History</Link>
            <Link to="/profile" className="sidebar-link" onClick={() => setMenuOpen(false)}>👤 Profile</Link>
            <button onClick={handleLogout} className="btn-danger text-sm mt-2">Logout</button>
          </div>
        )}
      </div>
    </nav>
  )
}

export const VendorNavbar = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const handleLogout = () => { logout(); toast.success('Logged out'); navigate('/') }

  return (
    <nav className="sticky top-0 z-50 bg-dark-800/80 backdrop-blur-md border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/vendor/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="text-xl font-bold gradient-text">Service Finder</span>
            <span className="badge badge-blue ml-1">Vendor</span>
          </Link>
          <div className="hidden md:flex items-center gap-2">
            <Link to="/vendor/dashboard" className="sidebar-link text-sm">🏠 Dashboard</Link>
            <Link to="/vendor/notifications" className="sidebar-link text-sm">🔔 Notifications</Link>
            <Link to="/vendor/history" className="sidebar-link text-sm">📜 History</Link>
            <Link to="/vendor/profile" className="sidebar-link text-sm">👤 Profile</Link>
            <button onClick={handleLogout} className="btn-secondary text-sm px-4 py-2 ml-2">Logout</button>
          </div>
          <button className="md:hidden text-slate-400" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-1">
            <Link to="/vendor/dashboard" className="sidebar-link" onClick={() => setMenuOpen(false)}>🏠 Dashboard</Link>
            <Link to="/vendor/notifications" className="sidebar-link" onClick={() => setMenuOpen(false)}>🔔 Notifications</Link>
            <Link to="/vendor/history" className="sidebar-link" onClick={() => setMenuOpen(false)}>📜 History</Link>
            <Link to="/vendor/profile" className="sidebar-link" onClick={() => setMenuOpen(false)}>👤 Profile</Link>
            <button onClick={handleLogout} className="btn-danger text-sm mt-2">Logout</button>
          </div>
        )}
      </div>
    </nav>
  )
}

export const AdminNavbar = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); toast.success('Logged out'); navigate('/') }

  return (
    <nav className="sticky top-0 z-50 bg-dark-800/80 backdrop-blur-md border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="text-xl font-bold gradient-text">Service Finder</span>
            <span className="badge badge-red ml-1">Admin</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/admin" className="sidebar-link text-sm">📊 Dashboard</Link>
            <Link to="/admin/users" className="sidebar-link text-sm">👥 Users</Link>
            <Link to="/admin/vendors" className="sidebar-link text-sm">🏪 Vendors</Link>
            <Link to="/admin/requests" className="sidebar-link text-sm">📋 Requests</Link>
            <Link to="/admin/feedback" className="sidebar-link text-sm">⭐ Feedback</Link>
            <button onClick={handleLogout} className="btn-secondary text-sm px-4 py-2 ml-2">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default UserNavbar
