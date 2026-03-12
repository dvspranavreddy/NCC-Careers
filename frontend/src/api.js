import axios from 'axios'

// Determine the backend base URL
const getBackendURL = () => {
  if (import.meta.env.MODE === 'development') {
    return 'http://localhost:5001'
  }
  // In production, use the same origin (backend should be on same domain or set via env)
  return import.meta.env.VITE_API_URL || window.location.origin
}

const API = axios.create({
  baseURL: `${getBackendURL()}/api`,
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default API
