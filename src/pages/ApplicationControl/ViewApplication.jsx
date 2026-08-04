import React, { useState, useRef, useEffect } from 'react'
import {
  Eye, ShieldCheck, RotateCcw, Filter, Search, ChevronDown, X,
  Check, AlertTriangle, Eye as ViewIcon,
} from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */

// Single‑select Dropdown (not used here, but kept for completeness)
function Dropdown({ value, onChange, options, placeholder = 'Select…', disabled = false, searchable = false, error = false }) {
  const { isDark } = useTheme()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef(null)

  const normalised = options.map(o => typeof o === 'string' ? { value: o, label: o } : o)
  const filtered = searchable && query ? normalised.filter(o => o.label.toLowerCase().includes(query.toLowerCase())) : normalised
  const selected = normalised.find(o => o.value === value)

  useEffect(() => {
    const handler = e => { if (containerRef.current && !containerRef.current.contains(e.target)) { setOpen(false); setQuery('') } }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleSelect = val => { onChange(val); setOpen(false); setQuery('') }

  const glassSurface = isDark ? { background: '#2a2a2a', backdropFilter: 'none' } : { background: 'rgba(255,255,255,0.80)', backdropFilter: 'blur(24px)' }
  const triggerBorder = error ? 'border-rose-500/60' : open ? 'border-[#7094ff]/60' : isDark ? 'border-white/[0.10]' : 'border-slate-300/70'

  return (
    <div ref={containerRef} className="relative">
      <button type="button" disabled={disabled} onClick={() => !disabled && setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-[13px] text-left border transition-all duration-200 outline-none disabled:opacity-40 disabled:cursor-not-allowed ${triggerBorder} ${open ? 'ring-2 ring-[#7094ff]/20' : ''} ${isDark ? 'text-slate-200' : 'text-slate-800'}`}
        style={glassSurface}
      >
        <span className={selected ? '' : isDark ? 'text-slate-500' : 'text-slate-400'}>{selected ? selected.label : placeholder}</span>
        <ChevronDown size={14} className={`flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''} ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
      </button>
      {open && (
        <div className={`absolute top-full left-0 right-0 mt-1.5 z-[200] rounded-xl border overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.35)] ${isDark ? 'border-white/[0.10]' : 'border-slate-200/80'}`}
          style={{ background: isDark ? '#2a2a2a' : 'rgba(255,255,255,0.98)', backdropFilter: 'blur(32px) saturate(180%)' }}
        >
          {searchable && (
            <div className={`px-3 py-2 border-b ${isDark ? 'border-white/[0.07]' : 'border-slate-100'}`}>
              <div className="relative flex items-center">
                <Search size={12} className={`absolute left-2.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search…"
                  className={`w-full pl-7 pr-3 py-1.5 text-[12px] rounded-lg outline-none border transition-all duration-150 ${isDark ? 'bg-[#2a2a2a] border-white/[0.08] text-[#d0d0d0] placeholder-[#555]' : 'bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400'}`} />
                {query && <button onClick={() => setQuery('')} className="absolute right-2 text-slate-400 hover:text-slate-200"><X size={11} /></button>}
              </div>
            </div>
          )}
          <div className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 ? <p className={`px-4 py-3 text-[12px] text-center ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>No results</p> : filtered.map(o => {
              const isSelected = o.value === value
              return (
                <button key={o.value} type="button" onClick={() => handleSelect(o.value)}
                  className={`w-full text-left px-4 py-2.5 text-[13px] flex items-center justify-between gap-2 transition-colors duration-100 ${isSelected ? 'text-[#7094ff] bg-[#7094ff]/10' : isDark ? 'text-[#888] hover:bg-white/[0.06] hover:text-[#e0e0e0]' : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'}`}
                >
                  {o.label}
                  {isSelected && <Check size={13} className="text-[#7094ff] flex-shrink-0" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// Multi‑select Dropdown with "Select All" and "None Selected" / "X selected"
function MultiSelectDropdown({
  values = [],
  onChange,
  options = [],
  placeholder = 'Select...',
  disabled = false,
  searchable = false,
  error = false,
}) {
  const { isDark } = useTheme()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef(null)

  const normalized = options.map(o =>
    typeof o === 'string' ? { value: o, label: o } : o
  )

  const filtered = searchable && query
    ? normalized.filter(o =>
        o.label.toLowerCase().includes(query.toLowerCase())
      )
    : normalized

  // Check if all options are selected
  const allSelected = normalized.length > 0 && normalized.every(o => values.includes(o.value))

  useEffect(() => {
    const handler = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
        setQuery('')
      }
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const toggleValue = val => {
    if (values.includes(val)) {
      onChange(values.filter(v => v !== val))
    } else {
      onChange([...values, val])
    }
  }

  const toggleSelectAll = () => {
    if (allSelected) {
      onChange([])
    } else {
      onChange(normalized.map(o => o.value))
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={`
          w-full min-h-[44px]
          px-3 py-2
          rounded-xl border

          flex items-center
          justify-between
          gap-2

          transition-all duration-200

          ${
            error
              ? 'border-rose-500/60'
              : open
                ? 'border-[#7094ff]/60 ring-2 ring-[#7094ff]/20'
                : isDark
                  ? 'border-white/[0.08]'
                  : 'border-slate-200'
          }

          ${
            disabled
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }

          ${
            isDark
              ? `
                bg-[#2a2a2a]
                text-[#d0d0d0]
              `
              : `
                bg-white/80
                text-slate-700



                backdrop-blur-xl
              `
          }
        `}
      >
        {/* ─── Trigger text: "None Selected" or "X selected" ─── */}
        <div className="flex-1 text-left">
          {values.length === 0 ? (
            <span className={isDark ? 'text-[#666]' : 'text-slate-400'}>
              None Selected
            </span>
          ) : (
            <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>
              {values.length} selected
            </span>
          )}
        </div>

        <ChevronDown
          size={14}
          className={`
            flex-shrink-0
            transition-transform duration-200

            ${open ? 'rotate-180' : ''}

            ${
              isDark
                ? 'text-[#666]'
                : 'text-slate-400'
            }
          `}
        />
      </button>

      {/* ─── Dropdown panel ─── */}
      {open && (
        <div
          className={`
            absolute top-full left-0 right-0
            mt-1.5 z-[200]

            rounded-xl overflow-hidden
            border

            shadow-[0_16px_48px_rgba(0,0,0,0.35)]

            ${
              isDark
                ? `
                  bg-[#2a2a2a]
                  border-white/[0.08]
                `
                : `
                  bg-white/95
                  border-slate-200
                  backdrop-blur-2xl
                `
            }
          `}
        >
          {/* ─── Search ─── */}
          {searchable && (
            <div
              className={`
                p-2 border-b

                ${
                  isDark
                    ? 'border-white/[0.06]'
                    : 'border-slate-100'
                }
              `}
            >
              <div className="relative">
                <Search
                  size={12}
                  className={`
                    absolute left-2.5 top-1/2
                    -translate-y-1/2

                    ${
                      isDark
                        ? 'text-[#666]'
                        : 'text-slate-400'
                    }
                  `}
                />
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search..."
                  className={`
                    w-full pl-7 pr-3 py-2
                    rounded-lg outline-none
                    text-[12px] border

                    ${
                      isDark
                        ? `
                          bg-[#242424]
                          border-white/[0.07]
                          text-[#d0d0d0]
                          placeholder-[#555]
                        `
                        : `
                          bg-slate-50
                          border-slate-200
                          text-slate-700
                          placeholder-slate-400
                        `
                    }
                  `}
                />
              </div>
            </div>
          )}

          {/* ─── Select All / Deselect All ─── */}
          <div className={`px-3 py-2 border-b ${isDark ? 'border-white/[0.06]' : 'border-slate-100'}`}>
            <button
              onClick={toggleSelectAll}
              className={`
                w-full text-left text-[12px] flex items-center gap-2
                ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}
                transition-colors duration-150
              `}
            >
              {allSelected ? (
                <>
                  <X size={14} className="text-rose-500" />
                  <span>Deselect all</span>
                </>
              ) : (
                <>
                  <Check size={14} className="text-[#7094ff]" />
                  <span>Select all</span>
                </>
              )}
            </button>
          </div>

          {/* ─── Options list ─── */}
          <div className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p
                className={`
                  px-4 py-3 text-center text-[12px]

                  ${
                    isDark
                      ? 'text-[#666]'
                      : 'text-slate-400'
                  }
                `}
              >
                No results found
              </p>
            ) : (
              filtered.map(o => {
                const selected = values.includes(o.value)
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => toggleValue(o.value)}
                    className={`
                      w-full px-4 py-2.5
                      flex items-center justify-between
                      text-left
                      transition-colors duration-150

                      ${
                        selected
                          ? `
                            bg-[#7094ff]/10
                            text-[#7094ff]
                          `
                          : isDark
                            ? `
                              text-[#c0c0c0]
                              hover:bg-white/[0.04]
                            `
                            : `
                              text-slate-700
                              hover:bg-slate-100/80
                            `
                      }
                    `}
                  >
                    <span className="text-[12px]">
                      {o.label}
                    </span>
                    {selected && (
                      <Check
                        size={13}
                        className="text-[#7094ff]"
                      />
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function GlassButton({ children, onClick, variant = 'default', className = '', disabled = false, type = 'button' }) {
  const { isDark } = useTheme()
  const variants = {
    default: {
      className: isDark ? 'text-slate-300 hover:text-white border-white/[0.10] hover:border-white/[0.20]' : 'text-slate-600 hover:text-slate-900 border-slate-300/70 hover:border-slate-400/60',
      style: { background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', boxShadow: isDark ? 'inset 0 1px 0 rgba(255,255,255,0.06)' : '0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)' }
    },
    primary: {
      className: 'text-white border-[#7094ff]/40 hover:border-[#7094ff]/60',
      style: { background: 'rgba(112, 148, 255, 0.85)', backdropFilter: 'blur(16px)', boxShadow: '0 4px 20px rgba(112,148,255,0.35), inset 0 1px 0 rgba(255,255,255,0.18)' }
    },
    chip_allow: {
      className: isDark ? 'text-emerald-400 border-emerald-500/25' : 'text-emerald-600 border-emerald-300/60',
      style: { background: isDark ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.72)', backdropFilter: 'blur(12px)', boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.06)' }
    },
    chip_prevent: {
      className: isDark ? 'text-rose-400 border-rose-500/25' : 'text-rose-600 border-rose-300/60',
      style: { background: isDark ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.72)', backdropFilter: 'blur(12px)', boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.06)' }
    }
  }
  const v = variants[variant] || variants.default
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      className={`flex items-center gap-2 rounded-xl border text-[13px] font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${v.className} ${className}`}
      style={v.style}
    >
      {children}
    </button>
  )
}

function Badge({ mode }) {
  const base = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border'
  if (mode === 'Allow')
    return <span className={`${base} bg-emerald-500/10 text-emerald-500 border-emerald-500/20`}><Check size={10} /> Allow</span>
  return <span className={`${base} bg-rose-500/10 text-rose-500 border-rose-500/20`}><AlertTriangle size={10} /> Prevent</span>
}

function GlassCard({ children, className = '' }) {
  const { isDark } = useTheme()
  return (
    <div className={`rounded-2xl border ${className}`}
      style={{
        background: isDark ? '#020617' : 'rgba(255,255,255,0.95)',
        backdropFilter: isDark ? 'none' : 'blur(24px)',
        WebkitBackdropFilter: isDark ? 'none' : 'blur(24px)',
        borderColor: isDark ? 'rgba(255,255,255,0.07)' : '#e2e8f0',
        boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.5)' : '0 2px 16px rgba(0,0,0,0.08)',
      }}
    >
      {children}
    </div>
  )
}

/* ───────────────────────── MAIN COMPONENT ───────────────────────── */
export default function ViewApplication() {
  const { isDark } = useTheme()
  const [branches, setBranches] = useState([])
  const [devices, setDevices] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  // Mock data (matches your second image)
  const allRows = [
    { id: 1, branch: 'BEL', ip: '192.168.0.180', pc: 'velox-H410M-H-V2', count: 1731 },
    { id: 2, branch: 'ISRO', ip: '192.168.0.44', pc: 'Swapppyy101', count: 2280 },
    { id: 3, branch: 'ISRO', ip: '192.168.0.22', pc: 'DESKTOP-GGHUO6H', count: 491 },
    { id: 4, branch: 'KHADIGRAM', ip: '192.168.0.67', pc: 'DESKTOP-IGOUAUO', count: 803 },
    { id: 5, branch: 'KHADIGRAM', ip: '192.168.0.67', pc: 'Sanket', count: 2671 },
    { id: 6, branch: 'KHADIGRAM', ip: '192.168.0.150', pc: 'DESKTOP-VM8O1CP', count: 1632 },
    { id: 7, branch: 'KHADIGRAM', ip: '192.168.0.69', pc: 'DESKTOP-GIBIBC4', count: 373 },
    { id: 8, branch: 'NRLDC', ip: '192.168.0.139', pc: 'DESKTOP-P2TR0U9', count: 1418 },
  ]

  // Filtering – only when submitted
  const filteredData = submitted
    ? allRows.filter(row => {
        if (branches.length > 0 && !branches.includes(row.branch)) return false
        if (devices.length > 0 && !devices.includes(row.pc)) return false
        return true
      })
    : []

  // Search filter
  const filteredRows = filteredData.filter(row => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return row.branch.toLowerCase().includes(q) ||
           row.ip.toLowerCase().includes(q) ||
           row.pc.toLowerCase().includes(q) ||
           row.count.toString().includes(q)
  })

  // Pagination
  const totalEntries = filteredRows.length
  const totalPages = Math.ceil(totalEntries / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalEntries)
  const currentRows = filteredRows.slice(startIndex, endIndex)

  useEffect(() => { setCurrentPage(1) }, [searchQuery, branches, devices, submitted])

  const goToPage = (page) => { if (page >= 1 && page <= totalPages) setCurrentPage(page) }

  // Stats (only for displayed data)
  const allowed = filteredData.filter(row => row.count > 1000).length
  const prevented = filteredData.filter(row => row.count <= 1000).length

  const branchOptions = [...new Set(allRows.map(r => r.branch))].map(b => ({ value: b, label: b }))
  const deviceOptions = [...new Set(allRows.map(r => r.pc))].map(d => ({ value: d, label: d }))

  const handleSubmit = () => setSubmitted(true)

  const handleReset = () => {
    setBranches([])
    setDevices([])
    setSearchQuery('')
    setSubmitted(false)
    setCurrentPage(1)
  }

  const handleRefresh = () => {
    setBranches([])
    setDevices([])
    setSearchQuery('')
    setSubmitted(false)
    setCurrentPage(1)
  }

  const thCls = `text-left text-[11px] font-semibold uppercase tracking-wider px-4 py-3 ${isDark ? 'text-slate-500 border-b border-white/[0.06]' : 'text-slate-400 border-b border-slate-100'}`
  const tdCls = `px-4 py-3 text-[12px] ${isDark ? 'text-slate-300' : 'text-slate-700'}`

  return (
    <div className="w-full">
      <br />

      {/* ─── Header ─── */}
      <div className="flex items-start justify-between mb-7">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(112,148,255,0.15)', border: '1px solid rgba(112,148,255,0.25)', backdropFilter: 'blur(12px)' }}>
            <Eye size={18} className="text-[#7094ff]" />
          </div>
          <div>
            <h2 className={`font-display font-bold text-lg leading-tight ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
              View Application
            </h2>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              View application control policies across endpoints
            </p>
          </div>
        </div>

      </div>

      {/* ─── Filter Card ─── (visible only when not submitted) */}
      {!submitted && (
        <GlassCard className="p-6 mb-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div>
              <label className={`block text-[11px] font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                BRANCH NAME *
              </label>
              <MultiSelectDropdown
                values={branches}
                onChange={setBranches}
                options={branchOptions}
                placeholder="Select Branch(es)"
                searchable
              />
            </div>
            <div>
              <label className={`block text-[11px] font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                DEVICE NAME *
              </label>
              <MultiSelectDropdown
                values={devices}
                onChange={setDevices}
                options={deviceOptions}
                placeholder="Select Device(s)"
                searchable
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <GlassButton onClick={handleReset} variant="default" className="px-4 py-2">
              <RotateCcw size={13} /> Reset
            </GlassButton>
            <GlassButton onClick={handleSubmit} variant="primary" className="px-5 py-2 font-semibold">
              <Filter size={13} /> Submit
            </GlassButton>
          </div>
        </GlassCard>
      )}

      {/* ─── Table ─── (visible only after submit) */}
      {submitted && (
        <GlassCard className="overflow-hidden">
          <div className={`flex items-center justify-between gap-3 px-5 py-4 border-b ${isDark ? 'border-white/[0.06]' : 'border-slate-100'}`}>
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-[#7094ff]" />
              <span className={`text-[13px] font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                View Application List
              </span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#7094ff]/15 text-[#7094ff] border border-[#7094ff]/20">
                {totalEntries}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Search input */}
              <div className="relative flex items-center rounded-xl border text-[12px] px-3 py-1.5"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.72)',
                  backdropFilter: 'blur(16px)',
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(203,213,225,0.80)',
                }}
              >
                <Search size={12} className={`mr-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className={`bg-transparent outline-none w-36 ${isDark ? 'text-slate-300 placeholder-slate-600' : 'text-slate-700 placeholder-slate-400'}`}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="ml-1 text-slate-400 hover:text-slate-200">
                    <X size={12} />
                  </button>
                )}
              </div>
              {/* Refresh button */}
              <button
                onClick={handleRefresh}
                className="p-2 rounded-xl border transition hover:bg-[#7094ff]/10"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.72)',
                  backdropFilter: 'blur(16px)',
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(203,213,225,0.80)',
                }}
                title="Refresh & go back to filter selection"
              >
                <RotateCcw size={14} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[400px]">
            <table className="w-full">
              <thead className={`sticky top-0 z-10 ${isDark ? 'bg-[#020617]' : 'bg-white/95'}`}>
                <tr>
                  <th className={thCls}>SR. NO.</th>
                  <th className={thCls}>BRANCH NAME</th>
                  <th className={thCls}>IP ADDRESS</th>
                  <th className={thCls}>PC NAME</th>
                  <th className={thCls}>COUNT</th>
                  <th className={`${thCls} text-center`}>VIEW</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.length === 0 ? (
                  <tr><td colSpan="6" className={`py-10 text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>No records found</td></tr>
                ) : (
                  currentRows.map((row, index) => {
                    const globalIndex = startIndex + index + 1
                    return (
                      <tr key={row.id} className={`border-b last:border-b-0 transition-colors duration-150 ${isDark ? 'border-white/[0.04] hover:bg-[#2e2e2e]' : 'border-slate-50 hover:bg-slate-50/60'}`}>
                        <td className={`${tdCls} text-[11px] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{globalIndex}</td>
                        <td className={tdCls}>{row.branch}</td>
                        <td className={`${tdCls} font-mono text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{row.ip}</td>
                        <td className={tdCls}>{row.pc}</td>
                        <td className={tdCls}>{row.count}</td>
                        <td className={`${tdCls} text-center`}>
                          <button className="p-1 rounded hover:bg-[#7094ff]/10 transition">
                            <ViewIcon size={14} className="text-[#7094ff]" />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {totalEntries > 0 && (
            <div className={`flex items-center justify-between px-5 py-3 border-t ${isDark ? 'border-white/[0.06]' : 'border-slate-100'}`}>
              <span className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                Showing {startIndex + 1} to {endIndex} of {totalEntries} entries
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-lg text-[11px] font-medium border transition ${isDark ? 'border-white/[0.08] text-slate-400 hover:text-white hover:border-white/[0.15] disabled:opacity-40 disabled:hover:border-white/[0.08]' : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 disabled:opacity-40'}`}
                >
                  Previous
                </button>
                <span className={`text-[11px] px-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-lg text-[11px] font-medium border transition ${isDark ? 'border-white/[0.08] text-slate-400 hover:text-white hover:border-white/[0.15] disabled:opacity-40 disabled:hover:border-white/[0.08]' : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 disabled:opacity-40'}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </GlassCard>
      )}
    </div>
  )
}