import React, { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
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
  if (!data || typeof data !== "object") return 0;

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

  if (!matchedKey) return 0;

  return Number(data[matchedKey] || 0);
};

/* =========================================================
   CUSTOM TOOLTIP
   Tooltip stays OUTSIDE the pie circle.
========================================================= */
const CustomTooltip = ({
  active,
  payload,
  coordinate,
  isDark,
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const item = payload[0]?.payload;

  if (!item) return null;

  return (
    <div
      className={`pointer-events-none rounded-lg border px-3 py-2 text-xs shadow-xl ${
        isDark
          ? "border-white/10 bg-[#1e293b] text-white/90"
          : "border-slate-200 bg-white text-slate-700"
      }`}
      style={{
        position: "absolute",
        left: coordinate?.x
          ? coordinate.x + 22
          : "100%",
        top: coordinate?.y || "50%",
        transform: "translateY(-50%)",
        zIndex: 9999,
        whiteSpace: "nowrap",
      }}
    >
      <p className="font-semibold">
        {item.name}
      </p>

      <p
        className={`mt-1 ${
          isDark
            ? "text-white/60"
            : "text-slate-500"
        }`}
      >
        {item.value}{" "}
        <span className="font-semibold">
          Incidents
        </span>
      </p>
    </div>
  );
};

/* =========================================================
   COMPONENT
========================================================= */
const IncidentByChannel = ({ data = {} }) => {
  const { isDark } = useTheme();

  /* =======================================================
     MODAL TRANSITION STATES
  ======================================================= */
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

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

  const totalIncidents = channelData.reduce(
    (sum, item) =>
      sum + Number(item.value || 0),
    0
  );

  /* =======================================================
     OPEN MODAL
  ======================================================= */
  const openChannelModal = async (channel) => {
    const apiChannel =
      CHANNEL_API_VALUES[channel] || channel;

    setSelectedChannel(channel);
    setSearch("");
    setCurrentPage(1);
    setError("");
    setModalData([]);
    setLoading(true);
    setIsMounted(true);
    setIsClosing(false);

    try {
      const response =
        await dashboardService.getIncidentByChannelModal(
          apiChannel
        );

      setModalData(
        Array.isArray(response?.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error(
        `${channel} API ERROR:`,
        err
      );

      setError(
        err?.response?.data?.message ||
          `Unable to load ${channel} data.`
      );

      setModalData([]);
    } finally {
      setLoading(false);

      requestAnimationFrame(() => {
        setIsOpen(true);
      });
    }
  };

  /* =======================================================
     CLOSE MODAL
  ======================================================= */
  const closeModal = () => {
    if (!isOpen) return;

    setIsClosing(true);
    setIsOpen(false);
  };

  /* =======================================================
     HANDLE TRANSITION END
  ======================================================= */
  const handleTransitionEnd = () => {
    if (isClosing) {
      setIsMounted(false);
      setIsClosing(false);
      setModalData([]);
      setSelectedChannel("");
      setSearch("");
      setCurrentPage(1);
      setError("");
    }
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

    if (isOpen) {
      document.addEventListener(
        "keydown",
        handleEscape
      );
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [isOpen]);

  /* =======================================================
     BODY SCROLL
  ======================================================= */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  /* =======================================================
     SEARCH FILTER
  ======================================================= */
  const filteredData = useMemo(() => {
    if (!search.trim()) {
      return modalData;
    }

    const searchValue =
      search.toLowerCase().trim();

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
        return Object.values(row).some(
          (value) =>
            String(value ?? "")
              .toLowerCase()
              .includes(searchValue)
        );
      }

      return false;
    });
  }, [modalData, search]);

  /* =======================================================
     RESET PAGE WHEN SEARCH CHANGES
  ======================================================= */
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  /* =======================================================
     PAGINATION
  ======================================================= */
  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredData.length / rowsPerPage
    )
  );

  const safePage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safePage - 1) * rowsPerPage;

  const currentRows = filteredData.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const firstRecord =
    filteredData.length === 0
      ? 0
      : startIndex + 1;

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
          PIE CHART + LEGEND
      ===================================================== */}
      <div className="flex w-full items-center justify-between gap-5">
        {/* =================================================
            PIE CHART
            SIZE IS UNCHANGED
        ================================================= */}
        <div className="relative h-[190px] w-[190px] shrink-0">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
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
                    openChannelModal(
                      entry.name
                    );
                  }
                }}
              >
                {channelData.map(
                  (entry, index) => (
                    <Cell
                      key={`channel-${index}`}
                      fill={entry.color}
                    />
                  )
                )}
              </Pie>

              {/* ==========================================
                  TOOLTIP
                  OUTSIDE PIE
              ========================================== */}
              <Tooltip
                content={
                  <CustomTooltip
                    isDark={isDark}
                  />
                }
                wrapperStyle={{
                  outline: "none",
                  zIndex: 9999,
                  pointerEvents: "none",
                  overflow: "visible",
                }}
                allowEscapeViewBox={{
                  x: true,
                  y: true,
                }}
                offset={20}
                cursor={false}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* =================================================
              CENTER LABEL
          ================================================= */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 flex h-[96px] w-[96px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full"
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

        {/* =================================================
            LEGEND
        ================================================= */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {channelData.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() =>
                openChannelModal(
                  item.name
                )
              }
              className="flex w-full items-center justify-between rounded-md px-2 py-1 text-left transition-all duration-200 ease-out hover:translate-x-[2px] hover:bg-slate-100 dark:hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-[8px] w-[8px] rounded-full"
                  style={{
                    backgroundColor:
                      item.color,
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
          MODAL
      ===================================================== */}
      {isMounted && (
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
            isOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          onTransitionEnd={
            handleTransitionEnd
          }
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }
          }}
        >
          {/* =================================================
              MODAL CONTAINER
          ================================================= */}
          <div
            className={`flex h-[80vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 ease-in-out dark:border-white/[0.08] dark:bg-[#020617] ${
              isOpen
                ? "scale-100 opacity-100"
                : "scale-95 opacity-0"
            }`}
          >
            {/* =================================================
                HEADER
            ================================================= */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-white/[0.08]">
              <div className="min-w-0">
                <h2 className="truncate text-[15px] font-semibold text-slate-800 dark:text-white">
                  Incident By Channel –{" "}
                  {selectedChannel}

                  {loading && (
                    <span className="ml-2 text-sm text-slate-400">
                      Loading...
                    </span>
                  )}
                </h2>

                <div className="mt-1 flex items-center gap-2">
                  <span
                    className="h-[8px] w-[8px] rounded-full"
                    style={{
                      backgroundColor:
                        CHANNEL_COLORS[
                          selectedChannel
                        ] ||
                        "#3B5BFF",
                    }}
                  />

                  <span className="text-[11px] text-slate-500 dark:text-white/40">
                    {selectedChannel}
                  </span>
                </div>
              </div>

              {/* =================================================
                  SEARCH + CLOSE
              ================================================= */}
              <div className="flex shrink-0 items-center gap-2">
                <div className="relative w-[220px] sm:w-[260px]">
                  <Search
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                    placeholder={`Search ${selectedChannel}...`}
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-[12px] text-slate-700 outline-none transition focus:border-[#7094ff] focus:ring-2 focus:ring-[#7094ff]/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/80"
                  />
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-white/[0.06] dark:text-white/60 dark:hover:bg-white/[0.1]"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* =================================================
                TABLE SECTION
            ================================================= */}
            <div className="min-h-0 flex-1 overflow-hidden p-4">
              <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.08]">
                <div className="min-h-0 flex-1 overflow-auto">
                  {/* ===========================================
                      LOADING
                  =========================================== */}
                  {loading ? (
                    <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3">
                      <Loader2
                        size={25}
                        className="animate-spin text-[#7094ff]"
                      />

                      <span className="text-[11px] text-slate-400 dark:text-white/30">
                        Loading{" "}
                        {selectedChannel}{" "}
                        incidents...
                      </span>
                    </div>
                  ) : error ? (
                    /* =========================================
                       ERROR
                    ========================================= */
                    <div className="flex h-full min-h-[300px] flex-col items-center justify-center">
                      <span className="text-[12px] text-red-400">
                        {error}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          openChannelModal(
                            selectedChannel
                          )
                        }
                        className="mt-3 rounded-md bg-[#7094ff] px-4 py-2 text-[10px] font-medium text-white transition hover:scale-105"
                      >
                        Retry
                      </button>
                    </div>
                  ) : (
                    /* =========================================
                       TABLE
                    ========================================= */
                    <table className="w-full text-[13px]">
                      <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-white/[0.06]">
                        <tr className="text-left text-slate-500 dark:text-white/50">
                          {getTableHeaders().map(
                            (header) => (
                              <th
                                key={header}
                                className="border-b border-slate-200 px-4 py-3 text-[11px] font-semibold uppercase tracking-wide dark:border-white/[0.08]"
                              >
                                {header}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>

                      <tbody>
                        {currentRows.length >
                        0 ? (
                          currentRows.map(
                            (row, index) => {
                              /* =================================
                                 PRINTER
                              ================================= */
                              if (
                                selectedChannel ===
                                "Printer"
                              ) {
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

                                const isBlocked =
                                  String(
                                    jobStatus
                                  )
                                    .toLowerCase()
                                    .includes(
                                      "prevent"
                                    ) ||
                                  String(
                                    jobStatus
                                  )
                                    .toLowerCase()
                                    .includes(
                                      "fail"
                                    ) ||
                                  String(
                                    jobStatus
                                  )
                                    .toLowerCase()
                                    .includes(
                                      "block"
                                    );

                                return (
                                  <tr
                                    key={`printer-${index}-${date}-${hostName}`}
                                    className="bg-white transition hover:bg-[#7094ff]/5 dark:bg-transparent dark:hover:bg-white/[0.03]"
                                  >
                                    <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3 font-medium text-slate-700 dark:border-white/[0.05] dark:text-white/75">
                                      {branch}
                                    </td>

                                    <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3 text-slate-400 dark:border-white/[0.05] dark:text-white/40">
                                      {formatTimestamp(
                                        date
                                      )}
                                    </td>

                                    <td className="max-w-[300px] truncate border-b border-slate-100 px-4 py-3 font-medium text-sky-600 dark:border-white/[0.05] dark:text-sky-400">
                                      <div
                                        className="truncate"
                                        title={
                                          hostName
                                        }
                                      >
                                        {hostName}
                                      </div>
                                    </td>

                                    <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3 dark:border-white/[0.05]">
                                      <span
                                        className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                                          isBlocked
                                            ? "bg-red-500/10 text-red-400"
                                            : "bg-emerald-500/10 text-emerald-400"
                                        }`}
                                      >
                                        {
                                          jobStatus
                                        }
                                      </span>
                                    </td>
                                  </tr>
                                );
                              }

                              /* =================================
                                 DRIVE
                              ================================= */
                              if (
                                selectedChannel ===
                                "Drive"
                              ) {
                                const branch =
                                  row?.branchName ||
                                  "NA";

                                const ipAddress =
                                  row?.ipAddress ||
                                  "NA";

                                const pcName =
                                  row?.pcName ||
                                  "NA";

                                const cdate =
                                  row?.cdate ||
                                  null;

                                return (
                                  <tr
                                    key={`drive-${index}-${cdate}`}
                                    className="bg-white transition hover:bg-[#7094ff]/5 dark:bg-transparent dark:hover:bg-white/[0.03]"
                                  >
                                    <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3 font-medium text-slate-700 dark:border-white/[0.05] dark:text-white/75">
                                      {branch}
                                    </td>

                                    <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3 text-slate-400 dark:border-white/[0.05] dark:text-white/60">
                                      {
                                        ipAddress
                                      }
                                    </td>

                                    <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3 font-medium text-sky-600 dark:border-white/[0.05] dark:text-sky-400">
                                      {pcName}
                                    </td>

                                    <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3 text-slate-400 dark:border-white/[0.05] dark:text-white/40">
                                      {formatTimestamp(
                                        cdate
                                      )}
                                    </td>
                                  </tr>
                                );
                              }

                              /* =================================
                                 OTHER CHANNELS
                              ================================= */
                              const branch =
                                Array.isArray(row)
                                  ? row[0]
                                  : row?.branchName ||
                                    "NA";

                              const username =
                                Array.isArray(row)
                                  ? row[3]
                                  : row?.username ||
                                    "NA";

                              const eventType =
                                Array.isArray(row)
                                  ? row[1]
                                  : row?.eventType ||
                                    "NA";

                              const device =
                                Array.isArray(row)
                                  ? row[2]
                                  : row?.deviceName ||
                                    row?.ipAddress ||
                                    "NA";

                              const timestamp =
                                Array.isArray(row)
                                  ? row[4]
                                  : row?.cdate ||
                                    row?.timestamp ||
                                    null;

                              return (
                                <tr
                                  key={`other-${index}-${timestamp}`}
                                  className="bg-white transition hover:bg-[#7094ff]/5 dark:bg-transparent dark:hover:bg-white/[0.03]"
                                >
                                  <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3 font-medium text-slate-700 dark:border-white/[0.05] dark:text-white/75">
                                    {branch}
                                  </td>

                                  <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3 text-slate-400 dark:border-white/[0.05] dark:text-white/60">
                                    {username}
                                  </td>

                                  <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3 font-medium text-sky-600 dark:border-white/[0.05] dark:text-sky-400">
                                    {eventType}
                                  </td>

                                  <td className="max-w-[430px] truncate border-b border-slate-100 px-4 py-3 text-slate-400 dark:border-white/[0.05] dark:text-white/45">
                                    <div
                                      className="truncate"
                                      title={String(
                                        device
                                      )}
                                    >
                                      {device}
                                    </div>
                                  </td>

                                  <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3 text-right text-slate-400 dark:border-white/[0.05] dark:text-white/40">
                                    {formatTimestamp(
                                      timestamp
                                    )}
                                  </td>
                                </tr>
                              );
                            }
                          )
                        ) : (
                          <tr>
                            <td
                              colSpan={
                                getTableHeaders()
                                  .length
                              }
                              className="px-3 py-10 text-center text-slate-400 dark:text-white/30"
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
                  <div className="flex shrink-0 flex-col gap-1 border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/[0.08] dark:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-[10px] text-slate-500 dark:text-white/40">
                      Showing {firstRecord}-
                      {lastRecord} of{" "}
                      {filteredData.length}
                    </span>

                    <div className="flex items-center gap-2">
                      {/* PREVIOUS */}
                      <button
                        type="button"
                        disabled={
                          safePage === 1
                        }
                        onClick={() =>
                          setCurrentPage(
                            (prev) =>
                              Math.max(
                                1,
                                prev - 1
                              )
                          )
                        }
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-[12px] font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70 dark:hover:bg-white/[0.08]"
                      >
                        <ChevronLeft
                          size={14}
                        />
                        Prev
                      </button>

                      {/* CURRENT PAGE */}
                      <span className="rounded-lg bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-white/[0.06] dark:text-white/80 dark:ring-white/10">
                        {safePage} /{" "}
                        {totalPages}
                      </span>

                      {/* NEXT */}
                      <button
                        type="button"
                        disabled={
                          safePage ===
                          totalPages
                        }
                        onClick={() =>
                          setCurrentPage(
                            (prev) =>
                              Math.min(
                                totalPages,
                                prev + 1
                              )
                          )
                        }
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12px] font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70 dark:hover:bg-white/[0.08]"
                      >
                        Next
                        <ChevronRight
                          size={14}
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IncidentByChannel;