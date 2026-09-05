import React, { useMemo, useState, useEffect } from "react";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { dashboardService } from "../../services/dashboardService";

// Column configuration
const incidentColumns = [
  { accessor: "ipAddress", header: "IP ADDRESS" },
  { accessor: "username", header: "USERNAME" },
  { accessor: "eventType", header: "EVENT TYPE" },
  { accessor: "fileDetails", header: "FILE DETAILS" },
  { accessor: "timestamp", header: "TIMESTAMP" },
];

// Event type color mapping
const eventTypeColor = (eventType) => {
  const type = eventType?.toLowerCase() || "";
  if (type.includes("upload")) return "text-blue-600 dark:text-blue-400";
  if (type.includes("transfer")) return "text-green-600 dark:text-green-400";
  if (type.includes("usb")) return "text-yellow-600 dark:text-yellow-400";
  return "text-slate-600 dark:text-white/50";
};

export default function IncidentByFileType({ data = [], fileTypeData = [] }) {
  // Modal transition states
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [selectedType, setSelectedType] = useState("");
  const [search, setSearch] = useState("");
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [modalData, setModalData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Tooltip state
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: "" });

  // Lock body scroll when modal is visible
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

  // Open modal with data fetch
  const openModal = async (item) => {
    setSelectedType(item.type);
    setSearch("");
    setCurrentPage(1);
    setLoading(true);
    setIsMounted(true);

    try {
      const response = await dashboardService.getIncidentByFileTypeModal(item.type);
      console.log("API Response:", response);

      if (response && response.success && response.data) {
        const transformedData = response.data.map((record) => ({
          ipAddress: record.branchname || "NA",
          username: record.username || "NA",
          eventType: record.eventType || "NA",
          fileDetails: record.fileSourcePath || "NA",
          timestamp: record.timestamp || "NA",
        }));
        console.log("Transformed Data:", transformedData);
        setModalData(transformedData);
      } else {
        setModalData([]);
        if (response && response.message) alert(response.message);
      }
    } catch (error) {
      console.error("Error fetching file type data:", error);
      alert(`Error loading data for ${item.type}`);
      setModalData([]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => setIsOpen(true));
    }
  };

  // Close modal
  const closeModal = () => {
    if (!isOpen) return;
    setIsClosing(true);
    setIsOpen(false);
  };

  // After exit animation completes, unmount the modal
  const handleTransitionEnd = () => {
    if (isClosing) {
      setIsMounted(false);
      setIsClosing(false);
      setModalData([]);
    }
  };

  const handleFileTypeClick = (item) => {
    if (item.pct === 0) {
      alert(`No incidents in ${item.type} file type`);
      return;
    }
    openModal(item);
  };

  // Tooltip handlers
  const handleMouseEnter = (e, item) => {
    setTooltip({
      visible: true,
      x: e.clientX,
      y: e.clientY - 10,
      content: `${item.type} – ${item.pct}%`,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0, content: "" });
  };

  // Safe data and pagination
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
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedRows = filteredRows.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );
  const startRecord = filteredRows.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endRecord = Math.min(safePage * pageSize, filteredRows.length);

  return (
    <>
      {/* Progress Bars */}
      <div className="flex flex-col gap-0 mt-2">
        {data.map((item) => (
          <div
            key={item.type}
            className="grid grid-cols-[45px_0.9fr_50px] items-center gap-1"
          >
            <span className="text-sm text-slate-500 dark:text-white/50 transform scale-75 inline-block">
              {item.type}
            </span>
            <div
              className="h-1 rounded-full bg-slate-200 dark:bg-[#071538] overflow-hidden cursor-pointer relative"
              onClick={() => handleFileTypeClick(item)}
              onMouseEnter={(e) => handleMouseEnter(e, item)}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${item.pct}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
            <span
              className="text-right text-sm font-medium"
              style={{ color: item.color }}
            >
              {item.pct}%
            </span>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed z-[9999] pointer-events-none px-2 py-1 text-xs font-medium rounded-md shadow-lg border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-[#1e293b] dark:text-white/90 transition-opacity duration-150"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          {tooltip.content}
        </div>
      )}

      {/* Modal with smooth transitions */}
      {isMounted && (
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
            isOpen ? "opacity-100" : "opacity-0"
          } ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
          onTransitionEnd={handleTransitionEnd}
        >
          <div
            className={`flex h-[80vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 ease-in-out dark:border-white/[0.08] dark:bg-[#020617] ${
              isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-white/[0.08]">
              <div className="min-w-0">
                <h2 className="truncate text-[15px] font-semibold text-slate-800 dark:text-white">
                  Incident By File Type - {selectedType}
                  {loading && <span className="ml-2 text-sm text-slate-400">Loading...</span>}
                </h2>
              </div>

              <div className="flex shrink-0 items-center gap-2">
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

                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-white/[0.06] dark:text-white/60 dark:hover:bg-white/[0.1]"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="min-h-0 flex-1 overflow-hidden p-4">
              <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.08]">
                <div className="min-h-0 flex-1 overflow-auto">
                  {loading ? (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-slate-400 dark:text-white/40">Loading incidents...</div>
                    </div>
                  ) : (
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
                        {paginatedRows.length > 0 ? (
                          paginatedRows.map((row, index) => (
                            <tr
                              key={index}
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
                                title={row.fileDetails}
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
                            <td
                              colSpan={incidentColumns.length}
                              className="px-3 py-10 text-center text-slate-400 dark:text-white/30"
                            >
                              No records found for {selectedType}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Footer / pagination */}
                <div className="flex shrink-0 flex-col gap-1 border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/[0.08] dark:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-[10px] text-slate-500 dark:text-white/40">
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
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}