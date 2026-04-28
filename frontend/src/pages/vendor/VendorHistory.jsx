import { useState, useEffect } from 'react'
import { VendorNavbar } from '../../components/Navbar'
import StatusBadge from '../../components/StatusBadge'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getVendorRequests, updateRequestStatus } from '../../api/requests'
import toast from 'react-hot-toast'

const STATUSES = ['all', 'pending', 'accepted', 'rejected', 'auto-cancelled', 'completed']

export default function VendorHistory() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [completing, setCompleting] = useState(null)

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const params = filter !== 'all' ? { status: filter } : {}
      const res = await getVendorRequests(params)
      setRequests(res.data.requests)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRequests() }, [filter])

  const handleComplete = async (id) => {
    setCompleting(id)
    try {
      await updateRequestStatus(id, { status: 'completed' })
      toast.success('Marked as completed!')
      fetchRequests()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    } finally {
      setCompleting(null)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <VendorNavbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="section-title">📜 Request History</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                filter === s ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? <LoadingSpinner text="Loading history..." /> : requests.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-slate-400">No requests in this category.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((r) => (
              <div key={r._id} className="card animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-sm font-bold text-slate-300">
                        {r.userId?.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <span className="font-semibold text-white">{r.userId?.name || 'Customer'}</span>
                    </div>
                    <p className="text-xs text-slate-500 ml-10">📍 {r.address}</p>
                    <p className="text-xs text-slate-500 ml-10">📞 {r.userId?.phone}</p>
                    <p className="text-xs text-slate-400 ml-10 mt-1 line-clamp-2">"{r.description}"</p>
                    <p className="text-xs text-slate-600 ml-10 mt-1">{new Date(r.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-10 md:ml-0">
                    <StatusBadge status={r.status} />
                    {r.status === 'accepted' && (
                      <button
                        onClick={() => handleComplete(r._id)}
                        disabled={completing === r._id}
                        className="btn-primary btn-sm text-xs"
                      >
                        {completing === r._id ? 'Updating...' : '✔ Mark Complete'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
