import { useState, useEffect } from 'react'
import { VendorNavbar } from '../../components/Navbar'
import { useAuth } from '../../context/AuthContext'
import { getVendorProfile, updateVendorProfile } from '../../api/vendors'
import LoadingSpinner from '../../components/LoadingSpinner'
import StatusBadge from '../../components/StatusBadge'
import toast from 'react-hot-toast'

const SERVICE_TYPES = ['Electrician', 'Plumber', 'Carpenter', 'Painter', 'AC Technician', 'Cleaner', 'Mason', 'Welder', 'Mechanic', 'TV Repair', 'Gardener', 'Other']

export default function VendorProfile() {
  const { user } = useAuth()
  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [images, setImages] = useState([])
  const [form, setForm] = useState({ shopName: '', phone: '', shopAddress: '', serviceArea: '', pricingInfo: '', serviceType: '' })

  useEffect(() => {
    getVendorProfile().then(r => {
      const v = r.data.vendor
      setVendor(v)
      setForm({ shopName: v.shopName, phone: v.phone, shopAddress: v.shopAddress, serviceArea: v.serviceArea, pricingInfo: v.pricingInfo || '', serviceType: v.serviceType })
    }).finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      images.forEach(f => fd.append('images', f))
      const res = await updateVendorProfile(fd)
      setVendor(res.data.vendor)
      toast.success('Profile updated!')
      setImages([])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-dark-900"><VendorNavbar /><LoadingSpinner /></div>

  return (
    <div className="min-h-screen bg-dark-900">
      <VendorNavbar />
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <h1 className="section-title">🏪 Vendor Profile</h1>

        {/* Shop Header */}
        <div className="card mb-6 flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center text-3xl border border-blue-500/20">
            🏪
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{vendor?.shopName}</h2>
            <p className="text-slate-400 text-sm">{vendor?.serviceType}</p>
            <div className="flex gap-2 mt-2">
              <StatusBadge status={vendor?.status} />
              <StatusBadge status={vendor?.availability} />
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="card">
          <h2 className="text-lg font-bold text-white mb-6">Edit Shop Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Shop Name</label>
              <input value={form.shopName} onChange={e => setForm({...form, shopName: e.target.value})} className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Service Type</label>
                <select value={form.serviceType} onChange={e => setForm({...form, serviceType: e.target.value})} className="input-field">
                  {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Phone Number</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-field" />
              </div>
            </div>
            <div>
              <label className="label">Shop Address</label>
              <input value={form.shopAddress} onChange={e => setForm({...form, shopAddress: e.target.value})} className="input-field" />
            </div>
            <div>
              <label className="label">Service Area</label>
              <input value={form.serviceArea} onChange={e => setForm({...form, serviceArea: e.target.value})} className="input-field" />
            </div>
            <div>
              <label className="label">Pricing Info</label>
              <input value={form.pricingInfo} onChange={e => setForm({...form, pricingInfo: e.target.value})} placeholder="e.g. ₹200/hr" className="input-field" />
            </div>
            <div>
              <label className="label">Add New Images</label>
              <input
                type="file" accept="image/*" multiple
                onChange={e => setImages(Array.from(e.target.files))}
                className="input-field text-slate-400 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:text-sm cursor-pointer"
              />
            </div>

            {/* Existing images */}
            {vendor?.images?.length > 0 && (
              <div>
                <label className="label">Current Images</label>
                <div className="flex gap-2 flex-wrap">
                  {vendor.images.map((img, i) => (
                    <img key={i} src={`http://localhost:5000${img}`} alt="" className="w-20 h-20 object-cover rounded-xl border border-slate-700" />
                  ))}
                </div>
              </div>
            )}

            <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
              {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
