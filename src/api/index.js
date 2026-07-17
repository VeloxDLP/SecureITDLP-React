import axios from 'axios'

// ── Create instance ──────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Token helpers ────────────────────────────────────────────────
export const TokenService = {
  get:     ()      => localStorage.getItem('pg_token'),
  set:     (token) => localStorage.setItem('pg_token', token),
  remove:  ()      => localStorage.removeItem('pg_token'),
  isValid: ()      => {
    const token = localStorage.getItem('pg_token')
    if (!token) return false
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 > Date.now()
    } catch {
      return false
    }
  },
}

// ── Request interceptor — attach Bearer token ────────────────────
api.interceptors.request.use(
  (config) => {
    const token = TokenService.get()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor — handle 401 / token expiry ────────────
let isRefreshing = false
let failedQueue  = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else       prom.resolve(token)
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // 401 — try refresh once, then redirect to login
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // TODO: swap for your real refresh endpoint
        // const { data } = await api.post('/auth/refresh')
        // TokenService.set(data.token)
        // processQueue(null, data.token)
        // originalRequest.headers.Authorization = `Bearer ${data.token}`
        // return api(originalRequest)

        // For now — clear and redirect
        TokenService.remove()
        processQueue(new Error('Session expired'))
        window.location.href = '/login'
      } catch (refreshError) {
        TokenService.remove()
        processQueue(refreshError)
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api

// ── Auth API calls ───────────────────────────────────────────────
export const AuthAPI = {
  login:  (credentials) => api.post('/auth/login',  credentials),
  logout: ()            => api.post('/auth/logout'),
  me:     ()            => api.get('/auth/me'),
}

// ── Dashboard API calls ──────────────────────────────────────────
export const DashboardAPI = {
  getStats:         () => api.get('/dashboard/stats'),
  getThreatTrend:   () => api.get('/dashboard/threats/trend'),
  getRecentAttacks: () => api.get('/dashboard/attacks/recent'),
  getDeviceStatus:  () => api.get('/dashboard/devices/status'),
}

// ── Devices API ──────────────────────────────────────────────────
export const DevicesAPI = {
  getAll:   (params) => api.get('/devices',      { params }),
  getById:  (id)     => api.get(`/devices/${id}`),
  update:   (id, d)  => api.put(`/devices/${id}`, d),
  delete:   (id)     => api.delete(`/devices/${id}`),
}