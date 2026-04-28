import api from './axios'

export const createRequest = (data) => api.post('/requests', data)
export const getUserRequests = () => api.get('/requests/user')
export const getVendorRequests = (params) => api.get('/requests/vendor', { params })
export const updateRequestStatus = (id, data) => api.patch(`/requests/${id}`, data)
export const getRequestById = (id) => api.get(`/requests/${id}`)

export const createReview = (data) => api.post('/reviews', data)
export const getVendorReviews = (vendorId) => api.get(`/reviews/vendor/${vendorId}`)
