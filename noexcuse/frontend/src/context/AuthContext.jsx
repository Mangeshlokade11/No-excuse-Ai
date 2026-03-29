import { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On app start, check if token exists and fetch user
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('nex_token')
      if (token) {
        try {
          const res = await api.get('/users/me')  // your backend endpoint
          setUser(res)
        } catch {
          localStorage.removeItem('nex_token')
          setUser(null)
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    if (res?.token) localStorage.setItem('nex_token', res.token)
    // Fetch user after login
    const userData = await api.get('/users/me')
    setUser(userData)
    return userData
  }

  const logout = () => {
    localStorage.removeItem('nex_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}