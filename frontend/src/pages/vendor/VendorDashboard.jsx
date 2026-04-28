import { useState, useEffect } from 'react'
import { VendorNavbar } from '../../components/Navbar'
import StatusBadge from '../../components/StatusBadge'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useAuth } from '../../context/AuthContext'
import { updateVendorStatus, getVendorProfile } from '../../api/vendors'
import { getVendorRequests, updateRequestStatus } from '../../api/requests'
import toast from 'react-hot-toast'

const Toggle = ({ label, checked, onChange, onLabel, offLabel }) => (
  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
    <div>
      <p className="text-sm font-medium text-white">{label}</p>
      <p className="text-xs text-slate-500 mt-0.5">{checked ? onLabel : offLabel}</p>
    </div>
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${checked ? 'bg-blue-600' : 'bg-slate-600'}`}
    >
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${checked ? 'left-7' : 'left-1'}`} />
    </button>
  </div>
)

export default function VendorDashboard() {
  const { user, fetchMe } = useAuth()
  const [vendor, setVendor] = useState(null)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)

  const fetchData = async () => {
    try {
      const [vRes, rRes] = await Promise.all([
        getVendorProfile(),
        getVendorRequests({ status: 'pending' })
      ])
      setVendor(vRes.data.vendor)
      setRequests(rRes.data.requests)
    } catch (err) {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleToggleStatus = async (field, value) => {
    try {
      const payload = field === 'status'
        ? { status: value ? 'open' : 'closed' }
        : { availability: value ? 'available' : 'busy' }
      const res = await updateVendorStatus(payload)
      setVendor(res.data.vendor)
      toast.success('Status updated!')
    } catch {
      toast.error('Failed to update status')
    }
  }

  const handleAction = async (requestId, status) => {
    setActionLoading(requestId + status)
    try {
      await updateRequestStatus(requestId, { status })
      toast.success(`Request ${status}!`)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) return <div className="min-h-screen bg-dark-900"><VendorNavbar /><LoadingSpinner size="lg" /></div>

  return (
    <div className="min-h-screen bg-dark-900">
      <VendorNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Greeting */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-white">
            Hi {vendor?.ownerName?.split(' ')[0] || user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-400 mt-1">{vendor?.shopName} • {vendor?.serviceArea}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column */}
          <div className="lg:col-span-1 space-y-4">

            {/* Vendor Card */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-2xl border border-blue-500/20">
                  🏪
                </div>
                <div>
                  <h3 className="font-bold text-white">{vendor?.shopName}</h3>
                  <p className="text-slate-400 text-sm">{vendor?.serviceType}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <StatusBadge status={vendor?.status} />
                <StatusBadge status={vendor?.availability} />
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <div className="flex text-yellow-400 text-sm">
                  {'★'.repeat(Math.round(vendor?.avgRating || 0))}
                  {'☆'.repeat(5 - Math.round(vendor?.avgRating || 0))}
                </div>
                <span className="text-xs text-slate-500">({vendor?.totalReviews} reviews)</span>
              </div>
            </div>

            {/* Status Controls */}
            <div className="card space-y-3">
              <h3 className="font-bold text-white mb-4">⚙️ Status Controls</h3>
              <Toggle
                label="Shop Status"
                checked={vendor?.status === 'open'}
                onChange={() => handleToggleStatus('status', vendor?.status !== 'open')}
                onLabel="Currently Open for business"
                offLabel="Currently Closed"
              />
              <Toggle
                label="Availability"
                checked={vendor?.availability === 'available'}
                onChange={() => handleToggleStatus('availability', vendor?.availability !== 'available')}
                onLabel="Available for new requests"
                offLabel="Busy with current work"
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="stat-card">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Pending</p>
                <p className="text-3xl font-black text-yellow-400">{requests.length}</p>
              </div>
              <div className="stat-card">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Rating</p>
                <p className="text-3xl font-black text-white">{vendor?.avgRating > 0 ? vendor.avgRating.toFixed(1) : '–'}</p>
              </div>
            </div>
          </div>

          {/* Right Column — Pending Requests */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">📥 Pending Requests</h2>
                <span className="badge badge-yellow">{requests.length} new</span>
              </div>

              {requests.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">✨</div>
                  <p className="text-slate-400">No pending requests right now.</p>
                  <p className="text-slate-600 text-sm mt-1">New requests will appear here automatically.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="table-header text-left pb-3">Customer</th>
                        <th className="table-header text-left pb-3">Details</th>
                        <th className="table-header text-left pb-3">Time</th>
                        <th className="table-header text-left pb-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((r) => {
                        const timeLeft = Math.max(0, 15 - Math.floor((Date.now() - new Date(r.createdAt)) / 60000))
                        return (
                          <tr key={r._id} className="table-row">
                            <td className="table-cell">
                              <div className="font-medium text-white">{r.userId?.name || 'Customer'}</div>
                              <div className="text-xs text-blue-400">{r.userId?.phone}</div>
                            </td>
                            <td className="table-cell">
                              <div className="text-xs text-slate-400 line-clamp-1 max-w-[160px]">📍 {r.address}</div>
                              <div className="text-xs text-slate-500 line-clamp-1 max-w-[160px] mt-0.5">"{r.description}"</div>
                            </td>
                            <td className="table-cell">
                              <div className={`text-xs font-bold ${timeLeft < 5 ? 'text-red-400' : 'text-yellow-400'}`}>
                                ⏱ {timeLeft}m left
                              </div>
                              <div className="text-xs text-slate-600">{new Date(r.createdAt).toLocaleTimeString()}</div>
                            </td>
                            <td className="table-cell">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleAction(r._id, 'accepted')}
                                  disabled={actionLoading === r._id + 'accepted'}
                                  className="btn-success btn-sm"
                                >
                                  {actionLoading === r._id + 'accepted' ? '...' : '✓ Accept'}
                                </button>
                                <button
                                  onClick={() => handleAction(r._id, 'rejected')}
                                  disabled={actionLoading === r._id + 'rejected'}
                                  className="btn-danger btn-sm"
                                >
                                  {actionLoading === r._id + 'rejected' ? '...' : '✗ Reject'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
              <p className="text-xs text-slate-500">
                <span className="text-blue-400 font-semibold">⏱ Auto-cancel:</span> Requests not responded to within 15 minutes are automatically cancelled. Toggle your status to <span className="text-emerald-400">Open + Available</span> to receive requests.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
