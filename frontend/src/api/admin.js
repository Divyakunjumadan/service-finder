import api from './axios'

export const getAnalytics = () => api.get('/admin/analytics')
export const getAllUsers = () => api.get('/admin/users')
export const toggleBlockUser = (id) => api.patch(`/admin/users/${id}/block`)
export const getAllVendors = () => api.get('/admin/vendors')
export const toggleApproveVendor = (id) => api.patch(`/admin/vendors/${id}/approve`)
export const deleteVendor = (id) => api.delete(`/admin/vendors/${id}`)
export const getAllRequests = (params) => api.get('/admin/requests', { params })
export const getAllReviews = () => api.get('/admin/reviews')
