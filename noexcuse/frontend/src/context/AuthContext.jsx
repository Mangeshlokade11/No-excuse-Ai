import { createContext, useContext } from 'react'
import api from '../lib/api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('nex_token', data.token)
    return data
  }

  const signup = async (name, email, password, username) => {
    const { data } = await api.post('/auth/signup', {
      name,
      email,
      password,
      username
    })
    localStorage.setItem('nex_token', data.token)
    return data
  }

  return (
    <AuthContext.Provider value={{ login, signup }}>
      {children}
    </AuthContext.Provider>
  )
}