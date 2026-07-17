/**
 * AlertModal.jsx
 * --------------
 * Drop-in SweetAlert2 replacement using React + Tailwind.
 * No external dependencies.
 *
 * Usage (imperative — works like Swal.fire):
 *   import { alert } from '../components/ui/AlertModal'
 *   await alert({ icon: 'success', title: 'Done', text: 'Saved!' })
 *
 * Usage (component — place once in Layout or App):
 *   import AlertModal from '../components/ui/AlertModal'
 *   <AlertModal />
 */

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

/* ── Event bus ────────────────────────────────────────────────── */
let _resolve = null
const listeners = new Set()

function dispatch(config) {
  return new Promise((res) => {
    _resolve = res
    listeners.forEach(cb => cb(config))
  })
}

/** Imperative API — use anywhere, no hooks needed */
export const alert = (config) => dispatch({ ...config })

/* ── Icon map ─────────────────────────────────────────────────── */
const ICONS = {
  success: { component: CheckCircle,    color: '#10b981', bg: 'bg-emerald-500/12' },
  error:   { component: XCircle,        color: '#ef4444', bg: 'bg-rose-500/12'    },
  warning: { component: AlertTriangle,  color: '#f59e0b', bg: 'bg-amber-500/12'   },
  info:    { component: Info,           color: '#7094ff', bg: 'bg-[#7094ff]/12'   },
}

/* ── Modal component ──────────────────────────────────────────── */
export default function AlertModal() {
  const [config, setConfig]   = useState(null)
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(100)
  const timerRef   = useRef(null)
  const animRef    = useRef(null)
  const startRef   = useRef(null)

  // Subscribe to dispatch calls
  useEffect(() => {
    const handler = (cfg) => {
      setConfig(cfg)
      setVisible(true)
      setProgress(100)
    }
    listeners.add(handler)
    return () => listeners.delete(handler)
  }, [])

  // Auto-dismiss timer with progress bar
  useEffect(() => {
    if (!visible || !config?.timer) return

    const duration = config.timer
    startRef.current = Date.now()

    const tick = () => {
      const elapsed = Date.now() - startRef.current
      const pct = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(pct)
      if (pct > 0) {
        animRef.current = requestAnimationFrame(tick)
      } else {
        handleClose()
      }
    }
    animRef.current = requestAnimationFrame(tick)

    timerRef.current = setTimeout(handleClose, duration)

    return () => {
      clearTimeout(timerRef.current)
      cancelAnimationFrame(animRef.current)
    }
  }, [visible, config])

  const handleClose = (confirmed = false) => {
    setVisible(false)
    setTimeout(() => {
      setConfig(null)
      if (_resolve) { _resolve(confirmed); _resolve = null }
    }, 200)
  }

  if (!config) return null

  const iconMeta = ICONS[config.icon] || ICONS.info
  const IconComp = iconMeta.component
  const isDark   = config.dark !== false &&
    document.documentElement.classList.contains('dark')

  const bg     = isDark ? '#242424' : '#ffffff'
  const text   = isDark ? '#e0e0e0' : '#1e293b'
  const subText= isDark ? '#888'    : '#64748b'
  const border = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4
                  transition-all duration-200
                  ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={() => config.allowOutsideClick !== false && handleClose()}
    >
      <div
        className={`relative w-full max-w-sm rounded-2xl shadow-2xl border
                    transition-all duration-200
                    ${visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
        style={{ background: bg, borderColor: border }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => handleClose()}
          className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center
                     transition-colors duration-150"
          style={{ color: subText }}
          onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <X size={14} />
        </button>

        {/* Content */}
        <div className="px-6 pt-8 pb-6 flex flex-col items-center text-center">

          {/* Icon */}
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${iconMeta.bg}`}>
            <IconComp size={28} style={{ color: iconMeta.color }} />
          </div>

          {/* Title */}
          {config.title && (
            <h3 className="font-display font-bold text-[16px] mb-1.5" style={{ color: text }}>
              {config.title}
            </h3>
          )}

          {/* Text */}
          {config.text && (
            <p className="text-[13px] leading-relaxed" style={{ color: subText }}>
              {config.text}
            </p>
          )}
        </div>

        {/* Actions */}
        {config.showConfirmButton !== false && (
          <div className={`px-6 pb-5 flex gap-2 justify-center border-t pt-4`}
               style={{ borderColor: border }}>

            {config.showCancelButton && (
              <button
                onClick={() => handleClose(false)}
                className="flex-1 px-4 py-2 rounded-xl text-[13px] font-medium
                           border transition-all duration-150"
                style={{
                  color: subText,
                  borderColor: border,
                  background: 'transparent',
                }}
                onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {config.cancelButtonText || 'Cancel'}
              </button>
            )}

            <button
              onClick={() => handleClose(true)}
              className="flex-1 px-4 py-2 rounded-xl text-[13px] font-semibold
                         text-white transition-all duration-150 shadow-lg"
              style={{
                background: '#7094ff',
                boxShadow: '0 4px 16px rgba(112,148,255,0.35)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#5d84ff'}
              onMouseLeave={e => e.currentTarget.style.background = '#7094ff'}
            >
              {config.confirmButtonText || 'OK'}
            </button>
          </div>
        )}

        {/* Timer progress bar */}
        {config.timer && config.timerProgressBar !== false && (
          <div className="h-1 rounded-b-2xl overflow-hidden" style={{ background: isDark ? '#2a2a2a' : '#f1f5f9' }}>
            <div
              className="h-full rounded-b-2xl transition-none"
              style={{ width: `${progress}%`, background: iconMeta.color }}
            />
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}