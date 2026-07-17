/**
 * useSessionTimer
 * ---------------
 * Watches the JWT expiry and:
 *   1. Shows a warning dialog 2 minutes before expiry
 *   2. Automatically logs out when the token expires
 *
 * Usage (place in Layout.jsx so it runs while authenticated):
 *   useSessionTimer({ onExpiry: logout, onWarning: showDialog })
 */

import { useEffect, useRef } from 'react'
import { TokenService } from '../utils/token'

const WARNING_BEFORE_MS = 2 * 60 * 1000  // warn 2 minutes before expiry

export function useSessionTimer({ onExpiry, onWarning } = {}) {
  const warningTimerRef = useRef(null)
  const expiryTimerRef  = useRef(null)

  const clearTimers = () => {
    clearTimeout(warningTimerRef.current)
    clearTimeout(expiryTimerRef.current)
  }

  const scheduleTimers = () => {
    clearTimers()

    const msLeft = TokenService.expiresIn()
    if (msLeft <= 0) {
      onExpiry?.()
      return
    }

    // Warning timer
    const warningIn = msLeft - WARNING_BEFORE_MS
    if (warningIn > 0) {
      warningTimerRef.current = setTimeout(() => {
        onWarning?.()
      }, warningIn)
    } else {
      // Less than 2 mins left on mount — warn immediately
      onWarning?.()
    }

    // Expiry timer
    expiryTimerRef.current = setTimeout(() => {
      onExpiry?.()
    }, msLeft)
  }

  useEffect(() => {
    scheduleTimers()

    // Re-schedule whenever the tab becomes active again
    // (the user may have left and come back with an expired token)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        scheduleTimers()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearTimers()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps
}