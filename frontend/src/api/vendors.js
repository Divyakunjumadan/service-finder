import api from './axios'

export const getVendors = (params) => api.get('/vendors', { params })
export const getVendorById = (id) => api.get(`/vendors/${id}`)
export const getVendorProfile = () => api.get('/vendors/profile')
export const updateVendorStatus = (data) => api.patch('/vendors/status', data)
export const updateVendorProfile = (formData) =>
  api.patch('/vendors/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
