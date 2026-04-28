import { useState, useEffect } from 'react'
import { AdminNavbar } from '../../components/Navbar'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getAllUsers, toggleBlockUser } from '../../api/admin'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [toggling, setToggling] = useState(null)

  useEffect(() => {
    getAllUsers().then(r => setUsers(r.data.users)).finally(() => setLoading(false))
  }, [])

  const handleToggle = async (userId, currentlyBlocked) => {
    setToggling(userId)
    try {
      const res = await toggleBlockUser(userId)
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isBlocked: res.data.user.isBlocked } : u))
      toast.success(res.data.message)
    } catch {
      toast.error('Action failed')
    } finally {
      setToggling(null)
    }
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const roleColors = { user: 'badge-blue', vendor: 'badge-green', admin: 'badge-red' }

  return (
    <div className="min-h-screen bg-dark-900">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">👥 User Management</h1>
            <p className="text-slate-400 mt-1">{users.length} registered accounts</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field max-w-sm"
          />
        </div>

        {loading ? <LoadingSpinner text="Loading users..." /> : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="table-header text-left py-3 px-4">User</th>
                    <th className="table-header text-left py-3 px-4">Contact</th>
                    <th className="table-header text-left py-3 px-4">Role</th>
                    <th className="table-header text-left py-3 px-4">Location</th>
                    <th className="table-header text-left py-3 px-4">Status</th>
                    <th className="table-header text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u._id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center text-sm font-bold text-blue-400">
                            {u.name[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-white">{u.name}</div>
                            <div className="text-xs text-slate-500">ID: {u._id.slice(-6)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div>{u.email}</div>
                        <div className="text-xs text-slate-500">{u.phone}</div>
                      </td>
                      <td className="table-cell">
                        <span className={`badge ${roleColors[u.role] || 'badge-gray'} capitalize`}>{u.role}</span>
                      </td>
                      <td className="table-cell">
                        <span className="text-slate-400">{u.location || u.address || '—'}</span>
                      </td>
                      <td className="table-cell">
                        <span className={`badge ${u.isBlocked ? 'badge-red' : 'badge-green'}`}>
                          {u.isBlocked ? '🚫 Blocked' : '✓ Active'}
                        </span>
                      </td>
                      <td className="table-cell">
                        <button
                          onClick={() => handleToggle(u._id, u.isBlocked)}
                          disabled={toggling === u._id}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                            u.isBlocked
                              ? 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30'
                              : 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                          }`}
                        >
                          {toggling === u._id ? '...' : u.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-12 text-slate-500">No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
