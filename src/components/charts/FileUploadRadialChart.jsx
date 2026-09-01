import React, { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { dashboardService } from "../../services/dashboardService";

// Column configuration – all columns to display in the modal table
const incidentColumns = [
  { accessor: "ipAddress", header: "IP ADDRESS" },
  { accessor: "action", header: "ACTION" },
  { accessor: "applicationName", header: "APPLICATION NAME" },
  { accessor: "fileDetails", header: "FILE DETAILS" },
  { accessor: "timestamp", header: "TIMESTAMP" },
  { accessor: "destinationPath", header: "DESTINATION PATH" },
];

// ============================================================
// CUSTOM TOOLTIP – matches the "Email 23 Incidents" style
// ============================================================
const CustomPieTooltip = ({ active, payload, isDark }) => {
  if (active && payload && payload.length) {
    // Get the actual segment (skip "remaining")
    const item = payload.find((p) => p.name && p.name !== "remaining");
    if (!item) return null;

    // Find the matching data item to get the count
    // The payload doesn't have count directly, we need to find it from the outer data
    // But we can access the count from the payload's payload object if we pass it
    const count = item.payload?.count ?? item.value;

    return (
      <div
        className={`rounded-lg border px-3 py-2 shadow-lg ${
          isDark
            ? "border-white/10 bg-[#1a1a2e] text-white"
            : "border-slate-200 bg-white text-slate-800"
        }`}
      >
        <p className={`text-xs font-medium ${isDark ? "text-white" : "text-slate-700"}`}>
          {item.name}
        </p>
        <p className={`text-xs ${isDark ? "text-white/70" : "text-slate-500"}`}>
          {count} Incidents
        </p>
      </div>
    );
  }
  return null;
};

export default function FileUploadRadialChart({
  data = [],
  isDark = false,
}) {
  // ====================================================
  // MODAL TRANSITION STATES
  // ====================================================
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [modalData, setModalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

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
  // GET TODAY'S DATE
  // ====================================================
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // ====================================================
  // OPEN MODAL + FETCH DATA
  // ====================================================
  const openModal = async (category) => {
    setSelectedCategory(category);
    setSearch("");
    setCurrentPage(1);
    setModalData([]);
    setApiError(null);
    setLoading(true);
    setIsMounted(true);

    const requestData = {
      event_type: category,
      timestamp: getTodayDate(),
    };

    try {
      const response = await dashboardService.getFileUploadModal(requestData);
      if (Array.isArray(response?.data)) {
        setModalData(response.data);
      } else if (Array.isArray(response)) {
        setModalData(response);
      } else {
        setModalData([]);
      }
    } catch (error) {
      console.error("Error fetching File Upload Modal data:", error);
      setApiError(error.message || "Failed to load data. Please try again.");
      setModalData([]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => setIsOpen(true));
    }
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
      setSelectedCategory("");
      setSearch("");
      setCurrentPage(1);
      setApiError(null);
    }
  };

  // ====================================================
  // CHART DATA
  // ====================================================
  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleString("default", { month: "short" });

  // Prepare pie data with names and counts for tooltip
  const outerData = [
    { 
      name: data[0]?.name || "FTP", 
      value: data[0]?.value || 0,
      count: data[0]?.count || 0,
    },
    { 
      name: "remaining", 
      value: 100 - (data[0]?.value || 0),
      count: 0,
    },
  ];
  const middleData = [
    { 
      name: data[1]?.name || "Network", 
      value: data[1]?.value || 0,
      count: data[1]?.count || 0,
    },
    { 
      name: "remaining", 
      value: 100 - (data[1]?.value || 0),
      count: 0,
    },
  ];
  const innerData = [
    { 
      name: data[2]?.name || "Web", 
      value: data[2]?.value || 0,
      count: data[2]?.count || 0,
    },
    { 
      name: "remaining", 
      value: 100 - (data[2]?.value || 0),
      count: 0,
    },
  ];

  // ====================================================
  // SEARCH & FILTER
  // ====================================================
  const safeData = Array.isArray(modalData) ? modalData : [];

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return safeData;
    return safeData.filter((row) =>
      incidentColumns.some((col) =>
        String(row[col.accessor] ?? "").toLowerCase().includes(term)
      )
    );
  }, [safeData, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredRows]);

  // ====================================================
  // PAGINATION
  // ====================================================
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

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
      {/* Chart + Legend */}
      <div className="flex items-center justify-between gap-4">
        {/* Chart - Clickable */}
        <div
          className="relative flex-shrink-0 cursor-pointer"
          style={{ width: 140, height: 180 }}
          onClick={() => openModal(data[0]?.name || "FILE UPLOAD")}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              {/* Outer Ring */}
              <Pie
                data={outerData}
                dataKey="value"
                nameKey="name"
                startAngle={90}
                endAngle={-250}
                innerRadius={60}
                outerRadius={70}
                stroke="none"
                cornerRadius={20}
              >
                <Cell key="outer-active" fill={data[0]?.color || "#7094ff"} />
                <Cell key="outer-inactive" fill="#23232c" />
              </Pie>

              {/* Middle Ring */}
              <Pie
                data={middleData}
                dataKey="value"
                nameKey="name"
                startAngle={90}
                endAngle={-250}
                innerRadius={44}
                outerRadius={54}
                stroke="none"
                cornerRadius={20}
              >
                <Cell key="middle-active" fill={data[1]?.color || "#4f8cff"} />
                <Cell key="middle-inactive" fill="#23232c" />
              </Pie>

              {/* Inner Ring */}
              <Pie
                data={innerData}
                dataKey="value"
                nameKey="name"
                startAngle={90}
                endAngle={-250}
                innerRadius={28}
                outerRadius={38}
                stroke="none"
                cornerRadius={20}
              >
                <Cell key="inner-active" fill={data[2]?.color || "#2d5cff"} />
                <Cell key="inner-inactive" fill="#23232c" />
              </Pie>

              {/* Custom Tooltip – shows "Name Incidents" like the image */}
              <Tooltip
                content={<CustomPieTooltip isDark={isDark} />}
                cursor={false}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold dark:text-white">{day}</span>
            <span className="text-xs dark:text-white/40">{month}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 flex-1">
          {data.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between cursor-pointer rounded-md px-1 -mx-1 transition hover:bg-slate-100 dark:hover:bg-white/[0.05]"
              onClick={() => openModal(item.name)}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs dark:text-white/70 text-slate-600">
                  {item.name}
                </span>
              </div>
              <span
                className="text-xs font-semibold"
                style={{ color: item.color }}
              >
                {item.count}
              </span>
            </div>
          ))}
        </div>
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
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-white/[0.08]">
              <div className="min-w-0">
                <h2 className="truncate text-[15px] font-semibold text-slate-800 dark:text-white">
                  File Upload Details -
                  <span className="text-blue-600 dark:text-blue-400">
                    {" "}{selectedCategory}
                  </span>
                </h2>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {/* Search */}
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
                {/* Close */}
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 dark:bg-white/[0.06] dark:text-white/60 dark:hover:bg-white/[0.1]"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="min-h-0 flex-1 overflow-hidden p-4">
              <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.08]">
                <div className="min-h-0 flex-1 overflow-auto">
                  <table className="w-full text-[13px]">
                    <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-white/[0.06]">
                      <tr className="text-left text-slate-500 dark:text-white/50">
                        {incidentColumns.map((col) => (
                          <th
                            key={col.accessor}
                            className="border-b border-slate-200 px-4 py-3 text-[11px] font-semibold uppercase tracking-wide dark:border-white/[0.08]"
                          >
                            {col.header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={incidentColumns.length} className="px-3 py-10 text-center text-slate-400 dark:text-white/30">
                            Loading...
                          </td>
                        </tr>
                      ) : apiError ? (
                        <tr>
                          <td colSpan={incidentColumns.length} className="px-3 py-10 text-center text-red-500 dark:text-red-400">
                            {apiError}
                          </td>
                        </tr>
                      ) : paginatedRows.length > 0 ? (
                        paginatedRows.map((row, index) => (
                          <tr
                            key={index}
                            className="bg-white transition hover:bg-[#7094ff]/5 dark:bg-transparent dark:hover:bg-white/[0.03]"
                          >
                            <td className="border-b border-slate-100 px-4 py-3 font-medium text-sky-600 dark:border-white/[0.05] dark:text-sky-400">
                              {row.ipAddress || row.ipaddress || "NA"}
                            </td>
                            <td className="border-b border-slate-100 px-4 py-3 text-slate-700 dark:border-white/[0.05] dark:text-white/80">
                              {row.action || "NA"}
                            </td>
                            <td className="border-b border-slate-100 px-4 py-3 text-slate-700 dark:border-white/[0.05] dark:text-white/80">
                              {row.applicationName || "NA"}
                            </td>
                            <td
                              className="max-w-[360px] truncate border-b border-slate-100 px-4 py-3 text-slate-400 dark:border-white/[0.05] dark:text-white/30"
                              title={row.fileDetails || row.file_details || row.fileName || ""}
                            >
                              {row.fileDetails || row.file_details || row.fileName || "NA"}
                            </td>
                            <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3 text-right text-slate-400 dark:border-white/[0.05] dark:text-white/40">
                              {row.timestamp || "NA"}
                            </td>
                            <td
                              className="max-w-[200px] truncate border-b border-slate-100 px-4 py-3 text-slate-400 dark:border-white/[0.05] dark:text-white/40"
                              title={row.destinationPath || row.destination_path || ""}
                            >
                              {row.destinationPath || row.destination_path || "NA"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={incidentColumns.length} className="px-3 py-10 text-center text-slate-400 dark:text-white/30">
                            No records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
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
                        <ChevronLeft size={14} /> Prev
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
                        Next <ChevronRight size={14} />
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