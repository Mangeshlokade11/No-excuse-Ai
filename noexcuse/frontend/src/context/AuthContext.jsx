import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../lib/api'

const Ctx = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null)
  const [loading, setLoad]  = useState(true)

  useEffect(() => {
    const t = localStorage.getItem('nex_token')
    const u = localStorage.getItem('nex_user')
    if (t && u) { try { setUser(JSON.parse(u)) } catch {} }
    setLoad(false)
  }, [])

  const persist = (token, user) => {
    localStorage.setItem('nex_token', token)
    localStorage.setItem('nex_user', JSON.stringify(user))
    setUser(user)
  }

  const login  = useCallback(async (email, password) => { const { data } = await api.post('/auth/login', { email, password }); persist(data.token, data.user); return data.user }, [])
  const signup = useCallback(async (name, email, password, username) => { const { data } = await api.post('/auth/signup', { name, email, password, username }); persist(data.token, data.user); return data.user }, [])
  const logout = useCallback(() => { localStorage.clear(); setUser(null) }, [])
  const updateUser = useCallback((u) => { setUser(p => { const n = {...p,...u}; localStorage.setItem('nex_user', JSON.stringify(n)); return n }) }, [])

  return <Ctx.Provider value={{ user, loading, login, signup, logout, updateUser }}>{children}</Ctx.Provider>
}

export const useAuth = () => { const c = useContext(Ctx); if (!c) throw new Error('useAuth outside AuthProvider'); return c }
