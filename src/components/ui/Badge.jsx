import React from 'react'

const variants = {
  warning:  'bg-amber-500/15  text-amber-400  border-amber-500/20',
  danger:   'bg-rose-500/15   text-rose-400   border-rose-500/20',
  success:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  info:     'bg-azure-500/15  text-azure-400  border-azure-500/20',
  violet:   'bg-violet-500/15 text-violet-400 border-violet-500/20',
  cyan:     'bg-cyan-500/15   text-cyan-400   border-cyan-500/20',
  neutral:  'dark:bg-slate-700/50 dark:text-slate-300 dark:border-slate-600/30 bg-slate-100 text-slate-600 border-slate-200',
}

export default function Badge({ children, variant = 'neutral', dot = false, className = '' }) {
  return (
    <span className={`
      inline-flex items-center gap-1.5 px-2 py-0.5
      text-[11px] font-semibold tracking-wide rounded-full border
      ${variants[variant] || variants.neutral}
      ${className}
    `}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full bg-current`} />
      )}
      {children}
    </span>
  )
}