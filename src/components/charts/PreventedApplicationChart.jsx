import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

import { dashboardService } from "../../services/dashboardService";

// ======================================================
// MODAL COLUMNS
// ======================================================
const incidentColumns = [
  { accessor: "ipAddress", header: "IP ADDRESS" },
  { accessor: "username", header: "USERNAME" },
  { accessor: "eventType", header: "EVENT TYPE" },
  { accessor: "fileDetails", header: "FILE DETAILS" },
  { accessor: "timestamp", header: "TIMESTAMP" },
];

// ======================================================
// EVENT TYPE COLOR
// ======================================================
const eventTypeColor = (eventType) => {
  const type = eventType?.toLowerCase() || "";
  if (type.includes("upload")) return "text-blue-600 dark:text-blue-400";
  if (type.includes("transfer")) return "text-green-600 dark:text-green-400";
  if (type.includes("usb")) return "text-yellow-600 dark:text-yellow-400";
  if (type.includes("prevent")) return "text-red-600 dark:text-red-400";
  return "text-slate-600 dark:text-white/50";
};

// ======================================================
// DATE FORMAT FOR API (YYYY-MM-DD)
// ======================================================
const formatDateForApi = (dateValue) => {
  if (!dateValue) return "";

  if (dateValue instanceof Date && !isNaN(dateValue)) {
    const year = dateValue.getFullYear();
    const month = String(dateValue.getMonth() + 1).padStart(2, "0");
    const day = String(dateValue.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const value = String(dateValue).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    const [day, month, year] = value.split("-");
    return `${year}-${month}-${day}`;
  }
  if (value.includes("T")) {
    const datePart = value.split("T")[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return datePart;
  }
  const parsed = new Date(value);
  if (!isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return value;
};

// ======================================================
// DISPLAY DATE (DD-MM-YYYY) for UI
// ======================================================
const formatDisplayDate = (dateValue) => {
  if (!dateValue) return "N/A";
  const value = String(dateValue);
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) return value;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-");
    return `${day}-${month}-${year}`;
  }
  return value;
};

// ======================================================
// SAFE API DATA EXTRACTION
// ======================================================
const extractApiRows = (response) => {
  if (!response) return [];
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response)) return response;
  return [];
};

// ======================================================
// MAIN COMPONENT
// ======================================================
export default function PreventedApplicationChart({
  data = [],
  gridColor,
  axisStyle,
  isDark = false,
}) {
  // ====================================================
  // MODAL TRANSITION STATES
  // ====================================================
  const [isOpen, setIsOpen] = useState(false);          // controls visibility (enter/exit)
  const [isMounted, setIsMounted] = useState(false);    // whether modal is in DOM
  const [isClosing, setIsClosing] = useState(false);    // flag for exit animation

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [modalData, setModalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // ====================================================
  // LOCK BODY SCROLL
  // ====================================================
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

  // ====================================================
  // CHART DATA
  // ====================================================
  const chartData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({
      ...item,
      date: item?.date,
      count: Number(item?.count || 0),
    }));
  }, [data]);

  // ====================================================
  // GET PREVENTED APPLICATION DATA
  // ====================================================
  const handleDateClick = async (clickedDate) => {
    if (!clickedDate) return;

    const apiDate = formatDateForApi(clickedDate);

    console.log("Clicked prevented application date:", clickedDate);
    console.log("Prevented application API date:", apiDate);

    setSelectedDate(clickedDate);
    setSelectedCategory("Prevented Applications");
    setSearch("");
    setCurrentPage(1);
    setModalData([]);
    setError("");
    setLoading(true);

    // Mount the modal
    setIsMounted(true);

    try {
      const response = await dashboardService.getPreventedApplicationData(apiDate);
      console.log("Prevented application modal API response:", response);

      const rawRows = extractApiRows(response);
      console.log("Raw rows:", rawRows);

      const transformedRows = rawRows.map((item) => ({
        ipAddress: item.hostName || "NA",
        username: "NA",
        eventType: item.applicationName || "Prevented",
        fileDetails: item.applicationPath || "NA",
        timestamp: item.ctime || "NA",
      }));

      setModalData(transformedRows);

      if (transformedRows.length === 0) {
        setError("No prevented application incidents found for this date.");
      }
    } catch (err) {
      console.error("Prevented application modal API error:", err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to load prevented application data.";
      setError(message);
      setModalData([]);
    } finally {
      setLoading(false);
      // Trigger enter animation after mount (next frame)
      requestAnimationFrame(() => setIsOpen(true));
    }
  };

  // ====================================================
  // BAR CLICK
  // ====================================================
  const handleBarClick = (entry) => {
    console.log("Prevented application bar clicked:", entry);
    const clickedDate = entry?.payload?.date || entry?.date;
    if (!clickedDate) {
      console.warn("No date found in clicked bar:", entry);
      return;
    }
    handleDateClick(clickedDate);
  };

  // ====================================================
  // CLOSE MODAL
  // ====================================================
  const closeModal = () => {
    if (!isOpen) return;
    setIsClosing(true);
    setIsOpen(false); // triggers exit animation
  };

  // After exit animation completes, unmount the modal
  const handleTransitionEnd = () => {
    if (isClosing) {
      setIsMounted(false);
      setIsClosing(false);
      setModalData([]);
      setSelectedDate("");
      setSelectedCategory("");
      setSearch("");
      setCurrentPage(1);
      setError("");
    }
  };

  // ====================================================
  // SEARCH
  // ====================================================
  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return modalData;
    return modalData.filter((row) =>
      incidentColumns.some((column) =>
        String(row?.[column.accessor] ?? "").toLowerCase().includes(term)
      )
    );
  }, [modalData, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // ====================================================
  // PAGINATION
  // ====================================================
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedRows = filteredRows.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );
  const startRecord = filteredRows.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endRecord = Math.min(safePage * pageSize, filteredRows.length);

  // ====================================================
  // CUSTOM TOOLTIP (with dark/light theme)
  // ====================================================
  const CustomTooltip = (props) => {
    const { active, payload } = props;

    if (active && payload && payload.length) {
      const clickedDate = payload[0]?.payload?.date;
      const count = payload[0]?.value ?? 0;

      return (
        <div
          className={`cursor-pointer rounded-lg border p-2 shadow-lg transition-colors ${
            isDark
              ? "border-white/10 bg-[#1e293b] hover:bg-[#0a0f1e]"
              : "border-slate-200 bg-white hover:bg-slate-50"
          }`}
          onClick={() => handleDateClick(clickedDate)}
        >
          <p className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-700"}`}>
            {formatDisplayDate(clickedDate)}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            {count} prevented
          </p>
          <p className="mt-1 text-xs text-blue-500 dark:text-blue-300">
            Click to view details →
          </p>
        </div>
      );
    }
    return null;
  };

  // ====================================================
  // RENDER
  // ====================================================
  return (
    <>
      {/* ==================================================
          PREVENTED APPLICATION CARD
      ================================================== */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[12px] font-semibold text-slate-700 dark:text-white/80">
            Prevented Application
          </p>
        </div>

        {/* CHART */}
        <ResponsiveContainer width="100%" height={210}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -38, bottom: 2 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => formatDisplayDate(date).slice(0, 5)}
              tick={axisStyle}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={axisStyle}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar
              dataKey="count"
              fill="#7094ff"
              radius={[6, 6, 0, 0]}
              barSize={15}
              className="cursor-pointer"
              onClick={handleBarClick}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ==================================================
          MODAL – with smooth transitions
      ================================================== */}
      {isMounted && (
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
            isOpen ? "opacity-100" : "opacity-0"
          } ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
          onTransitionEnd={handleTransitionEnd}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            className={`flex h-[80vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 ease-in-out dark:border-white/[0.08] dark:bg-[#020617] ${
              isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            {/* HEADER */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-white/[0.08]">
              <div className="min-w-0">
                <h2 className="truncate text-[15px] font-semibold text-slate-800 dark:text-white">
                  Prevented Application Details
                  <span className="ml-2 text-red-600 dark:text-red-400">
                    {selectedDate ? formatDisplayDate(selectedDate) : ""}
                  </span>
                </h2>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {/* SEARCH */}
                <div className="relative w-[220px] sm:w-[260px]">
                  <Search
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    disabled={loading}
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-[12px] text-slate-700 outline-none transition focus:border-[#7094ff] focus:ring-2 focus:ring-[#7094ff]/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/80"
                  />
                </div>

                {/* CLOSE */}
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-white/[0.06] dark:text-white/60 dark:hover:bg-white/[0.1]"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* TABLE AREA */}
            <div className="min-h-0 flex-1 overflow-hidden p-4">
              <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.08]">
                {loading ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-3">
                    <Loader2 size={30} className="animate-spin text-indigo-500" />
                    <p className="text-sm text-slate-500 dark:text-white/50">
                      Loading prevented applications for{" "}
                      <span className="font-medium text-indigo-500">
                        {formatDisplayDate(selectedDate)}
                      </span>
                      ...
                    </p>
                  </div>
                ) : error && modalData.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4">
                    <p className="text-sm font-medium text-slate-500 dark:text-white/50">
                      {error}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-white/30">
                      No records available for {formatDisplayDate(selectedDate)}
                    </p>
                  </div>
                ) : (
                  <div className="min-h-0 flex-1 overflow-auto">
                    <table className="w-full min-w-[900px] text-[13px]">
                      <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-white/[0.06]">
                        <tr className="text-left text-slate-500 dark:text-white/50">
                          {incidentColumns.map((column) => (
                            <th
                              key={column.accessor}
                              className="border-b border-slate-200 px-4 py-3 text-[11px] font-semibold uppercase tracking-wide dark:border-white/[0.08]"
                            >
                              {column.header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedRows.length > 0 ? (
                          paginatedRows.map((row, index) => (
                            <tr
                              key={`${selectedDate}-${index}`}
                              className="bg-white transition hover:bg-[#7094ff]/5 dark:bg-transparent dark:hover:bg-white/[0.03]"
                            >
                              <td className="border-b border-slate-100 px-4 py-3 font-medium text-sky-600 dark:border-white/[0.05] dark:text-sky-400">
                                {row.ipAddress || "NA"}
                              </td>
                              <td className="border-b border-slate-100 px-4 py-3 text-slate-700 dark:border-white/[0.05] dark:text-white/80">
                                {row.username || "NA"}
                              </td>
                              <td
                                className={`border-b border-slate-100 px-4 py-3 font-medium dark:border-white/[0.05] ${eventTypeColor(
                                  row.eventType
                                )}`}
                              >
                                {row.eventType || "NA"}
                              </td>
                              <td
                                className="max-w-[360px] truncate border-b border-slate-100 px-4 py-3 text-slate-400 dark:border-white/[0.05] dark:text-white/30"
                                title={row.fileDetails || "NA"}
                              >
                                {row.fileDetails || "NA"}
                              </td>
                              <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3 text-right text-slate-400 dark:border-white/[0.05] dark:text-white/40">
                                {row.timestamp || "NA"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={incidentColumns.length} className="px-3 py-10 text-center text-slate-400 dark:text-white/30">
                              No records found for {formatDisplayDate(selectedDate)}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* PAGINATION */}
                {!loading && modalData.length > 0 && (
                  <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/[0.08] dark:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-[12px] text-slate-500 dark:text-white/40">
                      Showing {startRecord}-{endRecord} of {filteredRows.length}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={safePage === 1}
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-[12px] font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70 dark:hover:bg-white/[0.08]"
                      >
                        <ChevronLeft size={14} />
                        Prev
                      </button>
                      <span className="rounded-lg bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-white/[0.06] dark:text-white/80 dark:ring-white/10">
                        {safePage} / {totalPages}
                      </span>
                      <button
                        type="button"
                        disabled={safePage === totalPages}
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-[12px] font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70 dark:hover:bg-white/[0.08]"
                      >
                        Next
                        <ChevronRight size={14} />
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
}