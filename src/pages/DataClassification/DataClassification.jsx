import React from "react";
import {
  Calendar,
  Filter,
  Download,
  RotateCw,
  Menu,
  FileText,
  ShieldAlert,
  Hand,
  Gavel,
  TriangleAlert,
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

// Theme context or hook - replace with your actual theme implementation
const useTheme = () => {
  const [isDark, setIsDark] = React.useState(true);
  return { isDark, setIsDark };
};

const sensitivityData = [
  { name: "Business Data", value: 267, color: "#22c55e" },
  { name: "Financial", value: 117, color: "#3b82f6" },
  { name: "Personal", value: 135, color: "#f59e0b" },
  { name: "Code", value: 398, color: "#ef4444" },
];

const fileTypeData = [
  { name: "png", value: 1245, color: "#2f80ed" },
  { name: "xlsx", value: 1102, color: "#2f70ed" },
  { name: "pdf", value: 856, color: "#4b7cff" },
  { name: "doc", value: 642, color: "#4b6cff" },
  { name: "jpg", value: 458, color: "#4b8cff" },
  { name: "xls", value: 156, color: "#4b5cff" },
  { name: "docx", value: 88, color: "#4b4cff" },
];

const networkData = [
  { name: "WEB UPLOAD", value: 120 },
  { name: "USB TRANSFER", value: 95 },
  { name: "FTP TRANSFER", value: 15 },
  { name: "DVD BURN", value: 8 },
  { name: "NETWORK UPLOAD", value: 5 },
];

const fileTotal = fileTypeData.reduce((sum, item) => sum + item.value, 0);

const classificationFiles = [
  {
    srNo: 1,
    fileName: "new_Bulk_Upload.xlsx",
    filePath: "K:\\Softwares\\sts-4.14.0.RELEASE\\new_Bulk_Upload.xlsx",
    extension: "xlsx",
    label: "Code",
    riskLevel: "High",
    detectedOn: "May 26, 2024 10:21 AM",
  },
  {
    srNo: 2,
    fileName: "newfile.xlsx",
    filePath: "K:\\Softwares\\sts-4.14.0.RELEASE\\newfile.xlsx",
    extension: "xlsx",
    label: "Code",
    riskLevel: "High",
    detectedOn: "May 26, 2024 10:18 AM",
  },
  {
    srNo: 3,
    fileName: "IDBI_Bulk_Upload_Demo.xlsx",
    filePath: "K:\\Softwares\\sts-4.14.0.RELEASE\\IDBI_Bulk_Upload_Demo.xlsx",
    extension: "xlsx",
    label: "Code",
    riskLevel: "High",
    detectedOn: "May 26, 2024 10:15 AM",
  },
  {
    srNo: 4,
    fileName: "bean-config.png",
    filePath: "K:\\Softwares\\sts-4.14.0.RELEASE\\configuration\\org.eclipse.osgi\\8...",
    extension: "png",
    label: "Unknown",
    riskLevel: "Medium",
    detectedOn: "May 26, 2024 10:12 AM",
  },
  {
    srNo: 5,
    fileName: "live-beans-graph.png",
    filePath: "K:\\Softwares\\sts-4.14.0.RELEASE\\configuration\\org.eclipse.osgi\\7...",
    extension: "png",
    label: "Unknown",
    riskLevel: "Medium",
    detectedOn: "May 26, 2024 10:10 AM",
  },
];

const topSensitiveData = [
  { name: "Code", value: 39.2, color: "#20C4C6" },
  { name: "Business Data", value: 26.3, color: "#2F80ED" },
  { name: "Financial", value: 17.8, color: "#F5A623" },
  { name: "Personal", value: 12.4, color: "#8B5CF6" },
  { name: "Others", value: 4.3, color: "#EF4444" },
];

const violationTrendData = [
  { day: "May 20", value: 35 },
  { day: "May 21", value: 55 },
  { day: "May 22", value: 105 },
  { day: "May 23", value: 75 },
  { day: "May 24", value: 60 },
  { day: "May 25", value: 100 },
];

const riskLevelData = [
  { name: "High Risk", value: 3754, color: "#ef4444" },
  { name: "Medium Risk", value: 642, color: "#f59e0b" },
  { name: "Low Risk", value: 151, color: "#22c55e" },
];

const riskTotal = riskLevelData.reduce((sum, item) => sum + item.value, 0);

const alerts = [
  {
    title: "Policy violation detected",
    time: "May 26, 2024 10:25 AM",
    color: "bg-red-500",
  },
  {
    title: "Unauthorized USB transfer blocked",
    time: "May 26, 2024 10:20 AM",
    color: "bg-yellow-500",
  },
  {
    title: "High risk file detected",
    time: "May 26, 2024 10:18 AM",
    color: "bg-red-500",
  },
  {
    title: "FTP Upload attempt blocked",
    time: "May 26, 2024 10:15 AM",
    color: "bg-yellow-500",
  },
];

const getRiskColor = (risk) => {
  switch (risk) {
    case "High":
      return "text-red-400";
    case "Medium":
      return "text-yellow-400";
    case "Low":
      return "text-green-400";
    default:
      return "text-gray-400";
  }
};

const getLabelColor = (label) => {
  switch (label) {
    case "Code":
      return "bg-red-500/20 text-red-400";
    case "Unknown":
      return "bg-gray-500/20 text-gray-400";
    default:
      return "bg-blue-500/20 text-blue-400";
  }
};

export default function DataClassification() {
  const { isDark } = useTheme();

  // Theme-based styles
  const theme = {
    bg: isDark ? "bg-[#020617]" : "bg-gray-50",
    headerBg: isDark ? "bg-[#020617]" : "bg-white",
    borderColor: isDark ? "border-[#1e2b3c]" : "border-gray-200",
    cardBg: isDark ? "bg-[#020617]" : "bg-white",
    cardBorder: isDark ? "border-[#1d2b3d]" : "border-gray-200",
    textPrimary: isDark ? "text-white" : "text-gray-900",
    textSecondary: isDark ? "text-gray-300" : "text-gray-600",
    textMuted: isDark ? "text-gray-400" : "text-gray-500",
    inputBg: isDark ? "bg-[#020617]" : "bg-gray-50",
    inputBorder: isDark ? "border-[#243244]" : "border-gray-300",
    hoverBg: isDark ? "hover:bg-[#020617]" : "hover:bg-gray-100",
    chartGrid: isDark ? "#243244" : "#e5e7eb",
    chartText: isDark ? "#d1d5db" : "#6b7280",
    chartAxis: isDark ? "#9ca3af" : "#4b5563",
    tableBorder: isDark ? "border-[#1d2b3d]" : "border-gray-200",
    tableHover: isDark ? "hover:bg-[#0d1727]" : "hover:bg-gray-50",
  };

  const cards = [
    {
      title: "TOTAL SCANNED FILES",
      value: "4,547",
      status: "↑ 12.5% from last week",
      statusColor: "text-emerald-400",
      icon: FileText,
      bg: isDark ? "#020617" : "from-blue-50 to-white",
      border: isDark ? "border border-[#1A2136]" : "border border-gray-200",
      iconColor: isDark ? "text-cyan-400" : "text-blue-600",
    },
    {
      title: "HIGH RISK FILES",
      value: "3,754",
      status: "↑ 8.3% from last week",
      statusColor: "text-red-400",
      icon: ShieldAlert,
      bg: isDark ? "#020617" : "from-red-50 to-white",
      border: isDark ? "border border-[#1A2136]" : "border border-gray-200",
      iconColor: isDark ? "text-red-500" : "text-red-600",
    },
    {
      title: "BLOCKED FILES",
      value: "156",
      status: "↑ 3.7% from last week",
      statusColor: "text-yellow-400",
      icon: Hand,
      bg: isDark ? "#020617" : "from-yellow-50 to-white",
      border: isDark ? "border border-[#1A2136]" : "border border-gray-200",
      iconColor: isDark ? "text-yellow-400" : "text-yellow-600",
    },
    {
      title: "POLICY RULES",
      value: "22",
      status: "No change",
      statusColor: "text-gray-400",
      icon: Gavel,
      bg: isDark ? "#020617" : "from-purple-50 to-white",
      border: isDark ? "border border-[#1A2136]" : "border border-gray-200",
      iconColor: isDark ? "text-violet-500" : "text-purple-600",
    },
    {
      title: "POLICY VIOLATIONS",
      value: "84",
      status: "↑ 15.2% from last week",
      statusColor: "text-red-400",
      icon: TriangleAlert,
      bg: isDark ? "#020617" : "from-red-50 to-white",
      border: isDark ? "border border-[#1A2136]" : "border border-gray-200",
      iconColor: isDark ? "text-red-500" : "text-red-600",
    },
  ];

  return (
    <>
      {/* Custom scrollbar styles (for dark theme) */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0d1727;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1a2d4a;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2a4a6a;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #1a2d4a #0d1727;
        }
      `}</style>

      <div className="overflow-hidden">
        <div className="h-full overflow-y-auto">
          {/* Dashboard Cards */}
          <div className="p-3">
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-2">
              {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <div
                    key={index}
                    className={`
                      bg-gradient-to-br ${card.bg}
                      ${card.border}
                      border
                      rounded-lg
                      h-[90px]
                      px-3
                      flex
                      items-center
                      justify-between
                      transition-all
                      duration-300
                      hover:scale-[1.02]
                      hover:shadow-lg
                    `}
                  >
                    <div>
                      <p className="text-[9px] uppercase tracking-wide text-gray-300">
                        {card.title}
                      </p>
                      <h2 className={`${theme.textPrimary} text-2xl font-bold mt-0.5`}>
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

          {/* Three Cards in a Row */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {/* Sensitivity Levels - Bar Chart */}
              <div className="bg-[#020617] border border-[#1A2136] rounded-2xl overflow-hidden">
                <div className="px-5 py-4">
                  <h2 className="text-white text-[10x] font-semibold">
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
                        <CartesianGrid stroke="#1A2136" strokeDasharray="4 4" vertical={true} />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#5F6B87", fontSize: 11 }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#5F6B87", fontSize: 11 }}
                          domain={[0, 800]}
                          ticks={[0, 200, 400, 600, 800]}
                        />
                        <Tooltip
                          cursor={{ fill: "rgba(134,162,255,0.08)" }}
                          contentStyle={{
                            backgroundColor: "#10182B",
                            border: "1px solid #1A2136",
                            borderRadius: "8px",
                            color: "#fff",
                          }}
                        />
                        <Bar dataKey="value" fill="#86A2FF" radius={[6, 6, 0, 0]} barSize={18} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* File Type Distribution - Donut Chart (with scrollable legend) */}
              <div className="relative rounded-2xl border border-[#232C46] bg-[#020617] overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]">
                <div className="absolute inset-[1px] rounded-2xl border border-[#121A2F] pointer-events-none" />
                <div className="relative px-5 py-4">
                  <h2 className="text-white text-[10px] font-semibold">
                    File Type Distribution
                  </h2>
                </div>
                <div className="relative flex items-start px-5 pb-5">
                  <div className="relative w-[190px] h-[170px] flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={fileTypeData}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={68}
                          paddingAngle={4}
                          cornerRadius={7}
                          stroke="none"
                        >
                          {fileTypeData.map((item, index) => (
                            <Cell key={index} fill={item.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <h2 className="text-white text-4xl font-bold leading-none">
                        {fileTotal}
                      </h2>
                      <p className="text-[#7E8AA8] text-sm mt-2">Files</p>
                    </div>
                  </div>
                  {/* Scrollable Legend */}
                  <div className="flex-1 ml-8 h-[170px] overflow-y-auto custom-scrollbar pr-2">
                    <div className="space-y-3">
                      {fileTypeData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-[#D8E1F7] text-sm">{item.name}</span>
                          </div>
                          <span className="text-sm font-semibold" style={{ color: item.color }}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Network DLP Event Type - Area Chart */}
              <div className="bg-[#020617] border border-[#1E2942] rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]">
                <div className="px-5 pt-4">
                  <h2 className="text-white text-[10px] font-semibold">Network DLP Events</h2>
                  <div className="flex items-end gap-2 mt-2">
                    {/* <span className="text-[20px] font-bold text-white leading-none">670</span> */}
                    {/* <span className="text-[#19D98C] text-xl mb-1">↗</span> */}
                  </div>
                </div>
                <div className="h-[180px] px-3 pb-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={networkData}
                      margin={{ top: 15, right: 10, left: -18, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="networkGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22C55E" stopOpacity={0.25} />
                          <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#1B2438" strokeDasharray="4 4" vertical={false} />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#5D6B87", fontSize: 8 }}
                      />
                      <YAxis
                        domain={[0, 4]}
                        ticks={[0, 1, 2, 3, 4]}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${v}%`}
                        tick={{ fill: "#5D6B87", fontSize: 11 }}
                      />
                      <Tooltip
                        cursor={false}
                        contentStyle={{
                          background: "#101827",
                          border: "1px solid #1E2942",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#22C55E"
                        strokeWidth={3}
                        fill="url(#networkGradient)"
                        dot={{ r: 3.5, fill: "#22C55E", stroke: "#FFFFFF", strokeWidth: 2 }}
                        activeDot={{ r: 5, fill: "#22C55E", stroke: "#FFFFFF", strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Classification Files Table with Scrollable Body */}
          <div className="px-6 pb-6">
            <div className={`${theme.cardBg} border ${theme.cardBorder} rounded-2xl overflow-hidden`}>
              {/* Header */}
              <div className={`flex items-center justify-between px-5 py-2 border-b ${theme.tableBorder}`}>
                <h2 className={`${theme.textPrimary} text-base font-semibold`}>
                  Classification Files
                </h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search
                      size={15}
                      className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textMuted}`}
                    />
                    <input
                      type="text"
                      placeholder="Search..."
                      className={`w-60 pl-9 pr-3 py-2 rounded-lg border ${theme.inputBorder}
                        ${theme.inputBg} ${theme.textSecondary}
                        text-xs placeholder-gray-500
                        focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    />
                  </div>
                  <button
                    className={`px-3 py-2 rounded-lg border ${theme.inputBorder} ${theme.textSecondary} ${theme.hoverBg} text-xs transition`}
                  >
                    Export
                  </button>
                </div>
              </div>

              {/* Scrollable Table Container */}
              <div className="overflow-x-auto">
                <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
                  <table className="w-full border-collapse">
                    <thead className={`sticky top-0 z-10 ${theme.cardBg} border-b ${theme.tableBorder}`}>
                      <tr>
                        <th className={`px-4 py-2 text-left text-[10px] uppercase tracking-wider font-semibold ${theme.textMuted}`}>
                          SR NO
                        </th>
                        <th className={`px-4 py-2 text-left text-[10px] uppercase tracking-wider font-semibold ${theme.textMuted}`}>
                          FILE NAME
                        </th>
                        <th className={`px-4 py-2 text-left text-[10px] uppercase tracking-wider font-semibold ${theme.textMuted}`}>
                          FILE PATH
                        </th>
                        <th className={`px-4 py-2 text-left text-[10px] uppercase tracking-wider font-semibold ${theme.textMuted}`}>
                          EXTENSION
                        </th>
                        <th className={`px-4 py-2 text-left text-[10px] uppercase tracking-wider font-semibold ${theme.textMuted}`}>
                          LABEL
                        </th>
                        <th className={`px-4 py-2 text-left text-[10px] uppercase tracking-wider font-semibold ${theme.textMuted}`}>
                          RISK LEVEL
                        </th>
                        <th className={`px-4 py-2 text-left text-[10px] uppercase tracking-wider font-semibold ${theme.textMuted}`}>
                          DETECTED ON
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {classificationFiles.map((file) => (
                        <tr
                          key={file.srNo}
                          className={`border-b ${theme.tableBorder} ${theme.tableHover} transition-colors`}
                        >
                          <td className="px-4 py-2 text-xs font-medium text-blue-400">
                            {file.srNo}
                          </td>
                          <td className={`px-4 py-2 text-xs font-medium ${theme.textPrimary}`}>
                            {file.fileName}
                          </td>
                          <td
                            className={`px-4 py-2 text-xs ${theme.textMuted} max-w-[280px] truncate`}
                            title={file.filePath}
                          >
                            {file.filePath}
                          </td>
                          <td className={`px-4 py-2 text-xs uppercase ${theme.textSecondary}`}>
                            {file.extension}
                          </td>
                          <td className="px-4 py-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${getLabelColor(
                                file.label
                              )}`}
                            >
                              {file.label}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <span className={`text-xs font-semibold ${getRiskColor(file.riskLevel)}`}>
                              {file.riskLevel}
                            </span>
                          </td>
                          <td className={`px-4 py-2 text-xs ${theme.textMuted}`}>
                            {file.detectedOn}
                          </td>
                        </tr>
                      ))}
                      {classificationFiles.length === 0 && (
                        <tr>
                          <td colSpan={7} className={`py-8 text-center text-sm ${theme.textMuted}`}>
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
      </div>
    </>
  );
}