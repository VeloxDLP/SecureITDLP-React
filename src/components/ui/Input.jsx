import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export function Input({
  label,
  error,
  icon,
  type = 'text',
  className = '',
  inputClassName = '',
  ...props
}) {
  const [showPass, setShowPass] = useState(false)
  const isPassword = type === 'password'
  const inputType  = isPassword ? (showPass ? 'text' : 'password') : type

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-[11px] font-semibold tracking-widest uppercase
                          dark:text-slate-400 text-slate-500">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2
                           dark:text-slate-500 text-slate-400 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          type={inputType}
          className={`
            w-full rounded-lg text-sm outline-none transition-all duration-200
            dark:bg-navy-800 dark:border-white/10 dark:text-slate-200
            dark:placeholder-slate-600 dark:focus:border-azure-500
            bg-white border-slate-200 text-slate-800
            placeholder-slate-400 focus:border-azure-500
            border py-2.5
            focus:ring-2 focus:ring-azure-500/20
            ${icon      ? 'pl-9'  : 'pl-3.5'}
            ${isPassword ? 'pr-10' : 'pr-3.5'}
            ${error ? 'border-rose-500 focus:ring-rose-500/20' : ''}
            ${inputClassName}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2
                       dark:text-slate-500 text-slate-400
                       hover:text-azure-500 transition-colors"
          >
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-rose-400">{error}</p>
      )}
    </div>
  )
}

export default Input