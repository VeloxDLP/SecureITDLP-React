
import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
} from "lucide-react";
import { dashboardService } from "../../services/dashboardService";

// Incident table columns
const incidentColumns = [
  { accessor: "application_name", header: "APPLICATION NAME" },
  { accessor: "action", header: "ACTION" },
  { accessor: "destination_path", header: "DESTINATION PATH" },
  { accessor: "file_name", header: "FILE NAME" },
  { accessor: "file_source_path", header: "FILE SOURCE PATH" },
  { accessor: "hostname", header: "HOSTNAME" },
  { accessor: "timestamp", header: "TIMESTAMP" },
];

// Time slots
const SLOTS = [
  "00:00-03:59",
  "04:00-07:59",
  "08:00-11:59",
  "12:00-15:59",
  "16:00-19:59",
  "20:00-23:59",
];

const norm = (value) =>
  String(value ?? "")
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const findRowForSlot = (rows, slot, index) => {
  if (!Array.isArray(rows) || rows.length === 0) return null;

  const exact = rows.find((row) => row.timeSlot === slot);
  if (exact) return exact;

  const normalized = rows.find(
    (row) => norm(row.timeSlot) === norm(slot)
  );

  if (normalized) return normalized;

  return typeof index === "number" && index < rows.length
    ? rows[index]
    : null;
};

export default function OrganisationIncident({
  data,
  isDark = true,
  axisStyle,
  gridColor,
}) {
  // Modal states
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);

  // Search and pagination
  const [search, setSearch] = useState("");
  const [pageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // API states
  const [incidentDetails, setIncidentDetails] = useState([]);
  const [incidentLoading, setIncidentLoading] = useState(false);
  const [incidentError, setIncidentError] = useState("");

  // Existing aggregate chart data
  const rows = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.result)) return data.result;
    return [];
  }, [data]);

  // Prepare chart data
  const chartData = useMemo(
    () =>
      SLOTS.map((slot, index) => {
        const row = findRowForSlot(rows, slot, index);

        return {
          x: slot,
          index,
          Endpoints: Number(row?.uniqueHostCount ?? 0),
          hostnames: row?.hostnames ?? null,
          rawTimeSlot: row?.timeSlot ?? slot,
        };
      }),
    [rows]
  );

  // Modal opening animation
  useEffect(() => {
    if (!isMounted) return undefined;

    const frame = requestAnimationFrame(() => {
      setIsOpen(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [isMounted]);

  // Prevent background scrolling
  useEffect(() => {
    if (isMounted) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isMounted]);

  // Fetch incidents for selected time slot
  const openModal = async (index) => {
    if (
      typeof index !== "number" ||
      index < 0 ||
      index >= SLOTS.length
    ) {
      return;
    }

    const slot = SLOTS[index];

    setSelectedSlotIndex(index);
    setSearch("");
    setCurrentPage(1);
    setIncidentDetails([]);
    setIncidentError("");
    setIncidentLoading(true);
    setIsMounted(true);

    try {
      const response =
        await dashboardService.getOrganisationIncident(slot);

      const result = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.result)
          ? response.result
          : Array.isArray(response)
            ? response
            : [];

      setIncidentDetails(result);
    } catch (error) {
      console.error(
        "Failed to load organisation incident details:",
        error
      );

      setIncidentError(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Unable to load incident details."
      );

      setIncidentDetails([]);
    } finally {
      setIncidentLoading(false);
    }
  };

  // Close modal
  const closeModal = () => {
    setIsOpen(false);
    setSearch("");
    setCurrentPage(1);

    setTimeout(() => {
      setIsMounted(false);
      setSelectedSlotIndex(null);
      setIncidentDetails([]);
      setIncidentError("");
    }, 350);
  };

  // Modal records
  const modalData = useMemo(() => {
    return Array.isArray(incidentDetails) ? incidentDetails : [];
  }, [incidentDetails]);

  // Search across all columns
  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return modalData;

    return modalData.filter((row) =>
      incidentColumns.some((column) =>
        String(row[column.accessor] ?? "")
          .toLowerCase()
          .includes(term)
      )
    );
  }, [modalData, search]);

  // Reset page when searching or changing slots
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedSlotIndex]);

  // Pagination
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

  const selectedTitle =
    selectedSlotIndex !== null
      ? SLOTS[selectedSlotIndex]
      : "";

  // Chart tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="pointer-events-none rounded-md border border-[#263247] bg-[#0b1120] p-2 shadow-xl">
        <p className="text-[12px] font-semibold text-white">
          {payload[0].payload.x}
        </p>

        <p className="text-[11px] text-slate-400">
          {payload[0].value} hosts
        </p>
      </div>
    );
  };

  return (
    <>
      {/* ================= CHART ================= */}
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
            onClick={(state) => {
              if (
                state &&
                typeof state.activeTooltipIndex === "number" &&
                state.activeTooltipIndex >= 0
              ) {
                openModal(state.activeTooltipIndex);
              }
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
              stroke={gridColor || "#1e293b"}
              vertical={false}
            />

            <XAxis
              dataKey="x"
              interval={0}
              tickMargin={10}
              tick={
                axisStyle || {
                  fill: isDark ? "#94a3b8" : "#64748b",
                  fontSize: 11,
                }
              }
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              allowDecimals={false}
              tick={
                axisStyle || {
                  fill: isDark ? "#94a3b8" : "#64748b",
                  fontSize: 11,
                }
              }
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
              style={{ cursor: "pointer" }}
              dot={(props) => {
                const { cx, cy, payload } = props;

                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill="#7094ff"
                    stroke="#fff"
                    strokeWidth={2}
                    style={{ cursor: "pointer" }}
                    onClick={() => openModal(payload.index)}
                  />
                );
              }}
              activeDot={(props) => {
                const { cx, cy, payload } = props;

                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={6}
                    fill="#7094ff"
                    style={{ cursor: "pointer" }}
                    onClick={() => openModal(payload.index)}
                  />
                );
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ================= INCIDENT MODAL ================= */}
      {isMounted &&
        createPortal(
          <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300 ${
              isOpen
                ? "bg-[#020617]/80 opacity-100"
                : "bg-transparent opacity-0"
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
              className={`flex h-[80vh] w-full max-w-7xl flex-col overflow-hidden rounded-xl border border-[#1e293b] bg-[#020617] shadow-2xl transition-all duration-300 ${
                isOpen
                  ? "translate-y-0 scale-100 opacity-100"
                  : "translate-y-2 scale-[0.98] opacity-0"
              }`}
            >
              {/* MODAL HEADER */}
              <div className="flex h-[46px] shrink-0 items-center justify-between gap-3 border-b border-[#1e293b] bg-[#020617] px-3">
                <h2 className="truncate text-[14px] font-semibold text-slate-100">
                  Organisation Incidents –{" "}
                  <span className="text-cyan-400">
                    {selectedTitle}
                  </span>
                </h2>

                <div className="flex items-center gap-2">
                  <div className="relative w-[220px] sm:w-[260px]">
                    <Search
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type="text"
                      value={search}
                      onChange={(event) =>
                        setSearch(event.target.value)
                      }
                      placeholder="Search incidents..."
                      className="h-[31px] w-full rounded-md border border-[#273449] bg-[#0b1120] pl-8 pr-3 text-[11px] text-slate-300 outline-none placeholder:text-slate-500 focus:border-cyan-500/50"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex h-[31px] w-[31px] items-center justify-center rounded-md bg-[#111827] text-slate-400 transition hover:bg-[#1e293b] hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* TABLE CONTAINER */}
              <div className="min-h-0 flex-1 p-2">
                <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-[#1e293b] bg-[#020617]">
                  <div className="min-h-0 flex-1 overflow-auto">
                    <table className="w-full min-w-[1200px] table-fixed border-separate border-spacing-0 text-[12px]">
                      <colgroup>
                        <col style={{ width: "15%" }} />
                        <col style={{ width: "12%" }} />
                        <col style={{ width: "18%" }} />
                        <col style={{ width: "15%" }} />
                        <col style={{ width: "18%" }} />
                        <col style={{ width: "12%" }} />
                        <col style={{ width: "190px" }} />
                      </colgroup>

                      <thead>
                        <tr>
                          {incidentColumns.map((column) => (
                            <th
                              key={column.accessor}
                              className="sticky top-0 z-20 h-[38px] whitespace-nowrap border-b border-[#1e293b] bg-[#111827] px-3 text-left text-[10px] font-semibold tracking-wide text-slate-400"
                            >
                              {column.header}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {incidentLoading ? (
                          <tr>
                            <td
                              colSpan={incidentColumns.length}
                              className="py-12 text-center text-[12px] text-slate-500"
                            >
                              Loading incident details...
                            </td>
                          </tr>
                        ) : incidentError ? (
                          <tr>
                            <td
                              colSpan={incidentColumns.length}
                              className="py-12 text-center text-[12px] text-rose-400"
                            >
                              {String(incidentError)}
                            </td>
                          </tr>
                        ) : paginatedRows.length > 0 ? (
                          paginatedRows.map((row, index) => (
                            <tr
                              key={row.id ?? index}
                              className="bg-[#020617] transition-colors hover:bg-[#0f172a]"
                            >
                              {incidentColumns.map((column) => (
                                <td
                                  key={column.accessor}
                                  title={String(
                                    row[column.accessor] ?? "NA"
                                  )}
                                  className={`h-[40px] max-w-[280px] overflow-hidden text-ellipsis whitespace-nowrap border-b border-[#111827] px-3 text-[12px] ${
                                    column.accessor === "action"
                                      ? "font-medium text-cyan-400"
                                      : "text-slate-400"
                                  }`}
                                >
                                  {row[column.accessor] ?? "NA"}
                                </td>
                              ))}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={incidentColumns.length}
                              className="py-12 text-center text-[12px] text-slate-500"
                            >
                              No incidents found for this time slot
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* FOOTER / PAGINATION */}
                  <div className="flex h-[48px] shrink-0 items-center justify-between gap-3 border-t border-[#1e293b] bg-[#080d1c] px-3">
                    <span className="text-[10px] text-slate-500">
                      Showing {startRecord}-{endRecord} of{" "}
                      {filteredRows.length}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={
                          safePage === 1 || incidentLoading
                        }
                        onClick={() =>
                          setCurrentPage((page) =>
                            Math.max(1, page - 1)
                          )
                        }
                        className="inline-flex h-[27px] items-center gap-1 rounded-md border border-[#263247] bg-[#0b1120] px-2.5 text-[11px] font-medium text-slate-400 transition hover:bg-[#172033] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronLeft size={13} />
                        Prev
                      </button>

                      <span className="flex h-[27px] min-w-[38px] items-center justify-center rounded-md border border-[#263247] bg-[#111827] px-2 text-[11px] font-semibold text-slate-300">
                        {safePage} / {totalPages}
                      </span>

                      <button
                        type="button"
                        disabled={
                          safePage === totalPages ||
                          incidentLoading
                        }
                        onClick={() =>
                          setCurrentPage((page) =>
                            Math.min(totalPages, page + 1)
                          )
                        }
                        className="inline-flex h-[27px] items-center gap-1 rounded-md border border-[#263247] bg-[#0b1120] px-2.5 text-[11px] font-medium text-slate-400 transition hover:bg-[#172033] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Next
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
