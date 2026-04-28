import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { register as registerApi } from '../api/auth'
import toast from 'react-hot-toast'

const SERVICE_TYPES = ['Electrician', 'Plumber', 'Carpenter', 'Painter', 'AC Technician', 'Cleaner', 'Mason', 'Welder', 'Mechanic', 'TV Repair', 'Gardener', 'Other']

export default function Register() {
  const [searchParams] = useSearchParams()
  const [role, setRole] = useState(searchParams.get('role') === 'vendor' ? 'vendor' : 'user')
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', ownerName: '', shopName: '', email: '', password: '',
    phone: '', address: '', location: '', serviceType: '', shopAddress: '',
    serviceArea: '', pricingInfo: ''
  })
  const [images, setImages] = useState([])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('role', role)
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v) })
      if (role === 'vendor') images.forEach((f) => fd.append('images', f))

      const res = await registerApi(fd)
      login(res.data)
      toast.success(`Welcome, ${res.data.user.name}! 🎉`)
      navigate(role === 'vendor' ? '/vendor/dashboard' : '/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen hero-bg flex flex-col">
      <nav className="p-6">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <span className="text-2xl">⚡</span>
          <span className="text-xl font-bold gradient-text">Service Finder</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl animate-slide-up">
          <div className="card">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
              <p className="text-slate-400">Join Service Finder today</p>
            </div>

            {/* Role Toggle */}
            <div className="flex rounded-xl bg-slate-800 p-1 mb-8">
              {['user', 'vendor'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    role === r ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r === 'user' ? '👤 User (Customer)' : '🏪 Vendor (Provider)'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {role === 'user' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Full Name *</label>
                      <input name="name" required placeholder="John Doe" value={form.name} onChange={handleChange} className="input-field" />
                    </div>
                    <div>
                      <label className="label">Mobile Number *</label>
                      <input name="phone" required placeholder="+91 9876543210" value={form.phone} onChange={handleChange} className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Email Address *</label>
                    <input name="email" type="email" required placeholder="you@example.com" value={form.email} onChange={handleChange} className="input-field" />
                  </div>
                  <div>
                    <label className="label">Password *</label>
                    <input name="password" type="password" required placeholder="Min. 6 characters" value={form.password} onChange={handleChange} className="input-field" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Address</label>
                      <input name="address" placeholder="Home/Office address" value={form.address} onChange={handleChange} className="input-field" />
                    </div>
                    <div>
                      <label className="label">City/Area</label>
                      <input name="location" placeholder="Mumbai, Delhi..." value={form.location} onChange={handleChange} className="input-field" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Shop Name *</label>
                      <input name="shopName" required placeholder="Raju Electric Works" value={form.shopName} onChange={handleChange} className="input-field" />
                    </div>
                    <div>
                      <label className="label">Owner Name *</label>
                      <input name="ownerName" required placeholder="Raju Kumar" value={form.ownerName} onChange={handleChange} className="input-field" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Service Type *</label>
                      <select name="serviceType" required value={form.serviceType} onChange={handleChange} className="input-field">
                        <option value="">Select service</option>
                        {SERVICE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Phone Number *</label>
                      <input name="phone" required placeholder="+91 9876543210" value={form.phone} onChange={handleChange} className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Email Address *</label>
                    <input name="email" type="email" required placeholder="shop@example.com" value={form.email} onChange={handleChange} className="input-field" />
                  </div>
                  <div>
                    <label className="label">Password *</label>
                    <input name="password" type="password" required placeholder="Min. 6 characters" value={form.password} onChange={handleChange} className="input-field" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Shop Address *</label>
                      <input name="shopAddress" required placeholder="123 Main Street" value={form.shopAddress} onChange={handleChange} className="input-field" />
                    </div>
                    <div>
                      <label className="label">Service Area *</label>
                      <input name="serviceArea" required placeholder="Andheri, Mumbai" value={form.serviceArea} onChange={handleChange} className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Pricing Info (optional)</label>
                    <input name="pricingInfo" placeholder="e.g. ₹200/hr, Free inspection" value={form.pricingInfo} onChange={handleChange} className="input-field" />
                  </div>
                  <div>
                    <label className="label">Shop/Work Images (optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setImages(Array.from(e.target.files))}
                      className="input-field text-slate-400 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:text-sm cursor-pointer"
                    />
                    {images.length > 0 && <p className="text-xs text-slate-500 mt-1">{images.length} file(s) selected</p>}
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
                ) : `Create ${role === 'vendor' ? 'Vendor' : 'User'} Account →`}
              </button>
            </form>

            <p className="text-center text-slate-400 text-sm mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
