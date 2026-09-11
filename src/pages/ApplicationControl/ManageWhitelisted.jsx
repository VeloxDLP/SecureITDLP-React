import React, { useEffect, useRef, useState } from "react";
import {
  AppWindow,
  RotateCcw,
  Plus,
  Check,
  ChevronDown,
  RefreshCw,
  Eye,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { dashboardService } from "../../services/dashboardService";

function ManageWhitelisted() {
  const { isDark } = useTheme();

  // ============================================================
  // STATES
  // ============================================================

  // MULTIPLE APPLICATIONS
  const [selectedApplications, setSelectedApplications] = useState([]);

  const [branch, setBranch] = useState("");

  const [branches, setBranches] = useState([]);
  const [devices, setDevices] = useState([]);

  // MULTIPLE DEVICES
  const [selectedDevices, setSelectedDevices] = useState([]);

  // Applications loaded from selected devices
  const [applications, setApplications] = useState([]);

  // Whitelist table data
  const [whitelistedApplications, setWhitelistedApplications] =
    useState([]);

  const [branchOpen, setBranchOpen] = useState(false);
  const [deviceOpen, setDeviceOpen] = useState(false);
  const [applicationOpen, setApplicationOpen] = useState(false);

  const [deviceLoading, setDeviceLoading] = useState(false);
  const [applicationLoading, setApplicationLoading] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Table
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Selected table rows
  const [selectedTableRows, setSelectedTableRows] = useState([]);

  const branchRef = useRef(null);
  const deviceRef = useRef(null);
  const applicationRef = useRef(null);
  const tableRef = useRef(null);

  // ONLY 5 DATA PER PAGE
  const rowsPerPage = 5;

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

      if (Array.isArray(response?.data)) {
        setBranches(response.data);
      } else {
        setBranches([]);
      }
    } catch (error) {
      console.error("Failed to load branches:", error);
      setBranches([]);
    }
  };

  // ============================================================
  // GET BRANCH VALUE
  // ============================================================

  const getBranchValue = (item) => {
    if (typeof item === "string") {
      return item;
    }

    return (
      item?.branchName ??
      item?.branch ??
      item?.name ??
      item?.value ??
      ""
    );
  };

  // ============================================================
  // GET DEVICE VALUE
  // ============================================================

  const getDeviceValue = (item) => {
    if (typeof item === "string") {
      return item;
    }

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

  // ============================================================
  // GET APPLICATION VALUE
  // ============================================================

  const getApplicationValue = (item) => {
    if (typeof item === "string") {
      return item;
    }

    return (
      item?.applicationName ??
      item?.application ??
      item?.name ??
      item?.value ??
      ""
    );
  };

  // ============================================================
  // BRANCH CHANGE
  // ============================================================

  const handleBranchChange = async (branchValue) => {
    setBranch(branchValue);

    // Clear previous devices
    setSelectedDevices([]);
    setDevices([]);

    // Clear applications
    setSelectedApplications([]);
    setApplications([]);

    // Clear table
    setWhitelistedApplications([]);
    setSelectedTableRows([]);
    setSearchTerm("");
    setCurrentPage(1);

    setBranchOpen(false);
    setDeviceOpen(false);
    setApplicationOpen(false);

    if (!branchValue) {
      return;
    }

    try {
      setDeviceLoading(true);

      const response =
        await dashboardService.getDevicesByBranch(branchValue);

      console.log("Device API Response:", response);

      if (Array.isArray(response?.data)) {
        setDevices(response.data);
      } else {
        setDevices([]);
      }
    } catch (error) {
      console.error("Failed to load devices:", error);
      setDevices([]);
    } finally {
      setDeviceLoading(false);
    }
  };

  // ============================================================
  // LOAD APPLICATIONS FOR DEVICES
  // ============================================================

  const loadApplicationsByDevices = async (deviceList) => {
    if (!deviceList || deviceList.length === 0) {
      setApplications([]);
      setSelectedApplications([]);
      return;
    }

    try {
      setApplicationLoading(true);

      console.log(
        "Get applications for devices:",
        deviceList
      );

      const response =
        await dashboardService.getApplicationsByHost(
          deviceList
        );

      console.log(
        "Application By Host API Response:",
        response
      );

      let applicationList = [];

      if (
        Array.isArray(
          response?.data?.applicationName
        )
      ) {
        applicationList =
          response.data.applicationName;
      } else if (
        Array.isArray(response?.data)
      ) {
        applicationList = response.data;
      } else if (
        Array.isArray(
          response?.applicationName
        )
      ) {
        applicationList =
          response.applicationName;
      }

      applicationList = [
        ...new Set(
          applicationList
            .map(getApplicationValue)
            .filter(Boolean)
        ),
      ];

      console.log(
        "Applications for selected devices:",
        applicationList
      );

      setApplications(applicationList);

      // Clear old application selection
      setSelectedApplications([]);
    } catch (error) {
      console.error(
        "Failed to load applications:",
        error
      );

      setApplications([]);
      setSelectedApplications([]);
    } finally {
      setApplicationLoading(false);
    }
  };

  // ============================================================
  // DEVICE MULTI SELECT
  // ============================================================

  const handleDeviceChange = (deviceValue) => {
    setSelectedDevices((prev) => {
      let updatedDevices;

      if (prev.includes(deviceValue)) {
        updatedDevices = prev.filter(
          (device) => device !== deviceValue
        );
      } else {
        updatedDevices = [
          ...prev,
          deviceValue,
        ];
      }

      // Load applications based on selected devices
      loadApplicationsByDevices(
        updatedDevices
      );

      return updatedDevices;
    });

    setApplicationOpen(false);

    // Clear old table
    setWhitelistedApplications([]);
    setSelectedTableRows([]);
    setSearchTerm("");
    setCurrentPage(1);
  };

  // ============================================================
  // DEVICE VALUES
  // ============================================================

  const filteredDevices = devices
    .map((item) => getDeviceValue(item))
    .filter(Boolean);

  // ============================================================
  // SELECT ALL DEVICES
  // ============================================================

  const allDevicesSelected =
    filteredDevices.length > 0 &&
    filteredDevices.every((device) =>
      selectedDevices.includes(device)
    );

  const handleSelectAllDevices = () => {
    if (filteredDevices.length === 0) {
      return;
    }

    let updatedDevices = [];

    if (allDevicesSelected) {
      updatedDevices =
        selectedDevices.filter(
          (device) =>
            !filteredDevices.includes(device)
        );
    } else {
      updatedDevices = [
        ...new Set([
          ...selectedDevices,
          ...filteredDevices,
        ]),
      ];
    }

    setSelectedDevices(updatedDevices);

    loadApplicationsByDevices(
      updatedDevices
    );

    setSelectedApplications([]);
    setApplicationOpen(false);
  };

  // ============================================================
  // APPLICATION MULTI SELECT
  // ============================================================

  const handleApplicationChange = (
    application
  ) => {
    setSelectedApplications((prev) => {
      if (prev.includes(application)) {
        return prev.filter(
          (item) => item !== application
        );
      }

      return [
        ...prev,
        application,
      ];
    });
  };

  // ============================================================
  // SELECT ALL APPLICATIONS
  // ============================================================

  const applicationValues = applications
    .map((item) =>
      getApplicationValue(item)
    )
    .filter(Boolean);

  const allApplicationsSelected =
    applicationValues.length > 0 &&
    applicationValues.every((application) =>
      selectedApplications.includes(
        application
      )
    );

  const handleSelectAllApplications = () => {
    if (applicationValues.length === 0) {
      return;
    }

    if (allApplicationsSelected) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications([
        ...applicationValues,
      ]);
    }
  };

  // ============================================================
  // APPLICATION DISPLAY TEXT
  // ============================================================

  const getApplicationDisplayText = () => {
    if (
      selectedDevices.length === 0
    ) {
      return "Select device first";
    }

    if (applicationLoading) {
      return "Loading applications...";
    }

    if (
      selectedApplications.length === 0
    ) {
      return "Select Application";
    }

    if (
      selectedApplications.length === 1
    ) {
      return selectedApplications[0];
    }

    return `${selectedApplications.length} applications selected`;
  };

  // ============================================================
  // RESET
  // ============================================================

  const handleReset = () => {
    setSelectedApplications([]);
    setBranch("");

    setSelectedDevices([]);
    setDevices([]);
    setApplications([]);

    setWhitelistedApplications([]);
    setSelectedTableRows([]);

    setSearchTerm("");
    setCurrentPage(1);

    setBranchOpen(false);
    setDeviceOpen(false);
    setApplicationOpen(false);

    setSubmitted(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async () => {
    setSubmitted(true);

    if (
      selectedApplications.length === 0 ||
      !branch ||
      selectedDevices.length === 0
    ) {
      return;
    }

    try {
      setLoading(true);

      setSearchTerm("");
      setCurrentPage(1);
      setSelectedTableRows([]);

      // ========================================================
      // REQUEST DATA
      // ========================================================

      const requestData = {
        applicationName:
          selectedApplications,
        branch: branch,
        device: selectedDevices,
      };

      console.log(
        "Whitelist Application Request:",
        requestData
      );

      // ========================================================
      // GET CURRENT WHITELIST DATA
      // ========================================================

      const response =
        await dashboardService.getApplicationWhitelisted();

      console.log(
        "Application Whitelisted Response:",
        response
      );

      const result = Array.isArray(
        response?.data
      )
        ? response.data
        : [];

      setWhitelistedApplications(result);

      // ========================================================
      // SCROLL TO TABLE
      // ========================================================

      setTimeout(() => {
        if (tableRef.current) {
          tableRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 150);
    } catch (error) {
      console.error(
        "Application whitelist API error:",
        error
      );

      setWhitelistedApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // OUTSIDE CLICK
  // ============================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        branchRef.current &&
        !branchRef.current.contains(
          event.target
        )
      ) {
        setBranchOpen(false);
      }

      if (
        deviceRef.current &&
        !deviceRef.current.contains(
          event.target
        )
      ) {
        setDeviceOpen(false);
      }

      if (
        applicationRef.current &&
        !applicationRef.current.contains(
          event.target
        )
      ) {
        setApplicationOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ============================================================
  // CARD STYLE
  // ============================================================

  const cardStyle = {
    background: isDark
      ? "#020617"
      : "rgba(255,255,255,0.95)",

    backdropFilter: isDark
      ? "none"
      : "blur(24px)",

    WebkitBackdropFilter: isDark
      ? "none"
      : "blur(24px)",

    borderColor: isDark
      ? "rgba(255,255,255,0.07)"
      : "#e2e8f0",

    boxShadow: isDark
      ? "0 4px 24px rgba(0,0,0,0.5)"
      : "0 2px 16px rgba(0,0,0,0.08)",
  };

  // ============================================================
  // INPUT STYLE
  // ============================================================

  const inputClass = `
    w-full
    h-[42px]
    rounded-xl
    border
    px-3
    text-[13px]
    outline-none
    transition-all
    duration-200
    ${
      isDark
        ? "bg-[#111827] border-white/[0.10] text-slate-200 placeholder:text-slate-600"
        : "bg-white border-slate-200 text-slate-700 placeholder:text-slate-400"
    }
    focus:border-[#7094ff]/60
    focus:ring-2
    focus:ring-[#7094ff]/15
  `;

  // ============================================================
  // LABEL STYLE
  // ============================================================

  const labelClass = `
    block
    text-[11px]
    font-semibold
    uppercase
    tracking-wider
    mb-1.5
    ${
      isDark
        ? "text-slate-500"
        : "text-slate-400"
    }
  `;

  // ============================================================
  // TABLE SEARCH
  // ============================================================

  const filteredApplications =
    whitelistedApplications.filter(
      (item) => {
        const search =
          searchTerm.toLowerCase();

        return (
          String(
            item?.applicationHash || ""
          )
            .toLowerCase()
            .includes(search) ||
          String(
            item?.applicationName || ""
          )
            .toLowerCase()
            .includes(search) ||
          String(
            item?.applicationPath || ""
          )
            .toLowerCase()
            .includes(search) ||
          String(
            item?.branchName || ""
          )
            .toLowerCase()
            .includes(search) ||
          String(
            item?.ipAddress || ""
          )
            .toLowerCase()
            .includes(search)
        );
      }
    );

  // ============================================================
  // TABLE UNIQUE KEY
  // ============================================================

  const getApplicationKey = (item) => {
    return (
      String(
        item?.applicationHash || ""
      ) ||
      `${item?.applicationName || ""}-${
        item?.ipAddress || ""
      }-${item?.branchName || ""}`
    );
  };

  // ============================================================
  // SELECT TABLE ROW
  // ============================================================

  const handleSelectTableRow = (item) => {
    const key = getApplicationKey(item);

    setSelectedTableRows((prev) => {
      if (prev.includes(key)) {
        return prev.filter(
          (itemKey) =>
            itemKey !== key
        );
      }

      return [
        ...prev,
        key,
      ];
    });
  };

  // ============================================================
  // SELECT ALL TABLE ROWS
  // ============================================================

  const allFilteredSelected =
    filteredApplications.length > 0 &&
    filteredApplications.every((item) =>
      selectedTableRows.includes(
        getApplicationKey(item)
      )
    );

  const handleSelectAllTableRows = () => {
    const allKeys =
      filteredApplications.map(
        (item) =>
          getApplicationKey(item)
      );

    if (allKeys.length === 0) {
      return;
    }

    if (allFilteredSelected) {
      setSelectedTableRows((prev) =>
        prev.filter(
          (key) =>
            !allKeys.includes(key)
        )
      );
    } else {
      setSelectedTableRows((prev) => [
        ...new Set([
          ...prev,
          ...allKeys,
        ]),
      ]);
    }
  };

  // ============================================================
  // ADD TO BLACKLISTED
  // ============================================================

  const handleAddToBlacklisted = () => {
    const selectedRows =
      whitelistedApplications.filter(
        (item) =>
          selectedTableRows.includes(
            getApplicationKey(item)
          )
      );

    console.log(
      "Selected applications for blacklist:",
      selectedRows
    );

    // Add blacklist API here
  };

  // ============================================================
  // PAGINATION
  // ONLY 5 ROWS
  // ============================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredApplications.length /
        rowsPerPage
    )
  );

  const startIndex =
    (currentPage - 1) *
    rowsPerPage;

  const paginatedApplications =
    filteredApplications.slice(
      startIndex,
      startIndex + rowsPerPage
    );

  useEffect(() => {
    if (
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  const displayStart =
    filteredApplications.length === 0
      ? 0
      : startIndex + 1;

  const displayEnd = Math.min(
    startIndex +
      paginatedApplications.length,
    filteredApplications.length
  );

  // ============================================================
  // JSX
  // ============================================================

  return (
    <div className="w-full">

      <br />

      {/* ======================================================
          HEADING
      ====================================================== */}

      <div className="flex items-start justify-between mb-7">

        <div className="flex items-center gap-3">

          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{
              background:
                "rgba(112,148,255,0.15)",
              border:
                "1px solid rgba(112,148,255,0.25)",
              backdropFilter:
                "blur(12px)",
            }}
          >
            <AppWindow
              size={18}
              className="text-[#7094ff]"
            />
          </div>

          <div>
            <h2
              className={`font-display font-bold text-lg leading-tight ${
                isDark
                  ? "text-slate-100"
                  : "text-slate-800"
              }`}
            >
              Manage Whitelisted
            </h2>

            <p
              className={`text-[11px] mt-0.5 ${
                isDark
                  ? "text-slate-500"
                  : "text-slate-400"
              }`}
            >
              Manage whitelisted applications
              across endpoints
            </p>
          </div>

        </div>
      </div>

      {/* ======================================================
          FORM CARD
      ====================================================== */}

      <div
        className="rounded-2xl border p-6"
        style={cardStyle}
      >

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

          {/* ==================================================
              BRANCH NAME
              DO NOT CHANGE
          ================================================== */}

          <div
            ref={branchRef}
            className="relative"
          >
            <label className={labelClass}>
              Branch Name{" "}
              <span className="text-rose-500">
                *
              </span>
            </label>

            <button
              type="button"
              onClick={() => {
                setBranchOpen(
                  (prev) => !prev
                );

                setDeviceOpen(false);
                setApplicationOpen(false);
              }}
              className={`
                ${inputClass}
                flex
                items-center
                justify-between
                text-left
                ${
                  branchOpen
                    ? "border-[#7094ff]/60 ring-2 ring-[#7094ff]/15"
                    : ""
                }
                ${
                  submitted && !branch
                    ? "border-rose-500/60"
                    : ""
                }
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
                {branch ||
                  "Select Branch"}
              </span>

              <ChevronDown
                size={14}
                className={`
                  transition-transform
                  ${
                    branchOpen
                      ? "rotate-180"
                      : ""
                  }
                  ${
                    isDark
                      ? "text-slate-500"
                      : "text-slate-400"
                  }
                `}
              />
            </button>

            {branchOpen && (
              <div
                className={`
                  absolute
                  top-full
                  left-0
                  right-0
                  mt-1.5
                  z-[200]
                  rounded-xl
                  border
                  overflow-hidden
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
                        isDark
                          ? "text-slate-600"
                          : "text-slate-400"
                      }`}
                    >
                      No branches found
                    </div>
                  ) : (
                    branches.map(
                      (item, index) => {
                        const value =
                          getBranchValue(
                            item
                          );

                        return (
                          <button
                            key={`${value}-${index}`}
                            type="button"
                            onClick={() =>
                              handleBranchChange(
                                value
                              )
                            }
                            className={`
                              w-full
                              px-4
                              py-2.5
                              text-left
                              text-[13px]
                              flex
                              items-center
                              justify-between
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
                            <span>
                              {value}
                            </span>

                            {branch ===
                              value && (
                              <Check
                                size={13}
                                className="text-[#7094ff]"
                              />
                            )}
                          </button>
                        );
                      }
                    )
                  )}

                </div>
              </div>
            )}

            {submitted &&
              !branch && (
                <p className="text-[10px] text-rose-500 mt-1">
                  Required
                </p>
              )}
          </div>

          {/* ==================================================
              DEVICE NAME
              DO NOT CHANGE
          ================================================== */}

          <div
            ref={deviceRef}
            className="relative"
          >
            <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5 text-[rgb(100,116,139)]">
              DEVICE NAME{" "}
              <span className="text-rose-500 normal-case tracking-normal">
                *
              </span>
            </label>

            <button
              type="button"
              disabled={
                !branch ||
                deviceLoading
              }
              onClick={() => {
                if (
                  !branch ||
                  deviceLoading
                ) {
                  return;
                }

                setDeviceOpen(
                  (prev) => !prev
                );

                setBranchOpen(false);
                setApplicationOpen(false);
              }}
              className={`
                w-full
                h-[42px]
                rounded-xl
                border
                px-3
                text-[13px]
                flex
                items-center
                justify-between
                text-left
                outline-none
                transition-all
                duration-200
                ${
                  !branch ||
                  deviceLoading
                    ? "bg-[#111827] border-[#334155] text-slate-600 opacity-50 cursor-not-allowed"
                    : deviceOpen
                    ? "bg-[#111827] border-[#7094ff]/60 text-slate-200 ring-2 ring-[#7094ff]/15"
                    : submitted &&
                      selectedDevices.length === 0
                    ? "bg-[#111827] border-rose-500/60 text-slate-200"
                    : "bg-[#111827] border-white/[0.10] text-slate-200"
                }
              `}
            >
              <span
                className={
                  selectedDevices.length > 0
                    ? "text-slate-200"
                    : "text-slate-600"
                }
              >
                {!branch
                  ? "Select branch first"
                  : deviceLoading
                  ? "Loading devices..."
                  : selectedDevices.length > 0
                  ? `${selectedDevices.length} devices selected`
                  : "Select Device"}
              </span>

              {deviceLoading ? (
                <RefreshCw
                  size={14}
                  className="text-slate-500 animate-spin"
                />
              ) : (
                <ChevronDown
                  size={14}
                  className={`
                    text-slate-500
                    transition-transform
                    ${
                      deviceOpen
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />
              )}
            </button>

            {deviceOpen &&
              branch &&
              !deviceLoading && (
                <div
                  className="
                    absolute
                    z-[200]
                    left-0
                    right-0
                    top-full
                    mt-1
                    rounded-xl
                    border
                    border-white/[0.10]
                    bg-[#111827]
                    shadow-[0_16px_48px_rgba(0,0,0,0.35)]
                    overflow-hidden
                  "
                >
                  <div className="max-h-[187px] overflow-y-auto py-1">

                    {filteredDevices.length ===
                    0 ? (
                      <div className="px-3 py-3 text-[12px] text-slate-500">
                        No devices found
                      </div>
                    ) : (
                      <>

                        {/* SELECT ALL */}
                        <button
                          type="button"
                          onClick={
                            handleSelectAllDevices
                          }
                          className={`
                            w-full
                            px-3
                            py-2.5
                            text-left
                            text-[12px]
                            flex
                            items-center
                            gap-2
                            border-b
                            border-[#27355f]
                            transition-colors
                            ${
                              allDevicesSelected
                                ? "bg-[#1e293b] text-[#7094ff]"
                                : "text-slate-400 hover:bg-[#1e293b] hover:text-slate-200"
                            }
                          `}
                        >
                          <span
                            className={`
                              w-[14px]
                              h-[14px]
                              rounded
                              border
                              flex
                              items-center
                              justify-center
                              flex-shrink-0
                              ${
                                allDevicesSelected
                                  ? "bg-[#7094ff] border-[#7094ff]"
                                  : "border-white/[0.25]"
                              }
                            `}
                          >
                            {allDevicesSelected && (
                              <Check
                                size={11}
                                className="text-white"
                              />
                            )}
                          </span>

                          <span>
                            Select all
                          </span>
                        </button>

                        {/* DEVICE LIST */}
                        {filteredDevices.map(
                          (value, index) => {
                            const isSelected =
                              selectedDevices.includes(
                                value
                              );

                            return (
                              <button
                                key={`${value}-${index}`}
                                type="button"
                                onClick={() =>
                                  handleDeviceChange(
                                    value
                                  )
                                }
                                className={`
                                  w-full
                                  px-3
                                  py-2.5
                                  text-left
                                  text-[12px]
                                  flex
                                  items-center
                                  justify-between
                                  transition-colors
                                  ${
                                    isSelected
                                      ? "bg-[#25395f] text-[#7094ff]"
                                      : "text-slate-400 hover:bg-[#1e293b] hover:text-slate-200"
                                  }
                                `}
                              >
                                <span className="truncate">
                                  {value}
                                </span>

                                {isSelected && (
                                  <Check
                                    size={14}
                                    className="text-[#7094ff] flex-shrink-0"
                                  />
                                )}
                              </button>
                            );
                          }
                        )}

                      </>
                    )}

                  </div>
                </div>
              )}

            {submitted &&
              selectedDevices.length ===
                0 && (
                <p className="text-[10px] text-rose-500 mt-1">
                  Required
                </p>
              )}
          </div>

          {/* ==================================================
              APPLICATION NAME - MULTI SELECT
          ================================================== */}

          <div
            ref={applicationRef}
            className="relative"
          >
            <label className={labelClass}>
              Application Name{" "}
              <span className="text-rose-500">
                *
              </span>
            </label>

            <button
              type="button"
              disabled={
                selectedDevices.length ===
                  0 ||
                applicationLoading
              }
              onClick={() => {
                if (
                  selectedDevices.length ===
                    0 ||
                  applicationLoading
                ) {
                  return;
                }

                setApplicationOpen(
                  (prev) => !prev
                );

                setBranchOpen(false);
                setDeviceOpen(false);
              }}
              className={`
                ${inputClass}
                flex
                items-center
                justify-between
                text-left
                ${
                  selectedDevices.length ===
                    0 ||
                  applicationLoading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
                ${
                  applicationOpen
                    ? "border-[#7094ff]/60 ring-2 ring-[#7094ff]/15"
                    : ""
                }
                ${
                  submitted &&
                  selectedApplications.length ===
                    0
                    ? "border-rose-500/60"
                    : ""
                }
              `}
            >
              <span
                className={
                  selectedApplications.length >
                  0
                    ? "text-slate-200 truncate"
                    : "text-slate-600"
                }
              >
                {getApplicationDisplayText()}
              </span>

              {applicationLoading ? (
                <RefreshCw
                  size={14}
                  className="text-slate-500 animate-spin flex-shrink-0"
                />
              ) : (
                <ChevronDown
                  size={14}
                  className={`
                    flex-shrink-0
                    text-slate-500
                    transition-transform
                    ${
                      applicationOpen
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />
              )}
            </button>

            {/* ==================================================
                APPLICATION DROPDOWN
            ================================================== */}

            {applicationOpen &&
              selectedDevices.length > 0 &&
              !applicationLoading && (
                <div
                  className="
                    absolute
                    top-full
                    left-0
                    right-0
                    mt-1.5
                    z-[200]
                    rounded-xl
                    border
                    border-white/[0.10]
                    bg-[#111827]
                    shadow-[0_16px_48px_rgba(0,0,0,0.35)]
                    overflow-hidden
                  "
                >

                  <div className="max-h-[187px] overflow-y-auto py-1">

                    {applicationValues.length ===
                    0 ? (
                      <div className="px-4 py-3 text-[12px] text-slate-500 text-center">
                        No applications found
                      </div>
                    ) : (
                      <>

                        {/* ==================================================
                            SELECT ALL APPLICATIONS
                        ================================================== */}

                        <button
                          type="button"
                          onClick={
                            handleSelectAllApplications
                          }
                          className={`
                            w-full
                            px-3
                            py-2.5
                            text-left
                            text-[12px]
                            flex
                            items-center
                            gap-2
                            border-b
                            border-[#27355f]
                            transition-colors
                            ${
                              allApplicationsSelected
                                ? "bg-[#1e293b] text-[#7094ff]"
                                : "text-slate-400 hover:bg-[#1e293b] hover:text-slate-200"
                            }
                          `}
                        >
                          <span
                            className={`
                              w-[14px]
                              h-[14px]
                              rounded
                              border
                              flex
                              items-center
                              justify-center
                              flex-shrink-0
                              ${
                                allApplicationsSelected
                                  ? "bg-[#7094ff] border-[#7094ff]"
                                  : "border-white/[0.25]"
                              }
                            `}
                          >
                            {allApplicationsSelected && (
                              <Check
                                size={11}
                                className="text-white"
                              />
                            )}
                          </span>

                          <span>
                            Select all
                          </span>
                        </button>

                        {/* ==================================================
                            APPLICATION LIST
                        ================================================== */}

                        {applicationValues.map(
                          (
                            application,
                            index
                          ) => {
                            const isSelected =
                              selectedApplications.includes(
                                application
                              );

                            return (
                              <button
                                key={`${application}-${index}`}
                                type="button"
                                onClick={() =>
                                  handleApplicationChange(
                                    application
                                  )
                                }
                                className={`
                                  w-full
                                  px-3
                                  py-2.5
                                  text-left
                                  text-[12px]
                                  flex
                                  items-center
                                  justify-between
                                  transition-colors
                                  ${
                                    isSelected
                                      ? "bg-[#25395f] text-[#7094ff]"
                                      : "text-slate-400 hover:bg-[#1e293b] hover:text-slate-200"
                                  }
                                `}
                              >
                                <span className="truncate">
                                  {application}
                                </span>

                                {isSelected && (
                                  <Check
                                    size={14}
                                    className="text-[#7094ff] flex-shrink-0"
                                  />
                                )}
                              </button>
                            );
                          }
                        )}

                      </>
                    )}

                  </div>
                </div>
              )}

            {submitted &&
              selectedApplications.length ===
                0 && (
                <p className="text-[10px] text-rose-500 mt-1">
                  Required
                </p>
              )}
          </div>

        </div>

        {/* ======================================================
            BUTTONS
        ====================================================== */}

        <div className="flex items-center justify-end gap-3 mt-6">

          {/* RESET */}

          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className={`
              flex
              items-center
              gap-2
              px-4
              py-2.5
              rounded-xl
              border
              text-[13px]
              font-medium
              transition-all
              duration-200
              disabled:opacity-40
              disabled:cursor-not-allowed
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

          {/* SUBMIT */}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="
              flex
              items-center
              gap-2
              px-5
              py-2.5
              rounded-xl
              border
              border-[#7094ff]/40
              text-white
              text-[13px]
              font-semibold
              transition-all
              duration-200
              disabled:opacity-40
              disabled:cursor-not-allowed
              hover:border-[#7094ff]/60
            "
            style={{
              background:
                "rgba(112, 148, 255, 0.85)",
              backdropFilter:
                "blur(16px)",
              WebkitBackdropFilter:
                "blur(16px)",
              boxShadow:
                "0 4px 20px rgba(112,148,255,0.35), inset 0 1px 0 rgba(255,255,255,0.18)",
            }}
          >
            {loading ? (
              <>
                <RefreshCw
                  size={13}
                  className="animate-spin"
                />
                Loading...
              </>
            ) : (
              <>
                <Plus size={13} />
                Submit
              </>
            )}
          </button>

        </div>
      </div>

      {/* ======================================================
          WHITELISTED APPLICATION TABLE
      ====================================================== */}

      {submitted && (
        <div
          ref={tableRef}
          className="w-full rounded-xl border border-[#27355f] bg-[#020617] p-6 mt-4 scroll-mt-6"
        >

          {/* ==================================================
              TABLE HEADER
          ================================================== */}

          <div className="flex items-center justify-between mb-5">

            <div>
              <h3 className="text-[14px] font-semibold text-white">
                Whitelisted Applications
              </h3>

              <p className="mt-1 text-[11px] text-slate-500">
                Device:{" "}
                {selectedDevices.length ===
                1
                  ? selectedDevices[0]
                  : `${selectedDevices.length} Devices`}
              </p>
            </div>

            {/* SEARCH */}

            <div className="relative w-[250px]">

              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(
                    e.target.value
                  );
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

          {/* ==================================================
              TABLE
          ================================================== */}

          <div className="overflow-x-auto max-h-[430px] overflow-y-auto custom-scrollbar">

            <table className="w-full text-left">

              <thead className="sticky top-0 z-10 bg-[#020617]">

                <tr className="border-b border-[#27355f]">

                  {/* CHECKBOX */}

                  <th className="w-[55px] px-2 py-3 text-center">

                    <input
                      type="checkbox"
                      checked={
                        allFilteredSelected
                      }
                      onChange={
                        handleSelectAllTableRows
                      }
                      className="h-3 w-3 cursor-pointer accent-[#4f56f0]"
                    />

                  </th>

                  {/* SR NO */}

                  <th className="w-[55px] px-2 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Sr
                    <br />
                    No
                  </th>

                  {/* APPLICATION HASH */}

                  <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Application Hash
                  </th>

                  {/* APPLICATION NAME */}

                  <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Application Name
                  </th>

                  {/* APPLICATION PATH */}

                  <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Application Path
                  </th>

                  {/* BRANCH */}

                  <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Branch Name
                  </th>

                  {/* IP */}

                  <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    IP Address
                  </th>

                </tr>

              </thead>

              <tbody>

                {paginatedApplications.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center text-[11px] text-slate-500"
                    >
                      No whitelisted applications found.
                    </td>
                  </tr>
                ) : (
                  paginatedApplications.map(
                    (item, index) => {
                      const applicationKey =
                        getApplicationKey(
                          item
                        );

                      const isSelected =
                        selectedTableRows.includes(
                          applicationKey
                        );

                      return (
                        <tr
                          key={`${applicationKey}-${index}`}
                          className="border-b border-[#27355f]/60 hover:bg-[#0f172a] transition-colors"
                        >

                          {/* CHECKBOX */}

                          <td className="w-[55px] px-2 py-3 text-center">

                            <input
                              type="checkbox"
                              checked={
                                isSelected
                              }
                              onChange={() =>
                                handleSelectTableRow(
                                  item
                                )
                              }
                              className="h-3 w-3 cursor-pointer accent-[#4f56f0]"
                            />

                          </td>

                          {/* SR NO */}

                          <td className="w-[55px] px-2 py-3 text-center text-[11px] text-slate-500">
                            {startIndex +
                              index +
                              1}
                          </td>

                          {/* APPLICATION HASH */}

                          <td className="px-4 py-3 text-[11px] text-slate-300 break-all max-w-[300px]">
                            {item?.applicationHash ||
                              "-"}
                          </td>

                          {/* APPLICATION NAME */}

                          <td className="px-4 py-3 text-[11px] text-slate-300 break-all max-w-[350px]">
                            {item?.applicationName ||
                              "-"}
                          </td>

                          {/* APPLICATION PATH */}

                          <td className="px-4 py-3 text-[11px] text-slate-300 break-all max-w-[400px]">
                            {item?.applicationPath ||
                              "-"}
                          </td>

                          {/* BRANCH */}

                          <td className="px-4 py-3 text-[11px] text-slate-300 whitespace-nowrap">
                            {item?.branchName ||
                              "-"}
                          </td>

                          {/* IP */}

                          <td className="px-4 py-3 text-[11px] text-slate-300 whitespace-nowrap">
                            {item?.ipAddress ||
                              "-"}
                          </td>

                        </tr>
                      );
                    }
                  )
                )}

              </tbody>

            </table>

          </div>

          {/* ==================================================
              PAGINATION
          ================================================== */}

          <div className="flex items-center justify-between mt-5 pt-4">

            <div className="text-[11px] text-slate-500">
              Showing{" "}
              {displayStart}{" "}
              to{" "}
              {displayEnd}{" "}
              of{" "}
              {filteredApplications.length}{" "}
              entries
            </div>

            <div className="flex items-center gap-1">

              {/* PREVIOUS */}

              <button
                type="button"
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  setCurrentPage(
                    (prev) =>
                      Math.max(
                        prev - 1,
                        1
                      )
                  )
                }
                className={`
                  h-[32px]
                  px-3
                  border
                  text-[11px]
                  flex
                  items-center
                  gap-1
                  transition-colors
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

              {/* PAGE NUMBERS */}

              {Array.from(
                {
                  length: totalPages,
                },
                (_, index) =>
                  index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() =>
                    setCurrentPage(page)
                  }
                  className={`
                    h-[32px]
                    min-w-[32px]
                    px-2
                    border
                    text-[11px]
                    transition-colors
                    ${
                      currentPage === page
                        ? "border-[#4f56f0] bg-[#4f56f0] text-white"
                        : "border-[#334155] text-slate-400 hover:bg-[#111827] hover:text-slate-200"
                    }
                  `}
                >
                  {page}
                </button>
              ))}

              {/* NEXT */}

              <button
                type="button"
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (prev) =>
                      Math.min(
                        prev + 1,
                        totalPages
                      )
                  )
                }
                className={`
                  h-[32px]
                  px-3
                  border
                  text-[11px]
                  flex
                  items-center
                  gap-1
                  transition-colors
                  ${
                    currentPage ===
                    totalPages
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

          {/* ==================================================
              BOTTOM BUTTONS
          ================================================== */}

          <div className="flex justify-center items-center gap-1 mt-2 pt-1">

            {/* ADD TO BLACKLISTED */}

            <button
              type="button"
              onClick={
                handleAddToBlacklisted
              }
              className="h-[36px] px-4 rounded-none bg-[#4f56f0] text-[11px] font-semibold text-white border border-[#4f56f0] hover:bg-[#5d64f5] transition-colors"
            >
              Add To Blacklisted
            </button>

            {/* RESET */}

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

export default ManageWhitelisted;