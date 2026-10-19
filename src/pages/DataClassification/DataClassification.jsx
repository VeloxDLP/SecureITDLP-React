import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FileText, Hand, ShieldAlert, Search, Loader2 } from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";

import { useTheme } from "../../context/ThemeContext";
import { dashboardService } from "../../services/dashboardService";
import ClassificationFilesModal from "./ClassificationFilesModal";

import {
  getFilesByCategory,
  getLabelColor,
  labelCounts,
} from "./classificationData";

/* ---------------- STATIC DATA & NORMALIZERS ---------------- */
const fileTypeColors = [
  "#7BBDE8", // Light Cyan (Peripherals)
  "#1613d3", // Deep Blue (Email)
  "#0d2e88", // Dark Blue (Network)
  "#375ab9", // Medium Blue (Printer)
  "#6375df", // Light Blue (Clipboard)
  "#6EA2B3", // Muted Teal (Drive)
  "#94a3b8", // Gray-Blue (Fallback 1)
  "#64748b", // Slate (Fallback 2)
];

const shortLabel = (name) =>
  name === "Business Documents" ? "Business" : name;

const networkData = [
  { name: "WEB UPLOAD", value: 20 },
  { name: "USB TRANSFER", value: 65 },
  { name: "FTP TRANSFER", value: 30 },
  { name: "DVD BURN", value: 70 },
  { name: "NETWORK UPLOAD", value: 80 },
];

function normalizeLabelCounts(response) {
  let data = response?.data ?? response;

  if (data && !Array.isArray(data)) {
    data =
      data.labelCounts ??
      data.label_counts ??
      data.labels ??
      data.counts ??
      data.result ??
      data.items ??
      data.data ??
      data;
  }

  if (Array.isArray(data)) {
    return data
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const name =
          item.name ??
          item.label ??
          item.labelName ??
          item.label_name ??
          item.sensitivity ??
          item.category ??
          item.key ??
          item.type ??
          item.level;
        const value =
          item.value ??
          item.count ??
          item.total ??
          item.total_count ??
          item.files ??
          item.totalFiles ??
          item.fileCount ??
          item.numFiles;
        const num = Number(value);
        if (!name || !Number.isFinite(num)) return null;
        return { name: String(name).trim(), value: num };
      })
      .filter(Boolean);
  }

  if (data && typeof data === "object") {
    return Object.entries(data)
      .filter(([k, v]) => {
        if (["total", "count", "sum"].includes(k)) return false;
        if (v == null || typeof v === "object") return false;
        return Number.isFinite(Number(v));
      })
      .map(([k, v]) => ({ name: k, value: Number(v) }));
  }

  return [];
}

function normalizeFileRow(item, index) {
  if (!item || typeof item !== "object") return null;

  const fileName = item.fileName ?? item.file_name ?? item.filename ?? item.FILE_NAME ?? "";
  const filePath = item.filePath ?? item.file_path ?? item.FILE_PATH ?? "";
  const extension = item.extension ?? item.EXTENSION ?? item.ext ?? "";
  const label = item.label ?? item.LABEL ?? item.classification ?? item.sensitivity ?? "";
  const hostName = item.hostname ?? item.hostName ?? item.host_name ?? item.HOSTNAME ?? item.host ?? "";
  const srNo = item.srNo ?? item.sr_no ?? item.SRNO ?? item.id ?? index + 1;

  if (!fileName && !filePath) return null;

  return {
    srNo,
    fileName: String(fileName || "").trim(),
    filePath: String(filePath || "").trim(),
    extension: String(extension || "").replace(/^\./, "").trim(),
    label: String(label || "").trim(),
    hostName: String(hostName || "").trim(),
  };
}

function normalizeFilesList(response) {
  let payload = response?.data ?? response;

  if (payload && !Array.isArray(payload) && typeof payload === "object") {
    payload = payload.data ?? payload.result ?? payload.payload ?? payload;
  }
  if (payload && !Array.isArray(payload) && typeof payload === "object") {
    payload = payload.content ?? payload.items ?? payload.records ?? payload.rows ?? payload.results ?? payload;
  }

  if (!Array.isArray(payload)) return [];

  return payload.map(normalizeFileRow).filter(Boolean);
}

/* ---------------- COMPONENT ---------------- */

export default function DataClassification() {
  const { isDark } = useTheme();

  const [totalScannedFiles, setTotalScannedFiles] = useState(0);
  const [loadingTotal, setLoadingTotal] = useState(true);

  const [sensitivityData, setSensitivityData] = useState(
    Array.isArray(labelCounts) ? labelCounts : []
  );
  const [loadingLabels, setLoadingLabels] = useState(true);

  // State for dynamic File Type Distribution
  const [fileTypeData, setFileTypeData] = useState([]);
  const [loadingFileTypes, setLoadingFileTypes] = useState(true);

  const [classificationFiles, setClassificationFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [filesError, setFilesError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [modalState, setModalState] = useState({
    show: false,
    title: "",
    data: [],
    loading: false,
    error: "",
  });

  /* ---------- FETCH: total scanned files ---------- */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingTotal(true);
        const response = await dashboardService.getTotalScannedFiles();
        let payload = response?.data ?? response;
        if (payload && typeof payload === "object" && !Array.isArray(payload)) {
          payload = payload.data ?? payload.result ?? payload;
        }
        const raw = typeof payload === "number" || typeof payload === "string"
            ? payload
            : payload?.totalScannedFiles ?? payload?.totalScannedFilesCount ?? payload?.count ?? payload?.total ?? 0;
        const count = Number(raw);
        if (mounted && Number.isFinite(count)) setTotalScannedFiles(count);
      } catch (err) {
        console.error("[DC] getTotalScannedFiles error:", err);
      } finally {
        if (mounted) setLoadingTotal(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  /* ---------- FETCH: label counts ---------- */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingLabels(true);
        if (typeof dashboardService.getLabelCounts !== "function") return;
        const response = await dashboardService.getLabelCounts();
        const normalized = normalizeLabelCounts(response);
        if (mounted && normalized.length > 0) setSensitivityData(normalized);
      } catch (err) {
        console.error("[DC] getLabelCounts error:", err);
      } finally {
        if (mounted) setLoadingLabels(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  /* ---------- FETCH: extension counts (File Type Distribution) ---------- */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingFileTypes(true);
        if (typeof dashboardService.getExtensionCounts !== "function") {
          console.error("[DC] dashboardService.getExtensionCounts is missing");
          return;
        }

        const response = await dashboardService.getExtensionCounts();
        
        let payload = response?.data ?? response;
        if (payload && !Array.isArray(payload) && typeof payload === "object") {
          payload = payload.data ?? payload.result ?? payload;
        }

        if (Array.isArray(payload)) {
          const mapped = payload.map((item, index) => ({
            name: String(item.extension || "UNKNOWN").toUpperCase(),
            value: Number(item.count) || 0,
            color: fileTypeColors[index % fileTypeColors.length],
          }));
          if (mounted) setFileTypeData(mapped);
        }
      } catch (err) {
        console.error("[DC] getExtensionCounts error:", err);
      } finally {
        if (mounted) setLoadingFileTypes(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  /* ---------- FETCH: classification files (table) ---------- */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingFiles(true);
        setFilesError("");
        if (typeof dashboardService.getClassificationFiles !== "function") return;
        const response = await dashboardService.getClassificationFiles();
        const rows = normalizeFilesList(response);
        if (mounted) {
          setClassificationFiles(rows);
          if (rows.length === 0) setFilesError("No classification files returned.");
        }
      } catch (err) {
        console.error("[DC] getClassificationFiles error:", err);
        if (mounted) setFilesError(err?.message ?? "Failed to load classification files.");
      } finally {
        if (mounted) setLoadingFiles(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  /* ---------- Filtered rows (search) ---------- */
  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return classificationFiles;
    const q = searchQuery.toLowerCase();
    return classificationFiles.filter((f) =>
      [f.fileName, f.filePath, f.label, f.hostName, f.extension]
        .join(" ").toLowerCase().includes(q)
    );
  }, [classificationFiles, searchQuery]);

  /* ---------- Modal Handlers ---------- */
  const openModal = (card) => {
    setModalState({
      show: true, title: card.modalTitle,
      data: getFilesByCategory(card.category),
      loading: false, error: "",
    });
  };

  const openLabelModal = async (label) => {
    if (!label) return;
    setModalState({ show: true, title: `${label} Files`, data: [], loading: true, error: "" });

    try {
      if (typeof dashboardService.getFilesByLabel !== "function") return;
      const response = await dashboardService.getFilesByLabel(label);
      const rows = normalizeFilesList(response);
      setModalState((prev) => ({
        ...prev, loading: false, data: rows,
        error: rows.length === 0 ? "No files found for this label." : "",
      }));
    } catch (err) {
      setModalState((prev) => ({
        ...prev, loading: false, error: err?.message ?? "Failed to load files.",
      }));
    }
  };

  const openExtensionModal = async (extension) => {                                                                                                                                                                                                                                                                                                                                
    if (!extension) return;

    setModalState({
      show: true,
      title: `${extension.toUpperCase()} Files`,
      data: [],
      loading: true,
      error: "",
    });

    try {
      if (typeof dashboardService.getFilesByExtension !== "function") {
        console.error("[DC] dashboardService.getFilesByExtension is missing");
        setModalState((prev) => ({
          ...prev,
          loading: false,
          error: "Service method missing.",
        }));
        return;
      }

      const response = await dashboardService.getFilesByExtension(extension);
      console.log(`[DC] files-by-extension "${extension}" raw:`, response);

      const rows = normalizeFilesList(response);
      console.log(`[DC] files-by-extension "${extension}" normalized:`, rows);

      setModalState((prev) => ({
        ...prev,
        loading: false,
        data: rows,
        error: rows.length === 0 ? "No files found for this extension." : "",
      }));
    } catch (err) {
      console.error("[DC] getFilesByExtension error:", err);
      setModalState((prev) => ({
        ...prev,
        loading: false,
        error: err?.message ?? "Failed to load files.",
      }));
    }
  };

  const closeModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, show: false, loading: false, error: "" }));
  }, []);

  /* ---------- Calculate Total for Pie Chart Center ---------- */
  const fileTotal = useMemo(() => {
    return fileTypeData.reduce((sum, item) => sum + item.value, 0);
  }, [fileTypeData]);

  /* ---------- CARDS ---------- */
  const cards = useMemo(
    () => [
      {
        title: "TOTAL SCANNED FILES", category: "total",
        modalTitle: "Total Scanned Files",
        value: loadingTotal ? "..." : totalScannedFiles.toLocaleString(),
        status: "↑ 12.5% from last week",
        statusColor: isDark ? "text-emerald-400" : "text-emerald-600",
        icon: FileText, iconColor: isDark ? "text-cyan-400" : "text-blue-600",
      },
      {
        title: "BLOCKED FILES", category: "blocked",
        modalTitle: "Blocked Files",
        value: getFilesByCategory("blocked").length.toLocaleString(),
        status: "↑ 3.7% from last week",
        statusColor: isDark ? "text-yellow-400" : "text-yellow-600",
        icon: Hand, iconColor: isDark ? "text-yellow-400" : "text-yellow-600",
      },
      {
        title: "HIGH RISK FILES", category: "highRisk",
        modalTitle: "High Risk Files",
        value: getFilesByCategory("highRisk").length.toLocaleString(),
        status: "↑ 8.3% from last week",
        statusColor: isDark ? "text-red-400" : "text-red-600",
        icon: ShieldAlert, iconColor: isDark ? "text-red-500" : "text-red-600",
      },
    ],
    [isDark, loadingTotal, totalScannedFiles]
  );

  /* ---------- RENDER ---------- */
  return (
    <div className="overflow-hidden">
      <div className="h-full overflow-y-auto">

        {/* ===== CARDS ===== */}
        <div className="p-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {cards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={index} role="button" tabIndex={0} onClick={() => openModal(card)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(card); } }}
                  className={`border rounded-lg h-[90px] px-3 flex items-center justify-between cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${isDark ? "border-[#1A2136] bg-[#020617]" : "border-gray-200 bg-white"}`}
                >
                  <div>
                    <p className={`text-[9px] uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-500"}`}>{card.title}</p>
                    <h2 className={`text-2xl font-bold mt-0.5 ${isDark ? "text-white" : "text-gray-900"}`}>{card.value}</h2>
                    <p className={`text-[10px] mt-0.5 ${card.statusColor}`}>{card.status}</p>
                  </div>
                  <Icon size={32} strokeWidth={1.8} className={card.iconColor} />
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== THREE CHARTS ===== */}
        <div className="px-2 pb-3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

            {/* SENSITIVITY LEVELS */}
            <div className={`rounded-2xl overflow-hidden border ${isDark ? "border-[#1A2136] bg-[#020617]" : "border-gray-200 bg-white"}`}>
              <div className="px-5 py-4 flex items-center justify-between">
                <h2 className={`text-[10px] font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>Sensitivity Levels</h2>
                {loadingLabels && <span className={`text-[10px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>Loading...</span>}
              </div>
              <div className="px-4 py-4">
                <div className="h-[210px]">
                  {sensitivityData.length === 0 ? (
                    <div className={`h-full flex items-center justify-center text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>No label data available.</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sensitivityData} margin={{ top: 5, right: 5, left: -18, bottom: 5 }}>
                        <CartesianGrid stroke={isDark ? "#1B2438" : "#e5e7eb"} strokeDasharray="4 4" vertical={false} horizontal={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} interval={0} angle={-35} textAnchor="end" height={45} tickFormatter={shortLabel} tick={{ fill: isDark ? "#5F6B87" : "#6b7280", fontSize: 9 }} />
                        <YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{ fill: isDark ? "#5F6B87" : "#6b7280", fontSize: 11 }} />
                        <Tooltip cursor={{ fill: isDark ? "rgba(134,162,255,0.08)" : "rgba(0,0,0,0.05)" }} contentStyle={{ backgroundColor: isDark ? "#10182B" : "#ffffff", border: isDark ? "1px solid #1A2136" : "1px solid #e5e7eb", borderRadius: "8px", color: isDark ? "#fff" : "#000" }} />
                        <Bar dataKey="value" name="Files" fill="#86A2FF" radius={[6, 6, 0, 0]} barSize={18} cursor="pointer" onClick={(entry) => openLabelModal(entry?.payload?.name ?? entry?.name)} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* FILE TYPE DISTRIBUTION */}
            <div className={`relative rounded-2xl border overflow-hidden ${isDark ? "bg-[#020617] border-[#1e293b]" : "bg-white border-gray-200"}`}>
              <div className="relative px-5 py-4 flex justify-between">
                <h2 className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>File Type Distribution</h2>
                {loadingFileTypes && <span className={`text-[10px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>Loading...</span>}
              </div>
              
              <div className="relative flex items-center justify-center gap-4 px-5 pb-5">
                {fileTypeData.length === 0 && !loadingFileTypes ? (
                  <div className={`h-[190px] flex items-center justify-center text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>No file types available.</div>
                ) : (
                  <>
                    <div className="relative h-[190px] w-[190px] shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={fileTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={82} paddingAngle={3} cornerRadius={6} stroke="none">
                            {fileTypeData.map((entry, index) => (
                              <Cell key={`file-type-${index}`} fill={entry.color} cursor="pointer" onClick={() => openExtensionModal(entry.name)} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: isDark ? "#10182B" : "#ffffff", border: isDark ? "1px solid #1A2136" : "1px solid #e5e7eb", borderRadius: "8px", color: isDark ? "#fff" : "#000" }} />
                        </PieChart>
                      </ResponsiveContainer>
                      
                      {/* Center Total */}
                      <div className={`pointer-events-none absolute left-1/2 top-1/2 flex h-[96px] w-[96px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full ${isDark ? "bg-[#111827]" : "bg-white"}`}>
                        <span className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{fileTotal.toLocaleString()}</span>
                        <span className={`text-[11px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>Files</span>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex min-w-0 flex-1 flex-col gap-2.5 overflow-y-auto max-h-[190px]">
                      {fileTypeData.map((item, index) => (
                        <button type="button" key={`file-type-name-${index}`} onClick={() => openExtensionModal(item.name)} className={`flex items-center gap-2 rounded px-1 py-0.5 text-left transition ${isDark ? "hover:bg-white/[0.06]" : "hover:bg-gray-100"}`}>
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className={`min-w-0 flex-1 truncate text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>{item.name}</span>
                          <span className={`text-xs font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{item.value}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* NETWORK DLP EVENTS */}
            <div className={`rounded-2xl overflow-hidden border ${isDark ? "border-[#1E2942] bg-[#020617]" : "border-gray-200 bg-white"}`}>
              <div className="px-5 pt-4">
                <h2 className={`text-[10px] font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>Network DLP Events</h2>
              </div>
              <div className="w-full h-[230px] px-2 pb-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={networkData} margin={{ top: 10, right: 8, left: 5, bottom: 5 }}>
                    <defs>
                      <linearGradient id="networkGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22C55E" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} padding={{ left: 5, right: 5 }} tick={{ fill: isDark ? "#5D6B87" : "#6b7280", fontSize: 8 }} />
                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} allowDecimals={false} width={32} tick={{ fill: isDark ? "#5D6B87" : "#6b7280", fontSize: 10 }} />
                    <Tooltip cursor={false} contentStyle={{ background: isDark ? "#101827" : "#ffffff", border: isDark ? "1px solid #1E2942" : "1px solid #e5e7eb", borderRadius: "8px", color: isDark ? "#fff" : "#000" }} />
                    <Area type="monotone" dataKey="value" name="Events" stroke="#22C55E" strokeWidth={3} fill="url(#networkGradient)" dot={{ r: 3.5, fill: "#22C55E", stroke: "#FFFFFF", strokeWidth: 2 }} activeDot={{ r: 5, fill: "#22C55E", stroke: "#FFFFFF", strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>

        {/* ===== CLASSIFICATION FILES TABLE ===== */}
        <div className="px-2 pb-6">
          <div className={`rounded-2xl overflow-hidden border ${isDark ? "border-[#1A2136] bg-[#020617]" : "border-gray-200 bg-white"}`}>
            <div className={`flex items-center justify-between px-5 py-2 border-b ${isDark ? "border-[#1D2B3D]" : "border-gray-200"}`}>
              <div className="flex items-center gap-3">
                <h2 className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>Classification Files</h2>
                {/* ✅ REMOVED COUNT HERE */}
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                  <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-48 h-7 pl-8 pr-3 rounded-lg border text-[10px] focus:outline-none focus:ring-1 focus:ring-blue-500 ${isDark ? "bg-[#020617] border-[#243244] text-gray-300 placeholder-gray-500" : "bg-gray-50 border-gray-300 text-gray-700 placeholder-gray-400"}`} />
                </div>
                <button type="button" className={`h-7 px-3 rounded-lg border text-[10px] transition ${isDark ? "border-[#243244] text-gray-300 hover:bg-[#0d1727]" : "border-gray-300 text-gray-600 hover:bg-gray-100"}`}>Export</button>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <div className="h-[220px] overflow-y-auto overflow-x-auto">
                {loadingFiles ? (
                  <div className="h-full flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin text-blue-500" />
                    <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Loading classification files...</span>
                  </div>
                ) : (
                  <table className="w-full min-w-[950px] table-fixed border-collapse">
                    <colgroup>
                      <col className="w-[6%]" /><col className="w-[20%]" /><col className="w-[36%]" /><col className="w-[9%]" /><col className="w-[13%]" /><col className="w-[16%]" />
                    </colgroup>
                    <thead className={`sticky top-0 z-20 ${isDark ? "bg-[#020617]" : "bg-white"}`}>
                      <tr className={`border-b ${isDark ? "border-[#1D2B3D]" : "border-gray-200"}`}>
                        {["SR NO", "FILE NAME", "FILE PATH", "EXTENSION", "LABEL", "HOST NAME"].map((heading) => (
                          <th key={heading} className={`px-3 py-2 text-left text-[9px] uppercase tracking-wider font-semibold whitespace-nowrap ${isDark ? "text-gray-400" : "text-gray-500"}`}>{heading}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFiles.map((file, index) => (
                        <tr key={file.srNo ?? index} className={`h-[34px] border-b transition-colors ${isDark ? "border-[#1D2B3D] hover:bg-[#0d1727]" : "border-gray-200 hover:bg-gray-50"}`}>
                          <td className={`px-3 py-2 text-[10px] font-medium ${isDark ? "text-blue-400" : "text-blue-600"}`}>{index + 1}</td>
                          <td className={`px-3 py-2 text-[10px] font-medium truncate ${isDark ? "text-white" : "text-gray-900"}`} title={file.fileName}>{file.fileName || "—"}</td>
                          <td className={`px-3 py-2 text-[9px] truncate ${isDark ? "text-gray-400" : "text-gray-500"}`} title={file.filePath}>{file.filePath || "—"}</td>
                          <td className={`px-3 py-2 text-[9px] uppercase font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>{file.extension || "—"}</td>
                          <td className="px-3 py-2">
                            {file.label ? (
                              <span className={`inline-flex items-center px-2 py-[2px] rounded-full text-[8px] font-semibold whitespace-nowrap ${getLabelColor(file.label)}`}>{file.label}</span>
                            ) : (
                              <span className={`text-[9px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>—</span>
                            )}
                          </td>
                          <td className={`px-3 py-2 text-[9px] whitespace-nowrap truncate ${isDark ? "text-gray-400" : "text-gray-500"}`} title={file.hostName}>{file.hostName || "—"}</td>
                        </tr>
                      ))}
                      {filteredFiles.length === 0 && (
                        <tr>
                          <td colSpan={6} className={`py-10 text-center text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                            {filesError ? filesError : searchQuery ? "No matching files." : "No classification files found."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      <ClassificationFilesModal
        show={modalState.show} onClose={closeModal} title={modalState.title} data={modalState.data} loading={modalState.loading} error={modalState.error}
      />
    </div>
  );
}