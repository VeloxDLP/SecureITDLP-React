/**
 * useAuth
 * -------
 * Re-exported convenience hook.
 * Import from here instead of directly from AuthContext
 * so the import path is consistent across the app.
 *
 * Usage:
 *   import { useAuth } from '../hooks/useAuth'
 *   const { user, login, logout, isAuthenticated } = useAuth()
 */

export { useAuth } from '../context/AuthContext'