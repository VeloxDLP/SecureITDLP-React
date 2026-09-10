import React, { useEffect, useRef, useState } from "react";
import {
  AppWindow,
  RotateCcw,
  Plus,
  Check,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { dashboardService } from "../../services/dashboardService";

function ManageWhitelisted() {
  const { isDark } = useTheme();

  // ============================================================
  // STATES
  // ============================================================

  const [applicationName, setApplicationName] = useState("");
  const [branch, setBranch] = useState("");

  const [branches, setBranches] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);

  const [branchOpen, setBranchOpen] = useState(false);
  const [deviceOpen, setDeviceOpen] = useState(false);

  const [deviceLoading, setDeviceLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const branchRef = useRef(null);
  const deviceRef = useRef(null);

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
  // BRANCH CHANGE
  // ============================================================

  const handleBranchChange = async (branchValue) => {
    setBranch(branchValue);

    // Clear previous device selection
    setSelectedDevices([]);
    setDevices([]);

    // Close dropdowns
    setBranchOpen(false);
    setDeviceOpen(false);

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
  // DEVICE MULTI SELECT
  // ============================================================

  const handleDeviceChange = (deviceValue) => {
    setSelectedDevices((prev) => {
      // Remove device if already selected
      if (prev.includes(deviceValue)) {
        return prev.filter(
          (device) => device !== deviceValue
        );
      }

      // Add device
      return [...prev, deviceValue];
    });
  };

  // ============================================================
  // DEVICE VALUES
  // ============================================================

  const filteredDevices = devices
    .map((item) => getDeviceValue(item))
    .filter(Boolean);

  // ============================================================
  // SELECT ALL
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

    if (allDevicesSelected) {
      // Remove all devices
      setSelectedDevices((prev) =>
        prev.filter(
          (device) =>
            !filteredDevices.includes(device)
        )
      );
    } else {
      // Select all devices
      setSelectedDevices((prev) => [
        ...new Set([
          ...prev,
          ...filteredDevices,
        ]),
      ]);
    }
  };

  // ============================================================
  // RESET
  // ============================================================

  const handleReset = () => {
    setApplicationName("");
    setBranch("");
    setSelectedDevices([]);
    setDevices([]);

    setBranchOpen(false);
    setDeviceOpen(false);

    setSubmitted(false);
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async () => {
    setSubmitted(true);

    if (
      !applicationName.trim() ||
      !branch ||
      selectedDevices.length === 0
    ) {
      return;
    }

    try {
      setLoading(true);

      const requestData = {
        applicationName: applicationName.trim(),
        branch: branch,
        device: selectedDevices,
      };

      console.log(
        "Whitelist Application Request:",
        requestData
      );

      // ======================================================
      // ADD YOUR API HERE
      // ======================================================
      //
      // const response =
      //   await dashboardService.addApplicationWhitelist(
      //     requestData
      //   );
      //
      // console.log("Whitelist API Response:", response);

      console.log(
        "Application Whitelist Data:",
        requestData
      );

      // Temporary delay
      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      setSubmitted(false);
    } catch (error) {
      console.error(
        "Application whitelist error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // CLOSE DROPDOWN ON OUTSIDE CLICK
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
  // COMMON CARD STYLE
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
  // JSX
  // ============================================================

  return (
    <div className="w-full">

      {/* ======================================================
          HEADING
      ====================================================== */}

      <br />

      <div className="flex items-start justify-between mb-7">

        <div className="flex items-center gap-3">

          {/* ICON */}
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{
              background:
                "rgba(112,148,255,0.15)",
              border:
                "1px solid rgba(112,148,255,0.25)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter:
                "blur(12px)",
            }}
          >
            <AppWindow
              size={18}
              className="text-[#7094ff]"
            />
          </div>

          {/* TITLE */}
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
              Manage whitelisted applications across endpoints
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* ==================================================
              BRANCH NAME
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

            {/* BRANCH BUTTON */}
            <button
              type="button"
              onClick={() => {
                setBranchOpen(
                  (prev) => !prev
                );

                setDeviceOpen(false);
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
                {branch || "Select Branch"}
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

            {/* BRANCH DROPDOWN */}
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
                          getBranchValue(item);

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

                            {branch === value && (
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

            {/* BRANCH VALIDATION */}
            {submitted && !branch && (
              <p className="text-[10px] text-rose-500 mt-1">
                Required
              </p>
            )}

          </div>

          {/* ==================================================
              DEVICE NAME
          ================================================== */}

          <div
            ref={deviceRef}
            className="relative"
          >

            {/* DEVICE LABEL */}
            <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5 text-[rgb(100,116,139)]">
              DEVICE NAME{" "}
              <span className="text-rose-500 normal-case tracking-normal">
                *
              </span>
            </label>

            {/* ==================================================
                DEVICE SELECT BUTTON
            ================================================== */}

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

              {/* SELECTED COUNT */}
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

              {/* ARROW / LOADER */}
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

            {/* ==================================================
                DEVICE DROPDOWN
            ================================================== */}

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

                  {/* ==================================================
                      SCROLL AREA
                  ================================================== */}

                  <div className="max-h-[187px] overflow-y-auto py-1">

                    {/* ==================================================
                        NO DEVICES
                    ================================================== */}

                    {filteredDevices.length === 0 ? (

                      <div className="px-3 py-3 text-[12px] text-slate-500">
                        No devices found
                      </div>

                    ) : (

                      <>

                        {/* ==================================================
                            SELECT ALL
                        ================================================== */}

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

                          {/* SELECT ALL CHECKBOX */}

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

                        {/* ==================================================
                            DEVICE LIST
                        ================================================== */}

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

                                {/* DEVICE NAME */}

                                <span className="truncate">
                                  {value}
                                </span>

                                {/* SELECTED CHECK - RIGHT SIDE */}

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

            {/* DEVICE VALIDATION */}

            {submitted &&
              selectedDevices.length === 0 && (
                <p className="text-[10px] text-rose-500 mt-1">
                  Required
                </p>
              )}

          </div>

          {/* ==================================================
              APPLICATION NAME
          ================================================== */}

          <div>

            <label className={labelClass}>
              Application Name{" "}
              <span className="text-rose-500">
                *
              </span>
            </label>

            <input
              type="text"
              value={applicationName}
              onChange={(e) =>
                setApplicationName(
                  e.target.value
                )
              }
              placeholder="Enter Application Name"
              className={
                submitted &&
                !applicationName.trim()
                  ? `${inputClass} border-rose-500/60`
                  : inputClass
              }
            />

            {submitted &&
              !applicationName.trim() && (
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

                Submitting...
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

    </div>
  );
}

export default ManageWhitelisted;