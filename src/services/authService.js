/**
 * authService.js
 * --------------
 * Handles all authentication API calls.
 *
 * Your API response for POST /user/login:
 *   { token: "eyJ...", refreshtoken: "eyJ..." }
 *
 * To switch mock → real backend:
 *   Set VITE_USE_MOCK=false in your .env
 */

import axiosInstance from '../api/axiosInstance'
import { TokenService } from '../utils/token'
import { API_ENDPOINTS } from '../constants/api'
import { normaliseError } from '../utils/apiError'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

// ── Mock helpers ─────────────────────────────────────────────────
const mockDelay = (ms = 600) => new Promise(r => setTimeout(r, ms))

const createMockJwt = (payload, expiresInSeconds = 3600) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const body = btoa(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  return `${header}.${body}.mock_signature`
}

// ── Build user object from JWT sub claim ─────────────────────────
// Since your backend doesn't return a user object, we decode the
// username from the JWT payload's `sub` field and construct the
// user object ourselves. Role defaults to 'Admin' — update the
// claim name if your JWT encodes it differently.
const buildUserFromToken = (token, fallbackUsername = '') => {
  const payload = TokenService.decodeToken(token)
  const username = payload?.sub || fallbackUsername
  const role     = payload?.role || payload?.roles?.[0] || 'Admin'
  return {
    id:       payload?.userId || payload?.id || 1,
    username,
    role,
    branch:   payload?.branch || 'HQ',
    email:    payload?.email  || `${username}@planetguard.io`,
  }
}

// ── Auth Service ─────────────────────────────────────────────────
export const authService = {

  /**
   * login({ username, password })
   * POSTs to /user/login, maps the response to our internal
   * session format, and returns the user object.
   */
  login: async ({ username, password }) => {
    try {
      if (USE_MOCK) {
        await mockDelay()
        if (!username || !password)
          throw { response: { status: 400, data: { message: 'Username and password are required.' } } }
        if (password === 'wrong')
          throw { response: { status: 401, data: { message: 'Invalid username or password.' } } }

        const user = { id: 1, username, role: 'Admin', branch: 'HQ', email: `${username}@planetguard.io` }
        TokenService.setSession({
          accessToken:  createMockJwt({ sub: username, roles: ['ROLE_ADMIN'], userId: 1 }, 3600),
          refreshToken: createMockJwt({ sub: username, type: 'refresh' }, 86400),
          user,
        })
        return user
      }

      // ── Real API call ──────────────────────────────────────────
      // POST http://192.168.0.189:8080/user/login
      // Body: { username, password }
      // Response: { token, refreshtoken }
      const { data } = await axiosInstance.post(
        API_ENDPOINTS.AUTH.LOGIN,
        { username, password }
      )

      // Map your backend's field names to our internal names
      //   data.token        → accessToken
      //   data.refreshtoken → refreshToken
      // const accessToken  = data.token
      // const refreshToken = data.refreshtoken
      const responseData = data.data
      const accessToken = responseData.accessToken
      const refreshToken = responseData.refreshToken
      if (!accessToken) throw new Error('No token received from server.')

      // Build user from JWT sub claim + the username they typed
      // const user = buildUserFromToken(accessToken, username)
      const user = responseData.user

      // Persist everything to localStorage
      TokenService.setSession({ accessToken, refreshToken, user })

      return user

    } catch (err) {
      // throw normaliseError(err)
       console.log("========== LOGIN ERROR ==========");
  console.log("Full Error:", err);
  console.log("Response:", err.response);
  console.log("Response Data:", err.response?.data);
  console.log("Backend Message:", err.response?.data?.message);

  const apiError = normaliseError(err);

  console.log("Normalized Message:", apiError.message);

  throw apiError;

    }
  },

  /**
   * logout()
   * Clears session. Silent — never throws.
   */
  logout: async () => {
    try {
      // Only call server logout if your backend supports it
      // if (!USE_MOCK) await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT)
    } catch {
      // Non-critical — token expires on its own
    } finally {
      TokenService.clearSession()
    }
  },

  /**
   * restoreSession()
   * Called on app startup. Returns the user if a valid
   * session exists, null otherwise.
   * Since there's no /me endpoint, we restore from localStorage.
   */
  restoreSession: async () => {
    const accessToken = TokenService.getAccessToken()
    if (!accessToken) return null

    // Token still valid — restore user from localStorage cache
    if (TokenService.isAccessTokenValid()) {
      return TokenService.getUser()
    }

    // Token expired but refresh token exists
    // The Axios interceptor will handle the silent refresh automatically.
    // Just return null here and let the next route redirect to login
    // if the refresh also fails.
    if (TokenService.hasRefreshToken()) {
      // Try to use the cached user; the next API call will refresh the token
      const cachedUser = TokenService.getUser()
      if (cachedUser) return cachedUser
    }

    // No valid session
    TokenService.clearSession()
    return null
  },
}