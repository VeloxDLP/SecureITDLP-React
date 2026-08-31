import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
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

// IMPORTANT:
// MailIncidentChart.jsx
// src/components/charts/MailIncidentChart.jsx
//
// dashboardService.js
// src/services/dashboardService.js
//
// Therefore:
import { dashboardService } from "../../services/dashboardService";


// ======================================================
// MODAL COLUMNS
// These match your API response
// ======================================================
const incidentColumns = [
  {
    accessor: "sender",
    header: "SENDER",
  },
  {
    accessor: "receiver",
    header: "RECEIVER",
  },
  {
    accessor: "hostName",
    header: "HOST NAME",
  },
  {
    accessor: "attachments",
    header: "ATTACHMENTS",
  },
  {
    accessor: "subject",
    header: "SUBJECT",
  },
];


// ======================================================
// FORMAT DATE FOR API
//
// Examples:
// 2026-08-31 -> 31-08-2026
// 31-08-2026 -> 31-08-2026
// ======================================================
const formatDateForApi = (dateValue) => {
  if (!dateValue) return "";

  const value = String(dateValue).trim();

  // Already DD-MM-YYYY
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    return value;
  }

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-");
    return `${day}-${month}-${year}`;
  }

  // ISO date
  if (value.includes("T")) {
    const datePart = value.split("T")[0];

    if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      const [year, month, day] = datePart.split("-");
      return `${day}-${month}-${year}`;
    }
  }

  // Try normal Date parsing
  const parsed = new Date(value);

  if (!Number.isNaN(parsed.getTime())) {
    const day = String(parsed.getDate()).padStart(2, "0");
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const year = parsed.getFullYear();

    return `${day}-${month}-${year}`;
  }

  return value;
};


// ======================================================
// DISPLAY DATE
// ======================================================
const formatDisplayDate = (dateValue) => {
  if (!dateValue) return "N/A";

  const value = String(dateValue);

  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    const [day, month, year] = value.split("-");
    return `${day}-${month}-${year}`;
  }

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

  // Your response:
  //
  // {
  //   success: true,
  //   code: "FETCH_SUCCESS",
  //   data: [...]
  // }
  //
  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response)) {
    return response;
  }

  return [];
};


// ======================================================
// MAIN COMPONENT
// ======================================================
export default function MailIncidentChart({
  data = [],
  growth = "+25%",
  isDark = false,
}) {
  // ====================================================
  // MODAL STATES
  // ====================================================
  const [showModal, setShowModal] = useState(false);

  const [selectedDate, setSelectedDate] = useState("");

  const [modalData, setModalData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;


  // ====================================================
  // CHART DATA
  // ====================================================
  const chartData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data.map((item) => ({
      ...item,
      date: item?.date,
      v: Number(item?.count || 0),
    }));
  }, [data]);


  // ====================================================
  // TOTAL INCIDENTS
  // ====================================================
  const totalIncidents = useMemo(() => {
    return chartData.reduce(
      (sum, item) => sum + Number(item?.v || 0),
      0
    );
  }, [chartData]);


  // ====================================================
  // GET DATA FOR CLICKED DATE
  // ====================================================
  const handleDateClick = async (clickedDate) => {
    if (!clickedDate) return;

    console.log("Clicked chart date:", clickedDate);


    setSelectedDate(clickedDate);
    setShowModal(true);
    setSearch("");
    setCurrentPage(1);
    setModalData([]);
    setError("");
    setLoading(true);

    try {
      // ================================================
      // CALL:
      // POST /DashboardModal/EmailModalData/31-08-2026
      // ================================================
      const response =
        await dashboardService.getMailIncidentData(clickedDate);

      console.log("Mail modal API response:", response.data);

      const rows = extractApiRows(response);

      console.log("Mail modal rows:", rows);

      setModalData(rows);

      if (rows.length === 0) {
        setError("No mail incidents found for this date.");
      }
    } catch (err) {
      console.error("Mail incident modal API error:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load mail incident data.";

      setError(message);
      setModalData([]);
    } finally {
      setLoading(false);
    }
  };


  // ====================================================
  // BAR CLICK
  // ====================================================
  const handleBarClick = (entry) => {
    console.log("Bar clicked:", entry);

    // Recharts normally gives:
    // entry.payload.date
    const clickedDate =
      entry?.payload?.date ||
      entry?.date;

    if (!clickedDate) {
      console.warn("No date found in clicked bar:", entry);
      return;
    }

    handleDateClick(clickedDate);
  };


  // ====================================================
  // SEARCH
  // ====================================================
  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return modalData;
    }

    return modalData.filter((row) =>
      incidentColumns.some((column) =>
        String(row?.[column.accessor] ?? "")
          .toLowerCase()
          .includes(term)
      )
    );
  }, [modalData, search]);


  // ====================================================
  // RESET PAGE WHEN SEARCH CHANGES
  // ====================================================
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);


  // ====================================================
  // PAGINATION
  // ====================================================
  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / pageSize)
  );

  const safePage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedRows = filteredRows.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const startRecord =
    filteredRows.length === 0
      ? 0
      : (safePage - 1) * pageSize + 1;

  const endRecord = Math.min(
    safePage * pageSize,
    filteredRows.length
  );


  // ====================================================
  // CLOSE MODAL
  // ====================================================
  const closeModal = () => {
    setShowModal(false);
    setSelectedDate("");
    setModalData([]);
    setSearch("");
    setCurrentPage(1);
    setError("");
  };


  // ====================================================
  // LOCK BODY SCROLL
  // ====================================================
  useEffect(() => {
    if (showModal) {
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
  }, [showModal]);


  // ====================================================
  // RENDER
  // ====================================================
  return (
    <>
      {/* ==================================================
          MAIL INCIDENT CARD
      ================================================== */}
      <div className="flex h-[80px] items-center justify-between">

        {/* LEFT */}
        <div>
          <p className="text-lg text-slate-700 dark:text-white">
            Total Incidents
          </p>

          <h1 className="text-2xl font-light text-slate-800 dark:text-white">
            {totalIncidents}
          </h1>

          <p className="mt-3 whitespace-nowrap text-sm italic text-slate-500 dark:text-white/60">
            Last update yesterday
          </p>
        </div>


        {/* RIGHT CHART */}
        <div className="h-[120px] w-[280px]">

          <ResponsiveContainer
            width="100%"
            height="85%"
          >
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 5,
                left: 5,
                bottom: 0,
              }}
            >

              <CartesianGrid
                vertical={false}
                stroke={
                  isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(15,23,42,0.08)"
                }
              />

              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  formatDisplayDate(value).slice(0, 5)
                }
                tick={{
                  fontSize: 9,
                  fill: isDark
                    ? "rgba(255,255,255,0.45)"
                    : "rgba(15,23,42,0.55)",
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                cursor={{
                  fill: isDark
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(112,148,255,0.05)",
                }}
                formatter={(value) => [
                  value,
                  "Incidents",
                ]}
                labelFormatter={(label) =>
                  `Date: ${formatDisplayDate(label)}`
                }
              />

              <Bar
                dataKey="v"
                fill="#7586ff"
                radius={[8, 8, 0, 0]}
                barSize={14}
                className="cursor-pointer"
                onClick={handleBarClick}
              />

            </BarChart>
          </ResponsiveContainer>


          {/* GROWTH */}
          <div className="text-right text-xs text-cyan-400">
            {growth} vs Last Week
          </div>

        </div>
      </div>


      {/* ==================================================
          MODAL
      ================================================== */}
      {showModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >

          <div
            className="flex h-[80vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-white/[0.08] dark:bg-[#020617]"
            onClick={(e) => e.stopPropagation()}
          >

            {/* ==================================================
                HEADER
            ================================================== */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-white/[0.08]">

              {/* TITLE */}
              <div className="min-w-0">

                <h2 className="truncate text-[15px] font-semibold text-slate-800 dark:text-white">

                  Mail Incident Details

                  <span className="ml-2 text-indigo-600 dark:text-indigo-400">
                    {selectedDate}
                  </span>

                </h2>

                <p className="mt-1 text-[11px] text-slate-400 dark:text-white/40">
                  Showing mail incidents only for the selected date
                </p>

              </div>


              {/* HEADER ACTIONS */}
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
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
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


            {/* ==================================================
                TABLE AREA
            ================================================== */}
            <div className="min-h-0 flex-1 overflow-hidden p-4">

              <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.08]">


                {/* ==================================================
                    LOADING
                ================================================== */}
                {loading ? (

                  <div className="flex flex-1 flex-col items-center justify-center gap-3">

                    <Loader2
                      size={30}
                      className="animate-spin text-indigo-500"
                    />

                    <p className="text-sm text-slate-500 dark:text-white/50">
                      Loading mail incidents for{" "}
                      <span className="font-medium text-indigo-500">
                        {selectedDate}
                      </span>
                      ...
                    </p>

                  </div>

                ) : error && modalData.length === 0 ? (

                  /* ==================================================
                     ERROR / NO DATA
                  ================================================== */
                  <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4">

                    <p className="text-sm font-medium text-slate-500 dark:text-white/50">
                      {error}
                    </p>

                    <p className="text-xs text-slate-400 dark:text-white/30">
                      No records available for {selectedDate}
                    </p>

                  </div>

                ) : (

                  /* ==================================================
                     TABLE
                  ================================================== */
                  <div className="min-h-0 flex-1 overflow-auto">

                    <table className="w-full min-w-[900px] text-[13px]">

                      {/* TABLE HEADER */}
                      <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-white/[0.06]">

                        <tr className="text-left text-slate-500 dark:text-white/50">

                          {incidentColumns.map(
                            (column) => (
                              <th
                                key={column.accessor}
                                className="border-b border-slate-200 px-4 py-3 text-[11px] font-semibold uppercase tracking-wide dark:border-white/[0.08]"
                              >
                                {column.header}
                              </th>
                            )
                          )}

                        </tr>

                      </thead>


                      {/* TABLE BODY */}
                      <tbody>

                        {paginatedRows.length > 0 ? (

                          paginatedRows.map(
                            (row, index) => (

                              <tr
                                key={`${selectedDate}-${index}`}
                                className="bg-white transition hover:bg-[#7094ff]/5 dark:bg-transparent dark:hover:bg-white/[0.03]"
                              >

                                {/* SENDER */}
                                <td className="max-w-[260px] truncate border-b border-slate-100 px-4 py-3 text-slate-700 dark:border-white/[0.05] dark:text-white/80">
                                  <span
                                    title={
                                      row?.sender || "NA"
                                    }
                                  >
                                    {row?.sender || "NA"}
                                  </span>
                                </td>


                                {/* RECEIVER */}
                                <td className="max-w-[260px] truncate border-b border-slate-100 px-4 py-3 text-sky-600 dark:border-white/[0.05] dark:text-sky-400">
                                  <span
                                    title={
                                      row?.receiver || "NA"
                                    }
                                  >
                                    {row?.receiver || "NA"}
                                  </span>
                                </td>


                                {/* HOST NAME */}
                                <td className="border-b border-slate-100 px-4 py-3 font-medium text-slate-700 dark:border-white/[0.05] dark:text-white/80">
                                  {row?.hostName || "NA"}
                                </td>


                                {/* ATTACHMENTS */}
                                <td
                                  className="max-w-[240px] truncate border-b border-slate-100 px-4 py-3 text-slate-500 dark:border-white/[0.05] dark:text-white/50"
                                  title={
                                    row?.attachments || "NA"
                                  }
                                >
                                  {row?.attachments || "NA"}
                                </td>


                                {/* SUBJECT */}
                                <td
                                  className="max-w-[300px] truncate border-b border-slate-100 px-4 py-3 font-medium text-indigo-600 dark:border-white/[0.05] dark:text-indigo-400"
                                  title={
                                    row?.subject || "NA"
                                  }
                                >
                                  {row?.subject || "NA"}
                                </td>

                              </tr>

                            )
                          )

                        ) : (

                          <tr>

                            <td
                              colSpan={
                                incidentColumns.length
                              }
                              className="px-3 py-10 text-center text-slate-400 dark:text-white/30"
                            >
                              No records found for{" "}
                              {selectedDate}
                            </td>

                          </tr>

                        )}

                      </tbody>

                    </table>

                  </div>

                )}


                {/* ==================================================
                    PAGINATION
                ================================================== */}
                {!loading &&
                  modalData.length > 0 && (

                    <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/[0.08] dark:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between">

                      {/* RECORD COUNT */}
                      <span className="text-[12px] text-slate-500 dark:text-white/40">

                        Showing{" "}
                        {startRecord}-{endRecord}{" "}
                        of {filteredRows.length}

                      </span>


                      {/* PAGINATION */}
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
                          <ChevronLeft size={14} />
                          Prev
                        </button>


                        {/* PAGE */}
                        <span className="rounded-lg bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-white/[0.06] dark:text-white/80 dark:ring-white/10">
                          {safePage} / {totalPages}
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