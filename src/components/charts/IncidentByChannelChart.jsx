import React, { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { dashboardService } from "../../services/dashboardService";

const colors = {
  Email: "#1613d3",
  Network: "#0d2e88",
  Printer: "#375ab9",
  Clipboard: "#6375df",
  Drive: "#6EA2B3",
  Peripherals: "#7BBDE8",
};

// Maps a channel label to the keyword(s) used to match it against
// row.eventType in the raw incident data. Adjust the keywords if your
// backend's eventType strings differ (e.g. "MAIL" vs "EMAIL").
const channelKeywords = {
  Email: ["MAIL"],
  Network: ["NETWORK"],
  Printer: ["PRINT"],
  Clipboard: ["CLIPBOARD"],
  Drive: ["DRIVE"],
  Peripherals: ["USB", "DVD"],
};

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
  if (type.includes("usb") || type.includes("dvd")) return "text-yellow-600 dark:text-yellow-400";
  if (type.includes("mail")) return "text-emerald-600 dark:text-emerald-400";
  return "text-slate-600 dark:text-white/50";
};

const IncidentByChannelChart = ({ data, isDark, channelIncidentData = [] }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [search, setSearch] = useState("");
  const pageSize = 10; // Removed selectable state, fixed to 10
  const [currentPage, setCurrentPage] = useState(1);

  // Lock body scroll when modal is open
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

  // Convert API object to chart array
  const channelData = [
    { name: "Email", value: data?.emailIncident ?? 0, color: colors.Email },
    { name: "Network", value: data?.networkIncident ?? 0, color: colors.Network },
    { name: "Printer", value: data?.printerIncident ?? 0, color: colors.Printer },
    { name: "Clipboard", value: data?.clipboardIncident ?? 0, color: colors.Clipboard },
    { name: "Drive", value: data?.driveIncident ?? 0, color: colors.Drive },
    { name: "Peripherals", value: data?.peripheralIncident ?? 0, color: colors.Peripherals },
  ];

  const total = channelData.reduce((sum, item) => sum + item.value, 0);

  const openChannel = (channelName) => {
    setSelectedChannel(channelName);
    setSearch("");
    setCurrentPage(1);
    setShowModal(true);
  };

  const safeRows = Array.isArray(channelIncidentData) ? channelIncidentData : [];

  const channelRows = useMemo(() => {
    const keywords = channelKeywords[selectedChannel] || [];
    if (keywords.length === 0) return safeRows;
    return safeRows.filter((row) => {
      const type = String(row.eventType || "").toUpperCase();
      return keywords.some((kw) => type.includes(kw));
    });
  }, [safeRows, selectedChannel]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return channelRows;

    return channelRows.filter((row) =>
      incidentColumns.some((col) =>
        String(row[col.accessor] ?? "").toLowerCase().includes(term)
      )
    );
  }, [channelRows, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]); // Removed pageSize dependency

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
      <div className="flex items-center justify-between gap-4">
        {/* Chart Left */}
        <div className="relative flex-shrink-0" style={{ width: 170, height: 170 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={channelData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={75}
                paddingAngle={3}
                cornerRadius={12}
                stroke="none"
              >
                {channelData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.color}
                    className="cursor-pointer"
                    onClick={() => {
                      if (entry.value === 0) {
                        alert(`No incidents in ${entry.name} channel`);
                      } else {
                        const channelData = dashboardService.getIncidentByChannelModal(entry.name);
                        console.log(channelData);
                        alert(channelData.data);
                      }
                      openChannel(entry.name);
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Circle */}
          <div
            className="absolute top-1/2 left-1/2 rounded-full flex flex-col items-center justify-center"
            style={{
              width: 95,
              height: 95,
              transform: "translate(-50%, -50%)",
              background: isDark ? "#111827" : "#ffffff",
              boxShadow: "0 0 10px rgba(0,0,0,0.15)",
            }}
          >
            <span
              className="font-bold"
              style={{ fontSize: "24px", color: isDark ? "#fff" : "#111827" }}
            >
              {total}
            </span>
            <span style={{ fontSize: "11px", color: "#94a3b8" }}>
              Incidents
            </span>
          </div>
        </div>

        {/* Legend Right */}
        <div className="flex flex-col gap-3 flex-1">
          {channelData.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between cursor-pointer rounded-md px-1 -mx-1 transition hover:bg-slate-100 dark:hover:bg-white/[0.05]"
              onClick={() => openChannel(item.name)}
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
              <span className="text-xs font-semibold" style={{ color: item.color }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal - same format as IncidentTableModal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="flex h-[80vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-white/[0.08] dark:bg-[#020617]">

            {/* Header: title + search + close */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-white/[0.08]">
              <div className="min-w-0">
                <h2 className="truncate text-[15px] font-semibold text-slate-800 dark:text-white">
                  Incident by Channel - {selectedChannel}
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
                  onClick={() => {
                    setShowModal(false);
                    setSearch("");
                    setCurrentPage(1);
                  }}
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
                            <td className={`border-b border-slate-100 px-4 py-3 font-medium dark:border-white/[0.05] ${eventTypeColor(row.eventType)}`}>
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
                            No records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Footer / pagination */}
                <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/[0.08] dark:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-[12px] text-slate-500 dark:text-white/40">
                    Showing {startRecord}-{endRecord} of {filteredRows.length}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Page size <select> has been removed here */}

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
};

export default IncidentByChannelChart;