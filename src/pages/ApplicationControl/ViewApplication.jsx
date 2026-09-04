import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ClipboardList,
  Check,
  Eye,
  ArrowLeft,
} from "lucide-react";

import { dashboardService } from "../../services/dashboardService";
import { useTheme } from "../../context/ThemeContext";

export default function ViewApplication() {
  const { isDark } = useTheme();

  // =========================
  // STATES (unchanged)
  // =========================
  const [applications, setApplications] = useState([]);
  const [branches, setBranches] = useState([]);
  const [devices, setDevices] = useState([]);

  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedDevices, setSelectedDevices] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(false);
  const [deviceLoading, setDeviceLoading] = useState(false);

  const [showResults, setShowResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // =========================
  // INLINE DETAILS
  // =========================
  const [viewingHostname, setViewingHostname] = useState(null);
  const [viewDetails, setViewDetails] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const itemsPerPage = 10;

  const applicationResultRef = useRef(null);
  const detailsSectionRef = useRef(null);

  // =========================
  // LOAD BRANCHES
  // =========================
  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      const response = await dashboardService.getBranch();
      setBranches(response?.data || []);
    } catch (error) {
      console.error("Failed to load branches:", error);
      setBranches([]);
    }
  };

  // =========================
  // BRANCH CHANGE
  // =========================
  const handleBranchChange = async (branchValue) => {
    setSelectedBranch(branchValue);
    setSelectedDevices([]);
    setDevices([]);
    if (!branchValue) return;
    try {
      setDeviceLoading(true);
      const response = await dashboardService.getDevicesByBranch(branchValue);
      setDevices(response?.data || []);
    } catch (error) {
      console.error("Failed to load devices:", error);
      setDevices([]);
    } finally {
      setDeviceLoading(false);
    }
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async () => {
    setViewingHostname(null);
    setViewDetails([]);
    setDetailError("");

    try {
      setLoading(true);
      const requestData = { branch: selectedBranch, device: selectedDevices };
      const response = await dashboardService.getApplicationCount(requestData);
      const responseData = response?.data;
      let applicationData = [];
      if (Array.isArray(responseData)) applicationData = responseData;
      else if (responseData && typeof responseData === "object") applicationData = [responseData];
      setApplications(applicationData);
      setShowResults(true);
      setCurrentPage(1);

      setTimeout(() => {
        if (applicationResultRef.current) {
          applicationResultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    } catch (error) {
      console.error("View Application API Error:", error);
      setApplications([]);
      setShowResults(true);
      setTimeout(() => {
        if (applicationResultRef.current) {
          applicationResultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // VIEW DETAILS
  // =========================
  const handleView = async (row) => {
    const hostname = row?.pcName ?? row?.pc ?? row?.computerName ?? "";
    if (!hostname) {
      setDetailError("Host name is not available");
      setViewDetails([]);
      setViewingHostname(hostname);
      setTimeout(() => {
        if (detailsSectionRef.current) {
          detailsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
      return;
    }

    setViewingHostname(hostname);
    setDetailLoading(true);
    setDetailError("");
    setViewDetails([]);

    try {
      const response = await dashboardService.getApplicationDetails(hostname);
      const details = Array.isArray(response?.data) ? response.data : response?.data ? [response.data] : [];
      setViewDetails(details);
    } catch (error) {
      console.error("Application details error:", error);
      setViewDetails([]);
      setDetailError(error?.response?.data?.message || "Failed to fetch application details");
    } finally {
      setDetailLoading(false);
      setTimeout(() => {
        if (detailsSectionRef.current) {
          detailsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    }
  };

  // =========================
  // CLOSE DETAILS
  // =========================
  const handleCloseDetails = () => {
    setViewingHostname(null);
    setViewDetails([]);
    setDetailError("");
    setDetailLoading(false);
  };

  // =========================
  // RESET
  // =========================
  const handleReset = () => {
    setSelectedBranch("");
    setSelectedDevices([]);
    setDevices([]);
    setApplications([]);
    setSearchTerm("");
    setShowResults(false);
    setCurrentPage(1);
    setViewingHostname(null);
    setViewDetails([]);
    setDetailError("");
    setDetailLoading(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // =========================
  // FILTER & PAGINATION
  // =========================
  const filteredApplications = applications.filter((item) => {
    const search = searchTerm.toLowerCase();
    return Object.values(item || {}).some((value) =>
      String(value ?? "").toLowerCase().includes(search)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredApplications.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = filteredApplications.slice(startIndex, startIndex + itemsPerPage);

  // =========================
  // DROPDOWN COMPONENTS (UPDATED BACKGROUND TO #172439)
  // =========================
  function Dropdown({ value, onChange, options, placeholder = "Select...", disabled = false }) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
      const handleOutsideClick = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) setOpen(false);
      };
      document.addEventListener("mousedown", handleOutsideClick);
      return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const normalizedOptions = (options || []).map((item) => {
      if (typeof item === "string") return { value: item, label: item };
      return {
        value: item.value ?? item.branchName ?? item.deviceName ?? item.name,
        label: item.label ?? item.branchName ?? item.deviceName ?? item.name,
      };
    });

    const selected = normalizedOptions.find((item) => item.value === value);

    return (
      <div ref={containerRef} className="relative w-full">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((prev) => !prev)}
          className={`
            w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] text-left border transition-all
            disabled:opacity-40 disabled:cursor-not-allowed
            ${isDark 
              ? "bg-[#172439] border-white/[0.10] text-slate-200"   // <-- changed to #172439
              : "bg-white border-slate-300 text-slate-800"}
            ${open ? "ring-2 ring-[#7094ff]/20 border-[#7094ff]/60" : ""}
          `}
        >
          <span className={selected ? "" : isDark ? "text-slate-500" : "text-slate-400"}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""} ${isDark ? "text-slate-500" : "text-slate-400"}`} />
        </button>
        {open && (
          <div className={`absolute top-full left-0 right-0 mt-1.5 z-[200] rounded-xl border overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.35)] ${isDark ? "bg-[#172439] border-white/[0.10]" : "bg-white border-slate-200"}`}>
            <div className="max-h-52 overflow-y-auto py-1">
              {normalizedOptions.length === 0 ? (
                <p className={`px-4 py-3 text-[12px] text-center ${isDark ? "text-slate-600" : "text-slate-400"}`}>No options available</p>
              ) : (
                normalizedOptions.map((option) => {
                  const selectedOption = option.value === value;
                  return (
                    <button
                      key={String(option.value)}
                      type="button"
                      onClick={() => { onChange(option.value); setOpen(false); }}
                      className={`
                        w-full text-left px-4 py-2.5 text-[13px] flex items-center justify-between gap-2 transition-colors
                        ${selectedOption 
                          ? "text-[#7094ff] bg-[#7094ff]/10" 
                          : isDark 
                            ? "text-[#a0aec0] hover:bg-white/[0.06] hover:text-white"   // adjusted text for #172439
                            : "text-slate-700 hover:bg-slate-100"}
                      `}
                    >
                      {option.label}
                      {selectedOption && <Check size={13} className="text-[#7094ff]" />}
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

  function MultiSelectDropdown({ values = [], onChange, options = [], placeholder = "Select...", disabled = false }) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
      const handleOutsideClick = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) setOpen(false);
      };
      document.addEventListener("mousedown", handleOutsideClick);
      return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const normalizedOptions = (options || []).map((item) => {
      if (typeof item === "string") return { value: item, label: item };
      return {
        value: item.value ?? item.deviceName ?? item.name,
        label: item.label ?? item.deviceName ?? item.name,
      };
    });

    const allSelected = normalizedOptions.length > 0 && normalizedOptions.every((item) => values.includes(item.value));

    const toggleDevice = (deviceValue) => {
      if (values.includes(deviceValue)) {
        onChange(values.filter((v) => v !== deviceValue));
      } else {
        onChange([...values, deviceValue]);
      }
    };

    const toggleSelectAll = () => {
      if (allSelected) {
        onChange([]);
      } else {
        onChange(normalizedOptions.map((item) => item.value));
      }
    };

    return (
      <div ref={containerRef} className="relative w-full">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((prev) => !prev)}
          className={`
            w-full min-h-[42px] flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] text-left border transition-all
            disabled:opacity-40 disabled:cursor-not-allowed
            ${isDark 
              ? "bg-[#172439] border-white/[0.10] text-slate-200"   // <-- changed to #172439
              : "bg-white border-slate-300 text-slate-800"}
            ${open ? "ring-2 ring-[#7094ff]/20 border-[#7094ff]/60" : ""}
          `}
        >
          <span className={values.length > 0 ? "" : isDark ? "text-slate-500" : "text-slate-400"}>
            {values.length > 0 ? `${values.length} device${values.length !== 1 ? "s" : ""} selected` : placeholder}
          </span>
          <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""} ${isDark ? "text-slate-500" : "text-slate-400"}`} />
        </button>
        {open && (
          <div className={`absolute top-full left-0 right-0 mt-1.5 z-[200] rounded-xl border overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.35)] ${isDark ? "bg-[#172439] border-white/[0.10]" : "bg-white border-slate-200"}`}>
            <div className={`px-3 py-2.5 border-b ${isDark ? "border-white/[0.06]" : "border-slate-100"}`}>
              <button type="button" onClick={toggleSelectAll} className={`w-full flex items-center gap-2 text-left text-[12px] ${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
                {allSelected ? <><X size={14} className="text-red-400" /> Deselect all</> : <><Check size={14} className="text-[#7094ff]" /> Select all</>}
              </button>
            </div>
            <div className="max-h-52 overflow-y-auto py-1">
              {normalizedOptions.length === 0 ? (
                <p className={`px-4 py-3 text-[12px] text-center ${isDark ? "text-slate-600" : "text-slate-400"}`}>No devices available</p>
              ) : (
                normalizedOptions.map((option) => {
                  const selected = values.includes(option.value);
                  return (
                    <button
                      key={String(option.value)}
                      type="button"
                      onClick={() => toggleDevice(option.value)}
                      className={`
                        w-full text-left px-4 py-2.5 text-[13px] flex items-center justify-between gap-2 transition-colors
                        ${selected 
                          ? "text-[#7094ff] bg-[#7094ff]/10" 
                          : isDark 
                            ? "text-[#a0aec0] hover:bg-white/[0.06] hover:text-white"
                            : "text-slate-700 hover:bg-slate-100"}
                      `}
                    >
                      <span>{option.label}</span>
                      {selected && <Check size={13} className="text-[#7094ff]" />}
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

  // =========================
  // MAIN RENDER (unchanged)
  // =========================
  return (
    <div className="min-h-screen p-6">
      {/* HEADER */}
      <div className={`w-full mb-6 rounded-xl border px-6 py-4 ${isDark ? "bg-[#020617] border-[#2B3345]" : "bg-white border-slate-200"}`}>
        <h2 className={`text-lg font-medium ${isDark ? "text-white" : "text-gray-900"}`}>View Application</h2>
        <p className={`mt-1 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          View application control policies and application details.
        </p>
      </div>

      {/* FILTER SECTION */}
      <div className={`w-full rounded-xl border p-5 ${isDark ? "bg-[#020617] border-indigo-950" : "bg-white border-slate-200"}`}>
        <div className="grid grid-cols-3 gap-5">
          <div>
            <label className={`block text-xs mb-1.5 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Branch</label>
            <Dropdown value={selectedBranch} onChange={handleBranchChange} options={branches} placeholder="Select Branch" />
          </div>
          <div>
            <label className={`block text-xs mb-1.5 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Device</label>
            <MultiSelectDropdown
              values={selectedDevices}
              onChange={setSelectedDevices}
              options={devices}
              placeholder={selectedBranch ? (deviceLoading ? "Loading devices..." : "Select Device(s)") : "Select branch first"}
              disabled={!selectedBranch || deviceLoading}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button
            type="button"
            onClick={handleReset}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-medium transition-colors ${isDark ? "border-gray-600 text-gray-300 hover:bg-white/5" : "border-slate-300 text-gray-700 hover:bg-slate-100"}`}
          >
            <RefreshCw className="h-4 w-4" /> Reset
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#4f56f0] text-white text-sm font-semibold shadow-lg shadow-indigo-900/40 hover:bg-[#5c63f5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><RefreshCw className="h-4 w-4 animate-spin" /> Loading...</>
            ) : (
              <><Eye className="h-4 w-4" /> Submit</>
            )}
          </button>
        </div>
      </div>

      {/* APPLICATION RESULTS (unchanged) */}
      {showResults && (
        <div
          ref={applicationResultRef}
          className={`mt-8 rounded-xl border p-6 scroll-mt-6 ${isDark ? "bg-[#020617] border-indigo-950" : "bg-white border-slate-200"}`}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <ClipboardList className={`h-5 w-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
              <h3 className={`font-semibold text-lg ${isDark ? "text-white" : "text-gray-900"}`}>Application Results</h3>
            </div>
            <div className="relative w-64">
              <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Search application..."
                className={`w-full pl-9 pr-9 py-2 rounded-lg border outline-none text-xs ${isDark ? "bg-[#0b1120] border-gray-800 text-gray-200 placeholder-gray-600" : "bg-white border-slate-200 text-gray-700 placeholder-gray-400"}`}
              />
              {searchTerm && (
                <button type="button" onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className={`text-xs uppercase border-b ${isDark ? "text-gray-400 border-gray-800" : "text-gray-500 border-slate-200"}`}>
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">PC Name</th>
                  <th className="px-4 py-3">Branch</th>
                  <th className="px-4 py-3">Application Count</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedApplications.length === 0 ? (
                  <tr>
                    <td colSpan="5" className={`px-4 py-12 text-center ${isDark ? "text-gray-500" : "text-gray-400"}`}>No application data found</td>
                  </tr>
                ) : (
                  paginatedApplications.map((row, index) => {
                    const pcName = row.pcName ?? row.pc ?? row.computerName ?? "—";
                    const branchName = row.branchName ?? row.branch ?? selectedBranch ?? "—";
                    const applicationCount = row.applicationCount ?? row.count ?? 0;
                    return (
                      <tr key={row.id ?? row.srNo ?? `${pcName}-${index}`} className={`border-b ${isDark ? "border-gray-800/50 hover:bg-white/5" : "border-slate-100 hover:bg-slate-50"}`}>
                        <td className={`px-4 py-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{startIndex + index + 1}</td>
                        <td className={`px-4 py-3 font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>{pcName}</td>
                        <td className={`px-4 py-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{branchName || "—"}</td>
                        <td className={`px-4 py-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isDark ? "bg-indigo-900/30 text-indigo-400 border border-indigo-800/50" : "bg-indigo-100 text-indigo-700 border border-indigo-200"}`}>
                            {applicationCount}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleView(row)}
                            className={`p-1.5 rounded-md transition ${isDark ? "text-indigo-400 hover:bg-indigo-900/30" : "text-indigo-600 hover:bg-indigo-50"}`}
                            title="View"
                          >
                            <Eye size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-5 pt-4">
            <div className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              Showing {paginatedApplications.length} of {filteredApplications.length} records
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs ${currentPage === 1 ? "opacity-40 cursor-not-allowed" : isDark ? "bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800/60" : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"}`}
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <span className={`text-xs px-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs ${currentPage === totalPages ? "opacity-40 cursor-not-allowed" : isDark ? "bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800/60" : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"}`}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INLINE DETAILS SECTION */}
      {viewingHostname !== null && (
        <div
          ref={detailsSectionRef}
          className={`mt-8 rounded-xl border p-6 scroll-mt-6 ${isDark ? "bg-[#020617] border-indigo-950" : "bg-white border-slate-200"}`}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <ClipboardList className={`h-5 w-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
              <div>
                <h3 className={`font-semibold text-lg ${isDark ? "text-white" : "text-gray-900"}`}>Application Details</h3>
                <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>Host: {viewingHostname || "—"}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCloseDetails}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs transition ${isDark ? "text-gray-400 hover:text-white hover:bg-white/10" : "text-gray-500 hover:bg-slate-100"}`}
            >
              <ArrowLeft size={14} /> Back
            </button>
          </div>

          <div className="overflow-x-auto">
            {detailLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <RefreshCw size={24} className="animate-spin text-indigo-500 mb-3" />
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Loading application details...</p>
              </div>
            ) : detailError ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${isDark ? "bg-red-900/20" : "bg-red-50"}`}>
                  <X size={20} className={isDark ? "text-red-400" : "text-red-500"} />
                </div>
                <p className={`text-sm font-medium ${isDark ? "text-red-400" : "text-red-600"}`}>{detailError}</p>
              </div>
            ) : viewDetails.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <ClipboardList size={28} className={`mb-3 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
                <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>No application details found for this host.</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className={`text-xs uppercase border-b ${isDark ? "text-gray-400 border-gray-800" : "text-gray-500 border-slate-200 bg-slate-50"}`}>
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Application Hash</th>
                    <th className="px-4 py-3">Application Name</th>
                    <th className="px-4 py-3">Application Path</th>
                    <th className="px-4 py-3">IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {viewDetails.map((detail, index) => {
                    const applicationHash = detail?.applicationHash ?? detail?.APPLICATION_HASH ?? "—";
                    const applicationName = detail?.applicationName ?? detail?.APPLICATION_NAME ?? "—";
                    const applicationPath = detail?.applicationPath ?? detail?.APPLICATION_PATH ?? "—";
                    const ipAddress = detail?.ipAddress ?? detail?.IP_ADDRESS ?? "—";
                    return (
                      <tr
                        key={`${applicationHash}-${index}`}
                        className={`border-b last:border-b-0 ${isDark ? "border-gray-800/50 hover:bg-white/5" : "border-slate-100 hover:bg-slate-50"}`}
                      >
                        <td className={`px-4 py-3 ${isDark ? "text-gray-500" : "text-gray-400"}`}>{index + 1}</td>
                        <td className={`px-4 py-3 max-w-[260px] break-all ${isDark ? "text-gray-300" : "text-gray-700"}`}>{applicationHash}</td>
                        <td className={`px-4 py-3 font-medium max-w-[220px] break-words ${isDark ? "text-gray-200" : "text-gray-800"}`}>{applicationName}</td>
                        <td className={`px-4 py-3 max-w-[360px] break-all ${isDark ? "text-gray-300" : "text-gray-700"}`}>{applicationPath}</td>
                        <td className={`px-4 py-3 whitespace-nowrap ${isDark ? "text-gray-300" : "text-gray-700"}`}>{ipAddress}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}