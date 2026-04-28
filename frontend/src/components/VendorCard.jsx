import { Link } from 'react-router-dom'

const SERVICE_ICONS = {
  Electrician: '⚡',
  Plumber: '🔧',
  Carpenter: '🪚',
  Painter: '🎨',
  Mechanic: '🔩',
  Cleaner: '🧹',
  Mason: '🧱',
  Welder: '🔥',
  'AC Technician': '❄️',
  'TV Repair': '📺',
  Gardener: '🌿',
  default: '🛠️'
}

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'text-yellow-400' : 'text-slate-600'}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-slate-400 ml-1">{rating > 0 ? rating.toFixed(1) : 'New'}</span>
    </div>
  )
}

const VendorCard = ({ vendor }) => {
  const icon = SERVICE_ICONS[vendor.serviceType] || SERVICE_ICONS.default
  const isOpen = vendor.status === 'open'
  const isAvailable = vendor.availability === 'available'

  return (
    <Link to={`/vendor/${vendor._id}`} className="block">
      <div className="card card-hover cursor-pointer group">
        {/* Header with icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-2xl border border-blue-500/20 group-hover:border-blue-400/40 transition-colors">
              {icon}
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                {vendor.shopName}
              </h3>
              <p className="text-sm text-slate-400">{vendor.serviceType}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`badge ${isOpen ? 'badge-green' : 'badge-red'}`}>
              {isOpen ? '● Open' : '● Closed'}
            </span>
            <span className={`badge ${isAvailable ? 'badge-blue' : 'badge-yellow'}`}>
              {isAvailable ? '✓ Available' : '⏳ Busy'}
            </span>
          </div>
        </div>

        {/* Rating */}
        <StarRating rating={vendor.avgRating} />

        {/* Info */}
        <div className="mt-3 space-y-1.5">
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <span>📍</span> {vendor.serviceArea}
          </p>
          {vendor.pricingInfo && (
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <span>💰</span> {vendor.pricingInfo}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between">
          <span className="text-xs text-slate-500">{vendor.totalReviews} review{vendor.totalReviews !== 1 ? 's' : ''}</span>
          <span className="text-xs text-blue-400 font-medium group-hover:underline">View Details →</span>
        </div>
      </div>
    </Link>
  )
}

export default VendorCard
