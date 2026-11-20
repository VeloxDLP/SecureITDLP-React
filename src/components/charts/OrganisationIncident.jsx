
import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";

const incidentColumns = [
  { accessor: "ipAddress", header: "IP ADDRESS" },
  { accessor: "username", header: "USERNAME" },
  { accessor: "eventType", header: "EVENT TYPE" },
  { accessor: "fileDetails", header: "FILE DETAILS" },
  { accessor: "timestamp", header: "TIMESTAMP" },
];

const eventTypeColor = (eventType) => {
  const type = eventType?.toLowerCase() || "";

  if (type.includes("upload")) return "text-blue-600 dark:text-blue-400";
  if (type.includes("transfer")) return "text-green-600 dark:text-green-400";
  if (type.includes("usb")) return "text-yellow-600 dark:text-yellow-400";

  return "text-slate-600 dark:text-white/50";
};

export default function OrganisationIncident({
  data = [],
  isDark,
  axisStyle,
  gridColor,
  Tip,
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [search, setSearch] = useState("");
  const [pageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  /* =====================================================
     MODAL ANIMATION
  ===================================================== */
  useEffect(() => {
    if (!isMounted) return undefined;

    const frame = requestAnimationFrame(() => setIsOpen(true));

    return () => cancelAnimationFrame(frame);
  }, [isMounted]);

  /* =====================================================
     BODY SCROLL LOCK
  ===================================================== */
  useEffect(() => {
    if (isMounted) {
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
  }, [isMounted]);

  /* =====================================================
     INCIDENT DATA
  ===================================================== */
  const modalData = [
    // {
    //   ipAddress: "192.168.0.41",
    //   username: "VELOX",
    //   eventType: "NETWORK UPLOAD",
    //   fileDetails: "NA",
    //   timestamp: "2024-01-15 10:30:00",
    // },
    // {
    //   ipAddress: "192.168.0.42",
    //   username: "Admin",
    //   eventType: "WEB UPLOAD",
    //   fileDetails: "NA",
    //   timestamp: "2024-01-15 11:15:00",
    // },
    // {
    //   ipAddress: "192.168.0.43",
    //   username: "User1",
    //   eventType: "FTP TRANSFER",
    //   fileDetails: "NA",
    //   timestamp: "2024-01-15 12:00:00",
    // },
    // {
    //   ipAddress: "192.168.0.44",
    //   username: "VELOX",
    //   eventType: "NETWORK UPLOAD",
    //   fileDetails: "NA",
    //   timestamp: "2024-01-15 13:30:00",
    // },
    // {
    //   ipAddress: "192.168.0.45",
    //   username: "Kiran_Tester",
    //   eventType: "WEB UPLOAD",
    //   fileDetails: "NA",
    //   timestamp: "2024-01-15 14:45:00",
    // },
    // {
    //   ipAddress: "192.168.0.46",
    //   username: "VELOX",
    //   eventType: "USB TRANSFER",
    //   fileDetails: "NA",
    //   timestamp: "2024-01-15 15:20:00",
    // },
    // {
    //   ipAddress: "192.168.0.47",
    //   username: "User2",
    //   eventType: "NETWORK UPLOAD",
    //   fileDetails: "NA",
    //   timestamp: "2024-01-15 16:10:00",
    // },
    // {
    //   ipAddress: "192.168.0.48",
    //   username: "VELOX",
    //   eventType: "WEB UPLOAD",
    //   fileDetails: "NA",
    //   timestamp: "2024-01-15 17:00:00",
    // },
    // {
    //   ipAddress: "192.168.0.49",
    //   username: "Kira_Tester",
    //   eventType: "FTP TRANSFER",
    //   fileDetails: "NA",
    //   timestamp: "2024-01-15 18:30:00",
    // },
    // {
    //   ipAddress: "192.168.0.50",
    //   username: "VELOX",
    //   eventType: "NETWORK UPLOAD",
    //   fileDetails: "NA",
    //   timestamp: "2024-01-15 19:45:00",
    // },
    // {
    //   ipAddress: "192.168.0.51",
    //   username: "Admin",
    //   eventType: "WEB UPLOAD",
    //   fileDetails: "NA",
    //   timestamp: "2024-01-15 20:30:00",
    // },
    // {
    //   ipAddress: "192.168.0.52",
    //   username: "User3",
    //   eventType: "NETWORK UPLOAD",
    //   fileDetails: "NA",
    //   timestamp: "2024-01-15 21:15:00",
    // },
    // {
    //   ipAddress: "192.168.0.53",
    //   username: "VELOX",
    //   eventType: "USB TRANSFER",
    //   fileDetails: "NA",
    //   timestamp: "2024-01-15 22:00:00",
    // },
  ];

  /* =====================================================
     CHART DATA
  ===================================================== */
  const defaultSlots = [
    { x: "00:00-03:59", count: 0 },
    { x: "04:00-07:59", count: 0 },
    { x: "08:00-11:59", count: 0 },
    { x: "12:00-15:59", count: 0 },
    { x: "16:00-19:59", count: 0 },
    { x: "20:00-23:59", count: 0 },
  ];

  const chartData = defaultSlots.map((slot) => {
    const item = data.find((d) => d.timeSlot === slot.x);

    return {
      ...slot,
      Endpoints: item ? item.uniqueHostCount : 0,
    };
  });

  /* =====================================================
     SEARCH FILTER
  ===================================================== */
  const safeData = Array.isArray(modalData) ? modalData : [];

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return safeData;

    return safeData.filter((row) =>
      incidentColumns.some((col) =>
        String(row[col.accessor] ?? "")
          .toLowerCase()
          .includes(term)
      )
    );
  }, [safeData, search]);

  /* =====================================================
     RESET PAGINATION
  ===================================================== */
  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize]);

  /* =====================================================
     PAGINATION
  ===================================================== */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / pageSize)
  );

  const safePage = Math.min(currentPage, totalPages);

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

  /* =====================================================
     OPEN MODAL
  ===================================================== */
  const openModal = (slot) => {
    setSelectedSlot(slot);
    setSearch("");
    setCurrentPage(1);
    setIsMounted(true);
  };

  /* =====================================================
     CLOSE MODAL
  ===================================================== */
  const closeModal = () => {
    setIsOpen(false);
    setSearch("");
    setCurrentPage(1);
  };

  /* =====================================================
     CUSTOM TOOLTIP
  ===================================================== */
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="cursor-pointer rounded border border-slate-200 bg-white p-2 shadow transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-[#020617] dark:hover:bg-[#0a0f1e]"
          onClick={() => openModal(payload[0].payload.x)}
        >
          <p className="text-sm font-medium">
            {payload[0].payload.x}
          </p>

          <p className="text-sm text-slate-600 dark:text-white/70">
            {payload[0].value} incidents
          </p>
        </div>
      );
    }

    return null;
  };

  /* =====================================================
     MAIN JSX
  ===================================================== */
  return (
    <>
      {/* AREA CHART */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={210}>
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: -30,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient
                id="orgGrad"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#7094ff"
                  stopOpacity={isDark ? 0.35 : 0.25}
                />

                <stop
                  offset="95%"
                  stopColor="#7094ff"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridColor}
              vertical={false}
            />

            <XAxis
              dataKey="x"
              interval={0}
              tickMargin={10}
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

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="natural"
              dataKey="Endpoints"
              stroke="#7094ff"
              fill="url(#orgGrad)"
              strokeWidth={2.5}
              dot={{
                r: 4,
                fill: "#7094ff",
                stroke: "#ffffff",
                strokeWidth: 2,
                className: "cursor-pointer hover:r-6 transition-all",
              }}
              activeDot={{
                r: 6,
                fill: "#7094ff",
                className: "cursor-pointer",
                onClick: (e, payload) => {
                  if (payload && payload.payload) {
                    openModal(payload.payload.x);
                  }
                },
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* INCIDENT MODAL */}
      {isMounted && (
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300 ease-out ${
            isOpen
              ? "bg-slate-950/55 opacity-100"
              : "bg-slate-950/0 opacity-0"
          }`}
          onTransitionEnd={(event) => {
            if (
              event.target === event.currentTarget &&
              !isOpen
            ) {
              setIsMounted(false);
            }
          }}
        >
          <div
            className={`flex h-[80vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl transition-[opacity,transform] duration-300 ease-out dark:border-white/[0.08] dark:bg-[#020617] ${
              isOpen
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-2 scale-[0.98] opacity-0"
            }`}
          >
            {/* MODAL HEADER */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-white/[0.08]">
              <div className="min-w-0">
                <h2 className="truncate text-[15px] font-semibold text-slate-800 dark:text-white">
                  Organisation Incidents -{" "}
                  <span className="text-blue-600 dark:text-blue-400">
                    {selectedSlot}
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
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-[12px] text-slate-700 outline-none transition focus:border-[#7094ff] focus:ring-2 focus:ring-[#7094ff]/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/80"
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

            {/* TABLE SECTION */}
            <div className="min-h-0 flex-1 overflow-hidden p-4">
              <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.08]">
                <div className="min-h-0 flex-1 overflow-auto">
                  <table className="w-full min-w-[900px] table-fixed border-separate border-spacing-0 text-[13px]">
                    {/* FIXED COLUMN WIDTHS */}
                    <colgroup>
                      <col style={{ width: "18%" }} />
                      <col style={{ width: "17%" }} />
                      <col style={{ width: "20%" }} />
                      <col style={{ width: "27%" }} />
                      <col style={{ width: "18%" }} />
                    </colgroup>

                    {/* TABLE HEADER */}
                    <thead>
                      <tr className="text-slate-500 dark:text-white/50">
                        {incidentColumns.map((col) => (
                          <th
                            key={col.accessor}
                            className="sticky top-0 z-30 whitespace-nowrap border-b border-slate-200 bg-slate-100 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide dark:border-white/[0.08] dark:bg-[#111827]"
                          >
                            {col.header}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    {/* TABLE BODY */}
                    <tbody>
                      {paginatedRows.length > 0 ? (
                        paginatedRows.map((row, index) => (
                          <tr
                            key={index}
                            className="bg-white transition hover:bg-[#7094ff]/5 dark:bg-[#020617] dark:hover:bg-white/[0.03]"
                          >
                            {/* IP ADDRESS */}
                            <td className="overflow-hidden text-ellipsis whitespace-nowrap border-b border-slate-100 px-4 py-3 text-left align-middle font-medium text-sky-600 dark:border-white/[0.05] dark:text-sky-400">
                              {row.ipAddress || "NA"}
                            </td>

                            {/* USERNAME */}
                            <td className="overflow-hidden text-ellipsis whitespace-nowrap border-b border-slate-100 px-4 py-3 text-left align-middle text-slate-700 dark:border-white/[0.05] dark:text-white/80">
                              {row.username || "NA"}
                            </td>

                            {/* EVENT TYPE */}
                            <td
                              className={`overflow-hidden text-ellipsis whitespace-nowrap border-b border-slate-100 px-4 py-3 text-left align-middle font-medium dark:border-white/[0.05] ${eventTypeColor(
                                row.eventType
                              )}`}
                            >
                              {row.eventType || "NA"}
                            </td>

                            {/* FILE DETAILS */}
                            <td
                              className="overflow-hidden text-ellipsis whitespace-nowrap border-b border-slate-100 px-4 py-3 text-left align-middle text-slate-400 dark:border-white/[0.05] dark:text-white/30"
                              title={row.fileDetails}
                            >
                              {row.fileDetails || "NA"}
                            </td>

                            {/* TIMESTAMP - LEFT ALIGNED */}
                            <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3 text-left align-middle font-medium text-slate-400 dark:border-white/[0.05] dark:text-white/40">
                              {row.timestamp || "NA"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={incidentColumns.length}
                            className="px-3 py-10 text-center text-slate-400 dark:text-white/30"
                          >
                            No records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION FOOTER */}
                <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/[0.08] dark:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-[12px] text-slate-500 dark:text-white/40">
                    Showing {startRecord}-{endRecord} of{" "}
                    {filteredRows.length}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* PREVIOUS */}
                    <button
                      type="button"
                      disabled={safePage === 1}
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.max(1, prev - 1)
                        )
                      }
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-[12px] font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70 dark:hover:bg-white/[0.08]"
                    >
                      <ChevronLeft size={14} />
                      Prev
                    </button>

                    {/* PAGE NUMBER */}
                    <span className="rounded-lg bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-white/[0.06] dark:text-white/80 dark:ring-white/10">
                      {safePage} / {totalPages}
                    </span>

                    {/* NEXT */}
                    <button
                      type="button"
                      disabled={safePage === totalPages}
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(totalPages, prev + 1)
                        )
                      }
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12px] font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70 dark:hover:bg-white/[0.08]"
                    >
                      Next
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
