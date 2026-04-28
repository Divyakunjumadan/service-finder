import axios from 'axios'

const API_URL = "https://service-finder-backend-divi-dve4f2hpb7bfceek.centralindia-01.azurewebsites.net/api"

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
})

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sf_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sf_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api