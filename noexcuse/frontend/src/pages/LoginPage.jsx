import { createContext, useContext, useState } from 'react'
import { login as apiLogin, logout as apiLogout } from '../api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nex_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = async (email, password) => {
    const data = await apiLogin(email, password)
    if (data?.user) {
      setUser(data.user)
      localStorage.setItem('nex_user', JSON.stringify(data.user))
    }
    return data
  }

  const logout = () => {
    apiLogout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)