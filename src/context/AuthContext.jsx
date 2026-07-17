/**
 * AuthContext
 * -----------
 * Global authentication state.
 * Components never call authService directly —
 * they use this context via useAuth().
 *
 * State machine:
 *   INIT → (restoreSession) → AUTHENTICATED | UNAUTHENTICATED
 *   UNAUTHENTICATED → (login) → AUTHENTICATED
 *   AUTHENTICATED   → (logout) → UNAUTHENTICATED
 */

import React, {
  createContext, useContext,
  useState, useEffect, useCallback,
} from 'react'
import { authService } from '../services/authservice'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)  // true only during initial restore

  // ── Restore session on app startup ───────────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        const restoredUser = await authService.restoreSession()
        setUser(restoredUser)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  // ── Login ─────────────────────────────────────────────────────
  const login = useCallback(async (username, password) => {
    try {
      const loggedInUser = await authService.login({ username, password })
      setUser(loggedInUser)
      console.log(loggedInUser);
      return { success: true }
    } catch (err) {
      // err is already a normalised ApiError from authService
      return {
        success: false,
        message: err.message || 'Login failed.',
        fieldErrors: err.fieldErrors || {},
      }
    }
  }, [])

  // ── Logout ────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await authService.logout()  // clears tokens internally
    setUser(null)
  }, [])

  // ── Update user in state (e.g. after profile edit) ────────────
  const updateUser = useCallback((patch) => {
    setUser(prev => prev ? { ...prev, ...patch } : null)
  }, [])

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}