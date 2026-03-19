import { useState, useEffect, useCallback } from 'react'
import api from '../lib/api'
import toast from 'react-hot-toast'

export const useHabits = () => {
  const [habits, setHabits]   = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    try { const { data } = await api.get('/habits'); setHabits(data) }
    catch { toast.error('Failed to load habits') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const addHabit    = useCallback(async (p) => { const { data } = await api.post('/habits', p); setHabits(h => [...h, data]); return data }, [])
  const removeHabit = useCallback(async (id) => { await api.delete(`/habits/${id}`); setHabits(h => h.filter(x => x._id !== id)) }, [])
  const updateHabit = useCallback(async (id, p) => { const { data } = await api.put(`/habits/${id}`, p); setHabits(h => h.map(x => x._id === id ? data : x)); return data }, [])

  return { habits, loading, refetch: fetch, addHabit, removeHabit, updateHabit }
}
