import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconColor  = 'text-azure-400',
  iconBg     = 'bg-azure-500/10',
  trend,
  trendUp    = false,
  animClass  = 'animate-fade-in',
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`
        stat-card dark:bg-navy-800 dark:border-white/[0.07] bg-white border-slate-200
        border rounded-xl p-4 flex flex-col gap-3
        dark:hover:border-azure-500/30 hover:border-azure-400/30
        dark:shadow-card-dark shadow-card-light
        ${onClick ? 'cursor-pointer' : ''}
        ${animClass}
      `}
    >
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
          {Icon && <Icon size={18} className={iconColor} />}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded-full
            ${trendUp
              ? 'text-rose-400 bg-rose-500/10'
              : 'text-emerald-400 bg-emerald-500/10'
            }`}>
            {trendUp
              ? <TrendingUp  size={11} />
              : <TrendingDown size={11} />
            }
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-[11px] font-semibold tracking-widest uppercase
                      dark:text-slate-500 text-slate-400 mb-1">
          {label}
        </p>
        <p className="font-display text-2xl font-bold dark:text-slate-100 text-slate-800 leading-none">
          {value}
        </p>
        {sub && (
          <p className="text-[11px] dark:text-slate-500 text-slate-400 mt-1.5">
            {sub}
          </p>
        )}
      </div>
    </div>
  )
}