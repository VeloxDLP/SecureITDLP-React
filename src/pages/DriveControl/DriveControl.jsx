import React, { useState, useRef, useEffect } from 'react'
import {
  Printer,
  Plus,
  Eye,
  RotateCcw,
  Check,
  AlertTriangle,
  ShieldCheck,
  Trash2,
  Search,
  ChevronDown,
  X,
  Folder,
} from 'lucide-react'

import { useTheme } from '../../context/ThemeContext'
import { alert as showAlert } from '../../components/ui/AlertModal'
import { dashboardService } from '../../services/dashboardService'

/* ─────────────────────────────────────────────────────────────
   CUSTOM DROPDOWN
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

  const normalised = (options || []).map((o) =>
    typeof o === 'string'
      ? {
          value: o,
          label: o,
        }
      : o
  )

  const filtered =
    searchable && query
      ? normalised.filter((o) =>
          String(o.label || '')
            .toLowerCase()
            .includes(query.toLowerCase())
        )
      : normalised

  const selected = normalised.find((o) => o.value === value)

  useEffect(() => {
    const handler = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setOpen(false)
        setQuery('')
      }
    }

    if (open) {
      document.addEventListener('mousedown', handler)
    }

    return () => {
      document.removeEventListener('mousedown', handler)
    }
  }, [open])

  const handleSelect = (val) => {
    onChange(val)
    setOpen(false)
    setQuery('')
  }

  const glassSurface = isDark
    ? {
        background: '#171827',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
      }
    : {
        background: 'rgba(255,255,255,0.80)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }

  const triggerBorder = error
    ? 'border-rose-500/60'
    : open
      ? 'border-[#7094ff]/60'
      : isDark
        ? 'border-white/[0.10]'
        : 'border-slate-300/70'

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
        <span
          className={
            selected
              ? ''
              : isDark
                ? 'text-slate-500'
                : 'text-slate-400'
          }
        >
          {selected ? selected.label : placeholder}
        </span>

        <ChevronDown
          size={14}
          className={`
            flex-shrink-0 transition-transform duration-200
            ${open ? 'rotate-180' : ''}
            ${isDark ? 'text-slate-500' : 'text-slate-400'}
          `}
        />
      </button>

      {open && (
        <div
          className={`
            absolute top-full left-0 right-0 mt-1.5 z-[200]
            rounded-xl border overflow-hidden
            shadow-[0_16px_48px_rgba(0,0,0,0.35)]
            animate-slide-up
            ${isDark
              ? 'border-white/[0.10]'
              : 'border-slate-200/80'}
          `}
          style={{
            background: isDark
              ? '#171827'
              : 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(32px) saturate(180%)',
            WebkitBackdropFilter:
              'blur(32px) saturate(180%)',
          }}
        >
          {searchable && (
            <div
              className={`
                px-3 py-2 border-b
                ${
                  isDark
                    ? 'border-white/[0.07]'
                    : 'border-slate-100'
                }
              `}
            >
              <div className="relative flex items-center">
                <Search
                  size={12}
                  className={`
                    absolute left-2.5
                    ${
                      isDark
                        ? 'text-slate-500'
                        : 'text-slate-400'
                    }
                  `}
                />

                <input
                  autoFocus
                  value={query}
                  onChange={(e) =>
                    setQuery(e.target.value)
                  }
                  placeholder="Search…"
                  className={`
                    w-full pl-7 pr-3 py-1.5
                    text-[12px] rounded-lg
                    outline-none border transition-all duration-150
                    ${
                      isDark
                        ? 'bg-[#171827] border-white/[0.08] text-[#d0d0d0] placeholder-[#555]'
                        : 'bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400'
                    }
                  `}
                />

                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-2 text-slate-400 hover:text-slate-200"
                  >
                    <X size={11} />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p
                className={`
                  px-4 py-3 text-[12px] text-center
                  ${
                    isDark
                      ? 'text-slate-600'
                      : 'text-slate-400'
                  }
                `}
              >
                No results
              </p>
            ) : (
              filtered.map((o, index) => {
                const isSelected = o.value === value

                return (
                  <button
                    key={`${String(o.value)}-${index}`}
                    type="button"
                    onClick={() =>
                      handleSelect(o.value)
                    }
                    className={`
                      w-full text-left px-4 py-2.5
                      text-[13px]
                      flex items-center justify-between gap-2
                      transition-colors duration-100
                      ${
                        isSelected
                          ? 'text-[#7094ff] bg-[#7094ff]/10'
                          : isDark
                            ? 'text-[#888] hover:bg-white/[0.06] hover:text-[#e0e0e0]'
                            : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                      }
                    `}
                  >
                    {o.label}

                    {isSelected && (
                      <Check
                        size={13}
                        className="text-[#7094ff] flex-shrink-0"
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
  children,
  onClick,
  variant = 'default',
  className = '',
  disabled = false,
  type = 'button',
}) {
  const { isDark } = useTheme()

  const variants = {
    default: {
      className: isDark
        ? 'text-slate-300 hover:text-white border-white/[0.10] hover:border-white/[0.20]'
        : 'text-slate-600 hover:text-slate-900 border-slate-300/70 hover:border-slate-400/60',

      style: {
        background: isDark
          ? 'rgba(255,255,255,0.06)'
          : 'rgba(255,255,255,0.65)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: isDark
          ? 'inset 0 1px 0 rgba(255,255,255,0.06)'
          : '0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
      },
    },

    primary: {
      className:
        'text-white border-[#7094ff]/40 hover:border-[#7094ff]/60',

      style: {
        background: 'rgba(112, 148, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow:
          '0 4px 20px rgba(112,148,255,0.35), inset 0 1px 0 rgba(255,255,255,0.18)',
      },
    },

    success: {
      className:
        'text-white border-emerald-500/40',

      style: {
        background: 'rgba(16, 185, 129, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow:
          '0 4px 20px rgba(16,185,129,0.30), inset 0 1px 0 rgba(255,255,255,0.18)',
      },
    },

    tab_active: {
      className:
        'text-white border-[#7094ff]/40',

      style: {
        background: 'rgba(112,148,255,0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow:
          '0 6px 24px rgba(112,148,255,0.35), inset 0 1px 0 rgba(255,255,255,0.20)',
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
        background: isDark
          ? 'rgba(16,185,129,0.12)'
          : 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: isDark
          ? 'none'
          : '0 2px 8px rgba(0,0,0,0.06)',
      },
    },

    chip_prevent: {
      className: isDark
        ? 'text-rose-400 border-rose-500/25'
        : 'text-rose-600 border-rose-300/60',

      style: {
        background: isDark
          ? 'rgba(239,68,68,0.12)'
          : 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: isDark
          ? 'none'
          : '0 2px 8px rgba(0,0,0,0.06)',
      },
    },
  }

  const v =
    variants[variant] || variants.default

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
        ${v.className}
        ${className}
      `}
      style={v.style}
    >
      {children}
    </button>
  )
}

/* ─────────────────────────────────────────────────────────────
   GLASS CARD
───────────────────────────────────────────────────────────── */

function GlassCard({
  children,
  className = '',
}) {
  const { isDark } = useTheme()

  return (
    <div
      className={`rounded-2xl border ${className}`}
      style={{
        background: isDark
          ? '#171827'
          : 'rgba(255,255,255,0.95)',

        backdropFilter: isDark
          ? 'none'
          : 'blur(24px)',

        WebkitBackdropFilter: isDark
          ? 'none'
          : 'blur(24px)',

        borderColor: isDark
          ? 'rgba(255,255,255,0.07)'
          : '#e2e8f0',

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
   ADD FORM
───────────────────────────────────────────────────────────── */

function AddForm({
  branches,
  onAdd,
}) {
  const { isDark } = useTheme()

  const [form, setForm] = useState({
    branch: '',
    device: '',
    function: '',
    drivePath: '',
  })

  const [submitted, setSubmitted] =
    useState(false)

  const [success, setSuccess] =
    useState(false)

  const [fetchedDevices, setFetchedDevices] =
    useState([])

  const [loadingDevices, setLoadingDevices] =
    useState(false)

  const branchOptions = (
    branches || []
  ).map((branch, index) => {
    const branchName =
      typeof branch === 'string'
        ? branch
        : branch?.branchName ||
          branch?.name ||
          branch?.branch ||
          ''

    return {
      value: branchName,
      label: branchName,
      _index: index,
    }
  })

  const deviceOptions = (
    fetchedDevices || []
  ).map((device, index) => {
    const deviceName =
      typeof device === 'string'
        ? device
        : device?.deviceName ||
          device?.device ||
          device?.hostname ||
          device?.hostName ||
          device?.computerName ||
          device?.ipAddress ||
          ''

    return {
      value: deviceName,
      label: deviceName,
      _index: index,
    }
  })

  const functionOptions = [
    {
      value: 'CREATE',
      label: 'CREATE',
    },
    {
      value: 'MODIFY',
      label: 'MODIFY',
    },
    {
      value: 'DELETE',
      label: 'DELETE',
    },
    {
      value: 'RENAME',
      label: 'RENAME',
    },
    {
      value: 'CUT',
      label: 'CUT',
    },
  ]

  const set = (key) => (value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === 'branch'
        ? {
            device: '',
            function: '',
          }
        : {}),
    }))
  }

  const isValid =
    form.branch &&
    form.device &&
    form.function &&
    form.drivePath

  const handleBranchChange = async (
    branch
  ) => {
    setForm((prev) => ({
      ...prev,
      branch,
      device: '',
      function: '',
    }))

    setFetchedDevices([])

    if (!branch) return

    try {
      setLoadingDevices(true)

      const response =
        await dashboardService.getDrivePolicies(
          branch
        )

      const data =
        response?.data ?? []

      if (Array.isArray(data)) {
        setFetchedDevices(data)
      } else {
        setFetchedDevices([])
      }
    } catch (error) {
      console.error(
        'Error loading drive devices:',
        error
      )

      setFetchedDevices([])

      showAlert?.(
        'Unable to load devices for selected branch.'
      )
    } finally {
      setLoadingDevices(false)
    }
  }

  const handleSubmit = async () => {
    setSubmitted(true)

    if (!isValid) {
      return
    }

    const requestData = {
      branch: form.branch,
      device: form.device,
      function: form.function,
      drivePath: form.drivePath,
    }

    try {
      console.log(
        'Selected Values:',
        requestData
      )

      const response =
        await dashboardService.addPrinterPolicy(
          requestData
        )

      console.log(
        'Add Drive Policy Response:',
        response
      )

      setSuccess(true)

      if (onAdd) {
        onAdd({
          ...requestData,
        })
      }

      setTimeout(() => {
        setSuccess(false)
      }, 2000)

    } catch (error) {
      console.error(
        'Error adding drive policy:',
        error
      )

      showAlert?.(
        'Unable to add drive policy.'
      )
    }
  }

  const handleReset = () => {
    setForm({
      branch: '',
      device: '',
      function: '',
      drivePath: '',
    })

    setFetchedDevices([])
    setSubmitted(false)
    setSuccess(false)
  }

  const labelCls = `
    block text-[11px] font-semibold
    uppercase tracking-wider mb-1.5
    ${isDark ? 'text-slate-500' : 'text-slate-400'}
  `

  return (
    <GlassCard className="p-6 mb-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

        {/* Branch */}
        <div>
          <label className={labelCls}>
            Branch Name{' '}
            <span className="text-rose-500 normal-case tracking-normal">
              *
            </span>
          </label>

          <Dropdown
            value={form.branch}
            onChange={handleBranchChange}
            options={branchOptions}
            placeholder="Select Branch"
            searchable={true}
            error={
              submitted && !form.branch
            }
          />

          {submitted && !form.branch && (
            <p className="text-[10px] text-rose-500 mt-1">
              Required
            </p>
          )}
        </div>

        {/* Device */}
        <div>
          <label className={labelCls}>
            Device Name{' '}
            <span className="text-rose-500 normal-case tracking-normal">
              *
            </span>
          </label>

          <Dropdown
            value={form.device}
            onChange={set('device')}
            options={deviceOptions}
            placeholder={
              !form.branch
                ? 'Select branch first'
                : loadingDevices
                  ? 'Loading devices...'
                  : 'Select Device'
            }
            disabled={
              !form.branch ||
              loadingDevices
            }
            error={
              submitted && !form.device
            }
          />

          {submitted && !form.device && (
            <p className="text-[10px] text-rose-500 mt-1">
              Required
            </p>
          )}
        </div>

        {/* Functions */}
        <div>
          <label className={labelCls}>
            Functions{' '}
            <span className="text-rose-500 normal-case tracking-normal">
              *
            </span>
          </label>

          <Dropdown
            value={form.function}
            onChange={set('function')}
            options={functionOptions}
            placeholder="Select Function"
            error={
              submitted && !form.function
            }
          />

          {submitted &&
            !form.function && (
              <p className="text-[10px] text-rose-500 mt-1">
                Required
              </p>
            )}
        </div>

        {/* Drive Path */}
        <div>
          <label className={labelCls}>
            Drive Path{' '}
            <span className="text-rose-500 normal-case tracking-normal">
              *
            </span>
          </label>

          <div className="relative">
            <input
              type="text"
              value={form.drivePath}
              onChange={(e) =>
                set('drivePath')(
                  e.target.value
                )
              }
              placeholder="Enter Drive Path"
              className={`
                w-full px-3 py-2.5 pl-10
                rounded-xl text-[13px]
                border transition-all duration-200
                outline-none
                ${
                  submitted &&
                  !form.drivePath
                    ? 'border-rose-500/60'
                    : isDark
                      ? 'border-white/[0.10]'
                      : 'border-slate-300/70'
                }
                ${
                  isDark
                    ? 'bg-[#171827] text-slate-200 placeholder-slate-500'
                    : 'bg-white/80 text-slate-800 placeholder-slate-400'
                }
                ${
                  submitted &&
                  !form.drivePath
                    ? 'ring-2 ring-rose-500/20'
                    : ''
                }
              `}
              style={{
                background: isDark
                  ? '#171827'
                  : 'rgba(255,255,255,0.80)',
                backdropFilter:
                  'blur(24px)',
                WebkitBackdropFilter:
                  'blur(24px)',
              }}
            />

            <Folder
              size={16}
              className={`
                absolute left-3 top-1/2
                -translate-y-1/2
                ${
                  isDark
                    ? 'text-slate-500'
                    : 'text-slate-400'
                }
              `}
            />
          </div>

          {submitted &&
            !form.drivePath && (
              <p className="text-[10px] text-rose-500 mt-1">
                Required
              </p>
            )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <GlassButton
          onClick={handleReset}
          variant="default"
          className="px-4 py-2"
        >
          <RotateCcw size={13} />
          Reset
        </GlassButton>

        <GlassButton
          onClick={handleSubmit}
          variant={
            success
              ? 'success'
              : 'primary'
          }
          className="px-5 py-2 font-semibold"
        >
          {success ? (
            <>
              <Check size={13} />
              Saved!
            </>
          ) : (
            <>
              <Plus size={13} />
              Submit
            </>
          )}
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

  const [search, setSearch] = useState('')
  const [filterMode, setFilterMode] = useState('')

  const safePolicies = Array.isArray(policies) ? policies : []

  const getValue = (policy, ...keys) => {
    for (const key of keys) {
      if (
        policy?.[key] !== undefined &&
        policy?.[key] !== null &&
        policy?.[key] !== ''
      ) {
        return policy[key]
      }
    }
    return ''
  }

  const filtered = safePolicies.filter((p) => {
    const q = search.toLowerCase().trim()

    const branch = String(
      getValue(p, 'branch', 'branchName')
    ).toLowerCase()

    const device = String(
      getValue(
        p,
        'device',
        'deviceName',
        'computerName',
        'hostName',
        'hostname'
      )
    ).toLowerCase()

    const ipAddress = String(
      getValue(
        p,
        'ipAddress',
        'ipaddress',
        'ip'
      )
    ).toLowerCase()

    const drivePath = String(
      getValue(
        p,
        'drivePath',
        'drivepath',
        'path'
      )
    ).toLowerCase()

    const func = String(
      getValue(
        p,
        'function',
        'functions',
        'FUNCTIONS'
      )
    ).toLowerCase()

    return (
      (!q ||
        branch.includes(q) ||
        device.includes(q) ||
        ipAddress.includes(q) ||
        drivePath.includes(q) ||
        func.includes(q)) &&
      (!filterMode ||
        String(
          getValue(
            p,
            'function',
            'functions',
            'FUNCTIONS'
          )
        ).toUpperCase() === filterMode)
    )
  })

  const filterOptions = [
    {
      value: '',
      label: 'All Functions',
    },
    {
      value: 'CREATE',
      label: 'CREATE',
    },
    {
      value: 'MODIFY',
      label: 'MODIFY',
    },
    {
      value: 'DELETE',
      label: 'DELETE',
    },
    {
      value: 'RENAME',
      label: 'RENAME',
    },
    {
      value: 'CUT',
      label: 'CUT',
    },
  ]

  /*
   * All functions use the SAME green style
   * like the Allow button in your screenshot.
   */
  const FunctionBadge = ({ value }) => {
  const functionName = String(value || '').toUpperCase()

  if (!functionName) {
    return (
      <span
        className="
          inline-flex
          items-center
          justify-center
          px-3
          py-1
          rounded-full
          text-[10px]
          font-medium
          bg-slate-500/10
          text-slate-400
          border
          border-slate-500/20
        "
      >
        N/A
      </span>
    )
  }

  return (
    <button
      type="button"
      className="
        inline-flex
        items-center
        justify-center
        gap-1.5
        px-3
        py-1
        rounded-full
        text-[10px]
        font-medium
        capitalize
        bg-emerald-500/[0.08]
        text-emerald-400
        border
        border-emerald-500/40
        hover:bg-emerald-500/[0.14]
        hover:border-emerald-400/60
        transition-all
        duration-200
        cursor-default
      "
    >
      <Check
        size={10}
        strokeWidth={2.5}
      />

      {functionName.charAt(0) +
        functionName.slice(1).toLowerCase()}
    </button>
  )
}

  return (
    <GlassCard className="overflow-hidden">

      {/* ─────────────────────────────────────────
          TOOLBAR
      ───────────────────────────────────────── */}

      <div
        className={`
          flex items-center
          justify-between
          gap-3
          px-5
          py-4
          border-b
          ${
            isDark
              ? 'border-white/[0.06]'
              : 'border-slate-100'
          }
        `}
      >

        {/* LEFT */}
        <div className="flex items-center gap-2">

          <ShieldCheck
            size={15}
            className="text-[#7094ff]"
          />

          <span
            className={`
              text-[13px]
              font-semibold
              ${
                isDark
                  ? 'text-slate-200'
                  : 'text-slate-700'
              }
            `}
          >
            Drive Policies
          </span>

          <span
            className="
              ml-1
              px-2
              py-0.5
              rounded-full
              text-[10px]
              font-bold
              bg-[#7094ff]/15
              text-[#7094ff]
              border
              border-[#7094ff]/20
            "
          >
            {filtered.length}
          </span>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">

          {/* SEARCH */}

          <div
            className={`
              relative
              flex
              items-center
              rounded-xl
              border
              text-[12px]
              ${
                isDark
                  ? 'border-white/[0.08]'
                  : 'border-slate-200/80'
              }
            `}
            style={{
              background: isDark
                ? 'rgba(255,255,255,0.04)'
                : 'rgba(255,255,255,0.72)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >

            <Search
              size={12}
              className={`
                absolute
                left-2.5
                ${
                  isDark
                    ? 'text-slate-500'
                    : 'text-slate-400'
                }
              `}
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search..."
              className={`
                bg-transparent
                pl-7
                pr-3
                py-1.5
                outline-none
                w-44
                text-[12px]
                ${
                  isDark
                    ? 'text-slate-300 placeholder-slate-600'
                    : 'text-slate-700 placeholder-slate-400'
                }
              `}
            />

          </div>

          {/* FILTER */}

          <div className="w-36">
            <Dropdown
              value={filterMode}
              onChange={setFilterMode}
              options={filterOptions}
              placeholder="All Functions"
            />
          </div>

        </div>
      </div>

      {/* ─────────────────────────────────────────
          EMPTY STATE
      ───────────────────────────────────────── */}

      {filtered.length === 0 ? (

        <div
          className={`
            py-16
            text-center
            text-[13px]
            ${
              isDark
                ? 'text-slate-600'
                : 'text-slate-400'
            }
          `}
        >
          No drive policies found.
        </div>

      ) : (

        /* ───────────────────────────────────────
           TABLE
        ─────────────────────────────────────── */

        <div className="overflow-x-auto">

          <table className="w-full border-collapse">

            {/* HEADER */}

            <thead>
              <tr
                className={
                  isDark
                    ? 'bg-white/[0.015]'
                    : 'bg-slate-50/70'
                }
              >

                <th
                  className={`
                    text-left
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wider
                    px-4
                    py-3
                    w-[55px]
                    ${
                      isDark
                        ? 'text-slate-600'
                        : 'text-slate-400'
                    }
                  `}
                >
                  #
                </th>

                <th
                  className={`
                    text-left
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wider
                    px-4
                    py-3
                    ${
                      isDark
                        ? 'text-slate-600'
                        : 'text-slate-400'
                    }
                  `}
                >
                  Branch
                </th>

                <th
                  className={`
                    text-left
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wider
                    px-4
                    py-3
                    ${
                      isDark
                        ? 'text-slate-600'
                        : 'text-slate-400'
                    }
                  `}
                >
                  Device
                </th>

                <th
                  className={`
                    text-left
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wider
                    px-4
                    py-3
                    ${
                      isDark
                        ? 'text-slate-600'
                        : 'text-slate-400'
                    }
                  `}
                >
                  Function
                </th>

                <th
                  className={`
                    text-left
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wider
                    px-4
                    py-3
                    ${
                      isDark
                        ? 'text-slate-600'
                        : 'text-slate-400'
                    }
                  `}
                >
                  Drive Path
                </th>

                <th
                  className={`
                    text-right
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wider
                    px-4
                    py-3
                    w-[80px]
                    ${
                      isDark
                        ? 'text-slate-600'
                        : 'text-slate-400'
                    }
                  `}
                >
                  Action
                </th>

              </tr>
            </thead>

            {/* BODY */}

            <tbody>

              {filtered.map((p, i) => {

                /*
                 * Unique key fix
                 */
                const rowId =
                  p.id ??
                  p.policyId ??
                  p.srNo ??
                  p.sr_no ??
                  `${getValue(
                    p,
                    'branch',
                    'branchName'
                  )}-${getValue(
                    p,
                    'device',
                    'deviceName',
                    'computerName',
                    'hostName',
                    'hostname'
                  )}-${getValue(
                    p,
                    'function',
                    'functions',
                    'FUNCTIONS'
                  )}-${getValue(
                    p,
                    'drivePath',
                    'drivepath',
                    'path'
                  )}-${i}`

                const branch =
                  getValue(
                    p,
                    'branch',
                    'branchName'
                  )

                const device =
                  getValue(
                    p,
                    'device',
                    'deviceName',
                    'computerName',
                    'hostName',
                    'hostname'
                  )

                const func =
                  getValue(
                    p,
                    'function',
                    'functions',
                    'FUNCTIONS'
                  )

                const drivePath =
                  getValue(
                    p,
                    'drivePath',
                    'drivepath',
                    'path'
                  )

                return (

                  <tr
                    key={rowId}
                    className={`
                      group
                      border-b
                      transition-colors
                      duration-150
                      ${
                        isDark
                          ? `
                            border-white/[0.045]
                            hover:bg-white/[0.025]
                          `
                          : `
                            border-slate-100
                            hover:bg-slate-50/70
                          `
                      }
                    `}
                  >

                    {/* NUMBER */}

                    <td
                      className={`
                        px-4
                        py-3
                        text-[11px]
                        ${
                          isDark
                            ? 'text-slate-600'
                            : 'text-slate-400'
                        }
                      `}
                    >
                      {i + 1}
                    </td>

                    {/* BRANCH */}

                    <td
                      className={`
                        px-4
                        py-3
                        text-[12px]
                        font-medium
                        ${
                          isDark
                            ? 'text-slate-300'
                            : 'text-slate-700'
                        }
                      `}
                    >
                      {branch || 'N/A'}
                    </td>

                    {/* DEVICE */}

                    <td
                      className={`
                        px-4
                        py-3
                        text-[11px]
                        font-mono
                        ${
                          isDark
                            ? 'text-slate-400'
                            : 'text-slate-500'
                        }
                      `}
                    >
                      {device || 'N/A'}
                    </td>

                    {/* FUNCTION */}

                    <td
                      className="
                        px-4
                        py-3
                      "
                    >
                      <FunctionBadge
                        value={
                          func || 'N/A'
                        }
                      />
                    </td>

                    {/* DRIVE PATH */}

                    <td
                      className={`
                        px-4
                        py-3
                        text-[11px]
                        font-mono
                        ${
                          isDark
                            ? 'text-slate-400'
                            : 'text-slate-500'
                        }
                      `}
                    >

                      <div className="flex items-center gap-2">

                        <div
                          className="
                            w-6
                            h-6
                            rounded-md
                            flex
                            items-center
                            justify-center
                            bg-[#7094ff]/10
                            border
                            border-[#7094ff]/15
                          "
                        >
                          <Folder
                            size={11}
                            className="text-[#7094ff]"
                          />
                        </div>

                        <span className="truncate max-w-[280px]">
                          {drivePath ||
                            getValue(
                              p,
                              'mode',
                              'modeOfAccess',
                              'mode_access'
                            ) ||
                            'N/A'}
                        </span>

                      </div>

                    </td>

                    {/* DELETE */}

                    <td
                      className="
                        px-4
                        py-3
                        text-right
                      "
                    >

                      <button
                        type="button"
                        onClick={() =>
                          onDelete(rowId)
                        }
                        title="Delete Policy"
                        className="
                          w-7
                          h-7
                          rounded-lg
                          flex
                          items-center
                          justify-center
                          ml-auto
                          text-slate-500
                          hover:text-rose-400
                          hover:bg-rose-500/10
                          transition-all
                          duration-150
                          opacity-70
                          group-hover:opacity-100
                        "
                      >
                        <Trash2
                          size={13}
                        />
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

function TabBar({
  active,
  onChange,
}) {
  const { isDark } = useTheme()

  const tabs = [
    {
      id: 'add',
      label: 'Add Policy',
      icon: Plus,
    },
    {
      id: 'view',
      label: 'View Policies',
      icon: Eye,
    },
  ]

  return (
    <div
      className="
        inline-flex items-center
        gap-1.5 rounded-2xl
        p-1.5 mb-6 border
      "
      style={{
        background: isDark
          ? '#171827'
          : 'rgba(255,255,255,0.60)',

        backdropFilter:
          'blur(20px)',

        WebkitBackdropFilter:
          'blur(20px)',

        borderColor: isDark
          ? 'rgba(255,255,255,0.07)'
          : 'rgba(203,213,225,0.70)',

        boxShadow: isDark
          ? '0 4px 16px rgba(0,0,0,0.40)'
          : '0 4px 16px rgba(148,163,184,0.15)',
      }}
    >
      {tabs.map((t) => {
        const Icon = t.icon

        const isActive =
          active === t.id

        return (
          <GlassButton
            key={t.id}
            onClick={() =>
              onChange(t.id)
            }
            variant={
              isActive
                ? 'tab_active'
                : 'tab_inactive'
            }
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

export default function DriveControl() {
  const { isDark } = useTheme()

  const [tab, setTab] =
    useState('add')

  const [policies, setPolicies] =
    useState([])

  const [branches, setBranches] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  /* ─────────────────────────────────────────
     CREATE FRONTEND UNIQUE ID
  ───────────────────────────────────────── */

  const createPolicyId = (
    policy,
    index
  ) => {
    if (
      policy?.id !== undefined &&
      policy?.id !== null
    ) {
      return policy.id
    }

    if (
      policy?.policyId !== undefined &&
      policy?.policyId !== null
    ) {
      return policy.policyId
    }

    if (
      policy?.srNo !== undefined &&
      policy?.srNo !== null
    ) {
      return policy.srNo
    }

    if (
      policy?.sr_no !== undefined &&
      policy?.sr_no !== null
    ) {
      return policy.sr_no
    }

    return [
      policy?.branch ??
        policy?.branchName ??
        'branch',

      policy?.ipAddress ??
        policy?.ipaddress ??
        'ip',

      policy?.device ??
        policy?.deviceName ??
        policy?.computerName ??
        'device',

      policy?.function ??
        policy?.functions ??
        'function',

      policy?.drivePath ??
        policy?.drivepath ??
        'path',

      index,
    ].join('-')
  }

  /* ─────────────────────────────────────────
     ADD LOCAL POLICY
  ───────────────────────────────────────── */

  const handleAdd = ({
    branch,
    branchName,
    device,
    function: func,
    drivePath,
  }) => {
    const newPolicy = {
      id: `local-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`,

      branch:
        branch ||
        branchName ||
        '',

      device:
        device || '',

      function:
        func || '',

      drivePath:
        drivePath || '',

      addedOn:
        new Date()
          .toISOString()
          .slice(0, 10),
    }

    setPolicies((prev) => [
      ...prev,
      newPolicy,
    ])
  }

  /* ─────────────────────────────────────────
     LOAD PAGE DATA
  ───────────────────────────────────────── */

  const loadPageData = async () => {
    try {
      setLoading(true)
      setError('')

      const [
        ALLBranch,
        DrivePolicies,
      ] = await Promise.all([
        dashboardService.getBranch(),
        dashboardService.getDrivePolicies(),
      ])

      console.log(
        'Branches:',
        ALLBranch?.data
      )

      console.log(
        'Drive Policies:',
        DrivePolicies?.data
      )

      /* Branches */
      const branchData =
        Array.isArray(
          ALLBranch?.data
        )
          ? ALLBranch.data
          : []

      setBranches(branchData)

      /* Policies */
      const policyData =
        Array.isArray(
          DrivePolicies?.data
        )
          ? DrivePolicies.data
          : []

      /*
       * IMPORTANT FIX:
       *
       * Add a unique frontend id
       * if API does not return one.
       */
      const normalizedPolicies =
        policyData.map(
          (policy, index) => ({
            ...policy,

            id: createPolicyId(
              policy,
              index
            ),
          })
        )

      setPolicies(
        normalizedPolicies
      )
    } catch (err) {
      console.error(
        'Error loading drive protection data:',
        err
      )

      setError(
        'Unable to load drive policy data.'
      )

      setPolicies([])
      setBranches([])
    } finally {
      setLoading(false)
    }
  }

  /* ─────────────────────────────────────────
     INITIAL LOAD
  ───────────────────────────────────────── */

  useEffect(() => {
    loadPageData()
  }, [])

  /* ─────────────────────────────────────────
     DELETE
  ───────────────────────────────────────── */

  const handleDelete = (id) => {
    setPolicies((prev) =>
      prev.filter(
        (policy) => policy.id !== id
      )
    )
  }

  return (
    <div className="w-full">
      <br />

      {/* Page Header */}
      <div className="flex items-start justify-between mb-7">

        <div className="flex items-center gap-3">

          <div
            className="
              w-10 h-10 rounded-2xl
              flex items-center
              justify-center
            "
            style={{
              background:
                'rgba(112,148,255,0.15)',

              border:
                '1px solid rgba(112,148,255,0.25)',

              backdropFilter:
                'blur(12px)',

              WebkitBackdropFilter:
                'blur(12px)',
            }}
          >
            <Printer
              size={18}
              className="text-[#7094ff]"
            />
          </div>

          <div>
            <h2
              className={`
                font-display font-bold
                text-lg leading-tight
                ${
                  isDark
                    ? 'text-slate-100'
                    : 'text-slate-800'
                }
              `}
            >
              Drive Control
            </h2>

            <p
              className={`
                text-[11px] mt-0.5
                ${
                  isDark
                    ? 'text-slate-500'
                    : 'text-slate-400'
                }
              `}
            >
              Manage drive access policies
              across endpoints
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="hidden sm:flex items-center gap-2">

          <GlassButton
            variant="chip_allow"
            className="
              px-3 py-1.5
              text-[11px]
              font-semibold
              cursor-default
            "
          >
            {policies.length}{' '}
            Policies
          </GlassButton>

          <GlassButton
            variant="chip_prevent"
            className="
              px-3 py-1.5
              text-[11px]
              font-semibold
              cursor-default
            "
          >
            {
              policies.filter(
                (p) =>
                  p.drivePath ||
                  p.drivepath ||
                  p.path
              ).length
            }{' '}
            Active
          </GlassButton>

        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="
            mb-5 rounded-xl
            border border-rose-500/20
            bg-rose-500/10
            px-4 py-3
            text-[12px]
            text-rose-400
          "
        >
          {error}
        </div>
      )}

      {/* Tabs */}
      <TabBar
        active={tab}
        onChange={setTab}
      />

      {/* Loading */}
      {loading ? (
        <GlassCard className="p-10">
          <div className="flex flex-col items-center justify-center gap-3">

            <div
              className="
                w-8 h-8
                border-2
                border-[#7094ff]/20
                border-t-[#7094ff]
                rounded-full
                animate-spin
              "
            />

            <p
              className={`
                text-[12px]
                ${
                  isDark
                    ? 'text-slate-500'
                    : 'text-slate-400'
                }
              `}
            >
              Loading drive policies...
            </p>
          </div>
        </GlassCard>
      ) : (
        <>
          {/* Add Policy */}
          {tab === 'add' && (
            <AddForm
              branches={branches}
              onAdd={(policy) => {
                handleAdd(policy)
                setTab('view')
              }}
            />
          )}

          {/* View Policies */}
          {tab === 'view' && (
            <PolicyTable
              policies={policies}
              onDelete={handleDelete}
            />
          )}
        </>
      )}
    </div>
  )
}