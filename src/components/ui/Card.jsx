import React from 'react'

export default function Card({
  children,
  className = '',
  glass = false,
  hover = false,
  padding = true,
}) {
  const base = glass
    ? 'dark:glass-dark glass-light rounded-xl'
    : `dark:bg-navy-800 dark:border-white/[0.07] bg-white border-slate-200
       border rounded-xl dark:shadow-card-dark shadow-card-light`

  return (
    <div className={`
      ${base}
      ${padding ? 'p-4' : ''}
      ${hover ? 'stat-card cursor-pointer dark:hover:border-azure-500/40 hover:border-azure-400/40' : ''}
      ${className}
    `}>
      {children}
    </div>
  )
}