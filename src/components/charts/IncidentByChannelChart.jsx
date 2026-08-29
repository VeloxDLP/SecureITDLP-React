import React, { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { dashboardService } from "../../services/dashboardService";
import { useTheme } from "../../context/ThemeContext";

/* =========================================================
   CHANNEL COLORS
========================================================= */
const CHANNEL_COLORS = {
  Email: "#1613d3",
  Network: "#0d2e88",
  Printer: "#375ab9",
  Clipboard: "#6375df",
  Drive: "#6EA2B3",
  Peripherals: "#7BBDE8",
};

/* =========================================================
   CHANNEL API VALUES
========================================================= */
const CHANNEL_API_VALUES = {
  Email: "Email",
  Network: "Network",
  Printer: "Printer",
  Clipboard: "Clipboard",
  Drive: "Drive",
  Peripherals: "Peripherals",
};

/* =========================================================
   FORMAT DATE
========================================================= */
const formatTimestamp = (value) => {
  if (!value) return "NA";

  try {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value).trim();
    }

    return date.toLocaleString();
  } catch {
    return String(value).trim();
  }
};

/* =========================================================
   GET CHANNEL VALUE
========================================================= */
const getChannelValue = (data, channel) => {
  if (!data || typeof data !== "object") {
    return 0;
  }

  const keys = Object.keys(data);

  const normalizedChannel = channel
    .replace(/[_\-\s]/g, "")
    .toLowerCase();

  const matchedKey = keys.find((key) => {
    const normalizedKey = String(key)
      .replace(/[_\-\s]/g, "")
      .toLowerCase();

    return (
      normalizedKey === normalizedChannel ||
      normalizedKey.includes(normalizedChannel)
    );
  });

  if (!matchedKey) {
    return 0;
  }

  return Number(data[matchedKey] || 0);
};

/* =========================================================
   COMPONENT
========================================================= */
const IncidentByChannel = ({ data = {} }) => {
  const { isDark } = useTheme();

  /* =======================================================
     STATES
  ======================================================= */
  const [showModal, setShowModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [modalData, setModalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");

  const rowsPerPage = 10;

  /* =======================================================
     CHANNEL DATA
  ======================================================= */
  const channelData = useMemo(() => {
    return [
      {
        name: "Email",
        value: getChannelValue(data, "Email"),
        color: CHANNEL_COLORS.Email,
      },
      {
        name: "Network",
        value: getChannelValue(data, "Network"),
        color: CHANNEL_COLORS.Network,
      },
      {
        name: "Printer",
        value: getChannelValue(data, "Printer"),
        color: CHANNEL_COLORS.Printer,
      },
      {
        name: "Clipboard",
        value: getChannelValue(data, "Clipboard"),
        color: CHANNEL_COLORS.Clipboard,
      },
      {
        name: "Drive",
        value: getChannelValue(data, "Drive"),
        color: CHANNEL_COLORS.Drive,
      },
      {
        name: "Peripherals",
        value: getChannelValue(data, "Peripheral"),
        color: CHANNEL_COLORS.Peripherals,
      },
    ];
  }, [data]);

  /* =======================================================
     TOTAL
  ======================================================= */
  const totalIncidents = channelData.reduce(
    (sum, item) => sum + Number(item.value || 0),
    0
  );

  /* =======================================================
     OPEN MODAL
  ======================================================= */
  const openChannelModal = async (channel) => {
    const apiChannel = CHANNEL_API_VALUES[channel] || channel;

    setSelectedChannel(channel);
    setShowModal(true);
    setLoading(true);
    setModalData([]);
    setSearch("");
    setCurrentPage(1);
    setError("");

    try {
      console.log("Selected Channel:", channel);
      console.log("API Channel:", apiChannel);

      const response =
        await dashboardService.getIncidentByChannelModal(apiChannel);

      console.log(`${channel} API RESPONSE:`, response);
      console.log(`${channel} API DATA:`, response?.data);

      setModalData(
        Array.isArray(response?.data) ? response.data : []
      );
    } catch (err) {
      console.error(`${channel} API ERROR:`, err);

      setError(
        err?.response?.data?.message ||
          `Unable to load ${channel} data.`
      );

      setModalData([]);
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     CLOSE MODAL
  ======================================================= */
  const closeModal = () => {
    setShowModal(false);
    setSelectedChannel("");
    setModalData([]);
    setSearch("");
    setCurrentPage(1);
    setError("");
  };

  /* =======================================================
     ESCAPE KEY
  ======================================================= */
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showModal]);

  /* =======================================================
     BODY SCROLL
  ======================================================= */
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  /* =======================================================
     SEARCH FILTER
  ======================================================= */
  const filteredData = useMemo(() => {
    if (!search.trim()) {
      return modalData;
    }

    const searchValue = search.toLowerCase().trim();

    return modalData.filter((row) => {
      if (!row) return false;

      if (Array.isArray(row)) {
        return row.some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(searchValue)
        );
      }

      if (typeof row === "object") {
        return Object.values(row).some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(searchValue)
        );
      }

      return false;
    });
  }, [modalData, search]);

  /* =======================================================
     RESET PAGE
  ======================================================= */
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  /* =======================================================
     PAGINATION
  ======================================================= */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / rowsPerPage)
  );

  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * rowsPerPage;

  const currentRows = filteredData.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const firstRecord =
    filteredData.length === 0 ? 0 : startIndex + 1;

  const lastRecord = Math.min(
    startIndex + rowsPerPage,
    filteredData.length
  );

  /* =======================================================
     TABLE HEADERS
  ======================================================= */
  const getTableHeaders = () => {
    if (selectedChannel === "Drive") {
      return [
        "BRANCH",
        "IP ADDRESS",
        "PC NAME",
        "DATE",
      ];
    }

    /*
      PRINTER API DATA:

      {
        "branch": "...",
        "date": "...",
        "hostName": "...",
        "jobStatus": "..."
      }
    */
    if (selectedChannel === "Printer") {
      return [
        "BRANCH",
        "DATE",
        "HOST NAME",
        "JOB STATUS",
      ];
    }

    return [
      "BRANCH",
      "USERNAME",
      "EVENT TYPE",
      "DEVICE / FILE DETAILS",
      "TIMESTAMP",
    ];
  };

  /* =======================================================
     RENDER
  ======================================================= */
  return (
    <>
      {/* =====================================================
          PIE CHART
      ===================================================== */}
      <div className="flex w-full items-center justify-between gap-5">
        <div className="relative h-[190px] w-[190px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={channelData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={82}
                paddingAngle={3}
                cornerRadius={6}
                stroke="none"
                style={{
                  cursor: "pointer",
                }}
                onClick={(entry) => {
                  if (entry?.name) {
                    openChannelModal(entry.name);
                  }
                }}
              >
                {channelData.map((entry, index) => (
                  <Cell
                    key={`channel-${index}`}
                    fill={entry.color}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* CENTER */}
          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              flex
              h-[96px]
              w-[96px]
              -translate-x-1/2
              -translate-y-1/2
              flex-col
              items-center
              justify-center
              rounded-full
            "
            style={{
              backgroundColor: isDark
                ? "#111827"
                : "#ffffff",
            }}
          >
            <span className="text-[24px] font-bold text-slate-800 dark:text-white">
              {totalIncidents}
            </span>

            <span className="text-[10px] text-slate-400">
              Incidents
            </span>
          </div>
        </div>

        {/* LEGEND */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {channelData.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => openChannelModal(item.name)}
              className="
                flex
                w-full
                items-center
                justify-between
                rounded-md
                px-2
                py-1
                text-left
                transition-all
                duration-200
                ease-out
                hover:bg-slate-100
                hover:translate-x-[2px]
                dark:hover:bg-white/[0.04]
              "
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-[8px] w-[8px] rounded-full"
                  style={{
                    backgroundColor: item.color,
                  }}
                />

                <span className="text-[11px] text-slate-600 dark:text-white/60">
                  {item.name}
                </span>
              </div>

              <span className="text-[11px] font-semibold text-slate-700 dark:text-white/80">
                {item.value}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* =====================================================
          MODAL OVERLAY
      ===================================================== */}
      {showModal && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/60
            p-4
            backdrop-blur-[3px]

            animate-[fadeIn_180ms_ease-out]
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
          style={{
            animation: "fadeIn 180ms ease-out",
          }}
        >
          {/* =================================================
              MODAL BOX
          ================================================= */}
          <div
            className="
              flex
              h-[78vh]
              w-full
              max-w-[1150px]
              flex-col
              overflow-hidden
              rounded-xl
              border
              border-slate-200
              bg-white
              shadow-2xl
              dark:border-white/[0.08]
              dark:bg-[#020617]

              animate-[modalSlideIn_220ms_ease-out]
            "
            style={{
              animation: "modalSlideIn 220ms ease-out",
            }}
          >
            {/* =================================================
                HEADER
            ================================================= */}
            <div
              className="
                flex
                shrink-0
                items-center
                justify-between
                border-b
                border-slate-200
                px-4
                py-3
                dark:border-white/[0.08]
              "
            >
              <div>
                <h2 className="text-[15px] font-semibold text-slate-800 dark:text-white">
                  Incident By Channel
                </h2>

                <div className="mt-1 flex items-center gap-2">
                  <span
                    className="h-[8px] w-[8px] rounded-full"
                    style={{
                      backgroundColor:
                        CHANNEL_COLORS[selectedChannel] ||
                        "#3B5BFF",
                    }}
                  />

                  <span className="text-[11px] text-slate-500 dark:text-white/40">
                    {selectedChannel}
                  </span>
                </div>
              </div>

              {/* SEARCH + CLOSE */}
              <div className="flex items-center gap-2">
                <div className="relative w-[240px]">
                  <Search
                    size={14}
                    className="
                      pointer-events-none
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                      dark:text-white/30
                    "
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder={`Search ${selectedChannel}...`}
                    className="
                      h-[34px]
                      w-full
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      pl-9
                      pr-3
                      text-[11px]
                      text-slate-700
                      outline-none
                      transition-all
                      duration-200
                      focus:border-[#7094ff]
                      focus:ring-2
                      focus:ring-[#7094ff]/20
                      dark:border-white/10
                      dark:bg-white/[0.04]
                      dark:text-white/80
                    "
                  />
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="
                    flex
                    h-[34px]
                    w-[34px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-slate-100
                    text-slate-500
                    transition-all
                    duration-200
                    hover:rotate-90
                    hover:bg-slate-200
                    dark:bg-white/[0.06]
                    dark:text-white/50
                    dark:hover:bg-white/[0.1]
                  "
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* =================================================
                TABLE SECTION
            ================================================= */}
            <div className="min-h-0 flex-1 p-3">
              <div
                className="
                  flex
                  h-full
                  min-h-0
                  flex-col
                  overflow-hidden
                  rounded-lg
                  border
                  border-slate-200
                  dark:border-white/[0.08]
                "
              >
                {/* TABLE */}
                <div
                  className="
                    min-h-0
                    flex-1
                    overflow-auto
                  "
                  style={{
                    scrollbarWidth: "thin",
                  }}
                >
                  {/* LOADING */}
                  {loading ? (
                    <div
                      className="
                        flex
                        h-full
                        min-h-[300px]
                        flex-col
                        items-center
                        justify-center
                        gap-3
                      "
                    >
                      <Loader2
                        size={25}
                        className="animate-spin text-[#7094ff]"
                      />

                      <span className="text-[11px] text-slate-400 dark:text-white/30">
                        Loading {selectedChannel} incidents...
                      </span>
                    </div>
                  ) : error ? (
                    /* ERROR */
                    <div className="flex h-full min-h-[300px] flex-col items-center justify-center">
                      <span className="text-[12px] text-red-400">
                        {error}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          openChannelModal(selectedChannel)
                        }
                        className="
                          mt-3
                          rounded-md
                          bg-[#7094ff]
                          px-4
                          py-2
                          text-[10px]
                          font-medium
                          text-white
                          transition-all
                          duration-200
                          hover:scale-105
                        "
                      >
                        Retry
                      </button>
                    </div>
                  ) : (
                    <table className="w-full min-w-[900px] border-collapse">
                      {/* HEADER */}
                      <thead className="sticky top-0 z-20 bg-[#111827]">
                        <tr>
                          {getTableHeaders().map((header) => (
                            <th
                              key={header}
                              className="
                                whitespace-nowrap
                                border-b
                                border-white/[0.08]
                                px-4
                                py-3
                                text-left
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-wide
                                text-white/40
                              "
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      {/* BODY */}
                      <tbody>
                        {currentRows.length > 0 ? (
                          currentRows.map((row, index) => {
                            /* ===================================
                               PRINTER
                               
                               API:
                               {
                                 branch: "...",
                                 date: "...",
                                 hostName: "...",
                                 jobStatus: "..."
                               }
                            =================================== */
                            if (selectedChannel === "Printer") {
                              const branch =
                                row?.branch ??
                                row?.branchName ??
                                "NA";

                              const date =
                                row?.date ??
                                row?.cdate ??
                                "NA";

                              const hostName =
                                row?.hostName ??
                                row?.hostname ??
                                "NA";

                              const jobStatus =
                                row?.jobStatus ??
                                row?.jobstatus ??
                                "NA";

                              return (
                                <tr
                                  key={`printer-${index}-${date}-${hostName}`}
                                  className="
                                    transition-all
                                    duration-200
                                    hover:bg-white/[0.025]
                                  "
                                >
                                  {/* BRANCH */}
                                  <td
                                    className="
                                      whitespace-nowrap
                                      border-b
                                      border-white/[0.05]
                                      px-4
                                      py-3
                                      text-[11px]
                                      font-medium
                                      text-white/75
                                    "
                                  >
                                    {branch}
                                  </td>

                                  {/* DATE */}
                                  <td
                                    className="
                                      whitespace-nowrap
                                      border-b
                                      border-white/[0.05]
                                      px-4
                                      py-3
                                      text-[11px]
                                      text-white/40
                                    "
                                  >
                                    {formatTimestamp(date)}
                                  </td>

                                  {/* HOST NAME */}
                                  <td
                                    className="
                                      max-w-[300px]
                                      border-b
                                      border-white/[0.05]
                                      px-4
                                      py-3
                                      text-[11px]
                                      text-blue-400
                                    "
                                  >
                                    <div
                                      className="max-w-[300px] truncate"
                                      title={hostName}
                                    >
                                      {hostName}
                                    </div>
                                  </td>

                                  {/* JOB STATUS */}
                                  <td
                                    className="
                                      whitespace-nowrap
                                      border-b
                                      border-white/[0.05]
                                      px-4
                                      py-3
                                    "
                                  >
                                    <span
                                      className={`
                                        inline-flex
                                        rounded-full
                                        px-2.5
                                        py-1
                                        text-[9px]
                                        font-semibold
                                        transition-all
                                        duration-200
                                        ${
                                          String(jobStatus)
                                            .toLowerCase()
                                            .includes("prevent") ||
                                          String(jobStatus)
                                            .toLowerCase()
                                            .includes("fail") ||
                                          String(jobStatus)
                                            .toLowerCase()
                                            .includes("block")
                                            ? "bg-red-500/10 text-red-400"
                                            : "bg-emerald-500/10 text-emerald-400"
                                        }
                                      `}
                                    >
                                      {jobStatus}
                                    </span>
                                  </td>
                                </tr>
                              );
                            }

                            /* ===================================
                               DRIVE
                            =================================== */
                            if (selectedChannel === "Drive") {
                              const branch =
                                row?.branchName || "NA";

                              const ipAddress =
                                row?.ipAddress || "NA";

                              const pcName =
                                row?.pcName || "NA";

                              const cdate =
                                row?.cdate || null;

                              return (
                                <tr
                                  key={`drive-${index}-${cdate}`}
                                  className="
                                    transition-all
                                    duration-200
                                    hover:bg-white/[0.025]
                                  "
                                >
                                  <td
                                    className="
                                      whitespace-nowrap
                                      border-b
                                      border-white/[0.05]
                                      px-4
                                      py-3
                                      text-[11px]
                                      font-medium
                                      text-white/75
                                    "
                                  >
                                    {branch}
                                  </td>

                                  <td
                                    className="
                                      whitespace-nowrap
                                      border-b
                                      border-white/[0.05]
                                      px-4
                                      py-3
                                      text-[11px]
                                      text-white/60
                                    "
                                  >
                                    {ipAddress}
                                  </td>

                                  <td
                                    className="
                                      whitespace-nowrap
                                      border-b
                                      border-white/[0.05]
                                      px-4
                                      py-3
                                      text-[11px]
                                      font-medium
                                      text-blue-400
                                    "
                                  >
                                    {pcName}
                                  </td>

                                  <td
                                    className="
                                      whitespace-nowrap
                                      border-b
                                      border-white/[0.05]
                                      px-4
                                      py-3
                                      text-[11px]
                                      text-white/40
                                    "
                                  >
                                    {formatTimestamp(cdate)}
                                  </td>
                                </tr>
                              );
                            }

                            /* ===================================
                               NETWORK / OTHER
                            =================================== */
                            const branch = Array.isArray(row)
                              ? row[0]
                              : row?.branchName || "NA";

                            const eventType = Array.isArray(row)
                              ? row[1]
                              : row?.eventType || "NA";

                            const device = Array.isArray(row)
                              ? row[2]
                              : row?.deviceName ||
                                row?.ipAddress ||
                                "NA";

                            const username = Array.isArray(row)
                              ? row[3]
                              : row?.username || "NA";

                            const timestamp = Array.isArray(row)
                              ? row[4]
                              : row?.cdate ||
                                row?.timestamp ||
                                null;

                            return (
                              <tr
                                key={`other-${index}-${timestamp}`}
                                className="
                                  transition-all
                                  duration-200
                                  hover:bg-white/[0.025]
                                "
                              >
                                <td
                                  className="
                                    whitespace-nowrap
                                    border-b
                                    border-white/[0.05]
                                    px-4
                                    py-3
                                    text-[11px]
                                    font-medium
                                    text-white/75
                                  "
                                >
                                  {branch}
                                </td>

                                <td
                                  className="
                                    whitespace-nowrap
                                    border-b
                                    border-white/[0.05]
                                    px-4
                                    py-3
                                    text-[11px]
                                    text-white/60
                                  "
                                >
                                  {username}
                                </td>

                                <td
                                  className="
                                    whitespace-nowrap
                                    border-b
                                    border-white/[0.05]
                                    px-4
                                    py-3
                                    text-[11px]
                                    font-medium
                                    text-blue-400
                                  "
                                >
                                  {eventType}
                                </td>

                                <td
                                  className="
                                    max-w-[430px]
                                    border-b
                                    border-white/[0.05]
                                    px-4
                                    py-3
                                    text-[11px]
                                    text-white/45
                                  "
                                >
                                  <div
                                    className="max-w-[430px] truncate"
                                    title={String(device || "")}
                                  >
                                    {device}
                                  </div>
                                </td>

                                <td
                                  className="
                                    whitespace-nowrap
                                    border-b
                                    border-white/[0.05]
                                    px-4
                                    py-3
                                    text-[11px]
                                    text-white/40
                                  "
                                >
                                  {formatTimestamp(timestamp)}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td
                              colSpan={
                                selectedChannel === "Printer"
                                  ? 4
                                  : selectedChannel === "Drive"
                                  ? 4
                                  : 5
                              }
                              className="
                                px-4
                                py-16
                                text-center
                                text-[12px]
                                text-white/30
                              "
                            >
                              {search
                                ? "No matching incidents found"
                                : `No ${selectedChannel} incident records found`}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* =================================================
                    PAGINATION
                ================================================= */}
                {!loading && !error && (
                  <div
                    className="
                      flex
                      shrink-0
                      items-center
                      justify-between
                      border-t
                      border-white/[0.08]
                      bg-white/[0.02]
                      px-4
                      py-3
                    "
                  >
                    <span className="text-[10px] text-white/35">
                      Showing {firstRecord}-{lastRecord} of{" "}
                      {filteredData.length}
                    </span>

                    <div className="flex items-center gap-2">
                      {/* PREVIOUS */}
                      <button
                        type="button"
                        disabled={safePage <= 1}
                        onClick={() =>
                          setCurrentPage((page) =>
                            Math.max(1, page - 1)
                          )
                        }
                        className="
                          flex
                          h-[30px]
                          items-center
                          gap-1
                          rounded-md
                          border
                          border-white/10
                          bg-white/[0.03]
                          px-2.5
                          text-[10px]
                          text-white/50
                          transition-all
                          duration-200
                          hover:bg-white/[0.07]
                          hover:text-white/80
                          disabled:cursor-not-allowed
                          disabled:opacity-30
                        "
                      >
                        <ChevronLeft size={13} />
                        Prev
                      </button>

                      {/* CURRENT PAGE */}
                      <span
                        className="
                          flex
                          h-[30px]
                          min-w-[50px]
                          items-center
                          justify-center
                          rounded-md
                          bg-[#7094ff]
                          px-2
                          text-[10px]
                          font-semibold
                          text-white
                        "
                      >
                        {safePage} / {totalPages}
                      </span>

                      {/* NEXT */}
                      <button
                        type="button"
                        disabled={safePage >= totalPages}
                        onClick={() =>
                          setCurrentPage((page) =>
                            Math.min(
                              totalPages,
                              page + 1
                            )
                          )
                        }
                        className="
                          flex
                          h-[30px]
                          items-center
                          gap-1
                          rounded-md
                          border
                          border-white/10
                          bg-white/[0.03]
                          px-2.5
                          text-[10px]
                          text-white/50
                          transition-all
                          duration-200
                          hover:bg-white/[0.07]
                          hover:text-white/80
                          disabled:cursor-not-allowed
                          disabled:opacity-30
                        "
                      >
                        Next
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          SMOOTH MODAL ANIMATIONS
          Put these in the component so no separate CSS file
          is required.
      ========================================================= */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: translateY(14px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </>
  );
};

export default IncidentByChannel;