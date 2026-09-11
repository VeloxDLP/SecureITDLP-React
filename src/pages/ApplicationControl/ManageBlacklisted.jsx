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
} from "lucide-react";
import { dashboardService } from "../../services/dashboardService";

function ManageBlacklisted() {
  const [branch, setBranch] = useState("");
  const [device, setDevice] = useState([]);

  const [branches, setBranches] = useState([]);
  const [devices, setDevices] = useState([]);

  const [blacklistedApplications, setBlacklistedApplications] =
    useState([]);

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
  // BRANCH VALUE
  // ============================================================
  const getBranchValue = (item) => {
    if (typeof item === "string") return item;

    return (
      item?.branchName ??
      item?.branch ??
      item?.name ??
      item?.value ??
      ""
    );
  };

  // ============================================================
  // DEVICE VALUE
  // ============================================================
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

  // ============================================================
  // BRANCH CHANGE
  // ============================================================
  const handleBranchChange = async (branchValue) => {
    setBranch(branchValue);

    // Clear multiple devices
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

      const response =
        await dashboardService.getDevicesByBranch(branchValue);

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

    // Clear old results when device selection changes
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

  // ============================================================
  // ALL DEVICES SELECTED
  // ============================================================
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
    if (!branch) {
      return "Select branch first";
    }

    if (deviceLoading) {
      return "Loading devices...";
    }

    if (device.length === 0) {
      return "Select Device";
    }

    if (device.length === 1) {
      return device[0];
    }

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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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

      const requestData = {
        device: device,
      };

      console.log(
        "Application Blacklisted Request:",
        requestData
      );

      const response =
        await dashboardService.getApplicationBlacklisted(
          requestData
        );

      console.log(
        "Application Blacklisted Response:",
        response
      );

      const result = response?.data || [];

      setBlacklistedApplications(result);

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
        "Application Blacklisted API Error:",
        error
      );

      setBlacklistedApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // CLOSE DROPDOWN OUTSIDE CLICK
  // ============================================================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        branchRef.current &&
        !branchRef.current.contains(event.target)
      ) {
        setBranchOpen(false);
      }

      if (
        deviceRef.current &&
        !deviceRef.current.contains(event.target)
      ) {
        setDeviceOpen(false);
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
  // SEARCH
  // ============================================================
  const filteredApplications =
    blacklistedApplications.filter((item) => {
      const search = searchTerm.toLowerCase();

      return (
        String(item?.applicationHash || "")
          .toLowerCase()
          .includes(search) ||
        String(item?.applicationName || "")
          .toLowerCase()
          .includes(search) ||
        String(item?.applicationType || "")
          .toLowerCase()
          .includes(search) ||
        String(item?.ipAddress || "")
          .toLowerCase()
          .includes(search)
      );
    });

  // ============================================================
  // APPLICATION UNIQUE KEY
  // ============================================================
  const getApplicationKey = (item) => {
    if (item?.applicationHash) {
      return String(item.applicationHash);
    }

    return `${item?.applicationName || ""}-${
      item?.applicationType || ""
    }-${item?.ipAddress || ""}`;
  };

  // ============================================================
  // SELECT APPLICATION
  // ============================================================
  const handleSelectApplication = (item) => {
    const key = getApplicationKey(item);

    setSelectedApplications((prev) => {
      if (prev.includes(key)) {
        return prev.filter(
          (selected) => selected !== key
        );
      }

      return [...prev, key];
    });
  };

  // ============================================================
  // SELECT ALL APPLICATIONS
  // ============================================================
  const handleSelectAll = () => {
    const allKeys = filteredApplications.map((item) =>
      getApplicationKey(item)
    );

    const allSelected =
      allKeys.length > 0 &&
      allKeys.every((key) =>
        selectedApplications.includes(key)
      );

    if (allSelected) {
      setSelectedApplications((prev) =>
        prev.filter((key) => !allKeys.includes(key))
      );
    } else {
      setSelectedApplications((prev) => [
        ...new Set([...prev, ...allKeys]),
      ]);
    }
  };

  const allFilteredSelected =
    filteredApplications.length > 0 &&
    filteredApplications.every((item) =>
      selectedApplications.includes(
        getApplicationKey(item)
      )
    );

  // ============================================================
  // ADD TO WHITELIST
  // ============================================================
  const handleAddToWhitelist = () => {
    const selectedRows =
      blacklistedApplications.filter((item) =>
        selectedApplications.includes(
          getApplicationKey(item)
        )
      );

    console.log(
      "Selected applications for whitelist:",
      selectedRows
    );

    // Add whitelist API here when endpoint is available.
  };

  // ============================================================
  // PAGINATION
  // ============================================================
  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredApplications.length / rowsPerPage
    )
  );

  const startIndex =
    (currentPage - 1) * rowsPerPage;

  const paginatedApplications =
    filteredApplications.slice(
      startIndex,
      startIndex + rowsPerPage
    );

  // ============================================================
  // KEEP PAGE VALID
  // ============================================================
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // ============================================================
  // DISPLAY START / END
  // ============================================================
  const displayStart =
    filteredApplications.length === 0
      ? 0
      : startIndex + 1;

  const displayEnd = Math.min(
    startIndex + paginatedApplications.length,
    filteredApplications.length
  );

  // ============================================================
  // JSX
  // ============================================================
  return (
    <div className="w-full pt-6 space-y-4">

      {/* ======================================================
          HEADER
      ====================================================== */}
      <div className="w-full rounded-xl border border-slate-700/80 bg-[#020617] px-5 py-4">
        <h2 className="text-[15px] font-semibold text-white">
          Manage Blacklisted
        </h2>

        <p className="mt-1 text-[12px] text-slate-400">
          Manage blacklisted application policies and application details.
        </p>
      </div>

      {/* ======================================================
          FILTER CARD
      ====================================================== */}
      <div className="w-full rounded-xl border border-[#27355f] bg-[#020617] px-4 py-4 min-h-[148px]">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[830px]">

          {/* ==================================================
              BRANCH NAME
          ================================================== */}
          <div
            ref={branchRef}
            className="relative"
          >
            <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5 text-[rgb(100,116,139)]">
              BRANCH NAME{" "}
              <span className="text-rose-500 normal-case tracking-normal">
                *
              </span>
            </label>

            <button
              type="button"
              onClick={() => {
                setBranchOpen((prev) => !prev);
                setDeviceOpen(false);
              }}
              className={`w-full h-[38px] rounded-lg border px-3 text-[12px] flex items-center justify-between outline-none transition-all bg-[#111827] ${
                branchOpen
                  ? "border-[#4f56f0] ring-1 ring-[#4f56f0]/30"
                  : "border-[#334155]"
              }`}
            >
              <span
                className={
                  branch
                    ? "text-slate-300"
                    : "text-slate-500"
                }
              >
                {branch || "Select Branch"}
              </span>

              <ChevronDown
                size={15}
                className={`text-slate-500 transition-transform ${
                  branchOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {branchOpen && (
              <div className="absolute z-50 left-0 right-0 mt-1 rounded-lg border border-[#334155] bg-[#111827] shadow-xl overflow-hidden">

                <div className="max-h-[160px] overflow-y-auto py-1">

                  {branches.length === 0 ? (
                    <div className="px-3 py-2.5 text-[12px] text-slate-500">
                      No branches found
                    </div>
                  ) : (
                    branches.map((item, index) => {
                      const value =
                        getBranchValue(item);

                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() =>
                            handleBranchChange(value)
                          }
                          className={`w-full px-3 py-2.5 text-left text-[12px] flex items-center justify-between transition-colors ${
                            branch === value
                              ? "bg-[#1e293b] text-[#7094ff]"
                              : "text-slate-400 hover:bg-[#1e293b] hover:text-slate-200"
                          }`}
                        >
                          <span>{value}</span>

                          {branch === value && (
                            <Check size={14} />
                          )}
                        </button>
                      );
                    })
                  )}

                </div>
              </div>
            )}
          </div>

          {/* ==================================================
              DEVICE NAME - MULTI SELECT
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
              disabled={!branch || deviceLoading}
              onClick={() => {
                if (!branch || deviceLoading) return;

                setDeviceOpen((prev) => !prev);
                setBranchOpen(false);
              }}
              className={`w-full h-[38px] rounded-lg border px-3 text-[12px] flex items-center justify-between outline-none transition-all ${
                !branch || deviceLoading
                  ? "border-[#334155] bg-[#111827] text-slate-700 cursor-not-allowed"
                  : deviceOpen
                  ? "border-[#7b7c83] bg-[#111827] text-[#aaadb6] ring-1 ring-[#4f56f0]/30"
                  : "border-[#334155] bg-[#111827] text-[#c3c4c7]"
              }`}
            >
              <span
                className={
                  device.length > 0
                    ? "text-slate-300"
                    : "text-slate-500"
                }
              >
                {getDeviceDisplayText()}
              </span>

              {deviceLoading ? (
                <RefreshCw
                  size={13}
                  className="text-slate-500 animate-spin"
                />
              ) : (
                <ChevronDown
                  size={15}
                  className={`text-slate-500 transition-transform ${
                    deviceOpen ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {deviceOpen &&
              branch &&
              !deviceLoading && (
                <div className="absolute z-50 left-0 right-0 mt-1 rounded-lg border border-[#334155] bg-[#111827] shadow-xl overflow-hidden">

                  <div className="max-h-[187px] overflow-y-auto py-1">

                    {devices.length === 0 ? (
                      <div className="px-3 py-2.5 text-[12px] text-slate-500">
                        No devices found
                      </div>
                    ) : (
                      <>

                        {/* ==================================================
                            SELECT ALL
                        ================================================== */}
                        <button
                          type="button"
                          onClick={handleSelectAllDevices}
                          className={`w-full px-3 py-2.5 text-left text-[12px] flex items-center gap-2 transition-colors border-b border-[#27355f] ${
                            allDevicesSelected
                              ? "bg-[#1e293b] text-[#7094ff]"
                              : "text-slate-400 hover:bg-[#1e293b] hover:text-slate-200"
                          }`}
                        >
                          <span className="w-[14px] flex items-center justify-center">
                            {allDevicesSelected && (
                              <Check size={14} />
                            )}
                          </span>

                          <span>Select all</span>
                        </button>

                        {/* ==================================================
                            DEVICE LIST
                        ================================================== */}
                        {devices.map((item, index) => {
                          const value =
                            getDeviceValue(item);

                          const isSelected =
                            device.includes(value);

                          return (
                            <button
                              key={index}
                              type="button"
                              onClick={() =>
                                handleDeviceChange(value)
                              }
                              className={`w-full px-3 py-2.5 text-left text-[12px] flex items-center justify-between transition-colors ${
                                isSelected
                                  ? "bg-[#1e293b] text-[#7094ff]"
                                  : "text-slate-400 hover:bg-[#1e293b] hover:text-slate-200"
                              }`}
                            >
                              <span>{value}</span>

                              {isSelected && (
                                <Check size={14} />
                              )}
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

        {/* ======================================================
            TOP BUTTONS
        ====================================================== */}
        <div className="flex justify-end gap-2 mt-4">

          {/* RESET */}
          <button
            type="button"
            onClick={handleReset}
            className="h-[36px] px-4 rounded-lg border border-slate-600 bg-transparent text-[11px] font-medium text-slate-300 flex items-center gap-2 hover:bg-slate-800 transition-colors"
          >
            <RotateCcw size={13} />
            Reset
          </button>

          {/* SUBMIT */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              loading ||
              !branch ||
              device.length === 0
            }
            className="h-[36px] px-5 rounded-lg bg-[#4f56f0] text-[11px] font-semibold text-white flex items-center gap-2 hover:bg-[#5d64f5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                <Eye size={14} />
                Submit
              </>
            )}
          </button>

        </div>
      </div>

      {/* ======================================================
          BLACKLISTED APPLICATION TABLE
      ====================================================== */}
      {blacklistedApplications.length > 0 && (
        <div
          ref={tableRef}
          className="w-full rounded-xl border border-[#27355f] bg-[#020617] p-6 scroll-mt-6"
        >

          {/* TABLE HEADER */}
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

          {/* TABLE SCROLLER */}
          <div className="overflow-x-auto max-h-[430px] overflow-y-auto custom-scrollbar">

            <table className="w-full text-left">

              <thead className="sticky top-0 z-10 bg-[#020617]">

                <tr className="border-b border-[#27355f]">

                  {/* SELECT CHECKBOX */}
                  <th className="w-[55px] px-2 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={handleSelectAll}
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

                  {/* APPLICATION TYPE */}
                  <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Application Type
                  </th>

                  {/* IP ADDRESS */}
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
                  paginatedApplications.map(
                    (item, index) => {
                      const applicationKey =
                        getApplicationKey(item);

                      const isSelected =
                        selectedApplications.includes(
                          applicationKey
                        );

                      return (
                        <tr
                          key={applicationKey}
                          className="border-b border-[#27355f]/60 hover:bg-[#0f172a] transition-colors"
                        >

                          {/* CHECKBOX */}
                          <td className="w-[55px] px-2 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() =>
                                handleSelectApplication(
                                  item
                                )
                              }
                              className="h-3 w-3 cursor-pointer accent-[#4f56f0]"
                            />
                          </td>

                          {/* SR NO */}
                          <td className="w-[55px] px-2 py-3 text-center text-[11px] text-slate-500">
                            {startIndex + index + 1}
                          </td>

                          {/* APPLICATION HASH */}
                          <td className="px-4 py-3 text-[11px] text-slate-300 break-all max-w-[300px]">
                            {item?.applicationHash || "-"}
                          </td>

                          {/* APPLICATION NAME */}
                          <td className="px-4 py-3 text-[11px] text-slate-300 break-all max-w-[450px]">
                            {item?.applicationName || "-"}
                          </td>

                          {/* APPLICATION TYPE */}
                          <td className="px-4 py-3 text-[11px] text-slate-300">
                            {item?.applicationType || "-"}
                          </td>

                          {/* IP ADDRESS */}
                          <td className="px-4 py-3 text-[11px] text-slate-300 whitespace-nowrap">
                            {item?.ipAddress || "-"}
                          </td>

                        </tr>
                      );
                    }
                  )
                )}

              </tbody>
            </table>
          </div>

          {/* ======================================================
              PAGINATION
          ====================================================== */}
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
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.max(prev - 1, 1)
                  )
                }
                className={`h-[32px] px-3 border text-[11px] flex items-center gap-1 transition-colors ${
                  currentPage === 1
                    ? "border-[#27355f] text-slate-700 cursor-not-allowed"
                    : "border-[#334155] text-slate-400 hover:bg-[#111827] hover:text-slate-200"
                }`}
              >
                <ChevronLeft size={13} />
                Previous
              </button>

              {/* PAGE NUMBERS */}
              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() =>
                    setCurrentPage(page)
                  }
                  className={`h-[32px] min-w-[32px] px-2 border text-[11px] transition-colors ${
                    currentPage === page
                      ? "border-[#4f56f0] bg-[#4f56f0] text-white"
                      : "border-[#334155] text-slate-400 hover:bg-[#111827] hover:text-slate-200"
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* NEXT */}
              <button
                type="button"
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(
                      prev + 1,
                      totalPages
                    )
                  )
                }
                className={`h-[32px] px-3 border text-[11px] flex items-center gap-1 transition-colors ${
                  currentPage === totalPages
                    ? "border-[#27355f] text-slate-700 cursor-not-allowed"
                    : "border-[#334155] text-slate-400 hover:bg-[#111827] hover:text-slate-200"
                }`}
              >
                Next
                <ChevronRight size={13} />
              </button>

            </div>
          </div>

          {/* ======================================================
              BOTTOM ACTION BUTTONS
          ====================================================== */}
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