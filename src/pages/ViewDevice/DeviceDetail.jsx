import React, { useState } from "react";
import { useLocation } from "react-router-dom"; // added for receiving device data
import { Search, ArrowLeft } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

/* =========================================================
   HARDWARE ITEM
========================================================= */
const HardwareItem = ({ label, value = "Na", isDark }) => {
  return (
    <div
      className={`
        flex items-center justify-between
        h-[26px]
        px-2
        rounded-[4px]
        border
        ${
          isDark
            ? "bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.07]"
            : "bg-[#f1f1f1] border-transparent hover:bg-[#e9e9e9]"
        }
      `}
    >
      <div className="flex items-center gap-1.5 min-w-0">
        <span
          className={`
            w-[5px] h-[5px]
            flex-shrink-0
            rounded-full
            ${isDark ? "bg-[#7094ff]" : "bg-[#6366c7]"}
          `}
        />
        <span
          className={`
            text-[10px] truncate
            ${isDark ? "text-white/60" : "text-[#666]"}
          `}
        >
          {label}
        </span>
      </div>
      <span
        className={`
          text-[10px]
          ml-2
          flex-shrink-0
          ${isDark ? "text-white/50" : "text-[#666]"}
        `}
      >
        {value}
      </span>
    </div>
  );
};

/* =========================================================
   PROTECTION CARD
========================================================= */
const ProtectionCard = ({
  title,
  allowed,
  prevented,
  color,
  isDark,
}) => {
  return (
    <div
      className={`
        h-[85px]
        rounded-lg
        border
        px-2.5
        py-1.5
        flex items-center justify-between
        shadow-[0_2px_8px_rgba(0,0,0,0.10)]
        ${
          isDark
            ? "bg-[#020617] border-white/[0.08]"
            : "bg-white border-slate-200"
        }
      `}
    >
      <div className="min-w-0">
        <h3
          className={`
            text-[13px]
            font-medium
            mb-0.5
            ${isDark ? "text-white/85" : "text-[#374151]"}
          `}
        >
          {title}
        </h3>
        <div
          className={`
            text-[10px]
            leading-[16px]
            ${isDark ? "text-white/50" : "text-[#777]"}
          `}
        >
          Allowed : {allowed}
        </div>
        <div
          className={`
            text-[10px]
            leading-[16px]
            ${isDark ? "text-white/50" : "text-[#777]"}
          `}
        >
          Prevented : {prevented}
        </div>
      </div>
      <div className="relative w-[46px] h-[46px] flex-shrink-0">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `
              conic-gradient(
                ${color} 0deg,
                ${color} 115deg,
                ${isDark ? "#292929" : "#e5e7eb"} 115deg,
                ${isDark ? "#292929" : "#e5e7eb"} 360deg
              )
            `,
          }}
        />
        <div
          className={`
            absolute
            left-[4px]
            top-[4px]
            w-[38px]
            h-[38px]
            rounded-full
            ${isDark ? "bg-[#020617]" : "bg-white"}
          `}
        />
        <span
          className={`
            absolute
            inset-0
            flex items-center justify-center
            z-10
            text-[22px]
            font-light
            ${isDark ? "text-white/80" : "text-[#333]"}
          `}
        >
          ↗
        </span>
      </div>
    </div>
  );
};

/* =========================================================
   DRIVE DETAIL
========================================================= */
function DriveDetail() {
  const { isDark } = useTheme();
  const location = useLocation(); // get navigation state
  const [search, setSearch] = useState("");

  // Extract device info passed from the dashboard
  const device = location.state?.device || {};
  const hostName = device.host || "N/A";

  const driveData = [
    {
      driveName: "10.30.13.60",
      totalSize: "SIANBY95",
      path: "Control Panel\\Network and Internet\\",
      date1: "21/02/2026",
      date2: "21/02/2026",
      usedSpace: "72 hrs",
    },
    {
      driveName: "10.30.13.75",
      totalSize: "SIANBY95",
      path: "Control Panel\\Network and Internet\\",
      date1: "21/02/2026",
      date2: "21/02/2026",
      usedSpace: "28 hrs",
    },
    {
      driveName: "10.30.13.75",
      totalSize: "SIANBY95",
      path: "Control Panel\\Network and Internet\\",
      date1: "21/02/2026",
      date2: "21/02/2026",
      usedSpace: "42 hrs",
    },
    {
      driveName: "10.30.13.75",
      totalSize: "SIANBY95",
      path: "Control Panel\\Network and Internet\\",
      date1: "21/02/2026",
      date2: "21/02/2026",
      usedSpace: "10 hrs",
    },
    {
      driveName: "10.30.13.75",
      totalSize: "SIANBY95",
      path: "Control Panel\\Network and Internet\\",
      date1: "21/02/2026",
      date2: "21/02/2026",
      usedSpace: "9 hrs",
    },
    {
      driveName: "10.30.13.75",
      totalSize: "SIANBY95",
      path: "Control Panel\\Network and Internet\\",
      date1: "21/02/2026",
      date2: "21/02/2026",
      usedSpace: "9 hrs",
    },
  ];

  const filteredData = driveData.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

  const cardClass = `
    rounded-lg
    border
    shadow-[0_2px_8px_rgba(0,0,0,0.10)]
    ${
      isDark
        ? "bg-[#020617] border-white/[0.08]"
        : "bg-white border-slate-200"
    }
  `;

  const tableCell = `
    px-2
    py-1
    text-[10px]
    whitespace-nowrap
    ${
      isDark
        ? "bg-white/[0.045] text-white/55"
        : "bg-[#f1f1f1] text-[#666]"
    }
  `;

  const handleBack = () => window.history.back();

  return (
    <div
      className={`
        h-screen
        overflow-hidden
        w-full
        px-1.5
        pt-0
        pb-1
        ${isDark ? "bg-[#070614]" : "bg-[#eef3ff]"}
      `}
    >
      {/* =====================================================
          HEADER CARD with Back button and host name
      ====================================================== */}
      <div className={`${cardClass} p-3 mb-3 flex items-center justify-between`}>
        <div>
          <h2
            className={`
              text-[15px]
              font-medium
              ${isDark ? "text-white/85" : "text-[#374151]"}
            `}
          >
            Endpoint Details
          </h2>
          <p
            className={`
              text-sm
              ${isDark ? "text-white/50" : "text-[#666]"}
            `}
          >
            System Configuration For{" "}
            <span className="font-semibold text-indigo-500 dark:text-indigo-400">
              {hostName}
            </span>
          </p>
        </div>
        <button
          onClick={handleBack}
          className={`
            flex items-center gap-1
            px-4 py-1
            rounded-md
            text-[11px]
            font-medium
            transition-colors
            shadow-sm
            ${
              isDark
                ? "bg-indigo-500 text-white hover:bg-indigo-600"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }
          `}
        >
          <ArrowLeft size={13} className="text-white" />
          Back
        </button>
      </div>

      {/* =====================================================
          TOP ROW (Drive Details + Hardware)
      ====================================================== */}
      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-[1.04fr_0.96fr]
          gap-1.5
        "
      >
        {/* Drive Details */}
        <div className={`${cardClass} p-2`}>
          <div className="flex items-center justify-between mb-1.5">
            <h2
              className={`
                text-[15px]
                font-medium
                ${isDark ? "text-white/85" : "text-[#374151]"}
              `}
            >
              Drive Details
            </h2>

            <div className="flex items-center gap-1">
              {["Excel", "Copy", "CSV", "PDF"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`
                    h-[22px]
                    px-2
                    rounded-[3px]
                    text-[9px]
                    ${
                      isDark
                        ? "bg-white/[0.05] text-white/50 hover:bg-white/[0.09]"
                        : "bg-[#f3f4f6] text-[#6b7280] hover:bg-[#e5e7eb]"
                    }
                  `}
                >
                  {item}
                </button>
              ))}

              <div className="relative ml-0.5">
                <Search
                  size={11}
                  className={`
                    absolute
                    left-1.5
                    top-1/2
                    -translate-y-1/2
                    ${isDark ? "text-white/30" : "text-[#9ca3af]"}
                  `}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Identities"
                  className={`
                    w-[110px]
                    h-[22px]
                    pl-5
                    pr-1.5
                    rounded-[3px]
                    border
                    outline-none
                    text-[9px]
                    ${
                      isDark
                        ? `
                          bg-white/[0.04]
                          border-white/[0.07]
                          text-white/70
                          placeholder:text-white/25
                        `
                        : `
                          bg-[#f3f4f6]
                          border-transparent
                          text-[#666]
                          placeholder:text-[#9ca3af]
                        `
                    }
                  `}
                />
              </div>
            </div>
          </div>

          <table
            className="
              w-full
              table-fixed
              border-separate
              border-spacing-y-[3px]
            "
          >
            <thead>
              <tr>
                <th className="w-[18%] px-2 text-left text-[9px] font-medium text-slate-500">
                  Drive Name
                </th>
                <th className="w-[13%] px-2 text-left text-[9px] font-medium text-slate-500">
                  Total Size
                </th>
                <th className="w-[30%] px-2 text-left text-[9px] font-medium text-slate-500">
                  Free Space
                </th>
                <th className="w-[13%] px-2 text-left text-[9px] font-medium text-slate-500">
                  Free Space
                </th>
                <th className="w-[13%] px-2 text-left text-[9px] font-medium text-slate-500">
                  Free Space
                </th>
                <th className="w-[13%] px-2 text-left text-[9px] font-medium text-slate-500">
                  Used Space
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td className={`${tableCell} rounded-l-[4px]`}>
                    {item.driveName}
                  </td>
                  <td className={tableCell}>{item.totalSize}</td>
                  <td className={`${tableCell} overflow-hidden text-ellipsis`}>
                    {item.path}
                  </td>
                  <td className={tableCell}>{item.date1}</td>
                  <td className={tableCell}>{item.date2}</td>
                  <td className={`${tableCell} rounded-r-[4px]`}>
                    {item.usedSpace}
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-3 text-center text-[9px] text-slate-400">
                    No records
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Hardware Details */}
        <div className={`${cardClass} p-2`}>
          <h2
            className={`
              text-[15px]
              font-medium
              mb-1.5
              ${isDark ? "text-white/85" : "text-[#374151]"}
            `}
          >
            Hardware Details
          </h2>

          <div className="h-[2px] px-2 rounded mb-1.5 bg-[#f3f4f6] dark:bg-white/[0.04]" />

          <div className="text-[9px] mb-0.5 text-[#666] dark:text-white/40">Identity</div>
          <div className="grid grid-cols-2 gap-1.5 mb-1.5">
            <HardwareItem label="Serial No." isDark={isDark} />
            <HardwareItem label="Mac Address" isDark={isDark} />
          </div>

          <div className="text-[9px] mb-0.5 text-[#666] dark:text-white/40">Processor</div>
          <div className="grid grid-cols-2 gap-1.5 mb-1.5">
            <HardwareItem label="Processor" isDark={isDark} />
            <HardwareItem label="BIOS Info" isDark={isDark} />
            <HardwareItem label="Motherboard" isDark={isDark} />
          </div>

          <div className="text-[9px] mb-0.5 text-[#666] dark:text-white/40">Storage &amp; Memory</div>
          <div className="grid grid-cols-2 gap-1.5">
            <HardwareItem label="All Drives" isDark={isDark} />
            <HardwareItem label="Ram Size" isDark={isDark} />
            <HardwareItem label="Hard Disk Model" isDark={isDark} />
            <HardwareItem label="Graphic Card" isDark={isDark} />
          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM ROW (OS, Monitoring, Protection)
      ====================================================== */}
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-[1.45fr_0.75fr_0.85fr]
          gap-1.5
          mt-1.5
        "
      >
        {/* Operating System Details */}
        <div className={`${cardClass} p-2`}>
          <h2
            className={`
              text-[15px]
              font-medium
              mb-1.5
              ${isDark ? "text-white/85" : "text-[#374151]"}
            `}
          >
            Operating System Details
          </h2>

          <div className="text-[9px] mb-0.5 text-[#666] dark:text-white/40">Identity</div>
          <div className="grid grid-cols-2 gap-1.5 mb-1.5">
            <HardwareItem label="Computer Name" isDark={isDark} />
            <HardwareItem label="Name Of Os" isDark={isDark} />
          </div>

          <div className="text-[9px] mb-0.5 text-[#666] dark:text-white/40">Processor</div>
          <div className="grid grid-cols-2 gap-1.5 mb-1.5">
            <HardwareItem label="Version" isDark={isDark} />
            <HardwareItem label="Architecture" isDark={isDark} />
          </div>

          <div className="text-[9px] mb-0.5 text-[#666] dark:text-white/40">Storage &amp; Memory</div>
          <div className="grid grid-cols-2 gap-1.5">
            <HardwareItem label="Total Ram (MB)" isDark={isDark} />
            <HardwareItem label="Available Ram (MB)" isDark={isDark} />
            <HardwareItem label="CPU Utilization (%)" isDark={isDark} />
          </div>
        </div>

        {/* Drive Monitoring */}
        <div className={`${cardClass} p-2`}>
          <h2
            className={`
              text-[15px]
              font-semibold
              ${isDark ? "text-white/90" : "text-[#1f2937]"}
            `}
          >
            Drive Monitoring
          </h2>

          <div className="flex items-end gap-2 mt-1">
            <span
              className={`
                text-[22px]
                font-semibold
                ${isDark ? "text-white" : "text-[#111827]"}
              `}
            >
              4.38K
            </span>
            <span className="text-[8px] text-[#4ade80] mb-0.5">↗ 22.41%</span>
          </div>

          <div className="relative mt-2 h-[110px]">
            <div
              className={`
                absolute
                right-0
                top-0
                px-2
                py-1
                rounded-[4px]
                text-[7px]
                shadow-md
                z-10
                ${
                  isDark
                    ? "bg-[#111827] border border-white/[0.08] text-white/50"
                    : "bg-white border border-slate-200 text-[#9ca3af]"
                }
              `}
            >
              <div>May 6, 2026</div>
              <div>Prevented Apps 1</div>
            </div>

            <div
              className={`
                absolute
                left-0
                right-0
                top-[35px]
                border-t
                ${isDark ? "border-white/[0.08]" : "border-[#e5e7eb]"}
              `}
            />

            <div
              className="
                absolute
                bottom-0
                left-0
                right-0
                flex
                items-end
                justify-around
                h-[60px]
              "
            >
              {[58, 88, 58, 70, 80, 25].map((h, i) => (
                <div
                  key={i}
                  className={`
                    w-[10px] rounded-t-[2px]
                    ${i === 4 ? "bg-[#6256f5]" : isDark ? "bg-white/[0.12]" : "bg-[#e5e7eb]"}
                  `}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>

            <div
              className={`
                absolute
                bottom-[-14px]
                left-0
                right-0
                flex
                justify-around
                text-[7px]
                ${isDark ? "text-white/40" : "text-[#555]"}
              `}
            >
              <span>0</span>
              <span>10K</span>
              <span>20K</span>
              <span>30K</span>
              <span>0</span>
              <span>10K</span>
            </div>
          </div>
        </div>

        {/* Protection Cards */}
        <div className="flex flex-col gap-1.5">
          <ProtectionCard
            title="Printer Protection"
            allowed="20"
            prevented="32"
            color="#402080"
            isDark={isDark}
          />
          <ProtectionCard
            title="USB Protection"
            allowed="20"
            prevented="32"
            color="#00a95c"
            isDark={isDark}
          />
          <ProtectionCard
            title="USB Connection"
            allowed="20"
            prevented="32"
            color="#f5c400"
            isDark={isDark}
          />
        </div>
      </div>
    </div>
  );
}

export default DriveDetail;