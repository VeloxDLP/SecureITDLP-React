import React from 'react'

const variants = {
  primary: `bg-azure-600 hover:bg-azure-500 text-white shadow-glow-sm 
             border border-azure-500/30 hover:shadow-glow-blue`,
  secondary: `dark:bg-navy-700 dark:hover:bg-navy-600 dark:border-white/10 dark:text-slate-300
               bg-white hover:bg-slate-50 border-slate-200 text-slate-700`,
  ghost:   `hover:bg-white/5 dark:text-slate-400 dark:hover:text-slate-200 
             text-slate-500 hover:text-slate-700 border border-transparent`,
  danger:  `bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30`,
  success: `bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30`,
}

const sizes = {
  xs: 'px-2.5 py-1 text-xs gap-1',
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-sm gap-2',
}

export default function Button({
  children,
  variant = 'primary',
  size    = 'md',
  icon,
  iconRight,
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-body font-medium
        rounded-lg border transition-all duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
      {iconRight && !loading && (
        <span className="flex-shrink-0">{iconRight}</span>
      )}
    </button>
  )
}