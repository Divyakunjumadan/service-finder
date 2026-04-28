import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AdminNavbar } from '../../components/Navbar'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getAnalytics } from '../../api/admin'

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className="card">
    <div className="flex items-center justify-between mb-3">
      <span className="text-3xl">{icon}</span>
      <span className={`badge ${color}`}>{sub}</span>
    </div>
    <p className="text-4xl font-black text-white">{value}</p>
    <p className="text-slate-400 text-sm mt-1">{label}</p>
  </div>
)

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnalytics().then(r => setAnalytics(r.data.analytics)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="min-h-screen bg-dark-900"><AdminNavbar /><LoadingSpinner size="lg" text="Loading analytics..." /></div>

  const a = analytics

  return (
    <div className="min-h-screen bg-dark-900">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-white">📊 Admin Dashboard</h1>
          <p className="text-slate-400 mt-1">System overview and analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up">
          <StatCard icon="👥" label="Total Users" value={a.totalUsers} sub="Customers" color="badge-blue" />
          <StatCard icon="🏪" label="Total Vendors" value={a.totalVendors} sub="Registered" color="badge-green" />
          <StatCard icon="✅" label="Active Vendors" value={a.activeVendors} sub="Open & Available" color="badge-green" />
          <StatCard icon="📋" label="Total Requests" value={a.totalRequests} sub="All time" color="badge-yellow" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon="⏳" label="Pending Requests" value={a.pendingRequests} sub="Awaiting" color="badge-yellow" />
          <StatCard icon="✔️" label="Completed" value={a.completedRequests} sub="Done" color="badge-green" />
          <StatCard icon="📅" label="Last 7 Days" value={a.recentRequests} sub="Recent" color="badge-blue" />
          <div className="card flex flex-col justify-between">
            <p className="text-slate-400 text-sm mb-2">Quick Links</p>
            <div className="space-y-2">
              <Link to="/admin/users" className="block text-xs text-blue-400 hover:text-blue-300 transition-colors">→ Manage Users</Link>
              <Link to="/admin/vendors" className="block text-xs text-blue-400 hover:text-blue-300 transition-colors">→ Manage Vendors</Link>
              <Link to="/admin/requests" className="block text-xs text-blue-400 hover:text-blue-300 transition-colors">→ View Requests</Link>
              <Link to="/admin/feedback" className="block text-xs text-blue-400 hover:text-blue-300 transition-colors">→ Reviews</Link>
            </div>
          </div>
        </div>

        {/* Requests Per Day */}
        <div className="card animate-fade-in">
          <h2 className="text-xl font-bold text-white mb-6">📈 Requests (Last 7 Days)</h2>
          {a.requestsPerDay.length === 0 ? (
            <div className="text-center py-8 text-slate-500">No data available yet</div>
          ) : (
            <div className="space-y-3">
              {(() => {
                const maxCount = Math.max(...a.requestsPerDay.map(d => d.count), 1)
                return a.requestsPerDay.map((day) => (
                  <div key={day._id} className="flex items-center gap-4">
                    <span className="text-xs text-slate-500 w-24 shrink-0">
                      {new Date(day._id).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex-1 bg-slate-800 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-teal-500 rounded-full transition-all duration-500"
                        style={{ width: `${(day.count / maxCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-white w-8 text-right">{day.count}</span>
                  </div>
                ))
              })()}
            </div>
          )}
        </div>

        {/* System Status */}
        <div className="card mt-6">
          <h2 className="text-xl font-bold text-white mb-4">⚙️ System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-sm font-medium">API Server Online</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-sm font-medium">MongoDB Connected</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <span className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-blue-400 text-sm font-medium">Auto-cancel Cron Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
