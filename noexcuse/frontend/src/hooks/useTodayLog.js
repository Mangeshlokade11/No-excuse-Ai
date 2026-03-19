import { useState, useEffect, useCallback } from 'react'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

export const useTodayLog = () => {
  const { updateUser }    = useAuth()
  const [log, setLog]     = useState(null)
  const [loading, setL]   = useState(true)
  const [toggling, setT]  = useState(null)

  const fetchLog = useCallback(async () => {
    try { const { data } = await api.get('/logs'); setLog(data) }
    catch (e) { console.error(e) }
    finally { setL(false) }
  }, [])

  useEffect(() => { fetchLog() }, [fetchLog])

  const toggleHabit = useCallback(async (habitId) => {
    setT(habitId)
    try {
      const { data } = await api.post('/logs/toggle', { habitId })
      setLog(data.log)
      updateUser(data.user)
      return data
    } finally { setT(null) }
  }, [updateUser])

  const isCompleted = useCallback((habitId) => {
    if (!log?.completedHabits) return false
    return log.completedHabits.some(c => (c.habit?._id || c.habit)?.toString() === habitId?.toString())
  }, [log])

  return { log, loading, fetchLog, toggleHabit, toggling, isCompleted }
}
