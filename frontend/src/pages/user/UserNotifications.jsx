import { useState, useEffect } from 'react'
import UserNavbar from '../../components/Navbar'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getNotifications, markNotificationsRead } from '../../api/auth'
import toast from 'react-hot-toast'

const TYPE_ICONS = {
  request: '📩', status: '📋', feedback: '⭐', system: '🔔'
}

export default function UserNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getNotifications()
        setNotifications(res.data.notifications)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const handleMarkRead = async () => {
    try {
      await markNotificationsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      toast.success('All marked as read')
    } catch {
      toast.error('Failed to mark as read')
    }
  }

  const unread = notifications.filter((n) => !n.isRead).length

  return (
    <div className="min-h-screen bg-dark-900">
      <UserNavbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="section-title mb-0">🔔 Notifications</h1>
          {unread > 0 && (
            <button onClick={handleMarkRead} className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              Mark all as read ({unread})
            </button>
          )}
        </div>

        {loading ? <LoadingSpinner text="Loading notifications..." /> : notifications.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-5xl mb-4">🔔</div>
            <h3 className="text-xl font-bold text-white mb-2">No notifications</h3>
            <p className="text-slate-400">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n._id} className={`card animate-fade-in transition-all ${!n.isRead ? 'border-blue-500/30 bg-blue-500/5' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center text-xl shrink-0">
                    {TYPE_ICONS[n.type] || '🔔'}
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-200 text-sm leading-relaxed">{n.message}</p>
                    <p className="text-xs text-slate-500 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                  {!n.isRead && (
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0 mt-1" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
