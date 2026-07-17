/**
 * useApi
 * ------
 * Generic hook that wraps any service call with loading,
 * error, and data state. Eliminates the need to write
 * try/catch + useState boilerplate in every component.
 *
 * Usage:
 *   const { data, loading, error, execute } =
 *     useApi(dashboardService.getStats)
 *
 *   // Auto-fetch on mount:
 *   const { data, loading } =
 *     useApi(dashboardService.getStats, { immediate: true })
 *
 *   // With params:
 *   const { data, execute } = useApi(deviceService.getAll)
 *   execute({ page: 0, size: 10, search: 'ISRO' })
 */

import { useState, useCallback, useEffect, useRef } from 'react'

export function useApi(serviceMethod, options = {}) {
  const {
    immediate    = false,  // auto-call on mount
    initialData  = null,   // initial value for `data`
    onSuccess,             // callback(data) after success
    onError,               // callback(error) after failure
    params       = [],     // args passed when immediate=true
  } = options

  const [data,    setData]    = useState(initialData)
  const [loading, setLoading] = useState(immediate)
  const [error,   setError]   = useState(null)

  // Ref to prevent state updates on unmounted components
  const mountedRef = useRef(true)
  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)

    try {
      const result = await serviceMethod(...args)
      if (mountedRef.current) {
        setData(result)
        onSuccess?.(result)
      }
      return result
    } catch (err) {
      if (mountedRef.current) {
        setError(err)
        onError?.(err)
      }
      throw err
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }, [serviceMethod])  // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-fetch on mount if requested
  useEffect(() => {
    if (immediate) execute(...params)
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  // Manual reset
  const reset = useCallback(() => {
    setData(initialData)
    setError(null)
    setLoading(false)
  }, [initialData])

  return { data, loading, error, execute, reset }
}