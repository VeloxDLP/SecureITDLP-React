import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { dashboardService } from "../../services/dashboardService";

// ======================================================
// TABLE COLUMNS
// ======================================================
const incidentColumns = [
  { accessor: "hostname", header: "HOSTNAME" },
  { accessor: "ipaddress", header: "IP ADDRESS" },
  { accessor: "keyword", header: "KEYWORD" },
  { accessor: "branch", header: "BRANCH" },
];

// ======================================================
// FORMAT DATE AS YYYY-MM-DD
// ======================================================
const formatDateForApi = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// ======================================================
// GET LAST 7 DAYS
// ======================================================
const getLast7Days = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(formatDateForApi(date));
  }
  return dates;
};

// ======================================================
// CUSTOM TOOLTIP – with dark/light theme
// ======================================================
const CustomTooltip = ({ active, payload, isDark }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`rounded-lg border p-3 shadow-xl ${
          isDark
            ? "border-white/10 bg-[#1a1a2e] text-white"
            : "border-slate-200 bg-white text-slate-800"
        }`}
      >
        <p className="text-sm font-medium">{payload[0]?.payload?.x}</p>
        <p className={`mt-1 text-sm font-semibold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
          {payload[0]?.value}% usage
        </p>
        <p className={`mt-1 text-xs ${isDark ? "text-emerald-400/70" : "text-emerald-500"}`}>
          Click to view details →
        </p>
      </div>
    );
  }
  return null;
};

// ======================================================
// MAIN COMPONENT
// ======================================================
export default function ClipboardIncident({
  data = [],
  isDark = false,
  axisStyle,
  total = 0,
}) {
  // ====================================================
  // MODAL TRANSITION STATES
  // ====================================================
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("Clipboard Incidents");
  const [search, setSearch] = useState("");
  const [modalData, setModalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
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
  // FETCH LAST 7 DAYS CLIPBOARD DATA
  // ====================================================
  const fetchClipboardData = async () => {
    try {
      setLoading(true);
      setApiError("");

      const last7Days = getLast7Days();

      const responses = await Promise.all(
        last7Days.map(async (date) => {
          try {
            const response = await dashboardService.getClipboardModal(date);
            return response;
          } catch (error) {
            console.error(`Clipboard API error for ${date}:`, error);
            return null;
          }
        })
      );

      const combinedData = [];
      responses.forEach((response) => {
        if (response && response.success === true && Array.isArray(response.data)) {
          response.data.forEach((item) => {
            combinedData.push(item);
          });
        }
      });

      setModalData(combinedData);
    } catch (error) {
      console.error("Error fetching clipboard modal data:", error);
      setApiError("Unable to load clipboard incident data.");
      setModalData([]);
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // OPEN MODAL
  // ====================================================
  const openModal = async (category) => {
    setSelectedCategory(category || "Clipboard Incidents");
    setSearch("");
    setCurrentPage(1);
    setModalData([]);
    setApiError("");
    setLoading(true);
    setIsMounted(true);

    await fetchClipboardData();
    requestAnimationFrame(() => setIsOpen(true));
  };

  // ====================================================
  // CLOSE MODAL
  // ====================================================
  const closeModal = () => {
    if (!isOpen) return;
    setIsClosing(true);
    setIsOpen(false);
  };

  const handleTransitionEnd = () => {
    if (isClosing) {
      setIsMounted(false);
      setIsClosing(false);
      setModalData([]);
      setSelectedCategory("Clipboard Incidents");
      setSearch("");
      setCurrentPage(1);
      setApiError("");
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
  // RENDER
  // ====================================================
  return (
    <>
      {/* ==================================================
          CHART SECTION
      ================================================== */}
      <div>
        <div className="mb-4 flex items-baseline gap-1">
          <span className="text-4xl font-bold text-slate-800 dark:text-white">
            {total}
          </span>
          <span className="text-sm font-bold text-emerald-400">↑</span>
        </div>

        <ResponsiveContainer width="100%" height={160}>
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
            onClick={() => openModal("Clipboard Incidents")}
            className="cursor-pointer"
          >
            <defs>
              <linearGradient id="clipGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#22c55e"
                  stopOpacity={isDark ? 0.35 : 0.18}
                />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis dataKey="x" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={(value) => `${value}%`}
              tick={axisStyle}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip content={<CustomTooltip isDark={isDark} />} />

            <Area
              type="monotone"
              dataKey="v"
              stroke="#22c55e"
              fill="url(#clipGrad)"
              strokeWidth={3}
              dot={{ r: 3, fill: "#22c55e", stroke: "#ffffff", strokeWidth: 2 }}
              activeDot={{ r: 5, fill: "#22c55e" }}
              name="%"
              animationDuration={800}
              animationEasing="ease-out"
            />
          </AreaChart>
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
            onClick={(e) => e.stopPropagation()}
          >
            {/* ==================================================
                HEADER
            ================================================== */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-white/[0.08]">
              <div className="min-w-0">
                <h2 className="truncate text-[15px] font-semibold text-slate-800 dark:text-white">
                  Clipboard Incident Details -
                  <span className="ml-1 text-emerald-600 dark:text-emerald-400">
                    {selectedCategory}
                  </span>
                </h2>
                <p className="mt-1 text-[10px] text-slate-400 dark:text-white/30">
                  Last 7 Days
                </p>
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
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-[12px] text-slate-700 outline-none transition focus:border-[#7094ff] focus:ring-2 focus:ring-[#7094ff]/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/80"
                  />
                </div>

                {/* ==================================================
                    CLOSE BUTTON – COMPLETELY STABLE
                    NO TRANSFORMS, NO SCALING, NO ROTATION
                    Only background and color changes on hover
                ================================================== */}
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors duration-200 hover:bg-slate-200 dark:bg-white/[0.06] dark:text-white/60 dark:hover:bg-white/[0.1]"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* ==================================================
                TABLE AREA
            ================================================== */}
            <div className="min-h-0 flex-1 overflow-hidden p-4">
              <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.08]">
                <div className="min-h-0 flex-1 overflow-auto">
                  <table className="w-full text-[13px]">
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
                      {loading ? (
                        <tr>
                          <td colSpan={incidentColumns.length} className="px-3 py-12 text-center text-slate-400 dark:text-white/40">
                            <div className="flex flex-col items-center gap-2">
                              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-[#7094ff] dark:border-white/10 dark:border-t-[#7094ff]" />
                              <span>Loading clipboard incidents...</span>
                            </div>
                          </td>
                        </tr>
                      ) : apiError ? (
                        <tr>
                          <td colSpan={incidentColumns.length} className="px-3 py-10 text-center text-red-500">
                            {apiError}
                          </td>
                        </tr>
                      ) : paginatedRows.length > 0 ? (
                        paginatedRows.map((row, index) => (
                          <tr
                            key={`${row.hostname}-${row.keyword}-${index}`}
                            className="group bg-white transition hover:bg-[#7094ff]/5 dark:bg-transparent dark:hover:bg-white/[0.03]"
                          >
                            <td className="border-b border-slate-100 px-4 py-3 font-medium text-blue-600 dark:border-white/[0.05] dark:text-blue-400">
                              {row.hostname || "NA"}
                            </td>
                            <td className="border-b border-slate-100 px-4 py-3 font-medium text-sky-600 dark:border-white/[0.05] dark:text-sky-400">
                              {row.ipaddress || "NA"}
                            </td>
                            <td
                              className="max-w-[360px] truncate border-b border-slate-100 px-4 py-3 text-slate-700 dark:border-white/[0.05] dark:text-white/80"
                              title={row.keyword}
                            >
                              {row.keyword || "NA"}
                            </td>
                            <td className="border-b border-slate-100 px-4 py-3 text-slate-600 dark:border-white/[0.05] dark:text-white/60">
                              {row.branch || "NA"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={incidentColumns.length} className="px-3 py-10 text-center text-slate-400 dark:text-white/30">
                            No clipboard incidents found for the last 7 days.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* ==================================================
                    PAGINATION
                ================================================== */}
                {!loading && modalData.length > 0 && (
                  <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/[0.08] dark:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-[12px] text-slate-500 dark:text-white/40">
                      Showing {startRecord}-{endRecord} of {filteredRows.length}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={safePage === 1 || loading}
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
                        disabled={safePage === totalPages || loading}
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