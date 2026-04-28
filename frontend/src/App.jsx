import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'

// Public
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'

// User
import UserHome from './pages/user/UserHome'
import VendorDetail from './pages/user/VendorDetail'
import RequestService from './pages/user/RequestService'
import UserHistory from './pages/user/UserHistory'
import UserNotifications from './pages/user/UserNotifications'
import UserProfile from './pages/user/UserProfile'

// Vendor
import VendorDashboard from './pages/vendor/VendorDashboard'
import VendorHistory from './pages/vendor/VendorHistory'
import VendorNotifications from './pages/vendor/VendorNotifications'
import VendorProfile from './pages/vendor/VendorProfile'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminVendors from './pages/admin/AdminVendors'
import AdminRequests from './pages/admin/AdminRequests'
import AdminFeedback from './pages/admin/AdminFeedback'

const RoleRedirect = () => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'vendor') return <Navigate to="/vendor/dashboard" replace />
  if (user.role === 'admin') return <Navigate to="/admin" replace />
  return <Navigate to="/dashboard" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/redirect" element={<RoleRedirect />} />

      {/* User Routes */}
      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['user']}><UserHome /></ProtectedRoute>} />
      <Route path="/vendor/:id" element={<ProtectedRoute allowedRoles={['user']}><VendorDetail /></ProtectedRoute>} />
      <Route path="/request/:vendorId" element={<ProtectedRoute allowedRoles={['user']}><RequestService /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute allowedRoles={['user']}><UserHistory /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute allowedRoles={['user']}><UserNotifications /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute allowedRoles={['user']}><UserProfile /></ProtectedRoute>} />

      {/* Vendor Routes */}
      <Route path="/vendor/dashboard" element={<ProtectedRoute allowedRoles={['vendor']}><VendorDashboard /></ProtectedRoute>} />
      <Route path="/vendor/history" element={<ProtectedRoute allowedRoles={['vendor']}><VendorHistory /></ProtectedRoute>} />
      <Route path="/vendor/notifications" element={<ProtectedRoute allowedRoles={['vendor']}><VendorNotifications /></ProtectedRoute>} />
      <Route path="/vendor/profile" element={<ProtectedRoute allowedRoles={['vendor']}><VendorProfile /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/vendors" element={<ProtectedRoute allowedRoles={['admin']}><AdminVendors /></ProtectedRoute>} />
      <Route path="/admin/requests" element={<ProtectedRoute allowedRoles={['admin']}><AdminRequests /></ProtectedRoute>} />
      <Route path="/admin/feedback" element={<ProtectedRoute allowedRoles={['admin']}><AdminFeedback /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
