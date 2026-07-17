import React, { useState, useRef, useEffect } from 'react'
import {
  Usb, Plus, Eye, RotateCcw, Check, AlertTriangle,
  ShieldCheck, Trash2, Search, Filter, ChevronDown, X,
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const BRANCHES = [
  { id: 1, name: 'BEL' },
  { id: 2, name: 'MUHS' },
  { id: 3, name: 'UNMANAGED' },
  { id: 4, name: 'ISRO' }
]

const DEVICES_BY_BRANCH = {
  1: ['DESKTOP-VM8O1CP','localhost.localdomain','velox-ubuntu'],
  2: ['DESKTOP-GIBI8G2'],
  3: ['DESKTOP-GIBI8C4'],
  4: ['DESKTOP-35AFCG4','DESKTOP-UDR7I15','DESKTOP-EKALV7M','DESKTOP-VM8O1CP'],
}

const DUMMY_POLICIES = [
  { id: 1, branch: 'HQ – Mumbai',        device: 'DESKTOP-MUM01', deviceType: 'USB', mode: 'Prevent', addedOn: '2025-05-01' },
  { id: 2, branch: 'Branch – Delhi',     device: 'DESKTOP-DEL01', deviceType: 'USB', mode: 'Allow',   addedOn: '2025-05-03' },
  { id: 3, branch: 'Branch – Bengaluru', device: 'LAPTOP-BLR02',  deviceType: 'USB', mode: 'Prevent', addedOn: '2025-05-07' },
  { id: 4, branch: 'HQ – Mumbai',        device: 'LAPTOP-MUM04',  deviceType: 'USB', mode: 'Allow',   addedOn: '2025-05-10' },
  { id: 5, branch: 'Branch – Chennai',   device: 'DESKTOP-CHN01', deviceType: 'USB', mode: 'Prevent', addedOn: '2025-05-12' },
]

/* ─────────────────────────────────────────────────────────────
   CUSTOM DROPDOWN
   Replaces native <select> — supports glass, rounded corners,
   search filter, and full theme control.
───────────────────────────────────────────────────────────── */
function Dropdown({
  value,
  onChange,
  options,          // [{ value, label }] or ['string']
  placeholder = 'Select…',
  disabled = false,
  searchable = false,
  error = false,
}) {
  const { isDark } = useTheme()
  const [open, setOpen]       = useState(false)
  const [query, setQuery]     = useState('')
  const containerRef          = useRef(null)

  // Normalise options to { value, label }
  const normalised = options.map(o =>
    typeof o === 'string' ? { value: o, label: o } : o
  )

  const filtered = searchable && query
    ? normalised.filter(o => o.label.toLowerCase().includes(query.toLowerCase()))
    : normalised

  const selected = normalised.find(o => o.value === value)

  // Close on outside click
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

  const handleSelect = (val) => {
    onChange(val)
    setOpen(false)
    setQuery('')
  }

  // Shared glass surface styles
  const glassSurface = isDark
    ? { background: 'rgb(36, 36, 36, 1)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }
    : { background: 'rgba(255, 255, 255, 0.80)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }

  const triggerBorder = error
    ? 'border-rose-500/60'
    : open
      ? 'border-[#7094ff]/60'
      : isDark ? 'border-white/[0.10]' : 'border-slate-300/70'

  return (
    <div ref={containerRef} className="relative">

      {/* ── Trigger ── */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={`
          w-full flex items-center justify-between gap-2
          px-3 py-2.5 rounded-xl text-[13px] text-left
          border transition-all duration-200 outline-none
          disabled:opacity-40 disabled:cursor-not-allowed
          ${triggerBorder}
          ${open ? 'ring-2 ring-[#7094ff]/20' : ''}
          ${isDark ? 'text-slate-200' : 'text-slate-800'}
        `}
        style={glassSurface}
      >
        <span className={selected ? '' : isDark ? 'text-slate-500' : 'text-slate-400'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`flex-shrink-0 transition-transform duration-200
                      ${open ? 'rotate-180' : ''}
                      ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
        />
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div
          className={`
            absolute top-full left-0 right-0 mt-1.5 z-[200]
            rounded-xl border overflow-hidden
            shadow-[0_16px_48px_rgba(0,0,0,0.35)]
            animate-slide-up
            ${isDark ? 'border-white/[0.10]' : 'border-slate-200/80'}
          `}
          style={{
            background: isDark
              ? 'rgba(10, 16, 30, 0.88)'
              : 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(32px) saturate(180%)',
            WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          }}
        >
          {/* Search */}
          {searchable && (
            <div className={`px-3 py-2 border-b
                             ${isDark ? 'border-white/[0.07]' : 'border-slate-100'}`}>
              <div className="relative flex items-center">
                <Search size={12} className={`absolute left-2.5
                                              ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search…"
                  className={`w-full pl-7 pr-3 py-1.5 text-[12px] rounded-lg outline-none
                              border transition-all duration-150
                              ${isDark
                                ? 'bg-[#2a2a2a] border-white/[0.08] text-[#d0d0d0] placeholder-[#555]'
                                : 'bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400'}`}
                />
                {query && (
                  <button onClick={() => setQuery('')}
                          className="absolute right-2 text-slate-400 hover:text-slate-200">
                    <X size={11} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options list */}
          <div className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className={`px-4 py-3 text-[12px] text-center
                             ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                No results
              </p>
            ) : (
              filtered.map(o => {
                const isSelected = o.value === value
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => handleSelect(o.value)}
                    className={`
                      w-full text-left px-4 py-2.5 text-[13px]
                      flex items-center justify-between gap-2
                      transition-colors duration-100
                      ${isSelected
                        ? 'text-[#7094ff] bg-[#7094ff]/10'
                        : isDark
                          ? 'text-[#888] hover:bg-white/[0.06] hover:text-[#e0e0e0]'
                          : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'}
                    `}
                  >
                    {o.label}
                    {isSelected && <Check size={13} className="text-[#7094ff] flex-shrink-0" />}
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

/* ─────────────────────────────────────────────────────────────
   GLASS BUTTON — reusable for all buttons on this page
───────────────────────────────────────────────────────────── */
function GlassButton({
  children, onClick, variant = 'default',
  className = '', disabled = false, type = 'button',
}) {
  const { isDark } = useTheme()

  const variants = {
    default: {
      className: isDark
        ? 'text-slate-300 hover:text-white border-white/[0.10] hover:border-white/[0.20]'
        : 'text-slate-600 hover:text-slate-900 border-slate-300/70 hover:border-slate-400/60',
      style: {
        background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.65)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: isDark
          ? 'inset 0 1px 0 rgba(255,255,255,0.06)'
          : '0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
      },
    },
    primary: {
      className: 'text-white border-[#7094ff]/40 hover:border-[#7094ff]/60',
      style: {
        background: 'rgba(112, 148, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 4px 20px rgba(112,148,255,0.35), inset 0 1px 0 rgba(255,255,255,0.18)',
      },
    },
    success: {
      className: 'text-white border-emerald-500/40',
      style: {
        background: 'rgba(16, 185, 129, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 4px 20px rgba(16,185,129,0.30), inset 0 1px 0 rgba(255,255,255,0.18)',
      },
    },
    tab_active: {
      className: 'text-white border-[#7094ff]/40',
      style: {
        background: 'rgba(112, 148, 255, 0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 6px 24px rgba(112,148,255,0.35), inset 0 1px 0 rgba(255,255,255,0.20)',
      },
    },
    tab_inactive: {
      className: isDark
        ? 'text-slate-400 hover:text-slate-100 border-transparent hover:border-white/[0.08]'
        : 'text-slate-500 hover:text-slate-800 border-transparent hover:border-slate-300/50',
      style: {
        background: 'transparent',
        backdropFilter: 'none',
      },
    },
    chip_allow: {
      className: isDark
        ? 'text-emerald-400 border-emerald-500/25'
        : 'text-emerald-600 border-emerald-300/60',
      style: {
        background: isDark ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.06)',
      },
    },
    chip_prevent: {
      className: isDark
        ? 'text-rose-400 border-rose-500/25'
        : 'text-rose-600 border-rose-300/60',
      style: {
        background: isDark ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.06)',
      },
    },
  }

  const v = variants[variant] || variants.default

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        flex items-center gap-2 rounded-xl border
        text-[13px] font-medium
        transition-all duration-200
        disabled:opacity-40 disabled:cursor-not-allowed
        ${v.className} ${className}
      `}
      style={v.style}
    >
      {children}
    </button>
  )
}

/* ─────────────────────────────────────────────────────────────
   BADGE
───────────────────────────────────────────────────────────── */
function Badge({ mode }) {
  const base = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border'
  if (mode === 'Allow')
    return <span className={`${base} bg-emerald-500/10 text-emerald-500 border-emerald-500/20`}>
      <Check size={10} /> Allow
    </span>
  return <span className={`${base} bg-rose-500/10 text-rose-500 border-rose-500/20`}>
    <AlertTriangle size={10} /> Prevent
  </span>
}

/* ─────────────────────────────────────────────────────────────
   GLASS CARD SURFACE
───────────────────────────────────────────────────────────── */
function GlassCard({ children, className = '' }) {
  const { isDark } = useTheme()
  return (
    <div
      className={`rounded-2xl border ${className}`}
      style={{
        background: isDark ? 'rgba(36,36,36,0.55)' : 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.85)',
        boxShadow: isDark
          ? '0 8px 32px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.05)'
          : '0 8px 24px rgba(148,163,184,0.14), inset 0 1px 0 rgba(255,255,255,1)',
      }}
    >
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   ADD FORM
───────────────────────────────────────────────────────────── */
function AddForm({ onAdd }) {
  const { isDark } = useTheme()
  const [form, setForm] = useState({ branch: '', device: '', deviceType: 'USB', mode: '' })
  const [submitted, setSubmitted] = useState(false)
  const [success, setSuccess]     = useState(false)

  const set = k => v => setForm(f => ({ ...f, [k]: v, ...(k === 'branch' ? { device: '' } : {}) }))

  const branchOptions = BRANCHES.map(b => ({ value: String(b.id), label: b.name }))
  const deviceOptions = form.branch ? (DEVICES_BY_BRANCH[Number(form.branch)] || []) : []
  const modeOptions   = [{ value: 'Allow', label: 'Allow' }, { value: 'Prevent', label: 'Prevent' }]
  const isValid       = form.branch && form.device && form.mode

  const handleSubmit = () => {
    setSubmitted(true)
    if (!isValid) return
    onAdd({ ...form, branchName: BRANCHES.find(b => String(b.id) === form.branch)?.name })
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false); setSubmitted(false)
      setForm({ branch: '', device: '', deviceType: 'USB', mode: '' })
    }, 1800)
  }

  const labelCls = `block text-[11px] font-semibold uppercase tracking-wider mb-1.5
                    ${isDark ? 'text-slate-500' : 'text-slate-400'}`

  return (
    <GlassCard className="p-6 mb-5">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">

        {/* Branch */}
        <div>
          <label className={labelCls}>Branch Name <span className="text-rose-500 normal-case tracking-normal">*</span></label>
          <Dropdown
            value={form.branch}
            onChange={set('branch')}
            options={branchOptions}
            placeholder="Select Branch"
            searchable
            error={submitted && !form.branch}
          />
          {submitted && !form.branch && <p className="text-[10px] text-rose-500 mt-1">Required</p>}
        </div>

        {/* Device */}
        <div>
          <label className={labelCls}>Device Name <span className="text-rose-500 normal-case tracking-normal">*</span></label>
          <Dropdown
            value={form.device}
            onChange={set('device')}
            options={deviceOptions}
            placeholder={form.branch ? 'Select Device' : 'Select branch first'}
            disabled={!form.branch}
            error={submitted && !form.device}
          />
          {submitted && !form.device && <p className="text-[10px] text-rose-500 mt-1">Required</p>}
        </div>

        {/* Device Type — static display */}
        <div>
          <label className={labelCls}>Device Type</label>
          <div
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-[13px]
                        ${isDark
                          ? 'border-white/[0.08] text-slate-400'
                          : 'border-slate-200/70 text-slate-500'}`}
            style={{
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.60)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            <Usb size={14} className="text-[#7094ff]" />
            <span>USB</span>
          </div>
        </div>

        {/* Mode */}
        <div>
          <label className={labelCls}>Mode of Access <span className="text-rose-500 normal-case tracking-normal">*</span></label>
          <Dropdown
            value={form.mode}
            onChange={set('mode')}
            options={modeOptions}
            placeholder="Select Mode"
            error={submitted && !form.mode}
          />
          {submitted && !form.mode && <p className="text-[10px] text-rose-500 mt-1">Required</p>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <GlassButton onClick={() => { setForm({ branch:'', device:'', deviceType:'USB', mode:'' }); setSubmitted(false) }}
                     variant="default" className="px-4 py-2">
          <RotateCcw size={13} /> Reset
        </GlassButton>

        <GlassButton onClick={handleSubmit}
                     variant={success ? 'success' : 'primary'}
                     className="px-5 py-2 font-semibold">
          {success ? <><Check size={13} /> Saved!</> : <><Plus size={13} /> Submit</>}
        </GlassButton>
      </div>
    </GlassCard>
  )
}

/* ─────────────────────────────────────────────────────────────
   POLICY TABLE
───────────────────────────────────────────────────────────── */
function PolicyTable({ policies, onDelete }) {
  const { isDark } = useTheme()
  const [search, setSearch]       = useState('')
  const [filterMode, setFilterMode] = useState('')

  const filtered = policies.filter(p => {
    const q = search.toLowerCase()
    return (!q || p.branch.toLowerCase().includes(q) || p.device.toLowerCase().includes(q))
        && (!filterMode || p.mode === filterMode)
  })

  const thCls = `text-left text-[11px] font-semibold uppercase tracking-wider px-4 py-3
                 ${isDark ? 'text-slate-500 border-b border-white/[0.06]' : 'text-slate-400 border-b border-slate-100'}`
  const tdCls = `px-4 py-3 text-[12px] ${isDark ? 'text-slate-300' : 'text-slate-700'}`

  const filterOptions = [
    { value: '',        label: 'All Modes' },
    { value: 'Allow',   label: 'Allow'     },
    { value: 'Prevent', label: 'Prevent'   },
  ]

  return (
    <GlassCard className="overflow-hidden">

      {/* Toolbar */}
      <div className={`flex items-center justify-between gap-3 px-5 py-4 border-b
                       ${isDark ? 'border-white/[0.06]' : 'border-slate-100'}`}>
        <div className="flex items-center gap-2">
          <ShieldCheck size={15} className="text-[#7094ff]" />
          <span className={`text-[13px] font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            USB Policies
          </span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold
                           bg-[#7094ff]/15 text-[#7094ff] border border-[#7094ff]/20">
            {filtered.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Search input */}
          <div
            className={`relative flex items-center rounded-xl border text-[12px]
                        ${isDark ? 'border-white/[0.08]' : 'border-slate-200/80'}`}
            style={{
              background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.72)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            <Search size={12} className={`absolute left-2.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className={`bg-transparent pl-7 pr-3 py-1.5 outline-none w-36
                          ${isDark ? 'text-slate-300 placeholder-slate-600' : 'text-slate-700 placeholder-slate-400'}`}
            />
          </div>

          {/* Filter dropdown — custom */}
          <div className="w-36">
            <Dropdown
              value={filterMode}
              onChange={setFilterMode}
              options={filterOptions}
              placeholder="All Modes"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className={`py-16 text-center text-[13px] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
          No USB policies found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className={thCls}>#</th>
                <th className={thCls}>Branch</th>
                <th className={thCls}>Device</th>
                <th className={thCls}>Type</th>
                <th className={thCls}>Mode</th>
                <th className={thCls}>Added On</th>
                <th className={`${thCls} text-right`}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id}
                    className={`border-b last:border-b-0 transition-colors duration-150
                                ${isDark ? 'border-white/[0.04] hover:bg-[#2e2e2e]'
                                         : 'border-slate-50 hover:bg-slate-50/60'}`}>
                  <td className={`${tdCls} text-[11px] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{i + 1}</td>
                  <td className={tdCls}>{p.branch}</td>
                  <td className={`${tdCls} font-mono text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{p.device}</td>
                  <td className={tdCls}>
                    <span className="inline-flex items-center gap-1.5">
                      <Usb size={12} className="text-[#7094ff]" /> USB
                    </span>
                  </td>
                  <td className={tdCls}><Badge mode={p.mode} /></td>
                  <td className={`${tdCls} ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{p.addedOn}</td>
                  <td className={`${tdCls} text-right`}>
                    <button
                      onClick={() => onDelete(p.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center ml-auto
                                 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10
                                 transition-all duration-150"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </GlassCard>
  )
}

/* ─────────────────────────────────────────────────────────────
   TAB BAR
───────────────────────────────────────────────────────────── */
function TabBar({ active, onChange }) {
  const { isDark } = useTheme()
  const tabs = [
    { id: 'add',  label: 'Add Policy',    icon: Plus },
    { id: 'view', label: 'View Policies', icon: Eye  },
  ]

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-2xl p-1.5 mb-6 border`}
      style={{
        background: isDark ? 'rgba(36,36,36,0.50)' : 'rgba(255,255,255,0.60)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(203,213,225,0.70)',
        boxShadow: isDark
          ? '0 8px 32px rgba(0,0,0,0.55)'
          : '0 4px 16px rgba(148,163,184,0.15)',
      }}
    >
      {tabs.map(t => {
        const Icon = t.icon
        const isActive = active === t.id
        return (
          <GlassButton
            key={t.id}
            onClick={() => onChange(t.id)}
            variant={isActive ? 'tab_active' : 'tab_inactive'}
            className="px-5 py-2.5 font-semibold"
          >
            <Icon size={14} />
            {t.label}
          </GlassButton>
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */
export default function UsbProtection() {
  const { isDark } = useTheme()
  const [tab, setTab]           = useState('add')
  const [policies, setPolicies] = useState(DUMMY_POLICIES)

  const handleAdd = ({ branchName, device, mode }) => {
    setPolicies(prev => [...prev, {
      id: Date.now(), branch: branchName, device,
      deviceType: 'USB', mode,
      addedOn: new Date().toISOString().slice(0, 10),
    }])
  }

  const handleDelete = id => setPolicies(prev => prev.filter(p => p.id !== id))

  return (
    <div className="w-full">

      {/* Page header */}
      <div className="flex items-start justify-between mb-7">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{
              background: 'rgba(112,148,255,0.15)',
              border: '1px solid rgba(112,148,255,0.25)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            <Usb size={18} className="text-[#7094ff]" />
          </div>
          <div>
            <h2 className={`font-display font-bold text-lg leading-tight
                            ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
              USB Protection
            </h2>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Manage USB device access policies across endpoints
            </p>
          </div>
        </div>

        {/* Stats chips */}
        <div className="hidden sm:flex items-center gap-2">
          <GlassButton variant="chip_allow" className="px-3 py-1.5 text-[11px] font-semibold cursor-default">
            {policies.filter(p => p.mode === 'Allow').length} Allowed
          </GlassButton>
          <GlassButton variant="chip_prevent" className="px-3 py-1.5 text-[11px] font-semibold cursor-default">
            {policies.filter(p => p.mode === 'Prevent').length} Prevented
          </GlassButton>
        </div>
      </div>

      <TabBar active={tab} onChange={setTab} />

      {tab === 'add'  && <AddForm onAdd={p => { handleAdd(p); setTab('view') }} />}
      {tab === 'view' && <PolicyTable policies={policies} onDelete={handleDelete} />}
    </div>
  )
}