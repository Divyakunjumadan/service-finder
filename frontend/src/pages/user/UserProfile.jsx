import { useState } from 'react'
import UserNavbar from '../../components/Navbar'
import { useAuth } from '../../context/AuthContext'
import { updateProfile } from '../../api/auth'
import toast from 'react-hot-toast'

export default function UserProfile() {
  const { user, fetchMe } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    location: user?.location || ''
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfile(form)
      await fetchMe()
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <UserNavbar />
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <h1 className="section-title">👤 My Profile</h1>

        {/* Avatar */}
        <div className="card mb-6 flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center text-3xl border border-blue-500/20">
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <p className="text-slate-400 text-sm">{user?.email}</p>
            <span className="badge badge-blue mt-1">Customer</span>
          </div>
        </div>

        {/* Edit Form */}
        <div className="card">
          <h2 className="text-lg font-bold text-white mb-6">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" placeholder="Your full name" />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-field" placeholder="+91 9876543210" />
            </div>
            <div>
              <label className="label">Address</label>
              <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="input-field" placeholder="Home/Office address" />
            </div>
            <div>
              <label className="label">City/Area</label>
              <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="input-field" placeholder="Mumbai, Delhi..." />
            </div>
            <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
              {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Account Info */}
        <div className="card mt-6">
          <h2 className="text-lg font-bold text-white mb-4">Account Info</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400 text-sm">Email</span>
              <span className="text-white text-sm">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 text-sm">Role</span>
              <span className="badge badge-blue">Customer</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 text-sm">Member Since</span>
              <span className="text-white text-sm">{new Date(user?.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
