/**
 * token.js — TokenService
 * -----------------------
 * All JWT storage, decoding, and expiry logic lives here.
 * Nothing else should touch localStorage for auth data.
 *
 * Adapted for your backend response shape:
 *   { token: "eyJ...", refreshtoken: "eyJ..." }
 */

const KEYS = {
  ACCESS_TOKEN:  'pg_access_token',
  REFRESH_TOKEN: 'pg_refresh_token',
  USER:          'pg_user',
}

// ── Decode JWT payload (no external library needed) ───────────────
const decodePayload = (token) => {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64).split('').map(c =>
        '%' + c.charCodeAt(0).toString(16).padStart(2, '0')
      ).join('')
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

export const TokenService = {

  // ── Access token ──────────────────────────────────────────────
  getAccessToken:    () => localStorage.getItem(KEYS.ACCESS_TOKEN),
  setAccessToken:    (t) => localStorage.setItem(KEYS.ACCESS_TOKEN, t),
  removeAccessToken: () => localStorage.removeItem(KEYS.ACCESS_TOKEN),

  // ── Refresh token ─────────────────────────────────────────────
  getRefreshToken:    () => localStorage.getItem(KEYS.REFRESH_TOKEN),
  setRefreshToken:    (t) => localStorage.setItem(KEYS.REFRESH_TOKEN, t),
  removeRefreshToken: () => localStorage.removeItem(KEYS.REFRESH_TOKEN),

  // ── User cache ────────────────────────────────────────────────
  getUser: () => {
    try {
      const raw = localStorage.getItem(KEYS.USER)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  },
  setUser:    (u) => localStorage.setItem(KEYS.USER, JSON.stringify(u)),
  removeUser: () => localStorage.removeItem(KEYS.USER),

  // ── Decode ────────────────────────────────────────────────────
  /** Decode a specific token string (not just the stored one) */
  decodeToken: (token) => decodePayload(token),

  /** Decode the stored access token */
  decode: () => {
    const token = localStorage.getItem(KEYS.ACCESS_TOKEN)
    if (!token) return null
    return decodePayload(token)
  },

  // ── Expiry helpers ────────────────────────────────────────────
  expiresIn: () => {
    const payload = TokenService.decode()
    if (!payload?.exp) return -1
    return (payload.exp * 1000) - Date.now()
  },

  /** True if token exists and has more than 30s left */
  isAccessTokenValid: () => TokenService.expiresIn() > 30_000,

  hasRefreshToken: () => !!localStorage.getItem(KEYS.REFRESH_TOKEN),

  // ── Role helpers ──────────────────────────────────────────────
  getRoles: () => {
    const p = TokenService.decode()
    return p?.roles || p?.authorities || []
  },
  hasRole: (role) => TokenService.getRoles().includes(role),

  // ── Session helpers ───────────────────────────────────────────
  /**
   * setSession({ accessToken, refreshToken, user })
   * Accepts both your backend's field names and our internal ones.
   * Saves whatever is provided — all fields optional.
   */
  setSession: ({ accessToken, refreshToken, user } = {}) => {
    if (accessToken)  TokenService.setAccessToken(accessToken)
    if (refreshToken) TokenService.setRefreshToken(refreshToken)
    if (user)         TokenService.setUser(user)
  },

  clearSession: () => {
    localStorage.removeItem(KEYS.ACCESS_TOKEN)
    localStorage.removeItem(KEYS.REFRESH_TOKEN)
    localStorage.removeItem(KEYS.USER)
  },
}