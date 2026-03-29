import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL + '/api'

const api = axios.create({
  baseURL,
  timeout: 15000,
})

// Add token to all requests if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem('nex_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle unauthorized responses
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// Login function
export const login = async (email, password) => {
  try {
    const res = await api.post('/auth/login', { email, password })
    // Save token to localStorage
    if (res.data?.token) localStorage.setItem('nex_token', res.data.token)
    return res.data
  } catch (err) {
    throw err.response?.data || err
  }
}

// Logout function
export const logout = () => {
  localStorage.clear()
  window.location.href = '/login'
}

// Example authenticated GET request
export const getUserProfile = async () => {
  const res = await api.get('/users/me')
  return res.data
}

export default api