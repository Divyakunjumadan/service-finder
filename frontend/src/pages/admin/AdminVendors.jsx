import { useState, useEffect } from 'react'
import { AdminNavbar } from '../../components/Navbar'
import LoadingSpinner from '../../components/LoadingSpinner'
import StatusBadge from '../../components/StatusBadge'
import { getAllVendors, toggleApproveVendor, deleteVendor } from '../../api/admin'
import toast from 'react-hot-toast'

export default function AdminVendors() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [actioning, setActioning] = useState(null)

  useEffect(() => {
    getAllVendors().then(r => setVendors(r.data.vendors)).finally(() => setLoading(false))
  }, [])

  const handleApprove = async (id) => {
    setActioning(id + 'approve')
    try {
      const res = await toggleApproveVendor(id)
      setVendors(prev => prev.map(v => v._id === id ? { ...v, isApproved: res.data.vendor.isApproved } : v))
      toast.success(res.data.message)
    } catch { toast.error('Action failed') }
    finally { setActioning(null) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove this vendor permanently?')) return
    setActioning(id + 'delete')
    try {
      await deleteVendor(id)
      setVendors(prev => prev.filter(v => v._id !== id))
      toast.success('Vendor removed')
    } catch { toast.error('Delete failed') }
    finally { setActioning(null) }
  }

  const filtered = vendors.filter(v =>
    v.shopName.toLowerCase().includes(search.toLowerCase()) ||
    v.serviceType.toLowerCase().includes(search.toLowerCase()) ||
    v.serviceArea.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-dark-900">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">🏪 Vendor Management</h1>
          <p className="text-slate-400 mt-1">{vendors.length} vendors registered</p>
        </div>

        <input
          type="text"
          placeholder="Search vendors..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field max-w-sm mb-6"
        />

        {loading ? <LoadingSpinner text="Loading vendors..." /> : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="table-header text-left py-3 px-4">Shop</th>
                    <th className="table-header text-left py-3 px-4">Owner</th>
                    <th className="table-header text-left py-3 px-4">Service</th>
                    <th className="table-header text-left py-3 px-4">Area</th>
                    <th className="table-header text-left py-3 px-4">Status</th>
                    <th className="table-header text-left py-3 px-4">Rating</th>
                    <th className="table-header text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(v => (
                    <tr key={v._id} className="table-row">
                      <td className="table-cell">
                        <div className="font-medium text-white">{v.shopName}</div>
                        <div className="text-xs text-slate-500">{v.phone}</div>
                      </td>
                      <td className="table-cell">
                        <div className="text-slate-300">{v.ownerName}</div>
                        <div className="text-xs text-slate-500">{v.ownerId?.email}</div>
                      </td>
                      <td className="table-cell">
                        <span className="badge badge-blue">{v.serviceType}</span>
                      </td>
                      <td className="table-cell text-slate-400">{v.serviceArea}</td>
                      <td className="table-cell">
                        <div className="flex flex-col gap-1">
                          <StatusBadge status={v.status} />
                          <StatusBadge status={v.availability} />
                          {!v.isApproved && <span className="badge badge-red">Rejected</span>}
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className="text-yellow-400 font-bold">
                          {v.avgRating > 0 ? v.avgRating.toFixed(1) : '–'}
                        </span>
                        <span className="text-xs text-slate-600 ml-1">({v.totalReviews})</span>
                      </td>
                      <td className="table-cell">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(v._id)}
                            disabled={actioning === v._id + 'approve'}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                              v.isApproved
                                ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                                : 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30'
                            }`}
                          >
                            {actioning === v._id + 'approve' ? '...' : v.isApproved ? 'Reject' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleDelete(v._id)}
                            disabled={actioning === v._id + 'delete'}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-600/10 text-red-500 hover:bg-red-600/20 transition-all"
                          >
                            {actioning === v._id + 'delete' ? '...' : 'Remove'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-12 text-slate-500">No vendors found.</td></tr>
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
