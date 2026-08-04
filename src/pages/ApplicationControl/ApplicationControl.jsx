import React, { useState, useRef, useEffect } from 'react'
import {
  AppWindow, Plus, Eye, RotateCcw, Check, AlertTriangle,
  ShieldCheck, Trash2, Search, ChevronDown, X,
} from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
// import { alert as showAlert } from '../../components/ui/AlertModal' // optional
// import { dashboardService } from '../../services/dashboardService'   // optional

/* ─────────────────────────────────────────────────────────────
   STATIC MOCK DATA (replace with real API calls later)
───────────────────────────────────────────────────────────── */
const MOCK_BRANCHES = ['MUMBAI-HEAD', 'VASHI', 'PUNE', 'AHMEDABAD', 'NAGPUR', 'BANGALORE', 'HYDERABAD', 'KOLKATA', 'CHENNAI', 'DELHI']

const MOCK_DEVICES_BY_BRANCH = {
  'MUMBAI-HEAD': ['DESKTOP-6RTJ7G1', 'DESKTOP-ABC123'],
  'VASHI': ['DESKTOP-B4J2VDM'],
  'PUNE': ['DESKTOP-F3E8J4M'],
  'AHMEDABAD': ['DESKTOP-C6DE2A4'],
  'NAGPUR': ['DESKTOP-D7F3B1Q'],
  'BANGALORE': ['DESKTOP-9A21L0D'],
  'HYDERABAD': ['DESKTOP-V9H7K1P'],
  'KOLKATA': ['LAPTOP-8FJ2K3L'],
  'CHENNAI': ['DELL-LATITUDE'],
  'DELHI': ['WIN10-11E4M12A2'],
}

const MOCK_APPLICATIONS = [
  'Chrome', 'Excel', 'Zoom', 'Slack', 'Teams', 'Outlook',
  'Firefox', 'VSCode', 'Notepad++', 'Photoshop', 'Word',
  'PowerPoint', 'Spotify', 'Discord', 'Telegram'
]

// Initial policies matching the mockup data (all "Allow" for demo)
const INITIAL_POLICIES = [
  { id: 1, ipAddress: '192.168.1.100', branch: 'MUMBAI-HEAD', pcName: 'DESKTOP-6RTJ7G1', mode: 'Allow' },
  { id: 2, ipAddress: '192.168.1.105', branch: 'VASHI', pcName: 'DESKTOP-B4J2VDM', mode: 'Allow' },
  { id: 3, ipAddress: '192.168.1.110', branch: 'PUNE', pcName: 'DESKTOP-F3E8J4M', mode: 'Allow' },
  { id: 4, ipAddress: '192.168.1.120', branch: 'AHMEDABAD', pcName: 'DESKTOP-C6DE2A4', mode: 'Allow' },
  { id: 5, ipAddress: '192.168.1.130', branch: 'NAGPUR', pcName: 'DESKTOP-D7F3B1Q', mode: 'Allow' },
  { id: 6, ipAddress: '192.168.1.200', branch: 'BANGALORE', pcName: 'DESKTOP-9A21L0D', mode: 'Allow' },
  { id: 7, ipAddress: '192.168.1.101', branch: 'HYDERABAD', pcName: 'DESKTOP-V9H7K1P', mode: 'Allow' },
  { id: 8, ipAddress: '192.168.1.107', branch: 'KOLKATA', pcName: 'LAPTOP-8FJ2K3L', mode: 'Allow' },
  { id: 9, ipAddress: '192.168.1.108', branch: 'CHENNAI', pcName: 'DELL-LATITUDE', mode: 'Allow' },
  { id: 10, ipAddress: '192.168.1.150', branch: 'DELHI', pcName: 'WIN10-11E4M12A2', mode: 'Allow' },
]

/* ─────────────────────────────────────────────────────────────
   CUSTOM DROPDOWN (single select)
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
  const containerRef = useRef(null)

  const normalised = options.map(o =>
    typeof o === 'string' ? { value: o, label: o } : o
  )

  const filtered = searchable && query
    ? normalised.filter(o => o.label.toLowerCase().includes(query.toLowerCase()))
    : normalised

  const selected = normalised.find(o => o.value === value)

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

  const handleSelect = val => {
    onChange(val)
    setOpen(false)
    setQuery('')
  }

  const glassSurface = isDark
    ? { background: '#2a2a2a', backdropFilter: 'none', WebkitBackdropFilter: 'none' }
    : { background: 'rgba(255,255,255,0.80)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }

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
            background: isDark ? '#2a2a2a' : 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(32px) saturate(180%)',
            WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          }}
        >
          {searchable && (
            <div className={`px-3 py-2 border-b ${isDark ? 'border-white/[0.07]' : 'border-slate-100'}`}>
              <div className="relative flex items-center">
                <Search size={12} className={`absolute left-2.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search…"
                  className={`w-full pl-7 pr-3 py-1.5 text-[12px] rounded-lg outline-none border transition-all duration-150
                              ${isDark
                      ? 'bg-[#2a2a2a] border-white/[0.08] text-[#d0d0d0] placeholder-[#555]'
                      : 'bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400'}`}
                />
                {query && (
                  <button onClick={() => setQuery('')} className="absolute right-2 text-slate-400 hover:text-slate-200">
                    <X size={11} />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className={`px-4 py-3 text-[12px] text-center ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
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
   MULTI‑SELECT DROPDOWN (for applications)
───────────────────────────────────────────────────────────── */
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

  const removeValue = val => {
    onChange(values.filter(v => v !== val))
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
        <div className="flex flex-wrap gap-1 flex-1 text-left">
          {values.length === 0 ? (
            <span className={isDark ? 'text-[#666]' : 'text-slate-400'}>
              {placeholder}
            </span>
          ) : (
            values.map(v => {
              const option = normalized.find(o => o.value === v)
              return (
                <span
                  key={v}
                  className="
                    inline-flex items-center gap-1
                    px-2 py-0.5 rounded-md
                    text-[11px]

                    bg-[#7094ff]/12
                    text-[#7094ff]
                    border border-[#7094ff]/20
                  "
                >
                  {option?.label}
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation()
                      removeValue(v)
                    }}
                  >
                    <X size={10} />
                  </button>
                </span>
              )
            })
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
      style: { background: 'transparent', backdropFilter: 'none' },
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
    return (
      <span className={`${base} bg-emerald-500/10 text-emerald-500 border-emerald-500/20`}>
        <Check size={10} /> Allow
      </span>
    )
  return (
    <span className={`${base} bg-rose-500/10 text-rose-500 border-rose-500/20`}>
      <AlertTriangle size={10} /> Prevent
    </span>
  )
}

/* ─────────────────────────────────────────────────────────────
   GLASS CARD
───────────────────────────────────────────────────────────── */
function GlassCard({ children, className = '' }) {
  const { isDark } = useTheme()
  return (
    <div
      className={`rounded-2xl border ${className}`}
      style={{
        background: isDark ? '#020617' : 'rgba(255,255,255,0.95)',
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
   ADD FORM (with static data and simulated API)
───────────────────────────────────────────────────────────── */
function AddForm({ branches, onAdd }) {
  const { isDark } = useTheme()
  const [form, setForm] = useState({ branch: '', device: '', applications: [], mode: '' })
  const [submitted, setSubmitted] = useState(false)
  const [success, setSuccess] = useState(false)
  const [fetchedDevices, setFetchedDevices] = useState([])

  const branchOptions = branches.map(b => ({ value: b, label: b }))
  const deviceOptions = fetchedDevices.map(d => ({ value: d, label: d }))
  const appOptions = MOCK_APPLICATIONS.map(app => ({ value: app, label: app }))
  const modeOptions = [
    { value: 'Allow', label: 'Allow' },
    { value: 'Prevent', label: 'Prevent' },
  ]

  const isValid = form.branch && form.device && form.applications.length > 0 && form.mode

  const handleBranchChange = (branch) => {
    setForm(f => ({ ...f, branch, device: '' }))
    const devices = MOCK_DEVICES_BY_BRANCH[branch] || []
    setFetchedDevices(devices)
  }

  const handleSubmit = async () => {
    setSubmitted(true)
    if (!isValid) return

    const requestData = {
      branch: form.branch,
      device: form.device,
      applications: form.applications,
      mode: form.mode,
    }

    setSuccess(true)
    setTimeout(() => setSuccess(false), 2000)

    onAdd({
      ipAddress: '192.168.1.' + (Math.floor(Math.random() * 200) + 1),
      branch: form.branch,
      pcName: form.device,
      mode: form.mode,
    })

    setSubmitted(false)
    setForm({ branch: '', device: '', applications: [], mode: '' })
  }

  const labelCls = `block text-[11px] font-semibold uppercase tracking-wider mb-1.5
                    ${isDark ? 'text-slate-500' : 'text-slate-400'}`

  return (
    <GlassCard className="p-6 mb-5">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {/* Branch */}
        <div>
          <label className={labelCls}>
            Branch Name <span className="text-rose-500 normal-case tracking-normal">*</span>
          </label>
          <Dropdown
            value={form.branch}
            onChange={handleBranchChange}
            options={branchOptions}
            placeholder="Select Branch"
            searchable
            error={submitted && !form.branch}
          />
          {submitted && !form.branch && <p className="text-[10px] text-rose-500 mt-1">Required</p>}
        </div>

        {/* Device */}
        <div>
          <label className={labelCls}>
            Device Name <span className="text-rose-500 normal-case tracking-normal">*</span>
          </label>
          <Dropdown
            value={form.device}
            onChange={val => setForm(f => ({ ...f, device: val }))}
            options={deviceOptions}
            placeholder={form.branch ? 'Select Device' : 'Select branch first'}
            disabled={!form.branch}
            error={submitted && !form.device}
          />
          {submitted && !form.device && <p className="text-[10px] text-rose-500 mt-1">Required</p>}
        </div>



        {/* Mode */}
        <div>
          <label className={labelCls}>
            Mode of Access <span className="text-rose-500 normal-case tracking-normal">*</span>
          </label>
          <Dropdown
            value={form.mode}
            onChange={val => setForm(f => ({ ...f, mode: val }))}
            options={modeOptions}
            placeholder="Select Mode"
            error={submitted && !form.mode}
          />
          {submitted && !form.mode && <p className="text-[10px] text-rose-500 mt-1">Required</p>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <GlassButton
          onClick={() => {
            setForm({ branch: '', device: '', applications: [], mode: '' })
            setSubmitted(false)
          }}
          variant="default"
          className="px-4 py-2"
        >
          <RotateCcw size={13} /> Reset
        </GlassButton>

        <GlassButton
          onClick={handleSubmit}
          variant={success ? 'success' : 'primary'}
          className="px-5 py-2 font-semibold"
        >
          {success ? <><Check size={13} /> Saved!</> : <><Plus size={13} /> Submit</>}
        </GlassButton>
      </div>
    </GlassCard>
  )
}

/* ─────────────────────────────────────────────────────────────
   POLICY TABLE – now scrollable + paginated
───────────────────────────────────────────────────────────── */
function PolicyTable({ policies, onDelete }) {
  const { isDark } = useTheme()
  const [search, setSearch] = useState('')
  const [filterMode, setFilterMode] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5 // entries per page

  // Filter
  const filtered = policies.filter(p => {
    const q = search.toLowerCase()
    return (
      (!q || p.branch?.toLowerCase().includes(q) || p.ipAddress?.toLowerCase().includes(q) || p.pcName?.toLowerCase().includes(q)) &&
      (!filterMode || p.mode === filterMode)
    )
  })

  // Pagination
  const totalEntries = filtered.length
  const totalPages = Math.ceil(totalEntries / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalEntries)
  const currentEntries = filtered.slice(startIndex, endIndex)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, filterMode])

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const thCls = `text-left text-[11px] font-semibold uppercase tracking-wider px-4 py-3
                 ${isDark ? 'text-slate-500 border-b border-white/[0.06]' : 'text-slate-400 border-b border-slate-100'}`
  const tdCls = `px-4 py-3 text-[12px] ${isDark ? 'text-slate-300' : 'text-slate-700'}`

  const filterOptions = [
    { value: '', label: 'All Modes' },
    { value: 'Allow', label: 'Allow' },
    { value: 'Prevent', label: 'Prevent' },
  ]

  return (
    <GlassCard className="overflow-hidden">
      {/* Toolbar */}
      <div className={`flex items-center justify-between gap-3 px-5 py-4 border-b
                       ${isDark ? 'border-white/[0.06]' : 'border-slate-100'}`}>
        <div className="flex items-center gap-2">
          <ShieldCheck size={15} className="text-[#7094ff]" />
          <span className={`text-[13px] font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
           View Mode
          </span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold
                           bg-[#7094ff]/15 text-[#7094ff] border border-[#7094ff]/20">
            {totalEntries}
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
                          ${isDark ? 'text-slate-300 placeholder-slate-600' : 'text-slate-700 placeholder-slate-400'}`}
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

      {/* Table container with scroll */}
      <div className="overflow-y-auto max-h-[400px]">
        {currentEntries.length === 0 ? (
          <div className={`py-16 text-center text-[13px] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            No application policies found.
          </div>
        ) : (
          <table className="w-full">
            <thead className={`sticky top-0 z-10 ${isDark ? 'bg-[#020617]' : 'bg-white/95'}`}>
              <tr>
                <th className={thCls}>SR. NO.</th>
                <th className={thCls}>IP ADDRESS</th>
                <th className={thCls}>BRANCH NAME</th>
                <th className={thCls}>PC NAME</th>
                <th className={thCls}>MODE TYPE</th>
                <th className={`${thCls} text-right`}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentEntries.map((p, i) => {
                const globalIndex = startIndex + i + 1
                return (
                  <tr
                    key={p.id}
                    className={`border-b last:border-b-0 transition-colors duration-150
                                ${isDark
                        ? 'border-white/[0.04] hover:bg-[#2e2e2e]'
                        : 'border-slate-50 hover:bg-slate-50/60'}`}
                  >
                    <td className={`${tdCls} text-[11px] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{globalIndex}</td>
                    <td className={`${tdCls} font-mono text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {p.ipAddress}
                    </td>
                    <td className={tdCls}>{p.branch}</td>
                    <td className={tdCls}>{p.pcName}</td>
                    <td className={tdCls}><Badge mode={p.mode} /></td>
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
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination footer */}
      {totalEntries > 0 && (
        <div className={`flex items-center justify-between px-5 py-3 border-t
                         ${isDark ? 'border-white/[0.06]' : 'border-slate-100'}`}>
          <span className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            Showing {startIndex + 1} to {endIndex} of {totalEntries} entries
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium border transition
                          ${isDark
                    ? 'border-white/[0.08] text-slate-400 hover:text-white hover:border-white/[0.15] disabled:opacity-40 disabled:hover:border-white/[0.08]'
                    : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 disabled:opacity-40'
                }`}
            >
              Previous
            </button>
            <span className={`text-[11px] px-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium border transition
                          ${isDark
                    ? 'border-white/[0.08] text-slate-400 hover:text-white hover:border-white/[0.15] disabled:opacity-40 disabled:hover:border-white/[0.08]'
                    : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 disabled:opacity-40'
                }`}
            >
              Next
            </button>
          </div>
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
    { id: 'add', label: 'Set Mode', icon: Plus },
    { id: 'view', label: 'View Mode', icon: Eye },
  ]

  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-2xl p-1.5 mb-6 border"
      style={{
        background: isDark ? '#020617' : 'rgba(255,255,255,0.60)',
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
export default function ApplicationControl() {
  const { isDark } = useTheme()
  const [tab, setTab] = useState('add')
  const [policies, setPolicies] = useState(INITIAL_POLICIES)
  const [branches] = useState(MOCK_BRANCHES)

  const handleAdd = (newPolicy) => {
    const newId = Math.max(...policies.map(p => p.id), 0) + 1
    setPolicies(prev => [
      ...prev,
      {
        id: newId,
        ipAddress: newPolicy.ipAddress || '192.168.1.99',
        branch: newPolicy.branch,
        pcName: newPolicy.pcName,
        mode: newPolicy.mode,
      }
    ])
  }

  const handleDelete = (id) => {
    setPolicies(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="w-full">
      <br />
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
            <AppWindow size={18} className="text-[#7094ff]" />
          </div>
          <div>
            <h2 className={`font-display font-bold text-lg leading-tight
                            ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
              Application Control
            </h2>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Manage application access policies across endpoints
            </p>
          </div>
        </div>
      </div>

      <TabBar active={tab} onChange={setTab} />

      {tab === 'add' && (
        <AddForm
          branches={branches}
          onAdd={(newPolicy) => {
            handleAdd(newPolicy)
            setTab('view')
          }}
        />
      )}
      {tab === 'view' && (
        <PolicyTable policies={policies} onDelete={handleDelete} />
      )}
    </div>
  )
}