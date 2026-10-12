import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  ChevronRight,
  Check,
  Monitor,
  Shield,
  Globe,
  Printer,
  FolderOpen,
  HardDrive,
  Network,
  Calendar,
  ClipboardList,
  SquarePen,
  RefreshCw,
  ChevronDown,
  X,
} from "lucide-react";

import { dashboardService } from "../../services/dashboardService";
import { useTheme } from "../../context/ThemeContext";

// ----------------------------------------------------
// MODULE DATA
// ----------------------------------------------------

const modulesData = [
  {
    name: "Application Control",
    count: 2,
    icon: Monitor,
    description: "Manage application execution policies",
  },
  {
    name: "USB Protection",
    count: 2,
    icon: Shield,
    description: "Control USB device access",
  },
  {
    name: "Website Control",
    count: 1,
    icon: Globe,
    description: "Manage website access policies",
  },
  {
    name: "Printer Control",
    count: 2,
    icon: Printer,
    description: "Manage printer access policies across endpoints",
  },
  {
    name: "Data Classification",
    count: 5,
    icon: FolderOpen,
    description: "Classify and protect sensitive data",
  },
  {
    name: "Drive Control",
    count: 2,
    icon: HardDrive,
    description: "Manage drive and storage access",
  },
  {
    name: "Network Policy",
    count: 5,
    icon: Network,
    description: "Define network access rules",
  },
];

const reportsData = {
  "Application Control": [
    "View Whitelisted",
    "View Blacklisted",
    "View Blocked",
  ],
  "USB Protection": [
    "USB Connection Status",
    "USB Data Transfer",
  ],
  "Website Control": [
    "Prevented Websites",
  ],
  "Printer Control": [
    "Printer Incidents",
  ],
  "Drive Control": [
    "Drive Report",
  ],
  "Network Policy": [
    "Peripheral Transfer",
    "Web Upload",
    "Network Transfer",
    "FTP Transfer",
    "Clipboard Event",
  ],
  "Data Classification": [
    "Classified Files",
    "Policy Violations",
  ],
};

const dateRangeOptions = [
  "Today",
  "Last 7 Days",
  "Last 30 Days",
  "Last 3 Months",
  "Last 6 Months",
];

// ----------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------

export default function ReportCenter() {
  const { isDark } = useTheme();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState();
  const [selectedReport, setSelectedReport] = useState();

  const [branch, setBranch] = useState("");
  const [device, setDevice] = useState([]);

  const [user, setUser] = useState("");
  const [dateRange, setDateRange] = useState("");

  const [showReport, setShowReport] = useState(false);

  const [fetchedDevices, setFetchedDevices] = useState([]);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const reportRef = useRef(null);

  const [getbranches, setapibranches] = useState([]);

  // ----------------------------------------------------
  // MODULE FILTER
  // ----------------------------------------------------

  const filteredModules = modulesData.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const reports = reportsData[selectedModule] || [];

  // ----------------------------------------------------
  // LOAD BRANCHES
  // ----------------------------------------------------

  const loadPageData = async () => {
    try {
      const ALLBranch = await dashboardService.getBranch();

      console.log("All received branches:", ALLBranch);

      const branchData = Array.isArray(ALLBranch)
        ? ALLBranch
        : Array.isArray(ALLBranch?.data)
        ? ALLBranch.data
        : Array.isArray(ALLBranch?.data?.data)
        ? ALLBranch.data.data
        : [];

      setapibranches(branchData);
    } catch (error) {
      console.error("Error loading branches:", error);
      setapibranches([]);
    }
  };

  useEffect(() => {
    loadPageData();
  }, []);

  // ----------------------------------------------------
  // DEVICE OPTIONS
  // API RESPONSE:
  //
  // [
  //   {
  //     pcName: "DESKTOP-001",
  //     agentStatus: "UP"
  //   }
  // ]
  // ----------------------------------------------------

  const deviceOptions = (fetchedDevices || [])
    .map((item, index) => {
      // If API returns simple string
      if (typeof item === "string") {
        return {
          value: item,
          label: item,
          status: "",
          key: `${item}-${index}`,
        };
      }

      // API object
      const deviceName =
        item?.pcName ||
        item?.deviceName ||
        item?.hostName ||
        item?.computerName ||
        item?.name ||
        "";

      const status =
        item?.agentStatus ||
        item?.status ||
        "";

      return {
        value: String(deviceName),
        label: String(deviceName),
        status: String(status),
        key: `${deviceName}-${index}`,
      };
    })
    .filter((item) => item.value);

  // ----------------------------------------------------
  // BRANCH CHANGE
  // ----------------------------------------------------

  const handleBranchChange = async (selectedBranch) => {
    console.log("Selected branch:", selectedBranch);

    setBranch(selectedBranch);

    // Reset previous device selection
    setDevice([]);
    setFetchedDevices([]);

    if (!selectedBranch) {
      return;
    }

    try {
      const response =
        await dashboardService.getDevicesByBranch(selectedBranch);

      console.log(
        "Devices response for branch:",
        selectedBranch,
        response
      );

      const devices = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.data)
        ? response.data.data
        : [];

      console.log("Final device list:", devices);

      setFetchedDevices(devices);
    } catch (error) {
      console.error("Error loading devices:", error);
      setFetchedDevices([]);
      setDevice([]);
    }
  };

  // ----------------------------------------------------
  // DUMMY REPORT DATA
  // ----------------------------------------------------

  const dummyRows = [
    {
      id: 1,
      module: selectedModule,
      report: selectedReport,
      branch: branch,
      device: device.join(", "),
      user: user,
      dateRange: dateRange,
      status: "Success",
    },
    {
      id: 2,
      module: selectedModule,
      report: selectedReport,
      branch: branch,
      device: "DESKTOP-9A1B2C3",
      user: "Admin",
      dateRange: dateRange,
      status: "Blocked",
    },
    {
      id: 3,
      module: selectedModule,
      report: selectedReport,
      branch: branch,
      device: "DESKTOP-5X8Y2Z1",
      user: "Guest",
      dateRange: dateRange,
      status: "Success",
    },
    {
      id: 4,
      module: selectedModule,
      report: selectedReport,
      branch: branch,
      device: "DESKTOP-4W7Q9T2",
      user: "Operator",
      dateRange: dateRange,
      status: "Blocked",
    },
    {
      id: 5,
      module: selectedModule,
      report: selectedReport,
      branch: branch,
      device: "DESKTOP-4W7Q9T2",
      user: "Operator",
      dateRange: dateRange,
      status: "Blocked",
    },
    {
      id: 6,
      module: selectedModule,
      report: selectedReport,
      branch: branch,
      device: "DESKTOP-4W7Q9T2",
      user: "Operator",
      dateRange: dateRange,
      status: "Blocked",
    },
    {
      id: 7,
      module: selectedModule,
      report: selectedReport,
      branch: branch,
      device: "DESKTOP-4W7Q9T2",
      user: "Operator",
      dateRange: dateRange,
      status: "Blocked",
    },
    {
      id: 8,
      module: selectedModule,
      report: selectedReport,
      branch: branch,
      device: "DESKTOP-4W7Q9T2",
      user: "Operator",
      dateRange: dateRange,
      status: "Blocked",
    },
    {
      id: 9,
      module: selectedModule,
      report: selectedReport,
      branch: branch,
      device: "DESKTOP-4W7Q9T2",
      user: "Operator",
      dateRange: dateRange,
      status: "Blocked",
    },
    {
      id: 10,
      module: selectedModule,
      report: selectedReport,
      branch: branch,
      device: "DESKTOP-4W7Q9T2",
      user: "Operator",
      dateRange: dateRange,
      status: "Blocked",
    },
  ];

  // ----------------------------------------------------
  // PAGINATION
  // ----------------------------------------------------

  const totalPages = Math.max(
    1,
    Math.ceil(dummyRows.length / itemsPerPage)
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const endIndex = startIndex + itemsPerPage;

  const paginatedRows = dummyRows.slice(
    startIndex,
    endIndex
  );

  // ----------------------------------------------------
  // VIEW REPORT
  // ----------------------------------------------------

  const handleViewReport = async () => {
    const requestData = {
      module: selectedModule,
      report: selectedReport,
      branch: branch,
      devices: device,
      duration: dateRange,
      fromDate: fromDate,
      toDate: toDate,
    };

    console.log("Report Request:", requestData);

    try {
      const ReportFetchedData =
        await dashboardService.GetReports(requestData);

      console.log(
        "ReportData:",
        ReportFetchedData?.data
      );

      setCurrentPage(1);
      setShowReport(true);

      setTimeout(() => {
        if (reportRef.current) {
          reportRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  // ----------------------------------------------------
  // RESET
  // ----------------------------------------------------

  const handleReset = () => {
    setSearchTerm("");
    setSelectedModule();
    setSelectedReport();

    setBranch("");
    setDevice([]);

    setFetchedDevices([]);

    setUser("");
    setDateRange("");

    setFromDate();
    setToDate();

    setShowReport(false);
    setCurrentPage(1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ====================================================
  // DROPDOWN
  // ====================================================

  function Dropdown({
    value,
    onChange,
    options = [],
    placeholder = "Select…",
    disabled = false,
    searchable = false,
    error = false,
  }) {
    const { isDark: dropdownDark } = useTheme();

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");

    const containerRef = useRef(null);

    const normalised = (options || [])
      .map((item, index) => {
        if (
          typeof item === "string" ||
          typeof item === "number"
        ) {
          return {
            value: String(item),
            label: String(item),
            key: `${item}-${index}`,
          };
        }

        const branchName =
          item?.branchName ||
          item?.branch_name ||
          item?.name ||
          item?.branch ||
          item?.BRANCH_NAME ||
          item?.value ||
          "";

        return {
          value: String(branchName),
          label: String(branchName),
          key: `${branchName}-${index}`,
        };
      })
      .filter((item) => item.value);

    const filtered =
      searchable && query
        ? normalised.filter((o) =>
            o.label
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
        document.addEventListener(
          "mousedown",
          handler
        );
      }

      return () => {
        document.removeEventListener(
          "mousedown",
          handler
        );
      };
    }, [open]);

    const handleSelect = (val) => {
      onChange(val);
      setOpen(false);
      setQuery("");
    };

    const glassSurface = dropdownDark
      ? {
          background: "#2a2a2a",
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
        }
      : {
          background: "rgba(255,255,255,0.80)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        };

    const triggerBorder = error
      ? "border-rose-500/60"
      : open
      ? "border-[#7094ff]/60"
      : dropdownDark
      ? "border-white/[0.10]"
      : "border-slate-300/70";

    return (
      <div
        ref={containerRef}
        className="relative"
      >
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
              dropdownDark
                ? "text-slate-200"
                : "text-slate-800"
            }
          `}
          style={glassSurface}
        >
          <span
            className={
              selected
                ? ""
                : dropdownDark
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
                dropdownDark
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
              ${dropdownDark
                ? "border-white/[0.10]"
                : "border-slate-200/80"}
            `}
            style={{
              background: dropdownDark
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
                    dropdownDark
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
                        dropdownDark
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
                        dropdownDark
                          ? "bg-[#2a2a2a] border-white/[0.08] text-[#d0d0d0] placeholder-[#555]"
                          : "bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400"
                      }
                    `}
                  />

                  {query && (
                    <button
                      type="button"
                      onClick={() =>
                        setQuery("")
                      }
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
                    px-4 py-3 text-[12px]
                    text-center
                    ${
                      dropdownDark
                        ? "text-slate-600"
                        : "text-slate-400"
                    }
                  `}
                >
                  No results
                </p>
              ) : (
                filtered.map((o) => {
                  const isSelected =
                    o.value === value;

                  return (
                    <button
                      key={o.key}
                      type="button"
                      onClick={() =>
                        handleSelect(o.value)
                      }
                      className={`
                        w-full text-left px-4 py-2.5
                        text-[13px]
                        flex items-center justify-between
                        gap-2 transition-colors
                        ${
                          isSelected
                            ? "text-[#7094ff] bg-[#7094ff]/10"
                            : dropdownDark
                            ? "text-[#888] hover:bg-white/[0.06] hover:text-[#e0e0e0]"
                            : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
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

  // ====================================================
  // MULTI SELECT DEVICE DROPDOWN
  // ====================================================

  function MultiSelectDropdown({
    values = [],
    onChange,
    options = [],
    placeholder = "Select...",
    disabled = false,
  }) {
    const [open, setOpen] = useState(false);

    const containerRef = useRef(null);

    useEffect(() => {
      const handleOutsideClick = (event) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(
            event.target
          )
        ) {
          setOpen(false);
        }
      };

      document.addEventListener(
        "mousedown",
        handleOutsideClick
      );

      return () => {
        document.removeEventListener(
          "mousedown",
          handleOutsideClick
        );
      };
    }, []);

    // ----------------------------------------------
    // NORMALIZE DEVICE OBJECTS
    // ----------------------------------------------

    const normalizedOptions = (options || [])
      .map((item, index) => {
        if (
          typeof item === "string" ||
          typeof item === "number"
        ) {
          return {
            value: String(item),
            label: String(item),
            status: "",
            key: `${item}-${index}`,
          };
        }

        const deviceName =
          item?.value ||
          item?.pcName ||
          item?.deviceName ||
          item?.hostName ||
          item?.computerName ||
          item?.name ||
          "";

        const status =
          item?.status ||
          item?.agentStatus ||
          "";

        return {
          value: String(deviceName),
          label: String(deviceName),
          status: String(status),
          key: `${deviceName}-${index}`,
        };
      })
      .filter((item) => item.value);

    // ----------------------------------------------
    // CHECK ALL
    // ----------------------------------------------

    const allSelected =
      normalizedOptions.length > 0 &&
      normalizedOptions.every((item) =>
        values.includes(item.value)
      );

    // ----------------------------------------------
    // TOGGLE DEVICE
    // ----------------------------------------------

    const toggleDevice = (deviceValue) => {
      if (values.includes(deviceValue)) {
        onChange(
          values.filter(
            (v) => v !== deviceValue
          )
        );
      } else {
        onChange([
          ...values,
          deviceValue,
        ]);
      }
    };

    // ----------------------------------------------
    // SELECT ALL
    // ----------------------------------------------

    const toggleSelectAll = () => {
      if (allSelected) {
        onChange([]);
      } else {
        onChange(
          normalizedOptions.map(
            (item) => item.value
          )
        );
      }
    };

    return (
      <div
        ref={containerRef}
        className="relative w-full"
      >
        {/* TRIGGER */}

        <button
          type="button"
          disabled={disabled}
          onClick={() =>
            !disabled &&
            setOpen((prev) => !prev)
          }
          className={`
            w-full min-h-[42px]
            flex items-center justify-between
            px-3 py-2.5 rounded-xl
            text-[13px] text-left
            border transition-all
            disabled:opacity-40
            disabled:cursor-not-allowed
            ${
              isDark
                ? "bg-[#172439] border-white/[0.10] text-slate-200"
                : "bg-white border-slate-300 text-slate-800"
            }
            ${
              open
                ? "ring-2 ring-[#7094ff]/20 border-[#7094ff]/60"
                : ""
            }
          `}
        >
          <span
            className={
              values.length > 0
                ? ""
                : isDark
                ? "text-slate-500"
                : "text-slate-400"
            }
          >
            {values.length > 0
              ? `${values.length} device${
                  values.length !== 1
                    ? "s"
                    : ""
                } selected`
              : placeholder}
          </span>

          <ChevronDown
            size={14}
            className={`
              transition-transform
              ${open ? "rotate-180" : ""}
              ${
                isDark
                  ? "text-slate-500"
                  : "text-slate-400"
              }
            `}
          />
        </button>

        {/* DROPDOWN */}

        {open && (
          <div
            className={`
              absolute top-full left-0 right-0
              mt-1.5 z-[200]
              rounded-xl border overflow-hidden
              shadow-[0_16px_48px_rgba(0,0,0,0.35)]
              ${
                isDark
                  ? "bg-[#172439] border-white/[0.10]"
                  : "bg-white border-slate-200"
              }
            `}
          >
            {/* SELECT ALL */}

            <div
              className={`
                px-3 py-2.5 border-b
                ${
                  isDark
                    ? "border-white/[0.06]"
                    : "border-slate-100"
                }
              `}
            >
              <button
                type="button"
                onClick={toggleSelectAll}
                className={`
                  w-full flex items-center gap-2
                  text-left text-[12px]
                  ${
                    isDark
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }
                `}
              >
                {allSelected ? (
                  <>
                    <X
                      size={14}
                      className="text-red-400"
                    />
                    Deselect all
                  </>
                ) : (
                  <>
                    <Check
                      size={14}
                      className="text-[#7094ff]"
                    />
                    Select all
                  </>
                )}
              </button>
            </div>

            {/* DEVICE LIST */}

            <div className="max-h-52 overflow-y-auto py-1">
              {normalizedOptions.length === 0 ? (
                <p
                  className={`
                    px-4 py-3 text-[12px]
                    text-center
                    ${
                      isDark
                        ? "text-slate-600"
                        : "text-slate-400"
                    }
                  `}
                >
                  No devices available
                </p>
              ) : (
                normalizedOptions.map(
                  (option) => {
                    const selected =
                      values.includes(
                        option.value
                      );

                    const status =
                      String(
                        option.status || ""
                      ).toUpperCase();

                    const isOnline =
                      status === "UP" ||
                      status === "ONLINE" ||
                      status === "ACTIVE";

                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() =>
                          toggleDevice(
                            option.value
                          )
                        }
                        className={`
                          w-full text-left
                          px-4 py-2.5 text-[13px]
                          flex items-center
                          justify-between gap-2
                          transition-colors
                          ${
                            selected
                              ? "text-[#7094ff] bg-[#7094ff]/10"
                              : isDark
                              ? "text-[#a0aec0] hover:bg-white/[0.06] hover:text-white"
                              : "text-slate-700 hover:bg-slate-100"
                          }
                        `}
                      >
                        {/* DEVICE NAME */}

                        <span className="truncate">
                          {option.label}
                        </span>

                        {/* STATUS + CHECK */}

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {option.status && (
                            <span
                              className={`
                                text-[10px]
                                px-2 py-0.5
                                rounded-full
                                ${
                                  isOnline
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "bg-red-500/10 text-red-400"
                                }
                              `}
                            >
                              {option.status}
                            </span>
                          )}

                          {selected && (
                            <Check
                              size={13}
                              className="text-[#7094ff]"
                            />
                          )}
                        </div>
                      </button>
                    );
                  }
                )
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ====================================================
  // RETURN
  // ====================================================

  return (
    <div className="min-h-screen p-6">

      {/* HEADER */}

      <div
        className={`
          w-full mb-6 rounded-xl border
          px-6 py-4
          ${
            isDark
              ? "bg-[#020617] border-[#2B3345]"
              : "bg-white border-slate-200"
          }
        `}
      >
        <h2
          className={`
            text-lg font-medium
            ${
              isDark
                ? "text-white"
                : "text-gray-900"
            }
          `}
        >
          Report
        </h2>

        <p
          className={`
            mt-1 text-sm
            ${
              isDark
                ? "text-gray-400"
                : "text-gray-500"
            }
          `}
        >
          Configure policy, source, destination,
          control, details.
        </p>
      </div>

      {/* FILTER CARDS */}

      <div className="grid grid-cols-4 gap-5 w-full">

        {/* MODULE */}

        <div
          className={`
            ${
              isDark
                ? "bg-[#020617] border-indigo-950"
                : "bg-white border-slate-200"
            }
            border rounded-xl p-4
            flex flex-col h-full
          `}
        >
          <h2
            className={`
              font-semibold mb-4
              ${
                isDark
                  ? "text-white"
                  : "text-gray-800"
              }
            `}
          >
            Module
          </h2>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredModules.map(
              (module) => {
                const Icon = module.icon;

                const isSelected =
                  module.name ===
                  selectedModule;

                return (
                  <button
                    key={module.name}
                    onClick={() => {
                      setSelectedModule(
                        module.name
                      );

                      setSelectedReport(
                        reportsData[
                          module.name
                        ]?.[0] || null
                      );
                    }}
                    className={`
                      w-full flex items-center
                      justify-between
                      px-3 py-2.5 rounded-lg
                      border text-left
                      transition-colors
                      ${
                        isSelected
                          ? isDark
                            ? "bg-[#1a2454] border-[#4f56f0]"
                            : "bg-indigo-50 border-indigo-300"
                          : isDark
                          ? "bg-transparent border-transparent hover:bg-white/5"
                          : "bg-transparent border-transparent hover:bg-slate-100"
                      }
                    `}
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`
                          h-4 w-4 flex-shrink-0
                          ${
                            isSelected
                              ? isDark
                                ? "text-indigo-400"
                                : "text-indigo-600"
                              : isDark
                              ? "text-gray-400"
                              : "text-gray-500"
                          }
                        `}
                      />

                      <span
                        className={`
                          text-sm truncate
                          ${
                            isSelected
                              ? isDark
                                ? "text-white font-medium"
                                : "text-indigo-700 font-medium"
                              : isDark
                              ? "text-gray-300"
                              : "text-gray-700"
                          }
                        `}
                      >
                        {module.name}
                      </span>
                    </span>

                    <span className="flex items-center gap-2">
                      <span
                        className={`
                          inline-flex items-center
                          justify-center h-5
                          min-w-[20px]
                          px-1.5 rounded-full
                          text-xs font-semibold
                          ${
                            isDark
                              ? "bg-indigo-600 text-white"
                              : "bg-indigo-100 text-indigo-700"
                          }
                        `}
                      >
                        {module.count}
                      </span>

                      <ChevronRight
                        className={`
                          h-4 w-4
                          ${
                            isDark
                              ? "text-gray-600"
                              : "text-gray-400"
                          }
                        `}
                      />
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* REPORT */}

        <div
          className={`
            ${
              isDark
                ? "bg-[#020617] border-indigo-950"
                : "bg-white border-slate-200"
            }
            border rounded-xl p-4
            flex flex-col h-full
          `}
        >
          <h2
            className={`
              font-semibold mb-1
              ${
                isDark
                  ? "text-white"
                  : "text-gray-800"
              }
            `}
          >
            Report
          </h2>

          <p
            className={`
              text-sm mb-4
              ${
                isDark
                  ? "text-indigo-400"
                  : "text-indigo-600"
              }
            `}
          >
            {selectedModule || "Select Module"} –
            Reports
          </p>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {reports.length > 0 ? (
              reports.map((report) => {
                const isSelected =
                  report === selectedReport;

                return (
                  <button
                    key={report}
                    onClick={() =>
                      setSelectedReport(report)
                    }
                    className={`
                      w-full flex items-center
                      justify-between
                      px-3 py-2.5 rounded-lg
                      border text-left
                      ${
                        isSelected
                          ? isDark
                            ? "bg-indigo-950/60 border-indigo-600"
                            : "bg-indigo-50 border-indigo-300"
                          : isDark
                          ? "bg-transparent border-gray-800 hover:bg-white/5"
                          : "bg-transparent border-slate-200 hover:bg-slate-100"
                      }
                    `}
                  >
                    <span
                      className={`
                        text-sm
                        ${
                          isSelected
                            ? isDark
                              ? "text-white font-medium"
                              : "text-indigo-700 font-medium"
                            : isDark
                            ? "text-gray-300"
                            : "text-gray-700"
                        }
                      `}
                    >
                      {report}
                    </span>

                    {isSelected && (
                      <Check
                        className={`
                          h-4 w-4
                          ${
                            isDark
                              ? "text-indigo-400"
                              : "text-indigo-600"
                          }
                        `}
                      />
                    )}
                  </button>
                );
              })
            ) : (
              <div
                className={`
                  text-sm text-center py-6
                  ${
                    isDark
                      ? "text-gray-500"
                      : "text-gray-400"
                  }
                `}
              >
                No reports available
              </div>
            )}
          </div>
        </div>

        {/* DEVICE SELECTION */}

        <div
          className={`
            ${
              isDark
                ? "bg-[#020617] border-indigo-950"
                : "bg-white border-slate-200"
            }
            border rounded-xl p-4
            flex flex-col h-full
          `}
        >
          <h2
            className={`
              font-semibold mb-4
              ${
                isDark
                  ? "text-white"
                  : "text-gray-800"
              }
            `}
          >
            Device Selection
          </h2>

          <div className="flex-1 space-y-4">

            {/* BRANCH */}

            <div>
              <label
                className={`
                  block text-xs mb-1.5
                  ${
                    isDark
                      ? "text-gray-400"
                      : "text-gray-600"
                  }
                `}
              >
                Branch
              </label>

              <Dropdown
                value={branch}
                onChange={handleBranchChange}
                options={getbranches}
                placeholder="Select Branch"
                searchable
              />
            </div>

            {/* DEVICE */}

            <div>
              <label
                className={`
                  block text-xs mb-1.5
                  ${
                    isDark
                      ? "text-gray-400"
                      : "text-gray-600"
                  }
                `}
              >
                Device
              </label>

              <MultiSelectDropdown
                values={device}
                onChange={setDevice}
                options={deviceOptions}
                placeholder={
                  branch
                    ? fetchedDevices.length > 0
                      ? "Select Device"
                      : "No devices available"
                    : "Select branch first"
                }
                disabled={!branch}
              />

              {/* DEVICE COUNT */}

              {branch &&
                fetchedDevices.length > 0 && (
                  <p
                    className={`
                      mt-2 text-[11px]
                      ${
                        isDark
                          ? "text-gray-500"
                          : "text-gray-400"
                      }
                    `}
                  >
                    {fetchedDevices.length} device
                    {fetchedDevices.length !== 1
                      ? "s"
                      : ""}{" "}
                    available
                  </p>
                )}
            </div>
          </div>
        </div>

        {/* DATE RANGE */}

        <div
          className={`
            ${
              isDark
                ? "bg-[#020617] border-indigo-950"
                : "bg-white border-slate-200"
            }
            border rounded-xl p-4
            flex flex-col h-full
          `}
        >
          <h2
            className={`
              font-semibold mb-4
              ${
                isDark
                  ? "text-white"
                  : "text-gray-800"
              }
            `}
          >
            Date Range
          </h2>

          <div className="grid grid-cols-2 gap-2 mb-2">
            {dateRangeOptions.map(
              (option) => {
                const isSelected =
                  option === dateRange;

                return (
                  <button
                    key={option}
                    onClick={() =>
                      setDateRange(option)
                    }
                    className={`
                      px-3 py-2 rounded-lg
                      text-xs font-medium
                      border
                      ${
                        isSelected
                          ? isDark
                            ? "bg-[#4f56f0] border-transparent text-white"
                            : "bg-indigo-600 border-transparent text-white"
                          : isDark
                          ? "bg-transparent border-gray-800 text-gray-300 hover:bg-white/5"
                          : "bg-transparent border-slate-300 text-gray-700 hover:bg-slate-100"
                      }
                    `}
                  >
                    {option}
                  </button>
                );
              }
            )}
          </div>

          {/* CUSTOM */}

          <button
            onClick={() =>
              setDateRange("Custom")
            }
            className={`
              w-full flex items-center
              justify-center gap-2
              px-3 py-2 rounded-lg
              text-xs font-medium
              border mb-3
              ${
                dateRange === "Custom"
                  ? isDark
                    ? "bg-[#4f56f0] border-transparent text-white"
                    : "bg-indigo-600 border-transparent text-white"
                  : isDark
                  ? "bg-transparent border-gray-800 text-gray-300 hover:bg-white/5"
                  : "bg-transparent border-slate-300 text-gray-700 hover:bg-slate-100"
              }
            `}
          >
            <Calendar className="h-3.5 w-3.5" />
            Custom
          </button>

          {/* SUMMARY */}

          <div
            className={`
              flex-1 min-h-0
              border rounded-lg p-3 mb-3
              overflow-y-auto
              ${
                isDark
                  ? "bg-[#020617] border-gray-800"
                  : "bg-slate-50 border-slate-200"
              }
            `}
          >
            <div className="flex items-center gap-2 mb-3">
              <ClipboardList
                className={`
                  h-4 w-4
                  ${
                    isDark
                      ? "text-indigo-400"
                      : "text-indigo-600"
                  }
                `}
              />

              <span
                className={`
                  text-sm font-medium
                  ${
                    isDark
                      ? "text-indigo-400"
                      : "text-indigo-700"
                  }
                `}
              >
                Selection Summary
              </span>
            </div>

            <dl className="space-y-1.5 text-xs">

              <div className="flex justify-between gap-3">
                <dt className="text-gray-500">
                  Module
                </dt>

                <dd
                  className={`
                    truncate ml-4
                    ${
                      isDark
                        ? "text-gray-300"
                        : "text-gray-800"
                    }
                  `}
                >
                  {selectedModule || "—"}
                </dd>
              </div>

              <div className="flex justify-between gap-3">
                <dt className="text-gray-500">
                  Report
                </dt>

                <dd
                  className={`
                    truncate ml-4
                    ${
                      isDark
                        ? "text-gray-300"
                        : "text-gray-800"
                    }
                  `}
                >
                  {selectedReport || "—"}
                </dd>
              </div>

              <div className="flex justify-between gap-3">
                <dt className="text-gray-500">
                  Branch
                </dt>

                <dd
                  className={`
                    truncate ml-4
                    ${
                      isDark
                        ? "text-gray-300"
                        : "text-gray-800"
                    }
                  `}
                >
                  {branch || "—"}
                </dd>
              </div>

              <div className="flex justify-between gap-3">
                <dt className="text-gray-500">
                  Device
                </dt>

                <dd
                  className={`
                    truncate ml-4
                    ${
                      isDark
                        ? "text-gray-300"
                        : "text-gray-800"
                    }
                  `}
                >
                  {device.length > 0
                    ? device.join(", ")
                    : "—"}
                </dd>
              </div>

              <div className="flex justify-between gap-3">
                <dt className="text-gray-500">
                  Date Range
                </dt>

                <dd
                  className={`
                    truncate ml-4
                    ${
                      isDark
                        ? "text-gray-300"
                        : "text-gray-800"
                    }
                  `}
                >
                  {dateRange || "—"}
                </dd>
              </div>

            </dl>
          </div>

          {/* BUTTONS */}

          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className={`
                w-1/2 flex items-center
                justify-center gap-2
                px-4 py-2.5 rounded-lg
                border text-sm font-medium
                ${
                  isDark
                    ? "border-gray-600 text-gray-300 hover:bg-white/5"
                    : "border-slate-300 text-gray-700 hover:bg-slate-100"
                }
              `}
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </button>

            <button
              onClick={handleViewReport}
              className="
                w-1/2 flex items-center
                justify-center gap-2
                px-4 py-2.5 rounded-lg
                bg-[#4f56f0]
                text-white text-sm
                font-semibold
                shadow-lg
                shadow-indigo-900/40
                hover:bg-[#5c63f5]
              "
            >
              <SquarePen className="h-4 w-4" />
              View Report
            </button>
          </div>
        </div>
      </div>

      {/* ====================================================
          REPORT RESULTS
      ==================================================== */}

      {showReport && (
        <div
          ref={reportRef}
          className={`
            mt-8 border rounded-xl p-6
            ${
              isDark
                ? "bg-[#020617] border-indigo-950"
                : "bg-white border-slate-200"
            }
          `}
        >
          <div className="flex items-center gap-3 mb-4">
            <ClipboardList
              className={`
                h-5 w-5
                ${
                  isDark
                    ? "text-indigo-400"
                    : "text-indigo-600"
                }
              `}
            />

            <h3
              className={`
                font-semibold text-lg
                ${
                  isDark
                    ? "text-white"
                    : "text-gray-900"
                }
              `}
            >
              Report Results
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead
                className={`
                  text-xs uppercase border-b
                  ${
                    isDark
                      ? "text-gray-400 border-gray-800"
                      : "text-gray-500 border-slate-200"
                  }
                `}
              >
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Module</th>
                  <th className="px-4 py-3">Report</th>
                  <th className="px-4 py-3">Branch</th>
                  <th className="px-4 py-3">Device</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Date Range</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {paginatedRows.map(
                  (row) => (
                    <tr
                      key={row.id}
                      className={`
                        border-b
                        ${
                          isDark
                            ? "border-gray-800/50 hover:bg-white/5"
                            : "border-slate-100 hover:bg-slate-50"
                        }
                      `}
                    >
                      <td
                        className={`
                          px-4 py-3
                          ${
                            isDark
                              ? "text-gray-400"
                              : "text-gray-500"
                          }
                        `}
                      >
                        {row.id}
                      </td>

                      <td className="px-4 py-3">
                        {row.module}
                      </td>

                      <td className="px-4 py-3">
                        {row.report}
                      </td>

                      <td className="px-4 py-3">
                        {row.branch}
                      </td>

                      <td className="px-4 py-3">
                        {row.device}
                      </td>

                      <td className="px-4 py-3">
                        {row.user}
                      </td>

                      <td className="px-4 py-3">
                        {row.dateRange}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`
                            inline-flex
                            items-center
                            px-2.5 py-0.5
                            rounded-full
                            text-xs font-medium
                            ${
                              row.status ===
                              "Success"
                                ? isDark
                                  ? "bg-emerald-900/30 text-emerald-400 border border-emerald-800/50"
                                  : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                : isDark
                                ? "bg-red-900/30 text-red-400 border border-red-800/50"
                                : "bg-red-100 text-red-700 border border-red-200"
                            }
                          `}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}

          <div className="flex items-center justify-between mt-4">

            <div
              className={`
                text-xs
                ${
                  isDark
                    ? "text-gray-500"
                    : "text-gray-400"
                }
              `}
            >
              Showing{" "}
              {paginatedRows.length} records for{" "}
              {selectedModule} –{" "}
              {selectedReport} • {branch} •{" "}
              {device.join(", ")} •{" "}
              {dateRange}
            </div>

            <div className="flex items-center gap-2">

              <button
                onClick={() =>
                  setCurrentPage(
                    (prev) =>
                      Math.max(
                        prev - 1,
                        1
                      )
                  )
                }
                disabled={currentPage === 1}
                className={`
                  px-3 py-1
                  rounded-md text-sm
                  ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : isDark
                      ? "bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800/60"
                      : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                  }
                `}
              >
                Previous
              </button>

              <span
                className={`
                  text-sm
                  ${
                    isDark
                      ? "text-gray-400"
                      : "text-gray-600"
                  }
                `}
              >
                Page {currentPage} of{" "}
                {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage(
                    (prev) =>
                      Math.min(
                        prev + 1,
                        totalPages
                      )
                  )
                }
                disabled={
                  currentPage === totalPages
                }
                className={`
                  px-3 py-1
                  rounded-md text-sm
                  ${
                    currentPage ===
                    totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : isDark
                      ? "bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800/60"
                      : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                  }
                `}
              >
                Next
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}