import React, { useState, useEffect } from 'react'
import {
  Usb, Plus, Eye, RotateCcw, Check, AlertTriangle,
  ShieldCheck, Trash2, Search, ChevronDown, X,
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import usbApi from '../api/usbApi'
import { alert as showAlert } from '../components/ui/AlertModal'
import { dashboardService } from '../services/dashboardService'

/* ─────────────────────────────────────────────────────────────
   DATA (Fallback)
───────────────────────────────────────────────────────────── */
const BRANCHES = [
  { id: 1, name: 'BEL' },
  { id: 2, name: 'MUHS' },
  { id: 3, name: 'UNMANAGED' },
  { id: 4, name: 'ISRO' }
]



/* ─────────────────────────────────────────────────────────────
   DROPDOWN COMPONENT
───────────────────────────────────────────────────────────── */
function Dropdown({
  value,
  onChange,
  options,
  placeholder = 'Select…',
  disabled = false,
  searchable = false,
  error = false,
}) {
  const { isDark } = useTheme()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = React.useRef(null)

  const normalised = options.map(o =>
    typeof o === 'string' ? { value: o, label: o } : o
  )

  const filtered = searchable && query
    ? normalised.filter(o => o.label.toLowerCase().includes(query.toLowerCase()))
    : normalised

  const selected = normalised.find(o => o.value === value)

  React.useEffect(() => {
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

  const glassSurface = isDark
    ? { background: '#1e1e2e', backdropFilter: 'none', WebkitBackdropFilter: 'none' }
    : { background: 'rgba(255, 255, 255, 0.80)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }

  const triggerBorder = error
    ? 'border-rose-500/60'
    : open
      ? 'border-[#7094ff]/60'
      : isDark ? 'border-white/[0.10]' : 'border-slate-300/70'

  return (
    <div ref={containerRef} className="relative">
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
              ? '#1e1e2e'
              : 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(32px) saturate(180%)',
            WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          }}
        >
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
                                ? 'bg-[#1e1e2e] border-white/[0.08] text-[#d0d0d0] placeholder-[#555]'
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
   GLASS BUTTON
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
        background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.65)',
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
  if (mode === 'Allow' || mode === 'allow')
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
        background: isDark ? '#1a1a2e' : 'rgba(255,255,255,0.95)',
        backdropFilter: isDark ? 'none' : 'blur(24px)',
        WebkitBackdropFilter: isDark ? 'none' : 'blur(24px)',
        borderColor: isDark ? 'rgba(255,255,255,0.07)' : '#e2e8f0',
        boxShadow: isDark
          ? '0 4px 24px rgba(0,0,0,0.5)'
          : '0 2px 16px rgba(0,0,0,0.08)',
      }}
    >
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   STYLED MODE DROPDOWN WITH COLORS
───────────────────────────────────────────────────────────── */
function StyledModeDropdown({ value, onChange, error, submitted }) {
  const { isDark } = useTheme()
  const [open, setOpen] = useState(false)
  const containerRef = React.useRef(null)
  
  const options = [
    { 
      value: 'Allow', 
      label: 'Allow',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: 'rgba(16, 185, 129, 0.3)'
    },
    { 
      value: 'Prevent', 
      label: 'Prevent',
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      borderColor: 'rgba(239, 68, 68, 0.3)'
    }
  ]
  
  const selected = options.find(o => o.value === value)
  
  React.useEffect(() => {
    const handler = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`
          w-full flex items-center justify-between gap-2
          px-3 py-2.5 rounded-xl border text-[13px] text-left
          transition-all duration-200 outline-none
          ${error && submitted && !value ? 'border-rose-500/60 ring-2 ring-rose-500/20' : ''}
          ${open ? 'ring-2 ring-[#7094ff]/20 border-[#7094ff]/60' : ''}
          ${isDark ? 'border-white/[0.08] text-slate-200' : 'border-slate-200/70 text-slate-800'}
        `}
        style={{
          background: selected 
            ? selected.bgColor 
            : isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.60)',
          borderColor: selected 
            ? selected.borderColor 
            : undefined
        }}
      >
        <span className="flex items-center gap-2">
          {selected && (
            <span 
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: selected.color }}
            />
          )}
          <span style={{ color: selected?.color || (isDark ? '#888' : '#94a3b8') }}>
            {selected ? selected.label : 'Select Mode'}
          </span>
        </span>
        <ChevronDown
          size={14}
          className={`flex-shrink-0 transition-transform duration-200
                      ${open ? 'rotate-180' : ''}
                      ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
        />
      </button>
      
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
              ? '#1e1e2e'
              : 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(32px) saturate(180%)',
            WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          }}
        >
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className={`
                w-full text-left px-4 py-2.5 text-[13px]
                flex items-center gap-3 transition-colors duration-150
                ${value === opt.value 
                  ? 'bg-[#7094ff]/10 text-[#7094ff]' 
                  : isDark 
                    ? 'hover:bg-white/[0.06] text-slate-300' 
                    : 'hover:bg-slate-100/80 text-slate-700'
                }
              `}
              style={{
                background: value === opt.value ? opt.bgColor : 'transparent'
              }}
            >
              <span 
                className="w-3 h-3 rounded-full flex-shrink-0 border-2"
                style={{ 
                  background: opt.color,
                  borderColor: opt.color
                }}
              />
              <span className="flex-1">{opt.label}</span>
              {value === opt.value && (
                <Check size={14} className="text-[#7094ff] flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   ADD FORM - WITH BRANCH DEVICE MAPPING
───────────────────────────────────────────────────────────── */
function AddForm({ onAdd, branchOptions: externalBranchOptions, branches = [], policies = [] }) {
  const { isDark } = useTheme()
  const [form, setForm] = useState({ branch: '', device: '', deviceType: 'USB', mode: '' })
  const [submitted, setSubmitted] = useState(false)
  const [success, setSuccess] = useState(false)
  const [availableDevices, setAvailableDevices] = useState([])

  const set = k => v => setForm(f => ({ ...f, [k]: v, ...(k === 'branch' ? { device: '' } : {}) }))

  const branchOptions = externalBranchOptions || BRANCHES.map(b => ({ value: String(b.id), label: b.name }))

  // 🔥 GET DEVICES FOR SELECTED BRANCH FROM MAPPING
  React.useEffect(() => {
    if (!form.branch) {
      setAvailableDevices([])
      return
    }

    try {
      console.log("🔍 Selected branch:", form.branch)
      
      // Get devices from the branch-device mapping
      let devices = []
      
      // Check if branch exists in mapping (case-insensitive)
      const branchKey = Object.keys(BRANCH_DEVICE_MAP).find(
        key => key.toLowerCase() === form.branch.toLowerCase()
      )
      
      if (branchKey) {
        devices = BRANCH_DEVICE_MAP[branchKey] || []
        console.log("✅ Devices from mapping for", form.branch, ":", devices)
      } else {
        // If branch not found in mapping, try to get from policies
        console.log("⚠️ Branch not found in mapping, checking policies...")
        const devicesFromPolicies = policies
          .filter(policy => {
            const policyBranch = policy.branchName || policy.branch || ''
            return policyBranch.toLowerCase() === form.branch.toLowerCase()
          })
          .map(policy => policy.deviceName || policy.device || '')
          .filter(Boolean)
        
        devices = [...new Set(devicesFromPolicies)]
        console.log("✅ Devices from policies:", devices)
        
        // If still no devices, use static fallback
        if (devices.length === 0) {
          const branchId = BRANCHES.find(b => b.name.toLowerCase() === form.branch.toLowerCase())?.id
          devices = branchId ? DEVICES_BY_BRANCH[branchId] || [] : []
          console.log("📦 Using static devices:", devices)
        }
      }
      
      setAvailableDevices(devices)
      
    } catch (error) {
      console.error("❌ Error getting devices:", error)
      setAvailableDevices([])
    }
  }, [form.branch, policies])

  const deviceOptions = availableDevices.length > 0 ? availableDevices : []

  const isValid = form.branch && form.device && form.mode

  const handleSubmit = async () => {
    setSubmitted(true)
    if (!isValid) return

    setSuccess(false)

    try {
      await usbApi.post('/api/usb', {
        client: 'NA',
        deviceType: 'usb',
        modeOfAccess: form.mode.toLowerCase(),
        writeModeDeny: '',
        executeModeDeny: '',
        targets: [
          {
            hostName: form.device,
            branch: form.branch,
            ipAddress: '192.168.0.44',
          }
        ]
      })

      onAdd({ branchName: form.branch, device: form.device, mode: form.mode })

      await showAlert({
        icon: 'success',
        title: 'Policy Saved',
        text: `USB policy for ${form.device} has been added successfully.`,
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
      })

      setSubmitted(false)
      setForm({ branch: '', device: '', deviceType: 'USB', mode: '' })

    } catch (err) {
      const message = err?.response?.data?.message
        || err?.message
        || 'Something went wrong. Please try again.'

      showAlert({
        icon: 'error',
        title: 'Submission Failed',
        text: message,
        confirmButtonText: 'Retry',
      })
    }
  }

  const labelCls = `block text-[11px] font-semibold uppercase tracking-wider mb-1.5
                    ${isDark ? 'text-slate-400' : 'text-slate-500'}`

  return (
    <div
      className={`rounded-2xl border p-6 mb-5`}
      style={{
        background: isDark 
          ? '#1a1a2e'
          : 'rgba(255,255,255,0.95)',
        borderColor: isDark ? 'rgba(255,255,255,0.07)' : '#e2e8f0',
        boxShadow: isDark
          ? '0 8px 32px rgba(0,0,0,0.4)'
          : '0 8px 32px rgba(0,0,0,0.08)',
      }}
    >
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

        {/* Device - Shows only devices for selected branch */}
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
          {form.branch && availableDevices.length === 0 && (
            <p className="text-[10px] text-slate-400 mt-1">No devices found for this branch</p>
          )}
          {form.branch && availableDevices.length > 0 && (
            <p className="text-[10px] text-emerald-400 mt-1">✓ {availableDevices.length} device(s) available</p>
          )}
        </div>

        {/* Device Type */}
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
          <StyledModeDropdown
            value={form.mode}
            onChange={set('mode')}
            error={submitted && !form.mode}
            submitted={submitted}
          />
          {submitted && !form.mode && <p className="text-[10px] text-rose-500 mt-1">Required</p>}
        </div>
      </div>

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
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   POLICY TABLE
───────────────────────────────────────────────────────────── */
function PolicyTable({ policies, onDelete, isLoading }) {
  const { isDark } = useTheme()
  const [search, setSearch] = useState('')
  const [filterMode, setFilterMode] = useState('')

  const filtered = policies.filter(p => {
    const q = search.toLowerCase()
    const branch = p.branchName || ''
    const device = p.deviceName || ''
    const mode = p.modeAccess || ''
    
    return (!q || branch.toLowerCase().includes(q) || device.toLowerCase().includes(q))
        && (!filterMode || mode.toLowerCase() === filterMode.toLowerCase())
  })

  const thCls = `text-left text-[11px] font-semibold uppercase tracking-wider px-4 py-3
                 ${isDark ? 'text-slate-400 border-b border-white/[0.06]' : 'text-slate-500 border-b border-slate-100'}`
  const tdCls = `px-4 py-3 text-[12px] ${isDark ? 'text-slate-300' : 'text-slate-700'}`

  const filterOptions = [
    { value: '', label: 'All Modes' },
    { value: 'Allow', label: 'Allow' },
    { value: 'Prevent', label: 'Prevent' },
  ]

  const formatDate = (ctime) => {
    if (!ctime) return 'N/A'
    try {
      const d = new Date(ctime)
      return d.toISOString().slice(0, 10)
    } catch {
      return 'N/A'
    }
  }

  return (
    <GlassCard className="overflow-hidden">
      <div className={`flex items-center justify-between gap-3 px-5 py-4 border-b
                       ${isDark ? 'border-white/[0.06]' : 'border-slate-100'}`}>
        <div className="flex items-center gap-2">
          <ShieldCheck size={15} className="text-[#7094ff]" />
          <span className={`text-[13px] font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            USB Policies
          </span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold
                           bg-[#7094ff]/15 text-[#7094ff] border border-[#7094ff]/20">
            {isLoading ? '...' : filtered.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
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
                          ${isDark ? 'text-slate-300 placeholder-slate-500' : 'text-slate-700 placeholder-slate-400'}`}
            />
          </div>

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

      {isLoading ? (
        <div className={`py-16 text-center text-[13px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          <div className="animate-spin inline-block w-6 h-6 border-2 border-[#7094ff] border-t-transparent rounded-full"></div>
          <p className="mt-2">Loading policies...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className={`py-16 text-center text-[13px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
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
                <th className={thCls}>IP Address</th>
                <th className={thCls}>Type</th>
                <th className={thCls}>Mode</th>
                <th className={thCls}>Added On</th>
                <th className={`${thCls} text-right`}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const branch = p.branchName || 'N/A'
                const device = p.deviceName || 'N/A'
                const ip = p.ipAddress || 'N/A'
                const mode = p.modeAccess || 'Prevent'
                const date = p.ctime || null
                
                return (
                  <tr key={i}
                      className={`border-b last:border-b-0 transition-colors duration-150
                                  ${isDark ? 'border-white/[0.04] hover:bg-white/[0.03]'
                                           : 'border-slate-50 hover:bg-slate-50/60'}`}>
                    <td className={`${tdCls} text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{i + 1}</td>
                    <td className={tdCls}>{branch}</td>
                    <td className={`${tdCls} font-mono text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {device}
                    </td>
                    <td className={`${tdCls} font-mono text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {ip}
                    </td>
                    <td className={tdCls}>
                      <span className="inline-flex items-center gap-1.5">
                        <Usb size={12} className="text-[#7094ff]" /> USB
                      </span>
                    </td>
                    <td className={tdCls}>
                      <Badge mode={mode} />
                    </td>
                    <td className={`${tdCls} ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                      {formatDate(date)}
                    </td>
                    <td className={`${tdCls} text-right`}>
                      <button
                        onClick={() => onDelete(i)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center ml-auto
                                   text-slate-400 hover:text-rose-500 hover:bg-rose-500/10
                                   transition-all duration-150"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                )
              })}
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
    { id: 'add', label: 'Add Policy', icon: Plus },
    { id: 'view', label: 'View Policies', icon: Eye },
  ]

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-2xl p-1.5 mb-6 border`}
      style={{
        background: isDark ? '#1a1a2e' : 'rgba(255,255,255,0.60)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(203,213,225,0.70)',
        boxShadow: isDark
          ? '0 4px 16px rgba(0,0,0,0.40)'
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
   MAIN PAGE
───────────────────────────────────────────────────────────── */
export default function UsbProtection() {
  const { isDark } = useTheme()
  
  // ── State for UI tabs ──
  const [tab, setTab] = useState('add')
  
  // ── State for policies (dynamic from API) ──
  const [policies, setPolicies] = useState([])
  
  // ── State for branches (dynamic from API) ──
  const [branches, setBranches] = useState([])
  
  // ── State for access counts ──
  const [accessCounts, setAccessCounts] = useState({ 
    preventCount: 0, 
    allowCount: 0 
  })
  
  // ── State for loading ──
  const [isLoading, setIsLoading] = useState(false)
  
  // ── State for error ──
  const [error, setError] = useState(null)

  // ── Load dashboard data ──
  const loadDashboard = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log("🔄 Loading dashboard data...")
      
      const [branchesRes, modeAccessRes, devicedetailRes] = await Promise.all([
        dashboardService.getBranch(),
        dashboardService.getModeAcess(),
        dashboardService.getdevicedetail()
      ])

      console.log("🔍 Branches response:", branchesRes)
      console.log("🔍 Mode Access response:", modeAccessRes)
      console.log("🔍 Device Detail response:", devicedetailRes)

      // Set branches from API
      if (branchesRes?.data) {
        setBranches(branchesRes.data)
        console.log("✅ Branches set:", branchesRes.data)
      }

      // Set access counts from API
      if (modeAccessRes?.data) {
        setAccessCounts({
          preventCount: modeAccessRes.data.preventCount || 0,
          allowCount: modeAccessRes.data.allowCount || 0
        })
        console.log("✅ Access counts set:", modeAccessRes.data)
      }

      // Set policies from devicedetail API
      let policiesData = []
      if (devicedetailRes?.data && Array.isArray(devicedetailRes.data)) {
        policiesData = devicedetailRes.data
      } else if (Array.isArray(devicedetailRes)) {
        policiesData = devicedetailRes
      } else if (devicedetailRes?.data?.data && Array.isArray(devicedetailRes.data.data)) {
        policiesData = devicedetailRes.data.data
      }
      setPolicies(policiesData)
      console.log("✅ Policies set:", policiesData)

    } catch (err) {
      console.error("❌ Error loading data:", err)
      setError(err.message || 'Failed to load data')
      
      showAlert({
        icon: 'error',
        title: 'Failed to Load Data',
        text: 'Could not load dashboard data.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // ── Initial load ──
  useEffect(() => {
    loadDashboard()
  }, [])

  // ── Transform API branches into dropdown options ──
  const branchOptions = branches.length > 0 
    ? branches.map(name => ({ value: name, label: name }))
    : BRANCHES.map(b => ({ value: String(b.id), label: b.name }))

  // ── Handle add policy ──
  const handleAdd = ({ branchName, device, mode }) => {
    const newPolicy = {
      branchName: branchName,
      deviceName: device,
      ipAddress: '192.168.0.44',
      modeAccess: mode,
      ctime: new Date().toISOString()
    }
    
    setPolicies(prev => [newPolicy, ...prev])
    
    setAccessCounts(prev => ({
      ...prev,
      [mode.toLowerCase() + 'Count']: (prev[mode.toLowerCase() + 'Count'] || 0) + 1
    }))
  }

  // ── Handle delete policy ──
  const handleDelete = (index) => {
    const deletedPolicy = policies[index]
    setPolicies(prev => prev.filter((_, i) => i !== index))
    
    if (deletedPolicy) {
      const mode = deletedPolicy.modeAccess || 'Prevent'
      setAccessCounts(prev => ({
        ...prev,
        [mode.toLowerCase() + 'Count']: Math.max(0, (prev[mode.toLowerCase() + 'Count'] || 0) - 1)
      }))
    }
    
    showAlert({
      icon: 'success',
      title: 'Policy Deleted',
      text: 'USB policy has been removed successfully.',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    })
  }

  return (
    <div className="w-full">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between mb-7">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{
              background: isDark ? 'rgba(112,148,255,0.15)' : 'rgba(112,148,255,0.15)',
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
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {isLoading 
                ? 'Loading endpoints...' 
                : `Manage USB device access policies across ${branches.length || 'all'} endpoints`}
            </p>
          </div>
        </div>

        {/* ── Stats chips ── */}
        <div className="hidden sm:flex items-center gap-2">
          <GlassButton variant="chip_allow" className="px-3 py-1.5 text-[11px] font-semibold cursor-default">
            {isLoading ? '...' : accessCounts.allowCount || policies.filter(p => p.modeAccess === 'Allow').length} Allowed
          </GlassButton>
          <GlassButton variant="chip_prevent" className="px-3 py-1.5 text-[11px] font-semibold cursor-default">
            {isLoading ? '...' : accessCounts.preventCount || policies.filter(p => p.modeAccess === 'Prevent').length} Prevented
          </GlassButton>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <TabBar active={tab} onChange={setTab} />

      {/* ── Error display ── */}
      {error && (
        <div className="mb-4 p-4 rounded-xl border border-rose-500/20 bg-rose-500/10">
          <p className="text-rose-500 text-sm">⚠️ {error}</p>
        </div>
      )}

      {/* ── Tab content ── */}
      {tab === 'add' && (
        <AddForm 
          onAdd={p => { handleAdd(p); setTab('view') }} 
          branchOptions={branchOptions}
          branches={branches}
          policies={policies}
        />
      )}
      
      {tab === 'view' && (
        <PolicyTable 
          policies={policies} 
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}