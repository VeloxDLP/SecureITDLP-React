import React, { useEffect, useRef, useState } from "react";
import {
  RotateCcw,
  Eye,
  ChevronDown,
  RefreshCw,
  Check,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  AppWindow,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { dashboardService } from "../../services/dashboardService";

// ─── Status Pill ───────────────────────────────────────────────
function StatusPill({ status }) {
  if (!status) return null;

  const lower = String(status).toLowerCase();
  const isUp = lower === "up";
  const isDown = lower === "down";

  const styles = isUp
    ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/[0.08]"
    : isDown
    ? "text-rose-400 border-rose-500/40 bg-rose-500/[0.08]"
    : "text-slate-400 border-slate-500/40 bg-slate-500/[0.08]";

  return (
    <span
      className={`shrink-0 px-2 py-[1px] rounded-md text-[10px] font-bold uppercase tracking-wide border ${styles}`}
    >
      {status}
    </span>
  );
}

function ManageBlacklisted() {
  const { isDark } = useTheme();

  const [branch, setBranch] = useState("");
  const [device, setDevice] = useState([]);

  const [branches, setBranches] = useState([]);
  const [devices, setDevices] = useState([]);

  const [blacklistedApplications, setBlacklistedApplications] = useState([]);

  const [deviceLoading, setDeviceLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [branchOpen, setBranchOpen] = useState(false);
  const [deviceOpen, setDeviceOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedApplications, setSelectedApplications] = useState([]);

  const branchRef = useRef(null);
  const deviceRef = useRef(null);
  const tableRef = useRef(null);

  const rowsPerPage = 10;

  // ============================================================
  // LOAD BRANCHES
  // ============================================================
  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      const response = await dashboardService.getBranch();
      console.log("Branch API Response:", response);
      setBranches(response?.data || []);
    } catch (error) {
      console.error("Failed to load branches:", error);
      setBranches([]);
    }
  };

  // ============================================================
  // VALUE HELPERS
  // ============================================================
  const getBranchValue = (item) => {
    if (typeof item === "string") return item;
    return item?.branchName ?? item?.branch ?? item?.name ?? item?.value ?? "";
  };

  const getDeviceValue = (item) => {
    if (typeof item === "string") return item;
    return (
      item?.deviceName ??
      item?.device ??
      item?.name ??
      item?.pcName ??
      item?.computerName ??
      item?.value ??
      ""
    );
  };

  const getAgentStatus = (item) => {
    if (typeof item === "string") return null;
    return item?.agentStatus ?? item?.status ?? null;
  };

  // ============================================================
  // BRANCH CHANGE
  // ============================================================
  const handleBranchChange = async (branchValue) => {
    setBranch(branchValue);

    setDevice([]);
    setDevices([]);
    setBlacklistedApplications([]);

    setSearchTerm("");
    setCurrentPage(1);
    setSelectedApplications([]);

    setBranchOpen(false);
    setDeviceOpen(false);

    if (!branchValue) return;

    try {
      setDeviceLoading(true);
      const response = await dashboardService.getDevicesByBranch(branchValue);
      console.log("Device API Response:", response);
      setDevices(response?.data || []);
    } catch (error) {
      console.error("Failed to load devices:", error);
      setDevices([]);
    } finally {
      setDeviceLoading(false);
    }
  };

  // ============================================================
  // DEVICE MULTI SELECT
  // ============================================================
  const handleDeviceChange = (deviceValue) => {
    setDevice((prev) => {
      if (prev.includes(deviceValue)) {
        return prev.filter((item) => item !== deviceValue);
      }
      return [...prev, deviceValue];
    });

    setBlacklistedApplications([]);
    setSearchTerm("");
    setCurrentPage(1);
    setSelectedApplications([]);
  };

  // ============================================================
  // SELECT ALL DEVICES
  // ============================================================
  const handleSelectAllDevices = () => {
    const allDeviceValues = devices
      .map((item) => getDeviceValue(item))
      .filter(Boolean);

    if (allDeviceValues.length === 0) return;

    const allSelected = allDeviceValues.every((value) =>
      device.includes(value)
    );

    if (allSelected) {
      setDevice([]);
    } else {
      setDevice(allDeviceValues);
    }

    setBlacklistedApplications([]);
    setSearchTerm("");
    setCurrentPage(1);
    setSelectedApplications([]);
  };

  const allDevicesSelected =
    devices.length > 0 &&
    devices
      .map((item) => getDeviceValue(item))
      .filter(Boolean)
      .every((value) => device.includes(value));

  // ============================================================
  // DEVICE DISPLAY TEXT
  // ============================================================
  const getDeviceDisplayText = () => {
    if (!branch) return "Select branch first";
    if (deviceLoading) return "Loading devices...";
    if (device.length === 0) return "Select Device";
    if (device.length === 1) return device[0];
    return `${device.length} devices selected`;
  };

  // ============================================================
  // RESET
  // ============================================================
  const handleReset = () => {
    setBranch("");
    setDevice([]);
    setDevices([]);
    setBlacklistedApplications([]);

    setSearchTerm("");
    setCurrentPage(1);
    setSelectedApplications([]);

    setBranchOpen(false);
    setDeviceOpen(false);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ============================================================
  // SUBMIT
  // ============================================================
  const handleSubmit = async () => {
    if (!branch || device.length === 0) return;

    try {
      setLoading(true);
      setSearchTerm("");
      setCurrentPage(1);
      setSelectedApplications([]);

      const requestData = { device: device };
      console.log("Application Blacklisted Request:", requestData);

      const response = await dashboardService.getApplicationBlacklisted(
        requestData
      );
      console.log("Application Blacklisted Response:", response);

      setBlacklistedApplications(response?.data || []);

      setTimeout(() => {
        if (tableRef.current) {
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 150);
    } catch (error) {
      console.error("Application Blacklisted API Error:", error);
      setBlacklistedApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // OUTSIDE CLICK
  // ============================================================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (branchRef.current && !branchRef.current.contains(event.target)) {
        setBranchOpen(false);
      }
      if (deviceRef.current && !deviceRef.current.contains(event.target)) {
        setDeviceOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ============================================================
  // SEARCH
  // ============================================================
  const filteredApplications = blacklistedApplications.filter((item) => {
    const search = searchTerm.toLowerCase();

    return (
      String(item?.applicationHash || "").toLowerCase().includes(search) ||
      String(item?.applicationName || "").toLowerCase().includes(search) ||
      String(item?.applicationType || "").toLowerCase().includes(search) ||
      String(item?.ipAddress || "").toLowerCase().includes(search)
    );
  });

  // ============================================================
  // KEY + SELECT
  // ============================================================
  const getApplicationKey = (item) => {
    if (item?.applicationHash) return String(item.applicationHash);
    return `${item?.applicationName || ""}-${item?.applicationType || ""}-${
      item?.ipAddress || ""
    }`;
  };

  const handleSelectApplication = (item) => {
    const key = getApplicationKey(item);
    setSelectedApplications((prev) => {
      if (prev.includes(key)) return prev.filter((s) => s !== key);
      return [...prev, key];
    });
  };

  const handleSelectAll = () => {
    const allKeys = filteredApplications.map((item) => getApplicationKey(item));
    const allSelected =
      allKeys.length > 0 &&
      allKeys.every((key) => selectedApplications.includes(key));

    if (allSelected) {
      setSelectedApplications((prev) =>
        prev.filter((key) => !allKeys.includes(key))
      );
    } else {
      setSelectedApplications((prev) => [...new Set([...prev, ...allKeys])]);
    }
  };

  const allFilteredSelected =
    filteredApplications.length > 0 &&
    filteredApplications.every((item) =>
      selectedApplications.includes(getApplicationKey(item))
    );

  const handleAddToWhitelist = () => {
    const selectedRows = blacklistedApplications.filter((item) =>
      selectedApplications.includes(getApplicationKey(item))
    );
    console.log("Selected applications for whitelist:", selectedRows);
  };

  // ============================================================
  // PAGINATION
  // ============================================================
  const totalPages = Math.max(
    1,
    Math.ceil(filteredApplications.length / rowsPerPage)
  );
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedApplications = filteredApplications.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const displayStart =
    filteredApplications.length === 0 ? 0 : startIndex + 1;
  const displayEnd = Math.min(
    startIndex + paginatedApplications.length,
    filteredApplications.length
  );

  // ============================================================
  // STYLES (same as ManageWhitelisted)
  // ============================================================
  const cardStyle = {
    background: isDark ? "#020617" : "rgba(255,255,255,0.95)",
    backdropFilter: isDark ? "none" : "blur(24px)",
    WebkitBackdropFilter: isDark ? "none" : "blur(24px)",
    borderColor: isDark ? "rgba(255,255,255,0.07)" : "#e2e8f0",
    boxShadow: isDark
      ? "0 4px 24px rgba(0,0,0,0.5)"
      : "0 2px 16px rgba(0,0,0,0.08)",
  };

  const inputClass = `
    w-full h-[42px] rounded-xl border px-3 text-[13px] outline-none transition-all duration-200
    ${
      isDark
        ? "bg-[#111827] border-white/[0.10] text-slate-200 placeholder:text-slate-600"
        : "bg-white border-slate-200 text-slate-700 placeholder:text-slate-400"
    }
    focus:border-[#7094ff]/60 focus:ring-2 focus:ring-[#7094ff]/15
  `;

  const labelClass = `
    block text-[11px] font-semibold uppercase tracking-wider mb-1.5
    ${isDark ? "text-slate-500" : "text-slate-400"}
  `;

  // ============================================================
  // JSX
  // ============================================================
  return (
    <div className="w-full">
      <br />

      {/* HEADING */}
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
            <AppWindow size={18} className="text-[#7094ff]" />
          </div>

          <div>
            <h2
              className={`font-display font-bold text-lg leading-tight ${
                isDark ? "text-slate-100" : "text-slate-800"
              }`}
            >
              Manage Blacklisted
            </h2>

            <p
              className={`text-[11px] mt-0.5 ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Manage blacklisted application policies and application details
            </p>
          </div>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="rounded-2xl border p-6" style={cardStyle}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {/* BRANCH */}
          <div ref={branchRef} className="relative">
            <label className={labelClass}>
              Branch Name <span className="text-rose-500">*</span>
            </label>

            <button
              type="button"
              onClick={() => {
                setBranchOpen((prev) => !prev);
                setDeviceOpen(false);
              }}
              className={`
                ${inputClass}
                flex items-center justify-between text-left
                ${branchOpen ? "border-[#7094ff]/60 ring-2 ring-[#7094ff]/15" : ""}
              `}
            >
              <span
                className={
                  branch
                    ? isDark
                      ? "text-slate-200"
                      : "text-slate-700"
                    : isDark
                    ? "text-slate-600"
                    : "text-slate-400"
                }
              >
                {branch || "Select Branch"}
              </span>

              <ChevronDown
                size={14}
                className={`
                  transition-transform
                  ${branchOpen ? "rotate-180" : ""}
                  ${isDark ? "text-slate-500" : "text-slate-400"}
                `}
              />
            </button>

            {branchOpen && (
              <div
                className={`
                  absolute top-full left-0 right-0 mt-1.5 z-[200]
                  rounded-xl border overflow-hidden
                  shadow-[0_16px_48px_rgba(0,0,0,0.25)]
                  ${
                    isDark
                      ? "bg-[#111827] border-white/[0.10]"
                      : "bg-white border-slate-200"
                  }
                `}
              >
                <div className="max-h-52 overflow-y-auto py-1">
                  {branches.length === 0 ? (
                    <div
                      className={`px-4 py-3 text-[12px] text-center ${
                        isDark ? "text-slate-600" : "text-slate-400"
                      }`}
                    >
                      No branches found
                    </div>
                  ) : (
                    branches.map((item, index) => {
                      const value = getBranchValue(item);
                      return (
                        <button
                          key={`${value}-${index}`}
                          type="button"
                          onClick={() => handleBranchChange(value)}
                          className={`
                            w-full px-4 py-2.5 text-left text-[13px]
                            flex items-center justify-between
                            transition-colors
                            ${
                              branch === value
                                ? "text-[#7094ff] bg-[#7094ff]/10"
                                : isDark
                                ? "text-slate-400 hover:bg-white/[0.06] hover:text-slate-200"
                                : "text-slate-700 hover:bg-slate-100"
                            }
                          `}
                        >
                          <span>{value}</span>
                          {branch === value && (
                            <Check size={13} className="text-[#7094ff]" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* DEVICE */}
          <div ref={deviceRef} className="relative">
            <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5 text-[rgb(100,116,139)]">
              DEVICE NAME{" "}
              <span className="text-rose-500 normal-case tracking-normal">*</span>
            </label>

            <button
              type="button"
              disabled={!branch || deviceLoading}
              onClick={() => {
                if (!branch || deviceLoading) return;
                setDeviceOpen((prev) => !prev);
                setBranchOpen(false);
              }}
              className={`
                w-full h-[42px] rounded-xl border px-3 text-[13px]
                flex items-center justify-between text-left
                outline-none transition-all duration-200
                ${
                  !branch || deviceLoading
                    ? "bg-[#111827] border-[#334155] text-slate-600 opacity-50 cursor-not-allowed"
                    : deviceOpen
                    ? "bg-[#111827] border-[#7094ff]/60 text-slate-200 ring-2 ring-[#7094ff]/15"
                    : "bg-[#111827] border-white/[0.10] text-slate-200"
                }
              `}
            >
              <span
                className={
                  device.length > 0 ? "text-slate-200" : "text-slate-600"
                }
              >
                {getDeviceDisplayText()}
              </span>

              {deviceLoading ? (
                <RefreshCw size={14} className="text-slate-500 animate-spin" />
              ) : (
                <ChevronDown
                  size={14}
                  className={`
                    text-slate-500 transition-transform
                    ${deviceOpen ? "rotate-180" : ""}
                  `}
                />
              )}
            </button>

            {deviceOpen && branch && !deviceLoading && (
              <div
                className="
                  absolute z-[200] left-0 right-0 top-full mt-1
                  rounded-xl border border-white/[0.10] bg-[#111827]
                  shadow-[0_16px_48px_rgba(0,0,0,0.35)] overflow-hidden
                "
              >
                <div className="max-h-[187px] overflow-y-auto py-1">
                  {devices.length === 0 ? (
                    <div className="px-3 py-3 text-[12px] text-slate-500">
                      No devices found
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleSelectAllDevices}
                        className={`
                          w-full px-3 py-2.5 text-left text-[12px]
                          flex items-center justify-between gap-2
                          border-b border-[#27355f] transition-colors
                          ${
                            allDevicesSelected
                              ? "bg-[#1e293b] text-[#7094ff]"
                              : "text-slate-400 hover:bg-[#1e293b] hover:text-slate-200"
                          }
                        `}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={`
                              w-[14px] h-[14px] rounded border
                              flex items-center justify-center flex-shrink-0
                              ${
                                allDevicesSelected
                                  ? "bg-[#7094ff] border-[#7094ff]"
                                  : "border-white/[0.25]"
                              }
                            `}
                          >
                            {allDevicesSelected && (
                              <Check size={11} className="text-white" />
                            )}
                          </span>
                          <span>Select all</span>
                        </span>

                        <span className="text-[10px] text-slate-500">
                          {
                            devices.filter(
                              (d) =>
                                String(getAgentStatus(d)).toLowerCase() === "up"
                            ).length
                          }{" "}
                          Up /{" "}
                          {
                            devices.filter(
                              (d) =>
                                String(getAgentStatus(d)).toLowerCase() ===
                                "down"
                            ).length
                          }{" "}
                          Down
                        </span>
                      </button>

                      {devices.map((item, index) => {
                        const value = getDeviceValue(item);
                        const status = getAgentStatus(item);
                        const isSelected = device.includes(value);

                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleDeviceChange(value)}
                            className={`
                              w-full px-3 py-2.5 text-left text-[12px]
                              flex items-center justify-between gap-2 transition-colors
                              ${
                                isSelected
                                  ? "bg-[#25395f] text-[#7094ff]"
                                  : "text-slate-400 hover:bg-[#1e293b] hover:text-slate-200"
                              }
                            `}
                          >
                            <span className="flex items-center gap-2 min-w-0 flex-1">
                              <span className="truncate">{value}</span>
                            </span>

                            <span className="flex items-center gap-2 flex-shrink-0">
                              {status && <StatusPill status={status} />}
                              {isSelected && (
                                <Check
                                  size={14}
                                  className="text-[#7094ff] flex-shrink-0"
                                />
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[13px] font-medium
              transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed
              ${
                isDark
                  ? "text-slate-300 border-white/[0.10] bg-white/[0.06] hover:text-white hover:border-white/[0.20]"
                  : "text-slate-600 border-slate-300/70 bg-white/65 hover:text-slate-900 hover:border-slate-400/60"
              }
            `}
          >
            <RotateCcw size={13} />
            Reset
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !branch || device.length === 0}
            className="
              flex items-center gap-2 px-5 py-2.5 rounded-xl border
              border-[#7094ff]/40 text-white text-[13px] font-semibold
              transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed
              hover:border-[#7094ff]/60
            "
            style={{
              background: "rgba(112, 148, 255, 0.85)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow:
                "0 4px 20px rgba(112,148,255,0.35), inset 0 1px 0 rgba(255,255,255,0.18)",
            }}
          >
            {loading ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Eye size={13} />
                Submit
              </>
            )}
          </button>
        </div>
      </div>

      {/* TABLE */}
      {blacklistedApplications.length > 0 && (
        <div
          ref={tableRef}
          className="w-full rounded-xl border border-[#27355f] bg-[#020617] p-6 mt-4 scroll-mt-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[14px] font-semibold text-white">
                Blacklisted Applications
              </h3>
              <p className="mt-1 text-[11px] text-slate-500">
                Device:{" "}
                {device.length === 1
                  ? device[0]
                  : `${device.length} Devices`}
              </p>
            </div>

            <div className="relative w-[250px]">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search..."
                className="w-full h-[34px] rounded-lg border border-[#334155] bg-[#111827] pl-9 pr-8 text-[11px] text-slate-300 placeholder:text-slate-600 outline-none focus:border-[#4f56f0] focus:ring-1 focus:ring-[#4f56f0]/30"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto max-h-[430px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead className="sticky top-0 z-10 bg-[#020617]">
                <tr className="border-b border-[#27355f]">
                  <th className="w-[55px] px-2 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={handleSelectAll}
                      className="h-3 w-3 cursor-pointer accent-[#4f56f0]"
                    />
                  </th>
                  <th className="w-[55px] px-2 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Sr
                    <br />
                    No
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Application Hash
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Application Name
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Application Type
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    IP Address
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedApplications.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-[11px] text-slate-500"
                    >
                      No matching applications found.
                    </td>
                  </tr>
                ) : (
                  paginatedApplications.map((item, index) => {
                    const applicationKey = getApplicationKey(item);
                    const isSelected =
                      selectedApplications.includes(applicationKey);

                    return (
                      <tr
                        key={applicationKey}
                        className="border-b border-[#27355f]/60 hover:bg-[#0f172a] transition-colors"
                      >
                        <td className="w-[55px] px-2 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectApplication(item)}
                            className="h-3 w-3 cursor-pointer accent-[#4f56f0]"
                          />
                        </td>
                        <td className="w-[55px] px-2 py-3 text-center text-[11px] text-slate-500">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-4 py-3 text-[11px] text-slate-300 break-all max-w-[300px]">
                          {item?.applicationHash || "-"}
                        </td>
                        <td className="px-4 py-3 text-[11px] text-slate-300 break-all max-w-[450px]">
                          {item?.applicationName || "-"}
                        </td>
                        <td className="px-4 py-3 text-[11px] text-slate-300">
                          {item?.applicationType || "-"}
                        </td>
                        <td className="px-4 py-3 text-[11px] text-slate-300 whitespace-nowrap">
                          {item?.ipAddress || "-"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-between mt-5 pt-4">
            <div className="text-[11px] text-slate-500">
              Showing {displayStart} to {displayEnd} of{" "}
              {filteredApplications.length} entries
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                className={`
                  h-[32px] px-3 border text-[11px] flex items-center gap-1 transition-colors
                  ${
                    currentPage === 1
                      ? "border-[#27355f] text-slate-700 cursor-not-allowed"
                      : "border-[#334155] text-slate-400 hover:bg-[#111827] hover:text-slate-200"
                  }
                `}
              >
                <ChevronLeft size={13} />
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`
                      h-[32px] min-w-[32px] px-2 border text-[11px] transition-colors
                      ${
                        currentPage === page
                          ? "border-[#4f56f0] bg-[#4f56f0] text-white"
                          : "border-[#334155] text-slate-400 hover:bg-[#111827] hover:text-slate-200"
                      }
                    `}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className={`
                  h-[32px] px-3 border text-[11px] flex items-center gap-1 transition-colors
                  ${
                    currentPage === totalPages
                      ? "border-[#27355f] text-slate-700 cursor-not-allowed"
                      : "border-[#334155] text-slate-400 hover:bg-[#111827] hover:text-slate-200"
                  }
                `}
              >
                Next
                <ChevronRight size={13} />
              </button>
            </div>
          </div>

          {/* BOTTOM BUTTONS */}
          <div className="flex justify-center items-center gap-1 mt-2 pt-1">
            <button
              type="button"
              onClick={handleAddToWhitelist}
              className="h-[36px] px-4 rounded-none bg-[#4f56f0] text-[11px] font-semibold text-white border border-[#4f56f0] hover:bg-[#5d64f5] transition-colors"
            >
              Add To Whitelist
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="h-[36px] px-4 rounded-none bg-[#4f56f0] text-[11px] font-semibold text-white border border-[#4f56f0] hover:bg-[#5d64f5] transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageBlacklisted;