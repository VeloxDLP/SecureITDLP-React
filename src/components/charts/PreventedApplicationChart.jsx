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
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";

// Column configuration for modal table
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
  if (type.includes("prevent")) return "text-red-600 dark:text-red-400";
  return "text-slate-600 dark:text-white/50";
};

export default function PreventedApplicationChart({
  data = [],
  gridColor,
  axisStyle,
  Tip,
  isDark = false,
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const pageSize = 10; // Fixed page size, dropdown removed
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

  // Hardcoded modal data for prevented applications
  const modalData = [
    {
      ipAddress: "192.168.0.41",
      username: "VELOX",
      eventType: "PREVENTED APP",
      fileDetails: "Malware.exe",
      timestamp: "2024-01-15 10:30:00",
    },
    {
      ipAddress: "192.168.0.42",
      username: "Admin",
      eventType: "PREVENTED APP",
      fileDetails: "Suspicious.dll",
      timestamp: "2024-01-15 11:15:00",
    },
    {
      ipAddress: "192.168.0.43",
      username: "User1",
      eventType: "PREVENTED APP",
      fileDetails: "Virus.scr",
      timestamp: "2024-01-15 12:00:00",
    },
    {
      ipAddress: "192.168.0.44",
      username: "VELOX",
      eventType: "PREVENTED APP",
      fileDetails: "Trojan.zip",
      timestamp: "2024-01-15 13:30:00",
    },
    {
      ipAddress: "192.168.0.45",
      username: "Kiran_Tester",
      eventType: "PREVENTED APP",
      fileDetails: "Ransomware.exe",
      timestamp: "2024-01-15 14:45:00",
    },
    {
      ipAddress: "192.168.0.46",
      username: "VELOX",
      eventType: "PREVENTED APP",
      fileDetails: "Spyware.dll",
      timestamp: "2024-01-15 15:20:00",
    },
    {
      ipAddress: "192.168.0.47",
      username: "User2",
      eventType: "PREVENTED APP",
      fileDetails: "Adware.exe",
      timestamp: "2024-01-15 16:10:00",
    },
    {
      ipAddress: "192.168.0.48",
      username: "VELOX",
      eventType: "PREVENTED APP",
      fileDetails: "Keylogger.exe",
      timestamp: "2024-01-15 17:00:00",
    },
    {
      ipAddress: "192.168.0.49",
      username: "Kira_Tester",
      eventType: "PREVENTED APP",
      fileDetails: "Worm.wrm",
      timestamp: "2024-01-15 18:30:00",
    },
    {
      ipAddress: "192.168.0.50",
      username: "VELOX",
      eventType: "PREVENTED APP",
      fileDetails: "Backdoor.exe",
      timestamp: "2024-01-15 19:45:00",
    },
    {
      ipAddress: "192.168.0.51",
      username: "Admin",
      eventType: "PREVENTED APP",
      fileDetails: "Rootkit.sys",
      timestamp: "2024-01-15 20:30:00",
    },
    {
      ipAddress: "192.168.0.52",
      username: "User3",
      eventType: "PREVENTED APP",
      fileDetails: "Bootkit.exe",
      timestamp: "2024-01-15 21:15:00",
    },
    {
      ipAddress: "192.168.0.53",
      username: "VELOX",
      eventType: "PREVENTED APP",
      fileDetails: "Malware.doc",
      timestamp: "2024-01-15 22:00:00",
    },
  ];

  const chartData = Array.isArray(data)
    ? data.map((item) => ({
        date: item.date,
        count: item.count,
      }))
    : [];

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
  }, [search]); // Removed pageSize dependency

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedRows = filteredRows.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );
  const startRecord = filteredRows.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endRecord = Math.min(safePage * pageSize, filteredRows.length);

  const openModal = (category) => {
    setSelectedCategory(category);
    setSearch("");
    setCurrentPage(1);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSearch("");
    setCurrentPage(1);
  };

  // Custom Tooltip with click handler
  const CustomTooltip = (props) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      return (
        <div 
          className="bg-white dark:bg-[#020617] p-2 rounded shadow border border-slate-200 dark:border-white/10 cursor-pointer hover:bg-slate-50 dark:hover:bg-[#0a0f1e] transition-colors"
          onClick={() => openModal("Prevented Applications")}
        >
          <p className="text-sm font-medium">{`${payload[0].payload.date}`}</p>
          <p className="text-sm text-blue-600 dark:text-blue-400">{`${payload[0].value} prevented`}</p>
          <p className="text-xs text-blue-500 mt-1">Click to view details →</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12px] font-semibold dark:text-white/80 text-slate-700">
            Prevented Application
          </p>
        </div>

        <ResponsiveContainer width="100%" height={210}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -38, bottom: 2 }}
            onClick={() => openModal("Prevented Applications")}
            className="cursor-pointer"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridColor}
            />

            <XAxis
              dataKey="date"
              tickFormatter={(date) => date?.slice(5)}
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

            <Tooltip
              content={<CustomTooltip />}
              cursor={false}
            />

            <Bar
              dataKey="count"
              fill="#7094ff"
              radius={[6, 6, 0, 0]}
              barSize={15}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => openModal("Prevented Applications")}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="flex h-[80vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-white/[0.08] dark:bg-[#020617]">

            {/* Header */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-white/[0.08]">
              <div className="min-w-0">
                <h2 className="truncate text-[15px] font-semibold text-slate-800 dark:text-white">
                  Prevented Application Details - <span className="text-red-600 dark:text-red-400">{selectedCategory}</span>
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

                {/* Footer / pagination - Dropdown REMOVED */}
                <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/[0.08] dark:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-[12px] text-slate-500 dark:text-white/40">
                    Showing {startRecord}-{endRecord} of {filteredRows.length}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* <select> dropdown has been removed here */}

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