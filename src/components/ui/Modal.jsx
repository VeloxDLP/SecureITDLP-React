import React, { useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const { isDark } = useTheme()

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className={`
        relative w-full ${sizes[size] || sizes.md}
        ${isDark ? 'glass-modal' : 'glass-modal-light'} 
        rounded-2xl shadow-glass
        animate-slide-up
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/8">
          <h3 className="font-display text-base font-semibold text-slate-100 tracking-wide">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center
                       text-slate-500 hover:text-slate-200 hover:bg-white/8
                       transition-all duration-150"
          >
            <X size={15} />
          </button>
        </div>
        {/* Body */}
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  )
}