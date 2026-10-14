import React, { useCallback, useState } from "react";
import {
  Calendar,
  Filter,
  Download,
  RotateCw,
  Menu,
  FileText,
  ShieldAlert,
  Hand,
  Search,
} from "lucide-react";
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
import { useTheme } from "../../context/ThemeContext"; // ✅ fixed path
import ClassificationFilesModal from "./ClassificationFilesModal";
import {
  classificationFiles,
  extensionCounts,
  getFilesByCategory,
  getFilesByExtension,
  getFilesByLabel,
  getLabelColor,
  labelCounts,
} from "./classificationData";

// ─── Data ──────────────────────────────────────────────────────────
// Both charts are counted from classificationFiles, so their totals
// always equal the Total Scanned Files card.
const sensitivityData = labelCounts;

const fileTypeColors = ["#2f80ed", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#94a3b8"];

const fileTypeData = extensionCounts.map((item, index) => ({
  ...item,
  color: fileTypeColors[index % fileTypeColors.length],
}));

const shortLabel = (name) => (name === "Business Documents" ? "Business" : name);

const networkData = [
  { name: "WEB UPLOAD", value: 20 },
  { name: "USB TRANSFER", value: 65 },
  { name: "FTP TRANSFER", value: 30 },
  { name: "DVD BURN", value: 70 },
  { name: "NETWORK UPLOAD", value: 80 },
];

const fileTotal = fileTypeData.reduce((sum, item) => sum + item.value, 0);

// ─── Main Component ──────────────────────────────────────────────
export default function DataClassification() {
  const { isDark } = useTheme();

  const [modalState, setModalState] = useState({ show: false, title: "", data: [] });

  const openModal = (card) => {
    setModalState({ show: true, title: card.modalTitle, data: getFilesByCategory(card.category) });
  };

  const openLabelModal = (label) => {
    if (!label) return;
    setModalState({ show: true, title: `${label} Files`, data: getFilesByLabel(label) });
  };

  const openExtensionModal = (extension) => {
    if (!extension) return;
    setModalState({
      show: true,
      title: `${extension.toUpperCase()} Files`,
      data: getFilesByExtension(extension),
    });
  };

  const closeModal = useCallback(() => {
    setModalState((previous) => ({ ...previous, show: false }));
  }, []);

  const cards = [
    {
      title: "TOTAL SCANNED FILES",
      category: "total",
      modalTitle: "Total Scanned Files",
      value: getFilesByCategory("total").length.toLocaleString(),
      status: "↑ 12.5% from last week",
      statusColor: isDark ? "text-emerald-400" : "text-emerald-600",
      icon: FileText,
      iconColor: isDark ? "text-cyan-400" : "text-blue-600",
    },
    {
      title: "BLOCKED FILES",
      category: "blocked",
      modalTitle: "Blocked Files",
      value: getFilesByCategory("blocked").length.toLocaleString(),
      status: "↑ 3.7% from last week",
      statusColor: isDark ? "text-yellow-400" : "text-yellow-600",
      icon: Hand,
      iconColor: isDark ? "text-yellow-400" : "text-yellow-600",
    },
    {
      title: "HIGH RISK FILES",
      category: "highRisk",
      modalTitle: "High Risk Files",
      value: getFilesByCategory("highRisk").length.toLocaleString(),
      status: "↑ 8.3% from last week",
      statusColor: isDark ? "text-red-400" : "text-red-600",
      icon: ShieldAlert,
      iconColor: isDark ? "text-red-500" : "text-red-600",
    },
  ];

  return (
    <div className="overflow-hidden">
      <div className="h-full overflow-y-auto">
        {/* ─── Dashboard Cards ─── */}
        <div className="p-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {cards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={index}
                  role="button"
                  tabIndex={0}
                  onClick={() => openModal(card)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") openModal(card);
                  }}
                  className={`
                    border rounded-lg h-[90px] px-3 flex items-center justify-between cursor-pointer
                    transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
                    ${isDark ? 'border-[#1A2136] bg-[#020617]' : 'border-gray-200 bg-white'}
                  `}
                >
                  <div>
                    <p className={`text-[9px] uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {card.title}
                    </p>
                    <h2 className={`text-2xl font-bold mt-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {card.value}
                    </h2>
                    <p className={`text-[10px] mt-0.5 ${card.statusColor}`}>
                      {card.status}
                    </p>
                  </div>
                  <Icon size={32} strokeWidth={1.8} className={card.iconColor} />
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Three Cards Row ─── */}
        <div className="px-2 pb-3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Sensitivity Levels - Bar Chart */}
            <div className={`rounded-2xl overflow-hidden border ${isDark ? 'border-[#1A2136] bg-[#020617]' : 'border-gray-200 bg-white'}`}>
              <div className="px-5 py-4">
                <h2 className={`text-[10px] font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Sensitivity Levels
                </h2>
              </div>
              <div className="px-4 py-4">
                <div className="h-[210px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={sensitivityData}
                      margin={{ top: 5, right: 5, left: -18, bottom: 5 }}
                    >
              <CartesianGrid
  stroke={isDark ? "#1B2438" : "#e5e7eb"}
  strokeDasharray="4 4"
  vertical={false}
  horizontal={false}
/>
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                        angle={-35}
                        textAnchor="end"
                        height={45}
                        tickFormatter={shortLabel}
                        tick={{ fill: isDark ? "#5F6B87" : "#6b7280", fontSize: 9 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                        tick={{ fill: isDark ? "#5F6B87" : "#6b7280", fontSize: 11 }}
                      />
                      <Tooltip
                        cursor={{ fill: isDark ? "rgba(134,162,255,0.08)" : "rgba(0,0,0,0.05)" }}
                        contentStyle={{
                          backgroundColor: isDark ? "#10182B" : "#ffffff",
                          border: isDark ? "1px solid #1A2136" : "1px solid #e5e7eb",
                          borderRadius: "8px",
                          color: isDark ? "#fff" : "#000",
                        }}
                      />
                      <Bar
                        dataKey="value"
                        name="Files"
                        fill="#86A2FF"
                        radius={[6, 6, 0, 0]}
                        barSize={18}
                        cursor="pointer"
                        onClick={(entry) => openLabelModal(entry?.payload?.name ?? entry?.name)}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* File Type Distribution - Donut Chart */}
         <div
  className={`relative rounded-2xl border overflow-hidden ${
    isDark
      ? "bg-[#020617] border-[#1e293b]"
      : "bg-white border-gray-200"
  }`}
>
  {/* Header */}
  <div className="relative px-5 py-4">
    <h2
      className={`text-sm font-semibold ${
        isDark ? "text-white" : "text-gray-900"
      }`}
    >
      File Type Distribution
    </h2>
  </div>

  {/* Pie + File Type Names */}
  <div className="relative flex items-center justify-center gap-40 px-5 pb-5">

    {/* Pie Chart */}
    <div className="relative h-[190px] w-[190px] shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={fileTypeData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={82}
            paddingAngle={3}
            cornerRadius={6}
            stroke="none"
          >
            {fileTypeData.map((entry, index) => (
              <Cell
                key={`file-type-${index}`}
                fill={entry.color}
                cursor="pointer"
                onClick={() => openExtensionModal(entry.name)}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center Total */}
      <div
        className={`pointer-events-none absolute left-1/2 top-1/2 flex h-[96px] w-[96px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full ${
          isDark ? "bg-[#111827]" : "bg-white"
        }`}
      >
        <span
          className={`text-xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {fileTotal}
        </span>

        <span
          className={`text-[11px] ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Files
        </span>
      </div>
    </div>

    {/* File Type Names */}
{/* File Type Names */}
<div className="flex w-[110px] flex-col gap-2.5">
  {fileTypeData.map((item, index) => (
    <button
      type="button"
      key={`file-type-name-${index}`}
      onClick={() => openExtensionModal(item.name)}
      className={`flex items-center gap-2 rounded px-1 py-0.5 text-left transition ${
        isDark ? "hover:bg-white/[0.06]" : "hover:bg-gray-100"
      }`}
    >
      {/* Color Dot */}
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: item.color }}
      />

      {/* Name */}
      <span
        className={`text-xs font-medium ${
          isDark ? "text-gray-300" : "text-gray-600"
        }`}
      >
        {item.name}
      </span>

      {/* Count */}
      <span
        className={`ml-auto text-xs font-semibold ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        {item.value}
      </span>
    </button>
  ))}
</div>
  </div>
</div>

            {/* Network DLP Events - Area Chart */}
        <div
  className={`rounded-2xl overflow-hidden border ${
    isDark
      ? "border-[#1E2942] bg-[#020617]"
      : "border-gray-200 bg-white"
  }`}
>
  {/* Header */}
  <div className="px-5 pt-4">
    <h2
      className={`text-[10px] font-semibold ${
        isDark ? "text-white" : "text-gray-800"
      }`}
    >
      Network DLP Events
    </h2>
  </div>

  {/* FULL SIZE CHART */}
  <div className="w-full h-[230px] px-2 pb-3">
    <ResponsiveContainer width="100%" height="100%">
  <AreaChart
  data={networkData}
  margin={{
    top: 10,
    right: 8,
    left: 5,
    bottom: 5,
  }}
>
  <defs>
    <linearGradient
      id="networkGradient"
      x1="0"
      y1="0"
      x2="0"
      y2="1"
    >
      <stop
        offset="0%"
        stopColor="#22C55E"
        stopOpacity={0.25}
      />
      <stop
        offset="100%"
        stopColor="#22C55E"
        stopOpacity={0}
      />
    </linearGradient>
  </defs>

  <XAxis
    dataKey="name"
    axisLine={false}
    tickLine={false}
    padding={{ left: 5, right: 5 }}
    tick={{
      fill: isDark ? "#5D6B87" : "#6b7280",
      fontSize: 8,
    }}
  />

  <YAxis
    domain={[0, 4]}
    ticks={[0, 1, 2, 3, 4]}
    axisLine={false}
    tickLine={false}
    tickFormatter={(v) => `${v}%`}
    width={28}
    tick={{
      fill: isDark ? "#5D6B87" : "#6b7280",
      fontSize: 10,
    }}
  />

  <Tooltip
    cursor={false}
    contentStyle={{
      background: isDark ? "#101827" : "#ffffff",
      border: isDark
        ? "1px solid #1E2942"
        : "1px solid #e5e7eb",
      borderRadius: "8px",
      color: isDark ? "#fff" : "#000",
    }}
  />

  <Area
    type="monotone"
    dataKey="value"
    stroke="#22C55E"
    strokeWidth={3}
    fill="url(#networkGradient)"
    dot={{
      r: 3.5,
      fill: "#22C55E",
      stroke: "#FFFFFF",
      strokeWidth: 2,
    }}
    activeDot={{
      r: 5,
      fill: "#22C55E",
      stroke: "#FFFFFF",
      strokeWidth: 2,
    }}
  />
</AreaChart>
    </ResponsiveContainer>
  </div>
</div>
          </div>
        </div>

        {/* ─── Classification Files Table ─── */}
    {/* ─── Classification Files Table ─── */}
<div className="px-2 pb-6">
  <div
    className={`rounded-2xl overflow-hidden border ${
      isDark
        ? "border-[#1A2136] bg-[#020617]"
        : "border-gray-200 bg-white"
    }`}
  >
    {/* Table Header */}
    <div
      className={`flex items-center justify-between px-5 py-2 border-b ${
        isDark ? "border-[#1D2B3D]" : "border-gray-200"
      }`}
    >
      <h2
        className={`text-sm font-semibold ${
          isDark ? "text-white" : "text-gray-800"
        }`}
      >
        Classification Files
      </h2>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative">
          <Search
            size={14}
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          />

          <input
            type="text"
            placeholder="Search..."
            className={`w-48 h-7 pl-8 pr-3 rounded-lg border text-[10px]
              ${
                isDark
                  ? "bg-[#020617] border-[#243244] text-gray-300 placeholder-gray-500"
                  : "bg-gray-50 border-gray-300 text-gray-700 placeholder-gray-400"
              }
              focus:outline-none focus:ring-1 focus:ring-blue-500`}
          />
        </div>

        {/* Export */}
        <button
          className={`h-7 px-3 rounded-lg border text-[10px] transition
            ${
              isDark
                ? "border-[#243244] text-gray-300 hover:bg-[#0d1727]"
                : "border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
        >
          Export
        </button>
      </div>
    </div>

    {/* Table */}
    <div className="w-full overflow-x-auto">
      <div className="h-[220px] overflow-y-auto overflow-x-auto">
        <table className="w-full min-w-[950px] table-fixed border-collapse">
          {/* Column Widths */}
          <colgroup>
            <col className="w-[6%]" />
            <col className="w-[20%]" />
            <col className="w-[36%]" />
            <col className="w-[9%]" />
            <col className="w-[13%]" />
            <col className="w-[16%]" />
          </colgroup>

          {/* Header */}
          <thead
            className={`sticky top-0 z-20 ${
              isDark
                ? "bg-[#020617]"
                : "bg-white"
            }`}
          >
            <tr
              className={`border-b ${
                isDark
                  ? "border-[#1D2B3D]"
                  : "border-gray-200"
              }`}
            >
              <th
                className={`px-3 py-2 text-left text-[9px] uppercase tracking-wider font-semibold whitespace-nowrap ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                SR NO
              </th>

              <th
                className={`px-3 py-2 text-left text-[9px] uppercase tracking-wider font-semibold whitespace-nowrap ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                FILE NAME
              </th>

              <th
                className={`px-3 py-2 text-left text-[9px] uppercase tracking-wider font-semibold whitespace-nowrap ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                FILE PATH
              </th>

              <th
                className={`px-3 py-2 text-left text-[9px] uppercase tracking-wider font-semibold whitespace-nowrap ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                EXTENSION
              </th>

              <th
                className={`px-3 py-2 text-left text-[9px] uppercase tracking-wider font-semibold whitespace-nowrap ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                LABEL
              </th>

              <th
                className={`px-3 py-2 text-left text-[9px] uppercase tracking-wider font-semibold whitespace-nowrap ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                HOST NAME
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {classificationFiles.map((file, index) => (
              <tr
                key={file.srNo}
                className={`h-[34px] border-b transition-colors ${
                  isDark
                    ? "border-[#1D2B3D] hover:bg-[#0d1727]"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                {/* SR NO */}
                <td
                  className={`px-3 py-2 text-[10px] font-medium ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  {index + 1}
                </td>

                {/* FILE NAME */}
                <td
                  className={`px-3 py-2 text-[10px] font-medium truncate ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                  title={file.fileName}
                >
                  {file.fileName}
                </td>

                {/* FILE PATH */}
                <td
                  className={`px-3 py-2 text-[9px] truncate ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                  title={file.filePath}
                >
                  {file.filePath}
                </td>

                {/* EXTENSION */}
                <td
                  className={`px-3 py-2 text-[9px] uppercase font-medium ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {file.extension}
                </td>

                {/* LABEL */}
                <td className="px-3 py-2">
                  <span
                    className={`inline-flex items-center px-2 py-[2px] rounded-full text-[8px] font-semibold whitespace-nowrap ${getLabelColor(
                      file.label
                    )}`}
                  >
                    {file.label}
                  </span>
                </td>

                {/* HOST NAME */}
                <td
                  className={`px-3 py-2 text-[9px] whitespace-nowrap truncate ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                  title={file.hostName}
                >
                  {file.hostName}
                </td>
              </tr>
            ))}

            {classificationFiles.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className={`py-10 text-center text-xs ${
                    isDark
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  No classification files found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
      </div>

      {/* ─── Card Detail Modal ─── */}
      <ClassificationFilesModal
        show={modalState.show}
        onClose={closeModal}
        title={modalState.title}
        data={modalState.data}
      />
    </div>
  );
}