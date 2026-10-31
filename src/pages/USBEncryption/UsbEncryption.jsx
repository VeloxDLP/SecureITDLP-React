import React, { useState, useRef, useEffect } from "react";
import {
  Lock,
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
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";
import { alert as showAlert } from "../../components/ui/AlertModal";
import { dashboardService } from "../../services/dashboardService";

/* =========================================================
   STATIC POLICIES - VIEW ONLY
========================================================= */

const STATIC_USB_POLICIES = [
  {
    id: "static-1",
    branchName: "Mumbai",
    ipAddress: "192.168.1.101",
    deviceName: "DESKTOP-001",
    encryption: "Enable",
  },
  {
    id: "static-2",
    branchName: "Delhi",
    ipAddress: "192.168.1.102",
    deviceName: "DESKTOP-002",
    encryption: "Disable",
  },
  {
    id: "static-3",
    branchName: "Pune",
    ipAddress: "192.168.1.103",
    deviceName: "DESKTOP-003",
    encryption: "Enable",
  },

    {
    id: "static-3",
    branchName: "Pune",
    ipAddress: "192.168.1.103",
    deviceName: "DESKTOP-003",
    encryption: "Enable",
  },

    {
    id: "static-3",
    branchName: "Pune",
    ipAddress: "192.168.1.103",
    deviceName: "DESKTOP-003",
    encryption: "Enable",
  },

    {
    id: "static-3",
    branchName: "Pune",
    ipAddress: "192.168.1.103",
    deviceName: "DESKTOP-003",
    encryption: "Enable",
  },

    {
    id: "static-3",
    branchName: "Pune",
    ipAddress: "192.168.1.103",
    deviceName: "DESKTOP-003",
    encryption: "Enable",
  },

  
];

/* =========================================================
   STATUS PILL
========================================================= */

function StatusPill({ status }) {
  if (!status) return null;

  const lower = String(status).toLowerCase();

  const styles =
    lower === "up"
      ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/[0.08]"
      : lower === "down"
      ? "text-rose-400 border-rose-500/40 bg-rose-500/[0.08]"
      : "text-slate-400 border-slate-500/40 bg-slate-500/[0.08]";

  return (
    <span className={`shrink-0 px-2 py-[1px] rounded-md text-[10px] font-bold uppercase tracking-wide border ${styles}`}>
      {status}
    </span>
  );
}

/* =========================================================
   MULTI SELECT DROPDOWN
========================================================= */

function MultiSelectDropdown({
  values = [],
  onChange,
  options = [],
  placeholder = "Select...",
  disabled = false,
  isDark = false,
  searchable = false,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () =>
      document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const normalizedOptions = options
    .map((item) => {
      if (typeof item === "string") {
        return { value: item, label: item, status: null };
      }

      const value =
        item?.value ??
        item?.deviceName ??
        item?.device ??
        item?.pcName ??
        item?.computerName ??
        item?.name ??
        "";

      return {
        value,
        label: item?.label ?? value,
        status: item?.agentStatus ?? item?.status ?? null,
      };
    })
    .filter((item) => item.value !== "");

  const filteredOptions =
    searchable && query
      ? normalizedOptions.filter((o) =>
          String(o.label).toLowerCase().includes(query.toLowerCase())
        )
      : normalizedOptions;

  const allSelected =
    normalizedOptions.length > 0 &&
    normalizedOptions.every((item) => values.includes(item.value));

  const toggleDevice = (deviceValue) => {
    if (values.includes(deviceValue)) {
      onChange(values.filter((value) => value !== deviceValue));
    } else {
      onChange([...values, deviceValue]);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={`w-full min-h-[42px] flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] text-left border transition-all disabled:opacity-40 disabled:cursor-not-allowed
          ${isDark ? "bg-[#111827] border-[#334155] text-slate-200" : "bg-white border-slate-300 text-slate-800"}
          ${open ? "ring-2 ring-[#7094ff]/20 border-[#7094ff]/60" : ""}`}
      >
        <span className={values.length ? "" : "text-slate-400"}>
          {values.length
            ? `${values.length} device${values.length !== 1 ? "s" : ""} selected`
            : placeholder}
        </span>

        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className={`absolute top-full left-0 right-0 mt-1.5 z-[200] rounded-xl border overflow-hidden shadow-xl ${
          isDark ? "bg-[#111827] border-[#334155]" : "bg-white border-slate-200"
        }`}>
          {searchable && (
            <div className="px-3 py-2 border-b border-slate-500/10">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search devices..."
                className="w-full px-2 py-1.5 text-xs rounded-lg outline-none bg-transparent"
              />
            </div>
          )}

          <div className="px-3 py-2 border-b border-slate-500/10">
            <button
              type="button"
              onClick={() =>
                onChange(
                  allSelected
                    ? []
                    : normalizedOptions.map((item) => item.value)
                )
              }
              className="text-xs"
            >
              {allSelected ? "Deselect all" : "Select all"}
            </button>
          </div>

          <div className="max-h-52 overflow-y-auto py-1">
            {filteredOptions.length === 0 ? (
              <p className="px-4 py-3 text-xs text-center">No results</p>
            ) : (
              filteredOptions.map((option, index) => {
                const selected = values.includes(option.value);

                return (
                  <button
                    key={`${option.value}-${index}`}
                    type="button"
                    onClick={() => toggleDevice(option.value)}
                    className={`w-full text-left px-4 py-2.5 text-[13px] flex items-center justify-between gap-2 ${
                      selected
                        ? "text-[#7094ff] bg-[#7094ff]/10"
                        : isDark
                        ? "text-slate-300 hover:bg-white/[0.06]"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{option.label}</span>

                    <span className="flex items-center gap-2">
                      {option.status && (
                        <StatusPill status={option.status} />
                      )}
                      {selected && <Check size={13} />}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SINGLE DROPDOWN
========================================================= */

function Dropdown({
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  disabled = false,
  searchable = false,
  error = false,
}) {
  const { isDark } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  const normalized = options.map((o) =>
    typeof o === "string"
      ? { value: o, label: o }
      : { ...o }
  );

  const filtered =
    searchable && query
      ? normalized.filter((o) =>
          String(o.label).toLowerCase().includes(query.toLowerCase())
        )
      : normalized;

  const selected = normalized.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setOpen(false);
        setQuery("");
      }
    };

    if (open) document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-[13px] text-left border outline-none disabled:opacity-40 disabled:cursor-not-allowed ${
          isDark
            ? "text-slate-200 bg-[#111827]"
            : "text-slate-800 bg-white"
        } ${
          error
            ? "border-rose-500/60"
            : isDark
            ? "border-white/[0.10]"
            : "border-slate-300"
        }`}
      >
        <span className="truncate">
          {selected ? selected.label : placeholder}
        </span>

        <ChevronDown
          size={12}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className={`absolute top-full left-0 right-0 mt-1.5 z-[200] rounded-xl border overflow-hidden shadow-xl ${
          isDark ? "bg-[#111827] border-white/10" : "bg-white border-slate-200"
        }`}>
          {searchable && (
            <div className="p-2">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full px-2 py-1.5 text-xs outline-none bg-transparent"
              />
            </div>
          )}

          <div className="max-h-52 overflow-y-auto py-1">
            {filtered.map((option, index) => (
              <button
                key={`${option.value}-${index}`}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                  setQuery("");
                }}
                className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-[#7094ff]/10 ${
                  option.value === value ? "text-[#7094ff]" : ""
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   GLASS BUTTON & CARD
========================================================= */

function GlassButton({
  children,
  onClick,
  variant = "default",
  className = "",
  disabled = false,
  type = "button",
}) {
  const { isDark } = useTheme();

  const variants = {
    default: {
      className: isDark
        ? "text-slate-300 hover:text-white border-white/[0.10]"
        : "text-slate-600 hover:text-slate-900 border-slate-300/70",
      style: {
        background: isDark
          ? "rgba(255,255,255,0.06)"
          : "rgba(255,255,255,0.65)",
      },
    },
    primary: {
      className: "text-white border-[#7094ff]/40",
      style: {
        background: "rgba(112,148,255,0.85)",
        boxShadow: "0 4px 20px rgba(112,148,255,0.35)",
      },
    },
    tab_active: {
      className: "text-white border-[#7094ff]/40",
      style: { background: "rgba(112,148,255,0.82)" },
    },
    tab_inactive: {
      className: isDark
        ? "text-slate-400 border-transparent"
        : "text-slate-500 border-transparent",
      style: { background: "transparent" },
    },
  };

  const v = variants[variant] || variants.default;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl border text-[13px] font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${v.className} ${className}`}
      style={v.style}
    >
      {children}
    </button>
  );
}

function GlassCard({ children, className = "" }) {
  const { isDark } = useTheme();

  return (
    <div
      className={`rounded-2xl border ${className}`}
      style={{
        background: isDark ? "#020617" : "rgba(255,255,255,0.95)",
        borderColor: isDark ? "rgba(255,255,255,0.07)" : "#e2e8f0",
        boxShadow: isDark
          ? "0 4px 24px rgba(0,0,0,0.5)"
          : "0 2px 16px rgba(0,0,0,0.08)",
      }}
    >
      {children}
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function Badge({ mode }) {
  const normalMode = String(mode || "").toLowerCase();

  const base =
    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border";

  if (normalMode === "enable" || normalMode === "enabled") {
    return (
      <span className={`${base} bg-emerald-500/10 text-emerald-500 border-emerald-500/20`}>
        <Check size={10} /> Enabled
      </span>
    );
  }

  return (
    <span className={`${base} bg-rose-500/10 text-rose-500 border-rose-500/20`}>
      <AlertTriangle size={10} /> Disabled
    </span>
  );
}

/* =========================================================
   ADD POLICY FORM
   - "Enable"  → branch + ≥1 device + password required → Submit ENABLED
   - "Disable" → Submit DISABLED
========================================================= */

function AddForm({ branches, onAdd }) {
  const { isDark } = useTheme();

  const [form, setForm] = useState({
    encryption: "",
    branch: "",
    password: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [fetchedDevices, setFetchedDevices] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);

  const isEnabled = form.encryption === "Enable";

  const branchOptions = (branches || [])
    .map((b) => {
      if (typeof b === "string" || typeof b === "number") {
        return { value: String(b), label: String(b) };
      }
      const value = b.branchName || b.name || b.branch || "";
      return { value, label: value };
    })
    .filter((b) => b.value);

  const deviceOptions = (fetchedDevices || [])
    .map((d) => {
      if (typeof d === "string" || typeof d === "number") {
        return { value: String(d), label: String(d) };
      }
      const value =
        d.ipAddress ||
        d.deviceName ||
        d.hostName ||
        d.device ||
        d.pcName ||
        d.computerName ||
        "";
      return {
        value,
        label: value,
        status: d.agentStatus ?? d.status ?? null,
      };
    })
    .filter((d) => d.value);

  const encryptionOptions = [
    { value: "Enable", label: "Enable" },
    { value: "Disable", label: "Disable" },
  ];

  /* ---------------------------------------------------------
     VALIDATION
     - "Enable"  → branch + ≥1 device + password → Submit ENABLED
     - "Disable" → never valid → Submit DISABLED
     - ""        → invalid
  --------------------------------------------------------- */
  const isValid =
    isEnabled &&
    !!form.branch &&
    selectedDevices.length > 0 &&
    form.password.trim() !== "";

  const handleEncryptionChange = (val) => {
    if (val === "Disable") {
      setForm({ encryption: val, branch: "", password: "" });
      setSelectedDevices([]);
      setFetchedDevices([]);
      setSubmitted(false);
    } else {
      setForm((prev) => ({ ...prev, encryption: val }));
    }
  };

  const handleBranchChange = async (branch) => {
    if (!isEnabled) return;

    setForm((prev) => ({ ...prev, branch }));
    setSelectedDevices([]);
    setFetchedDevices([]);

    try {
      const res = await dashboardService.getDevicesByBranch(branch);
      setFetchedDevices(res.data || []);
    } catch (error) {
      console.error("Device fetch failed:", error);
      setFetchedDevices([]);
    }
  };

  const handleReset = () => {
    setForm({ encryption: "", branch: "", password: "" });
    setSelectedDevices([]);
    setFetchedDevices([]);
    setSubmitted(false);
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    if (!isValid) return;

    const payload = {
      branch: form.branch,
      devices: isEnabled ? selectedDevices : [],
      encryption: form.encryption,
      password: isEnabled ? form.password : "",
    };

    try {
      await dashboardService.addUSBEncryptionPolicy?.(payload);

      if (onAdd) {
        await onAdd();
      }

      handleReset();
    } catch (err) {
      await showAlert({
        icon: "error",
        title: "Policy Failed",
        text: err?.response?.data?.message || "Error sending policy",
        confirmButtonText: "Cancel",
      });
    }
  };

  const labelCls = `block text-[11px] font-semibold uppercase tracking-wider mb-1.5 ${
    isDark ? "text-slate-500" : "text-slate-400"
  }`;

  const dim = !isEnabled ? "opacity-40 pointer-events-none select-none" : "";

  return (
    <GlassCard className="p-6 mb-5">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">

        {/* 1. USB ENCRYPTION */}
        <div>
          <label className={labelCls}>
            USB Encryption <span className="text-rose-500">*</span>
          </label>

          <Dropdown
            value={form.encryption}
            onChange={handleEncryptionChange}
            options={encryptionOptions}
            placeholder="Select Action"
            error={submitted && !form.encryption}
          />

          {submitted && !form.encryption && (
            <p className="text-[10px] text-rose-500 mt-1">Required</p>
          )}
        </div>

        {/* 2. BRANCH */}
        <div className={dim}>
          <label className={labelCls}>
            Branch Name <span className="text-rose-500">*</span>
          </label>

          <Dropdown
            value={form.branch}
            onChange={handleBranchChange}
            options={branchOptions}
            placeholder={isEnabled ? "Select Branch" : "Enable first"}
            searchable
            disabled={!isEnabled}
            error={submitted && isEnabled && !form.branch}
          />

          {submitted && isEnabled && !form.branch && (
            <p className="text-[10px] text-rose-500 mt-1">Required</p>
          )}
        </div>

        {/* 3. DEVICE */}
        <div className={dim}>
          <label className={labelCls}>
            Device Name <span className="text-rose-500">*</span>
          </label>

          <MultiSelectDropdown
            values={selectedDevices}
            onChange={setSelectedDevices}
            options={deviceOptions}
            placeholder={
              !isEnabled
                ? "Enable first"
                : form.branch
                ? "Select Device"
                : "Select branch first"
            }
            disabled={!isEnabled || !form.branch}
            isDark={isDark}
            searchable
          />

          {submitted && isEnabled && selectedDevices.length === 0 && (
            <p className="text-[10px] text-rose-500 mt-1">Required</p>
          )}
        </div>

        {/* 4. PASSWORD */}
        <div className={dim}>
          <label className={labelCls}>
            Password <span className="text-rose-500">*</span>
          </label>

          <div
            className={`relative flex items-center border rounded-xl px-3 transition-all ${
              submitted && isEnabled && !form.password.trim()
                ? "border-rose-500/60"
                : isDark
                ? "border-white/[0.10] bg-[#111827]"
                : "border-slate-300/70 bg-white"
            }`}
          >
            <Lock
              size={14}
              className={isDark ? "text-slate-500" : "text-slate-400"}
            />

            <input
              type="password"
              value={form.password}
              disabled={!isEnabled}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              placeholder={isEnabled ? "Enter password" : "Enable first"}                                                                                  
              className={`w-full bg-transparent px-2 py-2.5 text-[13px] outline-none disabled:cursor-not-allowed ${
                isDark
                  ? "text-slate-200 placeholder-slate-600"
                  : "text-slate-800 placeholder-slate-400"
              }`}
            />
          </div>

          {submitted && isEnabled && !form.password.trim() && (
            <p className="text-[10px] text-rose-500 mt-1">
              Password is required
            </p>
          )}
        </div>

      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center justify-end gap-3">
        <GlassButton
          onClick={handleReset}
          variant="default"
          className="px-4 py-2"
          disabled={!form.encryption}
        >
          <RotateCcw size={13} />
          Reset
        </GlassButton>

        <GlassButton
          onClick={handleSubmit}
          disabled={!isValid}
          variant="primary"
          className="px-5 py-2 font-semibold"
        >
          <Plus size={13} />
          Submit
        </GlassButton>
      </div>
    </GlassCard>
  );
}

/* =========================================================
   POLICY TABLE - PASSWORD NOT DISPLAYED
========================================================= */

function PolicyTable({ policies, onDelete }) {
  const { isDark } = useTheme();
  const [search, setSearch] = useState("");

  const safePolicies = Array.isArray(policies) ? policies : [];

  const filtered = safePolicies.filter((p) => {
    const q = search.toLowerCase();

    const branch = String(p.branchName || "");
    const ip = String(p.ipAddress || "");
    const device = String(p.deviceName || "");
    const enc = String(p.encryption || p.modeAccess || "");

    return (
      !q ||
      branch.toLowerCase().includes(q) ||
      ip.toLowerCase().includes(q) ||
      device.toLowerCase().includes(q) ||
      enc.toLowerCase().includes(q)
    );
  });

  const thCls = `text-left text-[10px] font-semibold uppercase tracking-wider px-3 py-3 whitespace-nowrap sticky top-0 z-20 ${
    isDark
      ? "text-slate-500 border-b border-white/[0.07]"
      : "text-slate-400 border-b border-slate-100"
  }`;

  const tdCls = `px-3 py-3 text-[11px] whitespace-nowrap ${
    isDark ? "text-slate-300" : "text-slate-700"
  }`;

  return (
    <GlassCard className="overflow-hidden">

      <div className={`flex items-center justify-between gap-3 px-5 py-3 border-b ${
        isDark ? "border-white/[0.06]" : "border-slate-100"
      }`}>
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-[#7094ff]" />

          <span className={`text-[13px] font-semibold ${
            isDark ? "text-slate-200" : "text-slate-700"
          }`}>
            USB Encryption Policies
          </span>

          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#7094ff]/15 text-[#7094ff]">
            {filtered.length}
          </span>
        </div>

        <div className={`relative flex items-center rounded-lg border text-[11px] ${
          isDark ? "border-white/[0.08]" : "border-slate-200/80"
        }`}>
          <Search size={12} className="absolute left-2.5 text-slate-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className={`bg-transparent pl-7 pr-2.5 py-1.5 outline-none w-36 text-[11px] ${
              isDark
                ? "text-slate-300 placeholder-slate-600"
                : "text-slate-700 placeholder-slate-400"
            }`}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={`py-12 text-center text-[12px] ${
          isDark ? "text-slate-600" : "text-slate-400"
        }`}>
          No USB Encryption policies found.
        </div>
      ) : (
        <div className="w-full overflow-x-auto overflow-y-auto max-h-[440px]">
          <table className="w-full min-w-[900px] table-fixed">

            <thead>
              <tr>
                <th className={`${thCls} w-[8%]`}>SR NO</th>
                <th className={`${thCls} w-[20%]`}>BRANCH</th>
                <th className={`${thCls} w-[22%]`}>IP ADDRESS</th>
                <th className={`${thCls} w-[20%]`}>DEVICE</th>
                <th className={`${thCls} w-[15%]`}>ENCRYPTION</th>
                <th className={`${thCls} w-[15%] text-right`}>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((p, i) => (
                <tr
                  key={p.id || `${p.ipAddress}-${i}`}
                  className={`border-b last:border-b-0 transition-colors duration-150 ${
                    isDark
                      ? "border-white/[0.045] hover:bg-white/[0.025]"
                      : "border-slate-100 hover:bg-slate-50/60"
                  }`}
                >
                  <td className={tdCls}>{i + 1}</td>

                  <td className={tdCls}>
                    {p.branchName || "N/A"}
                  </td>

                  <td className={`${tdCls} font-mono text-[10px]`}>
                    {p.ipAddress || "N/A"}
                  </td>

                  <td className={tdCls}>
                    {p.deviceName || "N/A"}
                  </td>

                  <td className={tdCls}>
                    <Badge mode={p.encryption || p.modeAccess} />
                  </td>

                  <td className={`${tdCls} text-right`}>
                    <button
                      type="button"
                      onClick={() => onDelete(p)}
                      className="w-6 h-6 rounded-md flex items-center justify-center ml-auto text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </GlassCard>
  );
}

/* =========================================================
   TAB BAR
========================================================= */

function TabBar({ active, onChange }) {
  const { isDark } = useTheme();

  const tabs = [
    { id: "add", label: "Add Policy", icon: Plus },
    { id: "view", label: "View Policies", icon: Eye },
  ];

  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-2xl p-1.5 mb-6 border"
      style={{
        background: isDark ? "#020617" : "rgba(255,255,255,0.60)",
        borderColor: isDark
          ? "rgba(255,255,255,0.07)"
          : "rgba(203,213,225,0.70)",
      }}
    >
      {tabs.map((t) => {
        const Icon = t.icon;

        return (
          <GlassButton
            key={t.id}
            onClick={() => onChange(t.id)}
            variant={active === t.id ? "tab_active" : "tab_inactive"}
            className="px-5 py-2.5 font-semibold"
          >
            <Icon size={14} />
            {t.label}
          </GlassButton>
        );
      })}
    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function UsbEncryption() {
  const { isDark } = useTheme();

  const [tab, setTab] = useState("add");
  const [policies, setPolicies] = useState([]);
  const [branches, setBranches] = useState([]);

  const loadPageData = async () => {
    try {
      const [ALLBranch, USBEncryptionPolicies] = await Promise.all([
        dashboardService.getBranch(),
        dashboardService.getUSBEncryptionPolicies?.() ||
          Promise.resolve({ data: [] }),
      ]);

      setBranches(ALLBranch.data || []);

      const apiPolicies = Array.isArray(USBEncryptionPolicies.data)
        ? USBEncryptionPolicies.data
        : [];

      setPolicies([
        ...STATIC_USB_POLICIES,
        ...apiPolicies,
      ]);

    } catch (error) {
      console.error("Error loading USB encryption data:", error);

      setPolicies(STATIC_USB_POLICIES);
      setBranches([]);
    }
  };

  useEffect(() => {
    loadPageData();
  }, []);

  const handleDelete = (policy) => {
    setPolicies((prev) => prev.filter((p) => p !== policy));
  };

  const handleAdd = async () => {
    await loadPageData();
    setTab("view");
  };

  return (
    <div className="w-full">
      <br />

      <div className="flex items-start justify-between mb-7">
        <div className="flex items-center gap-3">

          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(112,148,255,0.15)",
              border: "1px solid rgba(112,148,255,0.25)",
              backdropFilter: "blur(12px)",
            }}
          >
            <Lock size={18} className="text-[#7094ff]" />
          </div>

          <div>
            <h2 className={`font-display font-bold text-lg leading-tight ${
              isDark ? "text-slate-100" : "text-slate-800"
            }`}>
              USB Encryption
            </h2>

            <p className={`text-[11px] mt-0.5 ${
              isDark ? "text-slate-500" : "text-slate-400"
            }`}>
              Manage USB encryption policies across endpoints
            </p>
          </div>

        </div>
      </div>

      <TabBar active={tab} onChange={setTab} />

      {tab === "add" && (
        <AddForm
          branches={branches}
          onAdd={handleAdd}
        />
      )}

      {tab === "view" && (
        <PolicyTable
          policies={policies}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}