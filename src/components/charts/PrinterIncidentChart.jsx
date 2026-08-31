import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

import { dashboardService } from "../../services/dashboardService";

const incidentColumns = [
  {
    accessor: "ipAddress",
    header: "IP ADDRESS",
  },
  {
    accessor: "username",
    header: "USERNAME",
  },
  {
    accessor: "eventType",
    header: "EVENT TYPE",
  },
  {
    accessor: "fileDetails",
    header: "FILE DETAILS",
  },
  {
    accessor: "timestamp",
    header: "TIMESTAMP",
  },
];

// ============================================================
// EVENT TYPE COLOR
// ============================================================

const eventTypeColor = (eventType) => {
  const type = String(eventType || "").toLowerCase();

  if (
    type.includes("upload") ||
    type.includes("print")
  ) {
    return "text-emerald-600 dark:text-emerald-400";
  }

  if (type.includes("transfer")) {
    return "text-green-600 dark:text-green-400";
  }

  if (type.includes("usb")) {
    return "text-yellow-600 dark:text-yellow-400";
  }

  if (
    type.includes("prevent") ||
    type.includes("blocked") ||
    type.includes("deny")
  ) {
    return "text-red-600 dark:text-red-400";
  }

  return "text-slate-600 dark:text-white/50";
};

// ============================================================
// COMPONENT
// ============================================================

export default function PrinterIncidentChart({
  totalIncidents = 0,
  peakDay = "Monday",
  isDark = false,
}) {
  const [showModal, setShowModal] = useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [modalData, setModalData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const pageSize = 10;

  // ==========================================================
  // FETCH API
  // ==========================================================

  const fetchPrinterIncidents = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await dashboardService.getPrinterModalIncident();

      console.log(
        "Printer Modal Incident Response:",
        response
      );

      if (response?.success) {
        const records = Array.isArray(
          response?.data
        )
          ? response.data
          : [];

        setModalData(records);
      } else {
        setModalData([]);

        setError(
          response?.message ||
            "Printer incident data not found."
        );
      }
    } catch (err) {
      console.error(
        "Printer incident API error:",
        err
      );

      setModalData([]);

      setError(
        err?.response?.data?.message ||
          "Failed to load printer incident data."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // BODY SCROLL LOCK
  // ==========================================================

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

  // ==========================================================
  // OPEN MODAL
  // ==========================================================

  const openModal = async (category) => {
    setSelectedCategory(category);

    setSearch("");

    setCurrentPage(1);

    setModalData([]);

    setError("");

    setShowModal(true);

    await fetchPrinterIncidents();
  };

  // ==========================================================
  // CLOSE MODAL
  // ==========================================================

  const closeModal = () => {
    setShowModal(false);

    setSearch("");

    setCurrentPage(1);

    setModalData([]);

    setError("");
  };

  // ==========================================================
  // SEARCH
  // ==========================================================

  const filteredRows = useMemo(() => {
    const term = search
      .trim()
      .toLowerCase();

    if (!term) {
      return modalData;
    }

    return modalData.filter((row) => {
      return incidentColumns.some(
        (column) => {
          const value =
            row?.[column.accessor];

          return String(value ?? "")
            .toLowerCase()
            .includes(term);
        }
      );
    });
  }, [modalData, search]);

  // ==========================================================
  // RESET PAGE
  // ==========================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // ==========================================================
  // PAGINATION
  // ==========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredRows.length / pageSize
    )
  );

  const safePage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedRows =
    filteredRows.slice(
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

  // ==========================================================
  // DATE FORMAT
  // ==========================================================

  const formatTimestamp = (value) => {
    if (!value) {
      return "NA";
    }

    return String(value);
  };

  // ==========================================================
  // GET FIELD
  // ==========================================================

  const getUsername = (row) => {
    return (
      row?.username ??
      row?.userName ??
      row?.USER_NAME ??
      row?.USERNAME ??
      "NA"
    );
  };

  const getIpAddress = (row) => {
    return (
      row?.ipAddress ??
      row?.IP_ADDRESS ??
      row?.ipaddress ??
      "NA"
    );
  };

  const getEventType = (row) => {
    return (
      row?.eventType ??
      row?.jobStatus ??
      row?.JobStatus ??
      row?.job_status ??
      "PRINT JOB"
    );
  };

  const getFileDetails = (row) => {
    return (
      row?.fileDetails ??
      row?.document ??
      row?.DOCUMENT ??
      "NA"
    );
  };

  const getTimestamp = (row) => {
    return (
      row?.timestamp ??
      row?.date ??
      row?.DATE ??
      row?.time ??
      "NA"
    );
  };

  // ==========================================================
  // JSX
  // ==========================================================

  return (
    <>
      {/* ======================================================
          SUMMARY
      ====================================================== */}

      <div className="flex h-[80px] items-center justify-between">

        {/* LEFT SIDE */}

        <div className="grid grid-cols-2 gap-x-16 gap-y-6">

          <div className="text-lg text-slate-800 dark:text-white">
            Total Incidents :
            <br />

            <span className="font-semibold">
              {totalIncidents}
            </span>
          </div>

          <div className="text-lg text-slate-800 dark:text-white">
            Peak Day:
            <br />

            <span className="font-semibold">
              {peakDay}
            </span>
          </div>

          <div className="col-span-2">

            <p className="whitespace-nowrap text-sm italic text-slate-500 dark:text-white/60">
              Last update yesterday
            </p>

          </div>

        </div>

        {/* ====================================================
            CIRCULAR GAUGE
        ==================================================== */}

        <div className="flex flex-col items-center">

          <div
            className="relative cursor-pointer transition-all duration-200 hover:scale-105 hover:opacity-90"
            style={{
              width: 120,
              height: 120,
              marginTop: -20,
            }}
            onClick={() =>
              openModal("Printer Incidents")
            }
          >

            <svg
              viewBox="0 0 120 120"
              className="-rotate-[135deg]"
            >

              {/* BACKGROUND RING */}

              <circle
                cx="60"
                cy="60"
                r="40"
                fill="none"
                stroke={
                  isDark
                    ? "#2f2f2f"
                    : "#23232c"
                }
                strokeWidth="8"
              />

              {/* ACTIVE RING */}

              <circle
                cx="60"
                cy="60"
                r="40"
                fill="none"
                stroke="#17d35f"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="190 60"
                className="transition-all duration-500"
              />

            </svg>

            {/* CENTER */}

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">

              <div className="text-3xl font-bold text-slate-800 dark:text-white">
                {totalIncidents}
              </div>

              <div className="text-sm text-slate-500 dark:text-white/70">
                Incidents
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          MODAL
      ====================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">

          <div className="flex h-[80vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-white/[0.08] dark:bg-[#020617]">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-white/[0.08]">

              {/* TITLE */}

              <div className="min-w-0">

                <h2 className="truncate text-[15px] font-semibold text-slate-800 dark:text-white">

                  Printer Incident Details -

                  <span className="ml-1 text-emerald-600 dark:text-emerald-400">
                    {selectedCategory}
                  </span>

                </h2>

              </div>

              {/* RIGHT */}

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
                      setSearch(
                        e.target.value
                      )
                    }
                    placeholder="Search..."
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-[12px] text-slate-700 outline-none transition focus:border-[#7094ff] focus:ring-2 focus:ring-[#7094ff]/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/80"
                  />

                </div>

                {/* REFRESH */}

                {/* <button
                  type="button"
                  onClick={
                    fetchPrinterIncidents
                  }
                  disabled={loading}
                  title="Refresh"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  <RefreshCw
                    size={15}
                    className={
                      loading
                        ? "animate-spin"
                        : ""
                    }
                  />

                </button> */}

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

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div className="mx-4 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                {error}
              </div>
            )}

            {/* =================================================
                TABLE CONTAINER
            ================================================= */}

            <div className="min-h-0 flex-1 overflow-hidden p-4">

              <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.08]">

                <div className="min-h-0 flex-1 overflow-auto">

                  <table className="w-full min-w-[900px] text-[13px]">

                    {/* TABLE HEADER */}

                    <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-white/[0.06]">

                      <tr className="text-left text-slate-500 dark:text-white/50">

                        {incidentColumns.map(
                          (column) => (
                            <th
                              key={
                                column.accessor
                              }
                              className="border-b border-slate-200 px-4 py-3 text-[11px] font-semibold uppercase tracking-wide dark:border-white/[0.08]"
                            >
                              {
                                column.header
                              }
                            </th>
                          )
                        )}

                      </tr>

                    </thead>

                    {/* TABLE BODY */}

                    <tbody>

                      {/* LOADING */}

                      {loading && (
                        <tr>

                          <td
                            colSpan={
                              incidentColumns.length
                            }
                            className="px-3 py-12 text-center text-slate-400 dark:text-white/30"
                          >

                            <div className="flex flex-col items-center justify-center gap-3">

                              <RefreshCw
                                size={25}
                                className="animate-spin text-emerald-500"
                              />

                              <span>
                                Loading printer
                                incidents...
                              </span>

                            </div>

                          </td>

                        </tr>
                      )}

                      {/* DATA */}

                      {!loading &&
                        paginatedRows.length >
                          0 &&
                        paginatedRows.map(
                          (row, index) => {

                            /*
                             * IMPORTANT:
                             * Unique key for React.
                             */

                            const rowKey =
                              row?.srNo ??
                              row?.id ??
                              `${getIpAddress(
                                row
                              )}-${getTimestamp(
                                row
                              )}-${index}`;

                            return (
                              <tr
                                key={rowKey}
                                className="bg-white transition hover:bg-[#7094ff]/5 dark:bg-transparent dark:hover:bg-white/[0.03]"
                              >

                                {/* IP ADDRESS */}

                                <td className="border-b border-slate-100 px-4 py-3 font-medium text-sky-600 dark:border-white/[0.05] dark:text-sky-400">

                                  {getIpAddress(
                                    row
                                  )}

                                </td>

                                {/* USERNAME */}

                                <td className="border-b border-slate-100 px-4 py-3 text-slate-700 dark:border-white/[0.05] dark:text-white/80">

                                  {getUsername(
                                    row
                                  )}

                                </td>

                                {/* EVENT TYPE */}

                                <td
                                  className={`border-b border-slate-100 px-4 py-3 font-medium dark:border-white/[0.05] ${eventTypeColor(
                                    getEventType(
                                      row
                                    )
                                  )}`}
                                >

                                  {getEventType(
                                    row
                                  )}

                                </td>

                                {/* FILE DETAILS */}

                                <td
                                  className="max-w-[360px] truncate border-b border-slate-100 px-4 py-3 text-slate-400 dark:border-white/[0.05] dark:text-white/30"
                                  title={getFileDetails(
                                    row
                                  )}
                                >

                                  {getFileDetails(
                                    row
                                  )}

                                </td>

                                {/* TIMESTAMP */}

                                <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3 text-right text-slate-400 dark:border-white/[0.05] dark:text-white/40">

                                  {formatTimestamp(
                                    getTimestamp(
                                      row
                                    )
                                  )}

                                </td>

                              </tr>
                            );
                          }
                        )}

                      {/* EMPTY */}

                      {!loading &&
                        paginatedRows.length ===
                          0 && (
                          <tr>

                            <td
                              colSpan={
                                incidentColumns.length
                              }
                              className="px-3 py-12 text-center text-slate-400 dark:text-white/30"
                            >

                              No records found

                            </td>

                          </tr>
                        )}

                    </tbody>

                  </table>

                </div>

                {/* =================================================
                    PAGINATION
                ================================================= */}

                <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/[0.08] dark:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between">

                  {/* RECORD COUNT */}

                  <span className="text-[12px] text-slate-500 dark:text-white/40">

                    Showing{" "}
                    {startRecord}
                    -
                    {endRecord} of{" "}
                    {filteredRows.length}

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

                      <ChevronLeft
                        size={14}
                      />

                      Prev

                    </button>

                    {/* PAGE */}

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
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-[12px] font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70 dark:hover:bg-white/[0.08]"
                    >

                      Next

                      <ChevronRight
                        size={14}
                      />

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