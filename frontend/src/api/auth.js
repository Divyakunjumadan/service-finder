import api from './axios'

export const register = (formData) =>
  api.post('/auth/register', formData, { headers: { 'Content-Type': 'multipart/form-data' } })

export const login = (data) => api.post('/auth/login', data)
export const getMe = () => api.get('/auth/me')
export const updateProfile = (data) => api.patch('/users/profile', data)
export const getNotifications = () => api.get('/users/notifications')
export const markNotificationsRead = () => api.patch('/users/notifications/read')
export const getUnreadCount = () => api.get('/users/notifications/unread-count')
