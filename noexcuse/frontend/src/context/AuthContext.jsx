import { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, signup as apiSignup, logout as apiLogout, getUserProfile } from '../api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user on app start
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('nex_token')
      if (token) {
        try {
          const data = await getUserProfile()
          setUser(data)
        } catch {
          apiLogout()
        }
      }
      setLoading(false)
    }
    init()
  }, [])

  const login = async (email, password) => {
    const data = await apiLogin(email, password)
    if (data?.user) setUser(data.user)
    return data
  }

  const signup = async (name, email, password, username) => {
    const data = await apiSignup(name, email, password, username)
    if (data?.user) setUser(data.user)
    return data
  }

  const logout = () => {
    apiLogout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)