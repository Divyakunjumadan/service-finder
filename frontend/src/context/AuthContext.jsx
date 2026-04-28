import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [vendor, setVendor] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('sf_token') || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetchMe()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchMe = async () => {
    try {
      const res = await api.get('/auth/me')
      setUser(res.data.user)
      setVendor(res.data.vendor || null)
    } catch {
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = (data) => {
    localStorage.setItem('sf_token', data.token)
    setToken(data.token)
    setUser(data.user)
    setVendor(data.vendor || null)
  }

  const logout = () => {
    localStorage.removeItem('sf_token')
    setToken(null)
    setUser(null)
    setVendor(null)
  }

  return (
    <AuthContext.Provider value={{ user, vendor, token, loading, login, logout, fetchMe }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
