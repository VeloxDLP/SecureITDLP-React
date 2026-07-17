import React, { useState, useEffect, useMemo } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import FileUploadRadialChart from '../components/charts/FileUploadRadialChart'
import IncidentByChannelChart from '../components/charts/IncidentByChannelChart'
import OrganisationIncident from '../components/charts/OrganisationIncident'
import IncidentByFileType from '../components/charts/IncidentByFileType'
import ClipboardIncident from '../components/charts/ClipboardIncident'
import MailIncidentChart from '../components/charts/MailIncidentChart'
import PrinterIncidentChart from '../components/charts/PrinterIncidentChart'
import LatestIncidents from '../components/charts/LatestIncidents'
import PreventedApplicationChart from '../components/charts/PreventedApplicationChart'
import { dashboardService } from '../services/dashboardService'


/* ── Shared Tooltip ──────────────────────────────────────────────── */
function ChartTip({ active, payload, label, isDark }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl px-3 py-2 text-[11px] shadow-xl border"
      style={{
        background: isDark ? '#1a1a2e' : '#ffffff',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
      }}>
      {label && <p style={{ color: isDark ? '#888' : '#94a3b8' }} className="mb-1">{label}</p>}
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color || '#7094ff' }} className="flex gap-2">
          <span>{p.name || 'val'}:</span><strong>{p.value}</strong>
        </p>
      ))}
    </div>
  )
}

/* ── Dashboard Card ─────────────────────────────────────────────── */
function DCard({ children, className = '', padding = true, onClick, clickable = false }) {
  return (
    <div 
      className={`
        rounded-xl border transition-all duration-200
        dark:bg-[#020617] dark:border-white/[0.08] dark:hover:border-white/[0.13]
        bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm
        ${padding ? 'p-4' : ''}
        ${clickable ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-white/[0.02]' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

/* ── Section Divider Label ───────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-bold uppercase tracking-widest
                       dark:text-white/25 text-slate-400 flex-shrink-0">
        {children}
      </span>
      <div className="flex-1 h-px dark:bg-white/[0.06] bg-slate-200" />
    </div>
  )
}

/* ── Circular Progress (SVG) ─────────────────────────────────────── */
function CircleProgress({ pct = 20, color = '#7094ff', size = 60, stroke = 5, label, isDark }) {
  const r = (size / 2) - stroke
  const circ = 2 * Math.PI * r
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={isDark ? 'rgba(255,255,255,0.07)' : '#f1f5f9'} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={`${circ * pct / 100} ${circ * (1 - pct / 100)}`}
          strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[11px] font-bold dark:text-white text-slate-800">
          {label ?? `${pct}%`}
        </span>
      </div>
    </div>
  )
}

/* ── Section title ───────────────────────────────────────────────── */
function STitle({ children }) {
  return (
    <p className="text-[12px] font-semibold dark:text-white/80 text-slate-700 mb-3">
      {children}
    </p>
  )
}

/* ── Modal Component ────────────────────────────────────────────── */
function IncidentModal({ show, onClose, title, category, data, isDark }) {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (show) {
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
  }, [show]);

  const safeData = Array.isArray(data) ? data : [];

  const incidentColumns = [
    { accessor: "ipAddress", header: "IP ADDRESS" },
    { accessor: "username", header: "USERNAME" },
    { accessor: "eventType", header: "EVENT TYPE" },
    { accessor: "fileDetails", header: "FILE DETAILS" },
    { accessor: "timestamp", header: "TIMESTAMP" },
  ];

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
  }, [search, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedRows = filteredRows.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );
  const startRecord = filteredRows.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endRecord = Math.min(safePage * pageSize, filteredRows.length);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="flex h-[80vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-white/[0.08] dark:bg-[#020617]">

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-white/[0.08]">
          <div className="min-w-0">
            <h2 className="truncate text-[15px] font-semibold text-slate-800 dark:text-white">
              {title} - <span className="text-blue-600 dark:text-blue-400">{category}</span>
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
              onClick={onClose}
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
                        <td className="border-b border-slate-100 px-4 py-3 text-slate-700 dark:border-white/[0.05] dark:text-white/80">
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
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-[12px] text-slate-700 outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70"
                >
                  {[5, 10, 20, 50].map((size) => (
                    <option key={size} value={size}>{size} / page</option>
                  ))}
                </select>

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
  );
}

/* ── Main Dashboard ──────────────────────────────────────────────── */
export default function Dashboard() {
  const { isDark } = useTheme()
  const axisStyle = { fill: isDark ? '#555' : '#94a3b8', fontSize: 9 }
  const gridColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'
  const divider = isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'
  const cardBorder = isDark ? 'rgba(255,255,255,0.07)' : '#e2e8f0'
  const [endpointStatus, setEndpointStatus] = useState(null);
  const endpointData = endpointStatus?.data;

  const [fileUploadSummary, setFileUploadSummary] = useState([]);
  const [printerData, setPrinterData] = useState([]);
  const [clipboardData, setClipboardData] = useState([]);
  const [fileTypeData, setFileTypeData] = useState([]);
  const [incidentByChannelData, setincidentByChannelData] = useState([]);
  const [emailIncidentData, setemailIncidentData] = useState([]);
  const [OrganizationIncident, setorganizationincidentData] = useState([]);
  const [LatestIncident, setLatestincidentData] = useState([]);
  const [preventedApplicationData, setPreventedApplicationData] = useState([]);

  // Modal state
  const [modalState, setModalState] = useState({
    show: false,
    title: '',
    category: '',
    data: []
  });

  const openModal = (title, category, data) => {
    setModalState({
      show: true,
      title,
      category,
      data: data || []
    });
  };

  const closeModal = () => {
    setModalState({
      show: false,
      title: '',
      category: '',
      data: []
    });
  };

  // Hardcoded Web Incident Data
  const webIncidentData = [
    { ipAddress: "192.168.0.41", username: "VELOX", eventType: "WEB UPLOAD", fileDetails: "document.pdf", timestamp: "2024-01-15 10:30:00" },
    { ipAddress: "192.168.0.42", username: "Admin", eventType: "WEB UPLOAD", fileDetails: "report.docx", timestamp: "2024-01-15 11:15:00" },
    { ipAddress: "192.168.0.43", username: "User1", eventType: "WEB DOWNLOAD", fileDetails: "image.png", timestamp: "2024-01-15 12:00:00" },
    { ipAddress: "192.168.0.44", username: "VELOX", eventType: "WEB UPLOAD", fileDetails: "data.xlsx", timestamp: "2024-01-15 13:30:00" },
    { ipAddress: "192.168.0.45", username: "Kiran_Tester", eventType: "WEB UPLOAD", fileDetails: "presentation.pptx", timestamp: "2024-01-15 14:45:00" },
    { ipAddress: "192.168.0.46", username: "VELOX", eventType: "WEB DOWNLOAD", fileDetails: "backup.zip", timestamp: "2024-01-15 15:20:00" },
    { ipAddress: "192.168.0.47", username: "User2", eventType: "WEB UPLOAD", fileDetails: "script.js", timestamp: "2024-01-15 16:10:00" },
    { ipAddress: "192.168.0.48", username: "VELOX", eventType: "WEB DOWNLOAD", fileDetails: "style.css", timestamp: "2024-01-15 17:00:00" },
    { ipAddress: "192.168.0.49", username: "Kira_Tester", eventType: "WEB UPLOAD", fileDetails: "index.html", timestamp: "2024-01-15 18:30:00" },
    { ipAddress: "192.168.0.50", username: "VELOX", eventType: "WEB DOWNLOAD", fileDetails: "config.json", timestamp: "2024-01-15 19:45:00" },
  ];

  // Hardcoded Network Incident Data
  const networkIncidentData = [
    { ipAddress: "192.168.0.41", username: "VELOX", eventType: "NETWORK UPLOAD", fileDetails: "data_packet_01.bin", timestamp: "2024-01-15 10:30:00" },
    { ipAddress: "192.168.0.42", username: "Admin", eventType: "NETWORK UPLOAD", fileDetails: "config_backup.bin", timestamp: "2024-01-15 11:15:00" },
    { ipAddress: "192.168.0.43", username: "User1", eventType: "NETWORK DOWNLOAD", fileDetails: "system_update.bin", timestamp: "2024-01-15 12:00:00" },
    { ipAddress: "192.168.0.44", username: "VELOX", eventType: "NETWORK UPLOAD", fileDetails: "log_data.bin", timestamp: "2024-01-15 13:30:00" },
    { ipAddress: "192.168.0.45", username: "Kiran_Tester", eventType: "NETWORK UPLOAD", fileDetails: "test_packet.bin", timestamp: "2024-01-15 14:45:00" },
    { ipAddress: "192.168.0.46", username: "VELOX", eventType: "NETWORK DOWNLOAD", fileDetails: "firmware.bin", timestamp: "2024-01-15 15:20:00" },
    { ipAddress: "192.168.0.47", username: "User2", eventType: "NETWORK UPLOAD", fileDetails: "metrics_data.bin", timestamp: "2024-01-15 16:10:00" },
    { ipAddress: "192.168.0.48", username: "VELOX", eventType: "NETWORK DOWNLOAD", fileDetails: "security_patch.bin", timestamp: "2024-01-15 17:00:00" },
    { ipAddress: "192.168.0.49", username: "Kira_Tester", eventType: "NETWORK UPLOAD", fileDetails: "debug_log.bin", timestamp: "2024-01-15 18:30:00" },
    { ipAddress: "192.168.0.50", username: "VELOX", eventType: "NETWORK DOWNLOAD", fileDetails: "profile_data.bin", timestamp: "2024-01-15 19:45:00" },
  ];

  // Hardcoded Mail Incident Data
  const mailIncidentData = [
    { ipAddress: "192.168.0.41", username: "VELOX", eventType: "MAIL SENT", fileDetails: "Invoice_2024.pdf", timestamp: "2024-01-15 10:30:00" },
    { ipAddress: "192.168.0.42", username: "Admin", eventType: "MAIL RECEIVED", fileDetails: "Report.docx", timestamp: "2024-01-15 11:15:00" },
    { ipAddress: "192.168.0.43", username: "User1", eventType: "MAIL SENT", fileDetails: "Presentation.pptx", timestamp: "2024-01-15 12:00:00" },
    { ipAddress: "192.168.0.44", username: "VELOX", eventType: "MAIL RECEIVED", fileDetails: "Contract.pdf", timestamp: "2024-01-15 13:30:00" },
    { ipAddress: "192.168.0.45", username: "Kiran_Tester", eventType: "MAIL SENT", fileDetails: "Data_Export.xlsx", timestamp: "2024-01-15 14:45:00" },
    { ipAddress: "192.168.0.46", username: "VELOX", eventType: "MAIL RECEIVED", fileDetails: "Meeting_Notes.txt", timestamp: "2024-01-15 15:20:00" },
    { ipAddress: "192.168.0.47", username: "User2", eventType: "MAIL SENT", fileDetails: "Image_01.png", timestamp: "2024-01-15 16:10:00" },
    { ipAddress: "192.168.0.48", username: "VELOX", eventType: "MAIL RECEIVED", fileDetails: "Report_2024.pdf", timestamp: "2024-01-15 17:00:00" },
    { ipAddress: "192.168.0.49", username: "Kira_Tester", eventType: "MAIL SENT", fileDetails: "Backup.zip", timestamp: "2024-01-15 18:30:00" },
    { ipAddress: "192.168.0.50", username: "VELOX", eventType: "MAIL RECEIVED", fileDetails: "Source_Code.js", timestamp: "2024-01-15 19:45:00" },
  ];

  // Hardcoded Peripheral Incident Data
  const peripheralIncidentData = [
    { ipAddress: "192.168.0.41", username: "VELOX", eventType: "USB TRANSFER", fileDetails: "usb_data_01.bin", timestamp: "2024-01-15 10:30:00" },
    { ipAddress: "192.168.0.42", username: "Admin", eventType: "DVD BURN", fileDetails: "dvd_backup.iso", timestamp: "2024-01-15 11:15:00" },
    { ipAddress: "192.168.0.43", username: "User1", eventType: "USB TRANSFER", fileDetails: "external_drive_data.zip", timestamp: "2024-01-15 12:00:00" },
    { ipAddress: "192.168.0.44", username: "VELOX", eventType: "DVD BURN", fileDetails: "project_backup.iso", timestamp: "2024-01-15 13:30:00" },
    { ipAddress: "192.168.0.45", username: "Kiran_Tester", eventType: "USB TRANSFER", fileDetails: "test_data.bin", timestamp: "2024-01-15 14:45:00" },
    { ipAddress: "192.168.0.46", username: "VELOX", eventType: "DVD BURN", fileDetails: "media_backup.iso", timestamp: "2024-01-15 15:20:00" },
    { ipAddress: "192.168.0.47", username: "User2", eventType: "USB TRANSFER", fileDetails: "flash_drive_data.zip", timestamp: "2024-01-15 16:10:00" },
    { ipAddress: "192.168.0.48", username: "VELOX", eventType: "DVD BURN", fileDetails: "archive_dvd.iso", timestamp: "2024-01-15 17:00:00" },
    { ipAddress: "192.168.0.49", username: "Kira_Tester", eventType: "USB TRANSFER", fileDetails: "external_hdd_data.bin", timestamp: "2024-01-15 18:30:00" },
    { ipAddress: "192.168.0.50", username: "VELOX", eventType: "DVD BURN", fileDetails: "backup_dvd.iso", timestamp: "2024-01-15 19:45:00" },
  ];

  const transformedFileTypes = useMemo(() => {

    const max = Math.max(...fileTypeData.map(x => x.count), 1);

    const colors = [
      "#3076e7",
      "#3076e7",
      "#3076e7",
      "#3076e7",
      "#3076e7",
      "#3076e7",
    ];

    return fileTypeData.map((item, index) => ({
      type: item.extension.toUpperCase(),
      pct: Math.round((item.count / max) * 100),
      color: colors[index % colors.length],
    }));

  }, [fileTypeData]);

  const [incidentSummary, setIncidentSummary] = useState([]);
  const incidents = incidentSummary.reduce((obj, item) => {
    obj[item.eventType] = item.count;
    return obj;
  }, {});

  const webIncident = incidents["WEB UPLOAD"] || 0;
  const networkIncident = incidents["NETWORK UPLOAD"] || 0;
  const peripheralIncident = (incidents["DVD BURN"] || 0) + (incidents["USB TRANSFER"] || 0);
  const mailIncident = incidents["MAIL"] || 0;

  const fileUploadChartData = useMemo(() => {

    // Convert API response to an object
    const uploads = fileUploadSummary.reduce((obj, item) => {
      obj[item.eventType] = item.count;
      return obj;
    }, {});

    const ftp = uploads["FTP TRANSFER"] || 0;
    const network = uploads["NETWORK UPLOAD"] || 0;
    const web = uploads["WEB UPLOAD"] || 0;

    const max = Math.max(ftp, network, web, 1);
    const total = ftp + network + web || 1;

    return [
      {
        name: "FTP",
        value: Math.round((ftp / total) * 100),
        count: ftp,
        color: "#3819e9",
      },
      {
        name: "Network",
        value: Math.round((network / total) * 100),
        count: network,
        color: "#5c68ec",
      },
      {
        name: "Web Browser",
        value: Math.round((web / total) * 100),
        count: web,
        color: "#85a8ea",
      },
    ];


  }, [fileUploadSummary]);

  const transformedClipboardData = useMemo(() => {

    return clipboardData.map(item => ({

      x: item[0].split("-")[2],   // day only

      v: item[1]

    }));

  }, [clipboardData]);

  const Tip = (props) => <ChartTip {...props} isDark={isDark} />
  const loadDashboard = async () => {

    const [endpoint, incidents, fileTypes, clipboard, fileUpload, printerdata, incidentbychannel, emailIncident, OrganizationIncident, LatestIncident, PreventedApplication] = await Promise.all([
      dashboardService.getEndpointStatus(),
      dashboardService.getIncidentSummary(),
      dashboardService.getFileTypeIncident(),
      dashboardService.getClipboardIncidents(),
      dashboardService.getTodaysFileUploadIncidents(),
      dashboardService.getPrinterIncidents(),
      dashboardService.getIncidentsByChannel(),
      dashboardService.getMailIncident(),
      dashboardService.getOrganizationIncident(),
      dashboardService.getLatestIncident(),
      dashboardService.getPreventedApplication()
    ]);

    console.log("prevented incident", PreventedApplication.data);

    setEndpointStatus(endpoint);
    setIncidentSummary(incidents.data);
    setFileTypeData(fileTypes.data);
    setClipboardData(clipboard.data);
    setFileUploadSummary(fileUpload.data);
    setPrinterData(printerdata.data);
    setincidentByChannelData(incidentbychannel.data);
    setemailIncidentData(emailIncident.data);
    setorganizationincidentData(OrganizationIncident.data);
    setLatestincidentData(LatestIncident.data);
    setPreventedApplicationData(PreventedApplication.data);

  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="flex flex-col gap-2">

      {/* ROW 1 — Endpoint Status + 4× Malware Cards */}
      <div className="grid grid-cols-5 gap-4">

        {/* Endpoint Status */}
        <DCard className="col-span-1">
          <STitle>Endpoint Status</STitle>
          <div className="flex flex-col gap-3">
            {
              [
                {
                  label: "Total Endpoints",
                  val: endpointData?.total ?? 0,
                  max: endpointData?.total ?? 1,
                  color: "#7094ff",
                },
                {
                  label: "Active Devices",
                  val: endpointData?.active ?? 0,
                  max: endpointData?.total ?? 1,
                  color: "#22c55e",
                },
                {
                  label: "Inactive Devices",
                  val: endpointData?.inactive ?? 0,
                  max: endpointData?.total ?? 1,
                  color: "#ef4444",
                },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="dark:text-white/40 text-slate-500">{item.label}</span>
                    <span className="font-semibold" style={{ color: item.color }}>{item.val}</span>
                  </div>
                  <div className="h-1.5 rounded-full dark:bg-white/[0.06] bg-slate-100">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${(item.val / item.max) * 100}%`, background: item.color }} />
                  </div>
                </div>
              ))}
          </div>
        </DCard>

        {/* Web Incident - Clickable */}
        <DCard 
          className="flex items-center justify-between gap-3"
          clickable={true}
          onClick={() => openModal("Incident Details", "Web Incidents", webIncidentData)}
        >
          <div>
            <p className="text-[14px] font-bold dark:text-white text-slate-800 mb-2">
              Web Incident
            </p>

            <p className="text-3xl font-bold dark:text-white text-slate-800">
              {webIncident}
            </p>

            <p className="text-[10px] dark:text-white/30 text-slate-400 mt-1">
              Across all endpoints
            </p>

            <p className="text-[11px] text-emerald-400 font-semibold mt-1.5">
              ↑ 8.5%
            </p>
          </div>

          <CircleProgress
            pct={20}
            color="#7094ff"
            size={60}
            stroke={5}
            isDark={isDark}
          />
        </DCard>

        {/* Network Incident - Clickable */}
        <DCard 
          className="flex items-center justify-between gap-3"
          clickable={true}
          onClick={() => openModal("Incident Details", "Network Incidents", networkIncidentData)}
        >
          <div>
            <p className="text-[12px] font-semibold dark:text-white/80 text-slate-700 mb-2">
              Network Incident
            </p>
            <p className="text-3xl font-bold dark:text-white text-slate-800">
              {networkIncident}
            </p>
            <p className="text-[10px] dark:text-white/30 text-slate-400 mt-1">
              Across all endpoints
            </p>
            <p className="text-[11px] text-emerald-400 font-semibold mt-1.5">
              ↑ 5.2%
            </p>
          </div>

          <CircleProgress
            pct={40}
            color="#22c55e"
            size={60}
            stroke={5}
            isDark={isDark}
          />
        </DCard>

        {/* Mail Incident - Clickable */}
        <DCard 
          className="flex items-center justify-between gap-3"
          clickable={true}
          onClick={() => openModal("Incident Details", "Mail Incidents", mailIncidentData)}
        >
          <div>
            <p className="text-[12px] font-semibold dark:text-white/80 text-slate-700 mb-2">
              Mail Incident
            </p>

            <p className="text-3xl font-bold dark:text-white text-slate-800">
              {mailIncident}
            </p>

            <p className="text-[10px] dark:text-white/30 text-slate-400 mt-1">
              Across all endpoints
            </p>

            <p className="text-[11px] text-emerald-400 font-semibold mt-1.5">
              ↑ 12.4%
            </p>
          </div>

          <CircleProgress
            pct={60}
            color="#f59e0b"
            size={60}
            stroke={5}
            isDark={isDark}
          />
        </DCard>

        {/* Peripheral Incident - Clickable */}
        <DCard 
          className="flex items-center justify-between gap-3"
          clickable={true}
          onClick={() => openModal("Incident Details", "Peripheral Incidents", peripheralIncidentData)}
        >
          <div>
            <p className="text-[12px] font-semibold dark:text-white/80 text-slate-700 mb-2">
              Peripheral Incident
            </p>

            <p className="text-3xl font-bold dark:text-white text-slate-800">
              {peripheralIncident}
            </p>

            <p className="text-[10px] dark:text-white/30 text-slate-400 mt-1">
              Across all endpoints
            </p>

            <p className="text-[11px] text-emerald-400 font-semibold mt-1.5">
              ↑ 3.8%
            </p>
          </div>

          <CircleProgress
            pct={80}
            color="#ef4444"
            size={60}
            stroke={5}
            isDark={isDark}
          />
        </DCard>
      </div>

      {/* ROW 2 — Org Incident + Channel Donut + File Type */}
      <div>
        <div className="grid grid-cols-12 gap-2">

          {/* Organization Incident */}
          <DCard className="col-span-4">
            <STitle>Organization Incident</STitle>
            <OrganisationIncident data={OrganizationIncident} isDark={isDark} axisStyle={axisStyle} gridColor={gridColor} Tip={Tip} />
          </DCard>

          {/* Incident by Channel */}
          <DCard className="col-span-4">
            <STitle>Incident by Channel</STitle>

            <IncidentByChannelChart data={incidentByChannelData} isDark={isDark}></IncidentByChannelChart>
          </DCard>


          {/* Incident by File Type */}

          <DCard className="col-span-4">
            <STitle>Incident By File Type</STitle>

            <IncidentByFileType data={transformedFileTypes} />
          </DCard>

        </div>
      </div>

      {/* ROW 3 — File Upload + Clipboard + Mail + Printer */}
      <div className="grid grid-cols-12 gap-2">

        {/* File Upload */}
        <DCard className="col-span-3">
          <STitle>File Upload</STitle>
          <FileUploadRadialChart data={fileUploadChartData}></FileUploadRadialChart>
        </DCard>

        {/* Clipboard Incident */}
        <DCard className="col-span-5">
          <STitle>Clipboard Incident</STitle>
          <ClipboardIncident data={transformedClipboardData} isDark={isDark} axisStyle={axisStyle} Tip={Tip} total={670}></ClipboardIncident>
        </DCard>


        <div className="col-span-4 flex flex-col gap-2">

          {/* MAIL INCIDENT */}
          <DCard className="rounded-b-none border-b border-white/2">
            <STitle>Mail Incident (7 days)</STitle>

            <MailIncidentChart data={emailIncidentData} totalIncidents="120K" growth="+25%"></MailIncidentChart>
          </DCard>

          {/* PRINTER INCIDENT */}
          <DCard className="rounded-t-none">
            <STitle>Printer Incident </STitle>
            <PrinterIncidentChart totalIncidents={printerData.totalCount} peakDay={printerData.peakDay}></PrinterIncidentChart>
          </DCard>

        </div>
      </div>

      {/* ROW 4 — Endpoint Table + Prevented Apps */}
      <div className="grid grid-cols-12 gap-3">

        {/* Endpoint Status Table */}
        <DCard className="col-span-7" padding={false}>
          <LatestIncidents rows={LatestIncident} divider={divider} cardBorder={cardBorder} isDark={isDark} />
        </DCard>


        {/* Prevented Application */}
        <DCard className="col-span-5">
          <PreventedApplicationChart data={preventedApplicationData} gridColor={gridColor} axisStyle={axisStyle} Tip={Tip} />
        </DCard>
      </div>

      {/* Modal */}
      <IncidentModal 
        show={modalState.show}
        onClose={closeModal}
        title={modalState.title}
        category={modalState.category}
        data={modalState.data}
        isDark={isDark}
      />

    </div>
  )
}