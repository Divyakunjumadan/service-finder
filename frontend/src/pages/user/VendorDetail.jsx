import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import UserNavbar from '../../components/Navbar'
import StatusBadge from '../../components/StatusBadge'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getVendorById } from '../../api/vendors'

export default function VendorDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [vendor, setVendor] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [imgIdx, setImgIdx] = useState(0)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getVendorById(id)
        setVendor(res.data.vendor)
        setReviews(res.data.reviews)
      } catch {
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  if (loading) return <div className="min-h-screen bg-dark-900"><UserNavbar /><LoadingSpinner size="lg" text="Loading vendor..." /></div>
  if (!vendor) return null

  const images = vendor.images?.length > 0 ? vendor.images : []

  return (
    <div className="min-h-screen bg-dark-900">
      <UserNavbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Back */}
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
          ← Back to Search
        </Link>

        {/* Image Carousel */}
        {images.length > 0 && (
          <div className="relative h-64 rounded-2xl overflow-hidden mb-8 bg-slate-800 border border-slate-700">
            <img
              src={`http://localhost:5000${images[imgIdx]}`}
              alt="Shop"
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === imgIdx ? 'bg-white w-6' : 'bg-white/40'}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Header Card */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">{vendor.shopName}</h1>
              <p className="text-slate-400 mb-3">{vendor.serviceType} • {vendor.serviceArea}</p>
              <div className="flex items-center gap-3 flex-wrap">
                <StatusBadge status={vendor.status} />
                <StatusBadge status={vendor.availability} />
                {!vendor.isApproved && <span className="badge badge-yellow">⚠️ Pending Approval</span>}
              </div>
            </div>

            {/* Rating */}
            <div className="text-center md:text-right">
              <div className="text-4xl font-black text-white">{vendor.avgRating > 0 ? vendor.avgRating.toFixed(1) : '–'}</div>
              <div className="flex justify-center md:justify-end gap-0.5 my-1">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} className={`w-4 h-4 ${s <= Math.round(vendor.avgRating) ? 'text-yellow-400' : 'text-slate-600'}`}
                    fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="text-xs text-slate-500">{vendor.totalReviews} reviews</div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700/50">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Owner</p>
              <p className="text-white font-medium">{vendor.ownerName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Phone</p>
              <p className="text-white font-medium">{vendor.phone}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Shop Address</p>
              <p className="text-white font-medium">{vendor.shopAddress}</p>
            </div>
            {vendor.pricingInfo && (
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Pricing</p>
                <p className="text-emerald-400 font-medium">{vendor.pricingInfo}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <a
              href={`tel:${vendor.phone}`}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              📞 Call Vendor
            </a>
            {vendor.status === 'open' ? (
              <Link
                to={`/request/${vendor._id}`}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                📩 Request Service
              </Link>
            ) : (
              <button disabled className="btn-primary opacity-50 cursor-not-allowed text-sm">
                Shop is Closed
              </button>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-6">Customer Reviews ({reviews.length})</h2>
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">💬</div>
              <p className="text-slate-400">No reviews yet. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r._id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600/30 rounded-full flex items-center justify-center text-sm font-bold text-blue-400">
                        {r.userId?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <span className="font-medium text-white text-sm">{r.userId?.name || 'User'}</span>
                    </div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? 'text-yellow-400' : 'text-slate-600'}`}
                          fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  {r.comment && <p className="text-slate-300 text-sm">{r.comment}</p>}
                  <p className="text-xs text-slate-600 mt-2">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
