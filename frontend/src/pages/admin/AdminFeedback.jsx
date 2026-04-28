import { useState, useEffect } from 'react'
import { AdminNavbar } from '../../components/Navbar'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getAllReviews } from '../../api/admin'

export default function AdminFeedback() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getAllReviews().then(r => setReviews(r.data.reviews)).finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? reviews : reviews.filter(r => r.rating <= parseInt(filter))

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '—'

  const dist = [5, 4, 3, 2, 1].map(n => ({
    star: n,
    count: reviews.filter(r => r.rating === n).length,
    pct: reviews.length > 0 ? Math.round((reviews.filter(r => r.rating === n).length / reviews.length) * 100) : 0
  }))

  return (
    <div className="min-h-screen bg-dark-900">
      <AdminNavbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">⭐ Feedback & Reviews</h1>
          <p className="text-slate-400 mt-1">Monitor vendor ratings and customer feedback</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <p className="text-4xl font-black text-yellow-400">{avgRating}</p>
            <p className="text-slate-400 text-sm mt-1">Average Rating</p>
          </div>
          <div className="card text-center">
            <p className="text-4xl font-black text-white">{reviews.length}</p>
            <p className="text-slate-400 text-sm mt-1">Total Reviews</p>
          </div>
          <div className="card text-center">
            <p className="text-4xl font-black text-emerald-400">
              {reviews.filter(r => r.rating >= 4).length}
            </p>
            <p className="text-slate-400 text-sm mt-1">Positive (4–5★)</p>
          </div>
          <div className="card text-center">
            <p className="text-4xl font-black text-red-400">
              {reviews.filter(r => r.rating <= 2).length}
            </p>
            <p className="text-slate-400 text-sm mt-1">Poor (1–2★)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rating Distribution */}
          <div className="card">
            <h2 className="text-lg font-bold text-white mb-4">Rating Distribution</h2>
            <div className="space-y-3">
              {dist.map(({ star, count, pct }) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-yellow-400 text-sm w-6">{star}★</span>
                  <div className="flex-1 bg-slate-800 rounded-full h-2">
                    <div
                      className="h-2 bg-yellow-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Table */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">All Reviews</h2>
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="input-field text-sm py-1.5 w-auto"
              >
                <option value="all">All Ratings</option>
                <option value="2">2★ and below (Poor)</option>
                <option value="3">3★ and below</option>
              </select>
            </div>

            {loading ? <LoadingSpinner /> : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {filtered.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">No reviews found.</div>
                ) : filtered.map(r => (
                  <div key={r._id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="font-medium text-white text-sm">{r.userId?.name || 'User'}</span>
                        <span className="text-slate-500 text-xs ml-2">→</span>
                        <span className="text-blue-400 text-sm ml-2">{r.vendorId?.shopName || 'Vendor'}</span>
                        <span className="badge badge-gray text-xs ml-2">{r.vendorId?.serviceType}</span>
                      </div>
                      <div className="flex gap-0.5 shrink-0">
                        {[1,2,3,4,5].map(s => (
                          <span key={s} className={`text-sm ${s <= r.rating ? 'text-yellow-400' : 'text-slate-600'}`}>★</span>
                        ))}
                      </div>
                    </div>
                    {r.comment && <p className="text-slate-300 text-xs italic">"{r.comment}"</p>}
                    <p className="text-xs text-slate-600 mt-2">{new Date(r.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
