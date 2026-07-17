/**
 * axiosInstance.js
 * ----------------
 * The single Axios instance used by every service.
 *
 * Your API base: http://192.168.0.189:8080
 * Login endpoint: POST /user/login
 * Response shape: { token: "...", refreshtoken: "..." }
 *
 * Interceptors:
 *   1. Attach JWT Bearer token to every request
 *   2. Silent token refresh on 401 (queues concurrent requests)
 *   3. Hard logout when refresh also fails
 *   4. X-Request-ID header for server-side tracing
 */

import axios from 'axios'
import { TokenService } from '../utils/token'
import { API_ENDPOINTS, HTTP_STATUS } from '../constants/api'

// ── Create the instance ───────────────────────────────────────────
const axiosInstance = axios.create({
  // Set VITE_API_BASE_URL=http://192.168.0.189:8080 in your .env
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://192.168.0.41:8080',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  },
})

const generateRequestId = () =>
  Math.random().toString(36).slice(2, 10).toUpperCase()

// ── Refresh queue state ───────────────────────────────────────────
let isRefreshing = false
let failedQueue  = []

const processQueue = (error, newToken = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else       resolve(newToken)
  })
  failedQueue = []
}

const hardLogout = () => {
  TokenService.clearSession()
  // window.location.replace('/login')
  window.location.href = "/login";
}

// ── REQUEST interceptor ───────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = TokenService.getAccessToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    config.headers['X-Request-ID'] = generateRequestId()
    config.headers['X-Client-Time'] = new Date().toISOString()
    return config
  },
  (error) => Promise.reject(error)
)

// ── RESPONSE interceptor ──────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config

     if (originalRequest.url === API_ENDPOINTS.AUTH.LOGIN) {
      return Promise.reject(error);
    }
    
    if (error.response?.status !== HTTP_STATUS.UNAUTHORIZED || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (!TokenService.hasRefreshToken()) {
      hardLogout()
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return axiosInstance(originalRequest)
      }).catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      // Your backend's refresh endpoint — update body shape if needed
      const { data } = await axios.post(
        `${axiosInstance.defaults.baseURL}${API_ENDPOINTS.AUTH.REFRESH}`,
        { refreshToken: TokenService.getRefreshToken() },
        { headers: { 'Content-Type': 'application/json' } }
      )

      // Handle both response shapes: { token } or { accessToken }
      const newAccessToken  = data.token        || data.accessToken
      const newRefreshToken = data.refreshtoken || data.refreshToken

      TokenService.setSession({
        accessToken:  newAccessToken,
        refreshToken: newRefreshToken,
      })

      processQueue(null, newAccessToken)
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
      return axiosInstance(originalRequest)

    } catch (refreshError) {
      processQueue(refreshError)
      hardLogout()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default axiosInstance