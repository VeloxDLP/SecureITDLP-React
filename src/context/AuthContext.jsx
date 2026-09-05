// /**
//  * AuthContext
//  * -----------
//  * Global authentication state.
//  * Components never call authService directly —
//  * they use this context via useAuth().
//  *
//  * State machine:
//  *   INIT → (restoreSession) → AUTHENTICATED | UNAUTHENTICATED
//  *   UNAUTHENTICATED → (login) → AUTHENTICATED
//  *   AUTHENTICATED   → (logout) → UNAUTHENTICATED
//  */

// import React, {
//   createContext, useContext,
//   useState, useEffect, useCallback,
// } from 'react'
// import { authService } from '../services/authservice'

// const AuthContext = createContext(null)

// export function AuthProvider({ children }) {
//   const [user,    setUser]    = useState(null)
//   const [loading, setLoading] = useState(true)  // true only during initial restore

//   // ── Restore session on app startup ───────────────────────────
//   useEffect(() => {
//     const init = async () => {
//       try {
//         const restoredUser = await authService.restoreSession()
//         setUser(restoredUser)
//       } catch {
//         setUser(null)
//       } finally {
//         setLoading(false)
//       }
//     }
//     init()
//   }, [])

//   // ── Login ─────────────────────────────────────────────────────
//   const login = useCallback(async (username, password) => {
//     try {
//       const loggedInUser = await authService.login({ username, password })
//       setUser(loggedInUser)
//       console.log(loggedInUser);
//       return { success: true }
//     } catch (err) {
//       // err is already a normalised ApiError from authService
//       return {
//         success: false,
//         message: err.message || 'Login failed.',
//         fieldErrors: err.fieldErrors || {},
//       }
//     }
//   }, [])

//   // ── Logout ────────────────────────────────────────────────────
//   const logout = useCallback(async () => {
//     await authService.logout()  // clears tokens internally
//     setUser(null)
//   }, [])

//   // ── Update user in state (e.g. after profile edit) ────────────
//   const updateUser = useCallback((patch) => {
//     setUser(prev => prev ? { ...prev, ...patch } : null)
//   }, [])

//   const value = {
//     user,
//     loading,
//     login,
//     logout,
//     updateUser,
//     isAuthenticated: !!user,
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => {
//   const ctx = useContext(AuthContext)
//   if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
//   return ctx
// }

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react'

import { authService } from '../services/authservice'
import { TokenService } from '../utils/token'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Timer used to automatically logout when JWT expires
  const expirationTimerRef = useRef(null)


  // ─────────────────────────────────────────────
  // Automatic JWT expiration timer
  // ─────────────────────────────────────────────

  const setupExpirationTimer = useCallback((token) => {

    // Clear previous timer
    if (expirationTimerRef.current) {
      clearTimeout(expirationTimerRef.current)
      expirationTimerRef.current = null
    }

    if (!token) {
      return
    }

    const payload = TokenService.decodeToken(token)

    if (!payload?.exp) {
      console.warn("JWT does not contain exp claim")
      return
    }

    const expirationTime = payload.exp * 1000
    const remainingTime = expirationTime - Date.now()

    console.log(
      "Token expires in:",
      Math.round(remainingTime / 1000),
      "seconds"
    )

    // Already expired
    if (remainingTime <= 0) {

      console.log("Token already expired - logging out")

      TokenService.clearSession()
      setUser(null)

      return
    }

    // Schedule logout exactly when JWT expires
    expirationTimerRef.current = setTimeout(() => {

      console.log("JWT expired - automatic logout")

      TokenService.clearSession()
      setUser(null)

    }, remainingTime)

  }, [])


  // ─────────────────────────────────────────────
  // Restore session on application startup
  // ─────────────────────────────────────────────

  useEffect(() => {

    const init = async () => {

      try {

        const restoredUser =
          await authService.restoreSession()

        if (restoredUser) {

          const token = TokenService.getAccessToken()

          setUser(restoredUser)

          setupExpirationTimer(token)

        } else {

          setUser(null)

        }

      } catch (error) {

        console.error(
          "Session restore failed:",
          error
        )

        setUser(null)

      } finally {

        setLoading(false)

      }

    }

    init()

  }, [setupExpirationTimer])


  // ─────────────────────────────────────────────
  // Login
  // ─────────────────────────────────────────────

  const login = useCallback(async (username, password) => {

    try {

      const loggedInUser =
        await authService.login({
          username,
          password
        })

      setUser(loggedInUser)

      const token =
        TokenService.getAccessToken()

      // Start expiration timer
      setupExpirationTimer(token)

      console.log(loggedInUser)

      return {
        success: true
      }

    } catch (err) {

      return {
        success: false,
        message: err.message || 'Login failed.',
        fieldErrors: err.fieldErrors || {},
      }

    }

  }, [setupExpirationTimer])


  // ─────────────────────────────────────────────
  // Logout
  // ─────────────────────────────────────────────

  const logout = useCallback(async () => {

    await authService.logout()

    if (expirationTimerRef.current) {

      clearTimeout(expirationTimerRef.current)

      expirationTimerRef.current = null

    }

    setUser(null)

  }, [])


  // ─────────────────────────────────────────────
  // Cleanup timer
  // ─────────────────────────────────────────────

  useEffect(() => {

    return () => {

      if (expirationTimerRef.current) {

        clearTimeout(expirationTimerRef.current)

      }

    }

  }, [])


  // ─────────────────────────────────────────────
  // Update user
  // ─────────────────────────────────────────────

  const updateUser = useCallback((patch) => {

    setUser(prev =>
      prev
        ? { ...prev, ...patch }
        : null
    )

  }, [])


  // ─────────────────────────────────────────────
  // Context value
  // ─────────────────────────────────────────────

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

  if (!ctx) {
    throw new Error(
      'useAuth must be used inside <AuthProvider>'
    )
  }

  return ctx
}