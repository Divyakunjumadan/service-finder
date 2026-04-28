import { useState, useEffect } from 'react'
import { AdminNavbar } from '../../components/Navbar'
import LoadingSpinner from '../../components/LoadingSpinner'
import StatusBadge from '../../components/StatusBadge'
import { getAllRequests } from '../../api/admin'

const STATUSES = ['all', 'pending', 'accepted', 'rejected', 'auto-cancelled', 'completed']

export default function AdminRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    setLoading(true)
    const params = filter !== 'all' ? { status: filter } : {}
    getAllRequests(params).then(r => setRequests(r.data.requests)).finally(() => setLoading(false))
  }, [filter])

  return (
    <div className="min-h-screen bg-dark-900">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">📋 Request Monitoring</h1>
          <p className="text-slate-400 mt-1">View and monitor all service requests</p>
        </div>
        <div className="flex gap-2 flex-wrap mb-6">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === s ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
              {s}
            </button>
          ))}
        </div>
        {loading ? <LoadingSpinner text="Loading requests..." /> : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    {['Customer', 'Vendor', 'Address', 'Description', 'Status', 'Date'].map(h => (
                      <th key={h} className="table-header text-left py-3 px-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {requests.map(r => (
                    <tr key={r._id} className="table-row">
                      <td className="table-cell">
                        <div className="font-medium text-white">{r.userId?.name || '—'}</div>
                        <div className="text-xs text-slate-500">{r.userId?.phone}</div>
                      </td>
                      <td className="table-cell">
                        <div className="text-slate-300">{r.vendorId?.shopName || '—'}</div>
                        <div className="text-xs text-slate-500">{r.vendorId?.serviceType}</div>
                      </td>
                      <td className="table-cell text-slate-400 text-xs">{r.address}</td>
                      <td className="table-cell">
                        <span className="text-slate-400 text-xs line-clamp-2 max-w-[180px]">{r.description}</span>
                      </td>
                      <td className="table-cell"><StatusBadge status={r.status} /></td>
                      <td className="table-cell text-xs text-slate-500">{new Date(r.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                  {requests.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-12 text-slate-500">No requests found.</td></tr>
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
