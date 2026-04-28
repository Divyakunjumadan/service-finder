import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import UserNavbar from '../../components/Navbar'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useAuth } from '../../context/AuthContext'
import { createRequest } from '../../api/requests'
import { getVendorById } from '../../api/vendors'
import toast from 'react-hot-toast'

export default function RequestService() {
  const { vendorId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    address: user?.address || '',
    preferredTime: '',
    description: ''
  })

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getVendorById(vendorId)
        setVendor(res.data.vendor)
        setForm(f => ({ ...f, address: user?.address || '' }))
      } catch {
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [vendorId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await createRequest({ vendorId, ...form })
      toast.success('Request submitted! Waiting for vendor response...')
      navigate('/history')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-dark-900"><UserNavbar /><LoadingSpinner /></div>

  return (
    <div className="min-h-screen bg-dark-900">
      <UserNavbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <Link to={`/vendor/${vendorId}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
          ← Back to Vendor
        </Link>

        {/* Vendor Summary */}
        {vendor && (
          <div className="card mb-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-2xl border border-blue-500/20">
              🛠️
            </div>
            <div>
              <h2 className="font-bold text-white">{vendor.shopName}</h2>
              <p className="text-slate-400 text-sm">{vendor.serviceType} • {vendor.serviceArea}</p>
            </div>
          </div>
        )}

        {/* Request Form */}
        <div className="card">
          <h1 className="text-2xl font-bold text-white mb-2">Request Service</h1>
          <p className="text-slate-400 text-sm mb-6">
            Fill in the details below. The vendor has <span className="text-yellow-400 font-semibold">15 minutes</span> to respond before the request auto-cancels.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Your Address *</label>
              <input
                name="address"
                required
                placeholder="Enter the service address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="input-field"
              />
              <p className="text-xs text-slate-600 mt-1">Auto-filled from your profile. Edit if needed.</p>
            </div>

            <div>
              <label className="label">Preferred Date & Time *</label>
              <input
                name="preferredTime"
                type="datetime-local"
                required
                value={form.preferredTime}
                onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                className="input-field"
                style={{ colorScheme: 'dark' }}
              />
            </div>

            <div>
              <label className="label">Problem Description *</label>
              <textarea
                name="description"
                required
                rows={4}
                placeholder="Describe the issue in detail. E.g. 'Fan not working in bedroom, no power to the socket...'"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-field resize-none"
              />
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <p className="text-sm text-blue-300 font-semibold mb-1">⏱ What happens next?</p>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Your request will be sent to {vendor?.shopName}</li>
                <li>• The vendor has 15 minutes to accept or reject</li>
                <li>• No response = auto-cancelled</li>
                <li>• You can call the vendor directly while waiting</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Link to={`/vendor/${vendorId}`} className="btn-secondary flex-1 text-center">
                Cancel
              </Link>
              <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {submitting ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                ) : '📩 Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
