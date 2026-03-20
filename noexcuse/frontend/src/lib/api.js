import axios from 'axios'

// Use full API URL if defined, otherwise fallback to '/api' for local dev
const baseURL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '/api'

const api = axios.create({
  baseURL,
  timeout: 15000,
})

// Add auth token if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem('nex_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api