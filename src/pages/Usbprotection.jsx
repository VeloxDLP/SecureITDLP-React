import React, { useState, useRef, useEffect } from "react";
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
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";
import { alert as showAlert } from "../components/ui/AlertModal";
import { dashboardService } from "../services/dashboardService";

/* =========================================================
   CUSTOM DROPDOWN
========================================================= */

function Dropdown({
  value,
  onChange,
  options = [],
  placeholder = "Select…",
  disabled = false,
  searchable = false,
  error = false,
}) {
  const { isDark } = useTheme();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  const normalised = options.map((o) =>
    typeof o === "string"
      ? { value: o, label: o }
      : o
  );

  const filtered =
    searchable && query
      ? normalised.filter((o) =>
          String(o.label)
            .toLowerCase()
            .includes(query.toLowerCase())
        )
      : normalised;

  const selected = normalised.find(
    (o) => o.value === value
  );

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

    if (open) {
      document.addEventListener("mousedown", handler);
    }

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [open]);

  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
    setQuery("");
  };

  const triggerBorder = error
    ? "border-rose-500/60"
    : open
    ? "border-[#7094ff]/60"
    : isDark
    ? "border-white/[0.10]"
    : "border-slate-300/70";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() =>
          !disabled && setOpen(!open)
        }
        className={`
          w-full flex items-center justify-between gap-2
          px-3 py-2.5 rounded-xl text-[13px] text-left
          border transition-all duration-200 outline-none
          disabled:opacity-40 disabled:cursor-not-allowed
          ${triggerBorder}
          ${open ? "ring-2 ring-[#7094ff]/20" : ""}
          ${
            isDark
              ? "text-slate-200 bg-[#2a2a2a]"
              : "text-slate-800 bg-white"
          }
        `}
      >
        <span
          className={
            selected
              ? ""
              : isDark
              ? "text-slate-500"
              : "text-slate-400"
          }
        >
          {selected
            ? selected.label
            : placeholder}
        </span>

        <ChevronDown
          size={10}
          className={`
            flex-shrink-0 transition-transform duration-200
            ${open ? "rotate-180" : ""}
            ${
              isDark
                ? "text-slate-500"
                : "text-slate-400"
            }
          `}
        />
      </button>

      {open && (
        <div
          className={`
            absolute top-full left-0 right-0 mt-1.5 z-[200]
            rounded-xl border overflow-hidden
            shadow-[0_16px_48px_rgba(0,0,0,0.35)]
            ${
              isDark
                ? "border-white/[0.10]"
                : "border-slate-200/80"
            }
          `}
          style={{
            background: isDark
              ? "#2a2a2a"
              : "rgba(255,255,255,0.98)",
            backdropFilter:
              "blur(32px) saturate(180%)",
            WebkitBackdropFilter:
              "blur(32px) saturate(180%)",
          }}
        >
          {searchable && (
            <div
              className={`
                px-3 py-2 border-b
                ${
                  isDark
                    ? "border-white/[0.07]"
                    : "border-slate-100"
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
                        ? "text-slate-500"
                        : "text-slate-400"
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
                    text-[12px] rounded-lg outline-none
                    border transition-all duration-150
                    ${
                      isDark
                        ? "bg-[#2a2a2a] border-white/[0.08] text-[#d0d0d0] placeholder-[#555]"
                        : "bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400"
                    }
                  `}
                />

                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-2 text-slate-400"
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
                      ? "text-slate-600"
                      : "text-slate-400"
                  }
                `}
              >
                No results
              </p>
            ) : (
              filtered.map((o, index) => {
                const isSelected =
                  o.value === value;

                return (
                  <button
                    key={`${o.value}-${index}`}
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
                          ? "text-[#7094ff] bg-[#7094ff]/10"
                          : isDark
                          ? "text-[#888] hover:bg-white/[0.06] hover:text-[#e0e0e0]"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      }
                    `}
                  >
                    {o.label}

                    {isSelected && (
                      <Check
                        size={13}
                        className="text-[#7094ff]"
                      />
                    )}
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
   GLASS BUTTON
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
        ? "text-slate-300 hover:text-white border-white/[0.10] hover:border-white/[0.20]"
        : "text-slate-600 hover:text-slate-900 border-slate-300/70",
      style: {
        background: isDark
          ? "rgba(255,255,255,0.06)"
          : "rgba(255,255,255,0.65)",
        backdropFilter: "blur(16px)",
      },
    },

    primary: {
      className:
        "text-white border-[#7094ff]/40 hover:border-[#7094ff]/60",
      style: {
        background: "rgba(112,148,255,0.85)",
        backdropFilter: "blur(16px)",
        boxShadow:
          "0 4px 20px rgba(112,148,255,0.35)",
      },
    },

    success: {
      className:
        "text-white border-emerald-500/40",
      style: {
        background:
          "rgba(16,185,129,0.85)",
        backdropFilter: "blur(16px)",
      },
    },

    tab_active: {
      className:
        "text-white border-[#7094ff]/40",
      style: {
        background:
          "rgba(112,148,255,0.82)",
        backdropFilter: "blur(20px)",
        boxShadow:
          "0 6px 24px rgba(112,148,255,0.35)",
      },
    },

    tab_inactive: {
      className: isDark
        ? "text-slate-400 hover:text-slate-100 border-transparent"
        : "text-slate-500 hover:text-slate-800 border-transparent",
      style: {
        background: "transparent",
      },
    },

    chip_allow: {
      className: isDark
        ? "text-emerald-400 border-emerald-500/25"
        : "text-emerald-600 border-emerald-300/60",
      style: {
        background: isDark
          ? "rgba(16,185,129,0.12)"
          : "rgba(255,255,255,0.72)",
      },
    },

    chip_prevent: {
      className: isDark
        ? "text-rose-400 border-rose-500/25"
        : "text-rose-600 border-rose-300/60",
      style: {
        background: isDark
          ? "rgba(239,68,68,0.12)"
          : "rgba(255,255,255,0.72)",
      },
    },
  };

  const v =
    variants[variant] || variants.default;

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
  );
}

/* =========================================================
   BADGE
========================================================= */

function Badge({ mode }) {
  const normalMode =
    String(mode || "").toLowerCase();

  const base =
    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border";

  if (normalMode === "allow") {
    return (
      <span
        className={`
          ${base}
          bg-emerald-500/10
          text-emerald-500
          border-emerald-500/20
        `}
      >
        <Check size={10} />
        Allow
      </span>
    );
  }

  return (
    <span
      className={`
        ${base}
        bg-rose-500/10
        text-rose-500
        border-rose-500/20
      `}
    >
      <AlertTriangle size={10} />
      Prevent
    </span>
  );
}

/* =========================================================
   GLASS CARD
========================================================= */

function GlassCard({
  children,
  className = "",
}) {
  const { isDark } = useTheme();

  return (
    <div
      className={`rounded-2xl border ${className}`}
      style={{
        background: isDark
          ? "#020617"
          : "rgba(255,255,255,0.95)",

        borderColor: isDark
          ? "rgba(255,255,255,0.07)"
          : "#e2e8f0",

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
   ADD FORM
========================================================= */

function AddForm({
  branches,
  onAdd,
}) {
  const { isDark } = useTheme();

  const [form, setForm] = useState({
    branch: "",
    device: "",
    printerType: "",
    mode: "",
  });

  const [submitted, setSubmitted] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [fetchedDevices, setFetchedDevices] =
    useState([]);

  const branchOptions = (
    branches || []
  )
    .map((branch) => {
      if (
        typeof branch === "string" ||
        typeof branch === "number"
      ) {
        return {
          value: String(branch),
          label: String(branch),
        };
      }

      const value =
        branch.branchName ||
        branch.name ||
        branch.branch ||
        "";

      return {
        value,
        label: value,
      };
    })
    .filter((b) => b.value);

  const deviceOptions = (
    fetchedDevices || []
  )
    .map((device) => {
      if (
        typeof device === "string" ||
        typeof device === "number"
      ) {
        return {
          value: String(device),
          label: String(device),
        };
      }

      const value =
        device.ipAddress ||
        device.deviceName ||
        device.hostName ||
        device.device ||
        "";

      return {
        value,
        label: value,
      };
    })
    .filter((d) => d.value);

  const modeOptions = [
    {
      value: "Allow",
      label: "Allow",
    },
    {
      value: "Prevent",
      label: "Prevent",
    },
  ];

  const set = (key) => (value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "branch"
        ? { device: "" }
        : {}),
    }));
  };

  const isValid =
    form.branch &&
    form.device &&
    form.mode;

  const handleBranchChange = async (
    branch
  ) => {
    setForm((prev) => ({
      ...prev,
      branch,
      device: "",
    }));

    setFetchedDevices([]);

    try {
      const response =
        await dashboardService.getDevicesByBranch(
          branch
        );

      setFetchedDevices(
        response.data || []
      );
    } catch (error) {
      console.error(
        "Error loading devices:",
        error
      );

      setFetchedDevices([]);
    }
  };

  const handleSubmit = async () => {
    setSubmitted(true);

    if (!isValid) return;

    try {
      const requestData = {
        branch: form.branch,
        device: form.device,
        mode: form.mode,
      };

      const response =
        await dashboardService.addPrinterPolicy(
          requestData
        );

      if (response.data === "SUCCESS") {
        setSuccess(true);

        await showAlert({
          icon: "success",
          title: "Policy Saved",
          text: "Printer policy successful",
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: true,
        });

        setSubmitted(false);

        setForm({
          branch: "",
          device: "",
          printerType: "",
          mode: "",
        });

        setFetchedDevices([]);
        setSuccess(false);

        if (onAdd) {
          await onAdd();
        }
      } else {
        await showAlert({
          icon: "error",
          title: "Policy Failed",
          text: "Error Sending policy",
          confirmButtonText: "Cancel",
        });
      }
    } catch (error) {
      console.error(
        "Error adding printer policy:",
        error
      );

      await showAlert({
        icon: "error",
        title: "Policy Failed",
        text: "Error Sending policy",
        confirmButtonText: "Cancel",
      });
    }
  };

  const handleReset = () => {
    setForm({
      branch: "",
      device: "",
      printerType: "",
      mode: "",
    });

    setFetchedDevices([]);
    setSubmitted(false);
    setSuccess(false);
  };

  const labelCls = `
    block text-[11px] font-semibold
    uppercase tracking-wider mb-1.5
    ${
      isDark
        ? "text-slate-500"
        : "text-slate-400"
    }
  `;

  return (
    <GlassCard className="p-6 mb-5">
      <div
        className="
          grid grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-5 mb-6
        "
      >
        {/* Branch */}

        <div>
          <label className={labelCls}>
            Branch Name{" "}
            <span className="text-rose-500">
              *
            </span>
          </label>

          <Dropdown
            value={form.branch}
            onChange={handleBranchChange}
            options={branchOptions}
            placeholder="Select Branch"
            searchable
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
            Device Name{" "}
            <span className="text-rose-500">
              *
            </span>
          </label>

          <Dropdown
            value={form.device}
            onChange={set("device")}
            options={deviceOptions}
            placeholder={
              form.branch
                ? "Select Device"
                : "Select branch first"
            }
            disabled={!form.branch}
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

        {/* Mode */}

        <div>
          <label className={labelCls}>
            Mode of Access{" "}
            <span className="text-rose-500">
              *
            </span>
          </label>

          <Dropdown
            value={form.mode}
            onChange={set("mode")}
            options={modeOptions}
            placeholder="Select Mode"
            error={
              submitted && !form.mode
            }
          />

          {submitted && !form.mode && (
            <p className="text-[10px] text-rose-500 mt-1">
              Required
            </p>
          )}
        </div>
      </div>

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
            success ? "success" : "primary"
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
  );
}

/* =========================================================
   POLICY TABLE
========================================================= */

function PolicyTable({
  policies,
  onDelete,
}) {
  const { isDark } = useTheme();

  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] =
    useState("");

  const safePolicies = Array.isArray(
    policies
  )
    ? policies
    : [];

  const filtered =
    safePolicies.filter((p) => {
      const q =
        search.toLowerCase();

      const branch = String(
        p.branchName || ""
      );

      const ip = String(
        p.ipAddress || ""
      );

      const device = String(
        p.deviceName || ""
      );

      const mode = String(
        p.modeAccess || ""
      );

      const ctime = String(
        p.ctime || ""
      );

      return (
        (
          !q ||
          branch
            .toLowerCase()
            .includes(q) ||
          ip
            .toLowerCase()
            .includes(q) ||
          device
            .toLowerCase()
            .includes(q) ||
          mode
            .toLowerCase()
            .includes(q) ||
          ctime
            .toLowerCase()
            .includes(q)
        ) &&
        (
          !filterMode ||
          mode.toLowerCase() ===
            filterMode.toLowerCase()
        )
      );
    });

  /* =====================================================
     TABLE HEADER STYLE
  ===================================================== */

  const thCls = `
    text-left
    text-[10px]
    font-semibold
    uppercase
    tracking-wider
    px-3
    py-3
    whitespace-nowrap
    sticky
    top-0
    z-20
    ${
      isDark
        ? "text-slate-500 border-b border-white/[0.07]"
        : "text-slate-400 border-b border-slate-100"
    }
  `;

  /* =====================================================
     TABLE CELL STYLE
  ===================================================== */

  const tdCls = `
    px-3
    py-3
    text-[11px]
    whitespace-nowrap
    ${
      isDark
        ? "text-slate-300"
        : "text-slate-700"
    }
  `;

  const filterOptions = [
    {
      value: "",
      label: "All",
    },
    {
      value: "Allow",
      label: "Allow",
    },
    {
      value: "Prevent",
      label: "Prevent",
    },
  ];

  return (
    <GlassCard className="overflow-hidden">
      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div
        className={`
          flex items-center
          justify-between
          gap-3
          px-5
          py-3
          border-b
          ${
            isDark
              ? "border-white/[0.06]"
              : "border-slate-100"
          }
        `}
      >
        {/* TITLE */}

        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck
              size={14}
              className="text-[#7094ff]"
            />

            <span
              className={`
                text-[13px]
                font-semibold
                ${
                  isDark
                    ? "text-slate-200"
                    : "text-slate-700"
                }
              `}
            >
              Printer Policies
            </span>

            <span
              className="
                px-1.5
                py-0.5
                rounded-full
                text-[9px]
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
        </div>

        {/* SEARCH + FILTER */}

        <div className="flex items-center gap-2">
          {/* SEARCH */}

          <div
            className={`
              relative
              flex
              items-center
              rounded-lg
              border
              text-[11px]
              ${
                isDark
                  ? "border-white/[0.08]"
                  : "border-slate-200/80"
              }
            `}
            style={{
              background: isDark
                ? "rgba(255,255,255,0.04)"
                : "rgba(255,255,255,0.72)",
            }}
          >
            <Search
              size={12}
              className={`
                absolute
                left-2.5
                ${
                  isDark
                    ? "text-slate-500"
                    : "text-slate-400"
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
                pr-2.5
                py-1.5
                outline-none
                w-36
                text-[11px]
                ${
                  isDark
                    ? "text-slate-300 placeholder-slate-600"
                    : "text-slate-700 placeholder-slate-400"
                }
              `}
            />
          </div>

          {/* FILTER */}

          <div className="w-28">
            <Dropdown
              value={filterMode}
              onChange={setFilterMode}
              options={filterOptions}
              placeholder="All Modes"
            />
          </div>
        </div>
      </div>

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {filtered.length === 0 ? (
        <div
          className={`
            py-12
            text-center
            text-[12px]
            ${
              isDark
                ? "text-slate-600"
                : "text-slate-400"
            }
          `}
        >
          No printer policies found.
        </div>
      ) : (
        /* =================================================
           TABLE
        ================================================= */

        <div
          className={`
            w-full
            overflow-x-auto
            overflow-y-auto
            max-h-[440px]
            ${
              isDark
                ? "scrollbar-dark"
                : "scrollbar-light"
            }
          `}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: isDark
              ? "#334155 transparent"
              : "#cbd5e1 transparent",
          }}
        >
          <table className="w-full min-w-[1100px] table-fixed">
            <thead>
              <tr>
                {/* SR NO */}

                <th
                  className={`${thCls} w-[7%]`}
                >
                  #
                </th>

                {/* BRANCH */}

                <th
                  className={`${thCls} w-[18%]`}
                >
                  BRANCH
                </th>

                {/* IP */}

                <th
                  className={`${thCls} w-[22%]`}
                >
                  IP ADDRESS
                </th>

                {/* DEVICE */}

                <th
                  className={`${thCls} w-[20%]`}
                >
                  DEVICE
                </th>

                {/* MODE */}

                <th
                  className={`${thCls} w-[12%]`}
                >
                  MODE
                </th>

                {/* CREATED TIME */}

                <th
                  className={`${thCls} w-[13%]`}
                >
                  CREATED TIME
                </th>

                {/* ACTION */}

                <th
                  className={`
                    ${thCls}
                    w-[8%]
                    text-right
                  `}
                >
                  ACTION
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((p, i) => (
                <tr
                  key={`
                    ${p.branchName || "branch"}-
                    ${p.ipAddress || "ip"}-
                    ${p.deviceName || "device"}-
                    ${i}
                  `}
                  className={`
                    border-b
                    last:border-b-0
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
                          hover:bg-slate-50/60
                        `
                    }
                  `}
                >
                  {/* SR NO */}

                  <td
                    className={`
                      ${tdCls}
                      text-[10px]
                      ${
                        isDark
                          ? "text-slate-600"
                          : "text-slate-400"
                      }
                    `}
                  >
                    {i + 1}
                  </td>

                  {/* BRANCH */}

                  <td className={tdCls}>
                    <span
                      className={`
                        font-medium
                        ${
                          isDark
                            ? "text-slate-200"
                            : "text-slate-700"
                        }
                      `}
                    >
                      {p.branchName ||
                        "N/A"}
                    </span>
                  </td>

                  {/* IP ADDRESS */}

                  <td
                    className={`
                      ${tdCls}
                      font-mono
                      text-[10px]
                      ${
                        isDark
                          ? "text-slate-400"
                          : "text-slate-500"
                      }
                    `}
                  >
                    {p.ipAddress || "N/A"}
                  </td>

                  {/* DEVICE */}

                  <td
                    className={`
                      ${tdCls}
                      ${
                        isDark
                          ? "text-slate-300"
                          : "text-slate-700"
                      }
                    `}
                  >
                    {p.deviceName ||
                      "N/A"}
                  </td>

                  {/* MODE */}

                  <td className={tdCls}>
                    <Badge
                      mode={p.modeAccess}
                    />
                  </td>

                  {/* CREATED TIME */}

                  <td
                    className={`
                      ${tdCls}
                      text-[10px]
                      text-slate-500
                    `}
                  >
                    {p.ctime || "N/A"}
                  </td>

                  {/* ACTION */}

                  <td
                    className={`
                      ${tdCls}
                      text-right
                    `}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        onDelete(i)
                      }
                      className="
                        w-6
                        h-6
                        rounded-md
                        flex
                        items-center
                        justify-center
                        ml-auto
                        text-slate-500
                        hover:text-rose-500
                        hover:bg-rose-500/10
                        transition-all
                        duration-150
                      "
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

function TabBar({
  active,
  onChange,
}) {
  const { isDark } = useTheme();

  const tabs = [
    {
      id: "add",
      label: "Add Policy",
      icon: Plus,
    },
    {
      id: "view",
      label: "View Policies",
      icon: Eye,
    },
  ];

  return (
    <div
      className="
        inline-flex
        items-center
        gap-1.5
        rounded-2xl
        p-1.5
        mb-6
        border
      "
      style={{
        background: isDark
          ? "#020617"
          : "rgba(255,255,255,0.60)",

        borderColor: isDark
          ? "rgba(255,255,255,0.07)"
          : "rgba(203,213,225,0.70)",

        boxShadow: isDark
          ? "0 4px 16px rgba(0,0,0,0.40)"
          : "0 4px 16px rgba(148,163,184,0.15)",
      }}
    >
      {tabs.map((t) => {
        const Icon = t.icon;

        const isActive =
          active === t.id;

        return (
          <GlassButton
            key={t.id}
            onClick={() =>
              onChange(t.id)
            }
            variant={
              isActive
                ? "tab_active"
                : "tab_inactive"
            }
            className="
              px-5
              py-2.5
              font-semibold
            "
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

export default function PrinterControl() {
  const { isDark } = useTheme();

  const [tab, setTab] =
    useState("add");

  const [policies, setPolicies] =
    useState([]);

  const [branches, setBranches] =
    useState([]);

  /* =======================================================
     LOAD DATA
  ======================================================= */

  const loadPageData = async () => {
    try {
      const [
        ALLBranch,
        PrinterPolicies,
      ] = await Promise.all([
        dashboardService.getBranch(),
        dashboardService.getUSBPolicies(),
      ]);

      console.log(
        "Branches:",
        ALLBranch.data
      );

      console.log(
        "Printer Policies:",
        PrinterPolicies.data
      );

      setBranches(
        ALLBranch.data || []
      );

      setPolicies(
        Array.isArray(
          PrinterPolicies.data
        )
          ? PrinterPolicies.data
          : []
      );
    } catch (error) {
      console.error(
        "Error loading printer protection data:",
        error
      );

      setPolicies([]);
      setBranches([]);
    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    loadPageData();
  }, []);

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = (index) => {
    setPolicies((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  /* =======================================================
     AFTER ADD
  ======================================================= */

  const handleAdd = async () => {
    await loadPageData();
    setTab("view");
  };

  /* =======================================================
     STATS
  ======================================================= */

  const allowedCount =
    policies.filter(
      (p) =>
        String(
          p.modeAccess || ""
        ).toLowerCase() === "allow"
    ).length;

  const preventedCount =
    policies.filter(
      (p) =>
        String(
          p.modeAccess || ""
        ).toLowerCase() === "prevent"
    ).length;

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="w-full">
      <br />

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="flex items-start justify-between mb-7">
        <div className="flex items-center gap-3">
          {/* ICON */}

          <div
            className="
              w-10
              h-10
              rounded-2xl
              flex
              items-center
              justify-center
            "
            style={{
              background:
                "rgba(112,148,255,0.15)",
              border:
                "1px solid rgba(112,148,255,0.25)",
              backdropFilter:
                "blur(12px)",
            }}
          >
            <Printer
              size={18}
              className="text-[#7094ff]"
            />
          </div>

          {/* TITLE */}

          <div>
            <h2
              className={`
                font-display
                font-bold
                text-lg
                leading-tight
                ${
                  isDark
                    ? "text-slate-100"
                    : "text-slate-800"
                }
              `}
            >
              USB Protection
            </h2>

            <p
              className={`
                text-[11px]
                mt-0.5
                ${
                  isDark
                    ? "text-slate-500"
                    : "text-slate-400"
                }
              `}
            >
              Manage printer access policies
              across endpoints
            </p>
          </div>
        </div>

        {/* =================================================
            STATS
        ================================================= */}

        <div className="hidden sm:flex items-center gap-2">
          <GlassButton
            variant="chip_allow"
            className="
              px-3
              py-1.5
              text-[11px]
              font-semibold
              cursor-default
            "
          >
            {allowedCount} Allowed
          </GlassButton>

          <GlassButton
            variant="chip_prevent"
            className="
              px-3
              py-1.5
              text-[11px]
              font-semibold
              cursor-default
            "
          >
            {preventedCount} Prevented
          </GlassButton>
        </div>
      </div>

      {/* =================================================
          TABS
      ================================================= */}

      <TabBar
        active={tab}
        onChange={setTab}
      />

      {/* =================================================
          ADD POLICY
      ================================================= */}

      {tab === "add" && (
        <AddForm
          branches={branches}
          onAdd={handleAdd}
        />
      )}

      {/* =================================================
          VIEW POLICIES
      ================================================= */}

      {tab === "view" && (
        <PolicyTable
          policies={policies}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}