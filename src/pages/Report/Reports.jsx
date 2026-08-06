import React, { useState, useRef } from "react";
import {
  Search,
  ChevronRight,
  Check,
  Monitor,
  Shield,
  Globe,
  Printer,
  FolderOpen,
  HardDrive,
  Network,
  Building2,
  User,
  Calendar,
  ClipboardList,
  SquarePen,
  RefreshCw,
} from "lucide-react";

const modulesData = [
  { name: "Application Control", count: 2, icon: Monitor },
  { name: "USB Protection", count: 5, icon: Shield },
  { name: "Website Control", count: 5, icon: Globe },
  { name: "Printer Control", count: 5, icon: Printer },
  { name: "Data Classification", count: 5, icon: FolderOpen },
  { name: "Drive Control", count: 5, icon: HardDrive },
  { name: "Network Policy", count: 3, icon: Network },
];

const reportsData = {
  "Application Control": ["Manage Control", "View Control"],
  "USB Protection": ["USB Log", "Device Audit"],
  "Website Control": ["Web History", "Blocked Sites"],
  "Printer Control": ["Print Jobs", "Printer Audit"],
  "Data Classification": ["Classified Files", "Policy Violations"],
  "Drive Control": ["Drive Access", "External Drives"],
  "Network Policy": ["Network Logs", "Policy Changes"],
};

const branches = ["Mumbai", "Pune", "Delhi", "Bangalore", "Chennai"];
const devices = ["DESKTOP-7F2K3L1", "DESKTOP-9A1B2C3", "DESKTOP-5X8Y2Z1", "DESKTOP-4W7Q9T2"];
const users = ["All Users", "Admin", "Guest", "Operator"];

const dateRangeOptions = [
  "Today",
  "This Week",
  "Last Month",
  "Last 3 Months",
  "Last 6 Months",
];

// Default values
const defaultModule = "Application Control";
const defaultReport = "Manage Control";
const defaultBranch = "Mumbai";
const defaultDevice = "DESKTOP-7F2K3L1";
const defaultUser = "All Users";
const defaultDateRange = "Last Month";

export default function ReportCenter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState(defaultModule);
  const [selectedReport, setSelectedReport] = useState(defaultReport);
  const [branch, setBranch] = useState(defaultBranch);
  const [device, setDevice] = useState(defaultDevice);
  const [user, setUser] = useState(defaultUser);
  const [dateRange, setDateRange] = useState(defaultDateRange);
  const [showReport, setShowReport] = useState(false);

  const reportRef = useRef(null);

  const filteredModules = modulesData.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const reports = reportsData[selectedModule] || [];

  const handleViewReport = () => {
    setShowReport(true);
    setTimeout(() => {
      if (reportRef.current) {
        reportRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedModule(defaultModule);
    setSelectedReport(defaultReport);
    setBranch(defaultBranch);
    setDevice(defaultDevice);
    setUser(defaultUser);
    setDateRange(defaultDateRange);
    setShowReport(false);
    // Optionally scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Dummy rows for the report table
  const dummyRows = [
    {
      id: 1,
      module: selectedModule,
      report: selectedReport,
      branch: branch,
      device: device,
      user: user,
      dateRange: dateRange,
      status: "Success",
    },
    {
      id: 2,
      module: selectedModule,
      report: selectedReport,
      branch: branch,
      device: "DESKTOP-9A1B2C3",
      user: "Admin",
      dateRange: dateRange,
      status: "Blocked",
    },
    {
      id: 3,
      module: selectedModule,
      report: selectedReport,
      branch: branch,
      device: "DESKTOP-5X8Y2Z1",
      user: "Guest",
      dateRange: dateRange,
      status: "Success",
    },
    {
      id: 4,
      module: selectedModule,
      report: selectedReport,
      branch: branch,
      device: "DESKTOP-4W7Q9T2",
      user: "Operator",
      dateRange: dateRange,
      status: "Blocked",
    },
    {
      id: 5,
      module: selectedModule,
      report: selectedReport,
      branch: branch,
      device: "DESKTOP-4W7Q9T2",
      user: "Operator",
      dateRange: dateRange,
      status: "Blocked",
    },
    {
      id: 6,
      module: selectedModule,
      report: selectedReport,
      branch: branch,
      device: "DESKTOP-4W7Q9T2",
      user: "Operator",
      dateRange: dateRange,
      status: "Blocked",
    },
    {
      id: 7,
      module: selectedModule,
      report: selectedReport,
      branch: branch,
      device: "DESKTOP-4W7Q9T2",
      user: "Operator",
      dateRange: dateRange,
      status: "Blocked",
    },
    {
      id: 8,
      module: selectedModule,
      report: selectedReport,
      branch: branch,
      device: "DESKTOP-4W7Q9T2",
      user: "Operator",
      dateRange: dateRange,
      status: "Blocked",
    },
    {
      id: 9,
      module: selectedModule,
      report: selectedReport,
      branch: branch,
      device: "DESKTOP-4W7Q9T2",
      user: "Operator",
      dateRange: dateRange,
      status: "Blocked",
    },
    {
      id: 10,
      module: selectedModule,
      report: selectedReport,
      branch: branch,
      device: "DESKTOP-4W7Q9T2",
      user: "Operator",
      dateRange: dateRange,
      status: "Blocked",
    },
  ];

  return (
    <div className="min-h-screen  p-6">
      {/* Report Center button */}
 <button
  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold"
  style={{
    background: "rgba(112, 148, 255, 0.82)",
    backdropFilter: "blur(20px)",
    boxShadow: "rgba(112, 148, 255, 0.35) 0px 6px 24px, rgba(255, 255, 255, 0.2) 0px 1px 0px inset",
  }}
>
  <SquarePen className="h-4 w-4" />
  Report Center
</button>

      <div className="grid grid-cols-4 gap-5 w-full">
        {/* 1. Module */}
        <div className="bg-[#020617] border border-indigo-950 rounded-xl p-4 flex flex-col h-full">
          <h2 className="text-white font-semibold mb-4 flex-shrink-0">1. Module</h2>
          <div className="relative mb-4 flex-shrink-0">
            {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" /> */}
     
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredModules.map((module) => {
              const Icon = module.icon;
              const isSelected = module.name === selectedModule;
              return (
                <button
                  key={module.name}
                  onClick={() => {
                    setSelectedModule(module.name);
                    setSelectedReport(reportsData[module.name]?.[0] || null);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-colors ${
                    isSelected
                      ? "bg-[#1a2454] border-[#4f56f0]"
                      : "bg-transparent border-transparent hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`h-4 w-4 flex-shrink-0 ${
                        isSelected ? "text-indigo-400" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-sm truncate ${
                        isSelected ? "text-white font-medium" : "text-gray-300"
                      }`}
                    >
                      {module.name}
                    </span>
                  </span>
                  <span className="flex items-center gap-2 flex-shrink-0">
                    <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full text-xs font-semibold bg-indigo-600 text-white">
                      {module.count}
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Report */}
        <div className="bg-[#020617] border border-indigo-950 rounded-xl p-4 flex flex-col h-full">
          <h2 className="text-white font-semibold mb-1 flex-shrink-0">2. Report</h2>
          <p className="text-indigo-400 text-sm mb-4 flex-shrink-0">
            {selectedModule} – Reports
          </p>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {reports.length > 0 ? (
              reports.map((report) => {
                const isSelected = report === selectedReport;
                return (
                  <button
                    key={report}
                    onClick={() => setSelectedReport(report)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-colors ${
                      isSelected
                        ? "bg-indigo-950/60 border-indigo-600"
                        : "bg-transparent border-gray-800 hover:bg-white/5"
                    }`}
                  >
                    <span
                      className={`text-sm ${
                        isSelected ? "text-white font-medium" : "text-gray-300"
                      }`}
                    >
                      {report}
                    </span>
                    {isSelected && (
                      <Check className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="text-gray-500 text-sm text-center py-6">
                No reports available
              </div>
            )}
          </div>
        </div>

        {/* 3. ATM Selection */}
        <div className="bg-[#020617] border border-indigo-950 rounded-xl p-4 flex flex-col h-full">
          <h2 className="text-white font-semibold mb-4 flex-shrink-0">3. ATM Selection</h2>
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Branch</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full appearance-none pl-9 pr-8 py-2 rounded-lg bg-[#020617] border border-gray-800 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600"
                >
                  {branches.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Device</label>
              <div className="relative">
                <Monitor className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <select
                  value={device}
                  onChange={(e) => setDevice(e.target.value)}
                  className="w-full appearance-none pl-9 pr-8 py-2 rounded-lg bg-[#020617] border border-gray-800 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600"
                >
                  {devices.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
            
         
            </div>
          </div>
        </div>

        {/* 4. Date Range */}
        <div className="bg-#020617] border border-indigo-950 rounded-xl p-4 flex flex-col h-full">
          <h2 className="text-white font-semibold mb-4 flex-shrink-0">4. Date Range</h2>
          <div className="grid grid-cols-2 gap-2 mb-2 flex-shrink-0">
            {dateRangeOptions.map((option) => {
              const isSelected = option === dateRange;
              return (
                <button
                  key={option}
                  onClick={() => setDateRange(option)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                    isSelected
                      ? "bg-[#4f56f0] border-transparent text-white"
                      : "bg-transparent border-gray-800 text-gray-300 hover:bg-white/5"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setDateRange("Custom")}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border mb-3 flex-shrink-0 transition-colors ${
              dateRange === "Custom"
                ? "bg-[#4f56f0] border-transparent text-white"
                : "bg-transparent border-gray-800 text-gray-300 hover:bg-white/5"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            Custom
          </button>

          {/* Selection Summary */}
          <div className="flex-1 min-h-0 bg-[#020617] border border-gray-800 rounded-lg p-3 mb-3 overflow-y-auto">
            <div className="flex items-center gap-2 mb-3">
              <ClipboardList className="h-4 w-4 text-indigo-400 flex-shrink-0" />
              <span className="text-indigo-400 text-sm font-medium">Selection Summary</span>
            </div>
            <dl className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <dt className="text-gray-500">Module</dt>
                <dd className="text-gray-300 truncate ml-4">{selectedModule}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Report</dt>
                <dd className="text-gray-300 truncate ml-4">{selectedReport || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Branch</dt>
                <dd className="text-gray-300 truncate ml-4">{branch}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Device</dt>
                <dd className="text-gray-300 truncate ml-4">{device}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">User</dt>
                <dd className="text-gray-300 truncate ml-4">{user}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Date Range</dt>
                <dd className="text-gray-300 truncate ml-4">{dateRange}</dd>
              </div>
            </dl>
          </div>

          {/* Buttons: Reset and View Report */}
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={handleReset}
              className="w-1/2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-600 text-gray-300 text-sm font-medium hover:bg-white/5 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </button>
            <button
              onClick={handleViewReport}
              className="w-1/2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#4f56f0] text-white text-sm font-semibold shadow-lg shadow-indigo-900/40 hover:bg-[#5c63f5] transition-colors"
            >
              <SquarePen className="h-4 w-4" />
              View Report
            </button>
          </div>
        </div>
      </div>

      {/* Report section – appears after clicking View Report */}
      {showReport && (
        <div ref={reportRef} className="mt-8 bg-[#020617] border border-indigo-950 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <ClipboardList className="h-5 w-5 text-indigo-400" />
            <h3 className="text-white font-semibold text-lg">Report Results</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase border-b border-gray-800">
                <tr>
                  <th scope="col" className="px-4 py-3">#</th>
                  <th scope="col" className="px-4 py-3">Module</th>
                  <th scope="col" className="px-4 py-3">Report</th>
                  <th scope="col" className="px-4 py-3">Branch</th>
                  <th scope="col" className="px-4 py-3">Device</th>
                  <th scope="col" className="px-4 py-3">User</th>
                  <th scope="col" className="px-4 py-3">Date Range</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {dummyRows.map((row) => (
                  <tr key={row.id} className="border-b border-gray-800/50 hover:bg-white/5">
                    <td className="px-4 py-3 text-gray-400">{row.id}</td>
                    <td className="px-4 py-3 text-gray-300">{row.module}</td>
                    <td className="px-4 py-3 text-gray-300">{row.report}</td>
                    <td className="px-4 py-3 text-gray-300">{row.branch}</td>
                    <td className="px-4 py-3 text-gray-300">{row.device}</td>
                    <td className="px-4 py-3 text-gray-300">{row.user}</td>
                    <td className="px-4 py-3 text-gray-300">{row.dateRange}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          row.status === "Success"
                            ? "bg-emerald-900/30 text-emerald-400 border border-emerald-800/50"
                            : "bg-red-900/30 text-red-400 border border-red-800/50"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Showing {dummyRows.length} records for {selectedModule} – {selectedReport} • {branch} • {device} • {user} • {dateRange}
          </div>
        </div>
      )}
    </div>
  );
}