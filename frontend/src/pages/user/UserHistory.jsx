import { useState, useEffect } from 'react'
import UserNavbar from '../../components/Navbar'
import StatusBadge from '../../components/StatusBadge'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getUserRequests, createReview } from '../../api/requests'
import toast from 'react-hot-toast'

const ReviewModal = ({ request, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [hovered, setHovered] = useState(0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onSubmit({ vendorId: request.vendorId._id, requestId: request._id, rating, comment })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="card w-full max-w-md animate-slide-up">
        <h2 className="text-xl font-bold text-white mb-1">Leave a Review</h2>
        <p className="text-slate-400 text-sm mb-6">for <span className="text-white">{request.vendorId?.shopName}</span></p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Rating *</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map((s) => (
                <button key={s} type="button"
                  onMouseEnter={() => setHovered(s)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(s)}
                  className="text-3xl transition-transform hover:scale-110"
                >
                  <span className={(hovered || rating) >= s ? 'text-yellow-400' : 'text-slate-600'}>★</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Comment (optional)</label>
            <textarea rows={3} placeholder="Share your experience..."
              value={comment} onChange={(e) => setComment(e.target.value)}
              className="input-field resize-none" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Submit Review ⭐</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function UserHistory() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewingRequest, setReviewingRequest] = useState(null)

  useEffect(() => {
    getUserRequests().then(r => setRequests(r.data.requests)).finally(() => setLoading(false))
  }, [])

  const handleReview = async (data) => {
    try {
      await createReview(data)
      toast.success('Review submitted!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    }
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <UserNavbar />
      {reviewingRequest && (
        <ReviewModal request={reviewingRequest} onClose={() => setReviewingRequest(null)} onSubmit={handleReview} />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="section-title">📜 My Service History</h1>

        {loading ? <LoadingSpinner text="Loading history..." /> : requests.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-white mb-2">No requests yet</h3>
            <p className="text-slate-400">Go find a service provider and make your first request!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((r) => (
              <div key={r._id} className="card animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-xl border border-blue-500/20 shrink-0">
                      🛠️
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{r.vendorId?.shopName || 'Unknown Vendor'}</h3>
                      <p className="text-sm text-slate-400">{r.vendorId?.serviceType}</p>
                      <p className="text-xs text-slate-500 mt-1">📍 {r.address}</p>
                      <p className="text-xs text-slate-500">🕐 {new Date(r.createdAt).toLocaleString()}</p>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">"{r.description}"</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <StatusBadge status={r.status} />
                    {r.status === 'completed' && (
                      <button onClick={() => setReviewingRequest(r)} className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors">
                        ⭐ Leave Review
                      </button>
                    )}
                    {r.status === 'accepted' && r.vendorId?.phone && (
                      <a href={`tel:${r.vendorId.phone}`} className="text-xs text-blue-400 hover:text-blue-300">
                        📞 Call Vendor
                      </a>
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
