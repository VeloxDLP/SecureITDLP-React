import React, { useState } from "react";
import {
  ShieldCheck,
  Folder,
  FolderOpen,
  Tag,
  Share2,
  Trash2,
  Building2,
  Monitor,
} from "lucide-react";
import { useTheme } from '../context/ThemeContext';

function ApplyNetworkPolicy() {
  const { isDark } = useTheme();
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedEndpoints, setSelectedEndpoints] = useState([]);
  const [endpoints, setEndpoints] = useState([
    { id: 1, name: "Desktop - 12kfjr2inrSOKK", ip: "192.168.24.101" },
    { id: 2, name: "Desktop - 12kfjr2inrSOKK", ip: "192.169.24.101" },
    { id: 3, name: "Desktop - 12kfjr2inrSOKR", ip: "192.168.24.101" },
    { id: 4, name: "Desktop - 12kfjr2inrSOKK", ip: "192.168.24.101" },
    { id: 5, name: "Desktop - 12kfjr2linrSOKK", ip: "192.168.24.101" },
    { id: 6, name: "Desktop - 12kfjr2inrSOKK", ip: "192.168.24.101" },
    { id: 7, name: "Desktop - 12kfjr2inrSOKK", ip: "192.169.24.101" },
    { id: 8, name: "Desktop - 12kfjr2inrSOKR", ip: "192.168.24.101" },
    { id: 9, name: "Desktop - 12kfjr2inrSOKK", ip: "192.168.24.101" },
    { id: 10, name: "Desktop - 12kfjr2linrSOKK", ip: "192.168.24.101" },
  ]);

  const branches = [
    { id: "mumbai", label: "Mumbai" },
    { id: "vashi", label: "Vashi" },
    { id: "pune", label: "Pune" },
    { id: "nagpur", label: "Nagpur" },
  ];

  const policies = [
    {
      id: 1,
      name: "Farewell Policy",
      description:
        "Configure policy, source, destination, control, details.",
    },
    {
      id: 2,
      name: "Security Policy",
      description:
        "Configure policy, source, destination, control, details.",
    },
    {
      id: 3,
      name: "Network Policy",
      description:
        "Configure policy, source, destination, control, details.",
    },
    {
      id: 4,
      name: "Access Policy",
      description:
        "Configure policy, source, destination, control, details.",
    },
    {
      id: 5,
      name: "Compliance Policy",
      description:
        "Configure policy, source, destination, control, details.",
    },
    {
      id: 6,
      name: "Data Policy",
      description:
        "Configure policy, source, destination, control, details.",
    },
    {
      id: 7,
      name: "Application Policy",
      description:
        "Configure policy, source, destination, control, details.",
    },
    {
      id: 8,
      name: "Firewall Policy",
      description:
        "Configure policy, source, destination, control, details.",
    },
    {
      id: 9,
      name: "Backup Policy",
      description:
        "Configure policy, source, destination, control, details.",
    },
  ];

  const policyDetails = {
    fileType: ["PDF", "Doc", "Docx", "xlsx", "txt"],
    keywords: ["Salary, email, increment", "Salary"],
    channels: ["Browser Upload", "FTP Transfer", "Clipboard copy"],
    regex: ["PDF", "Doc", "Docx", "xlsx", "txt"],
    application: ["Browser Upload", "FTP Transfer", "Clipboard copy", "Network Share"],
  };

  const handlePolicySelect = (policyId) => {
    setSelectedPolicy(policyId);
  };

  const handleBranchSelect = (branchId) => {
    setSelectedBranch(branchId);
    setSelectedEndpoints([]);
  };

  const handleEndpointToggle = (endpointId) => {
    setSelectedEndpoints(prev =>
      prev.includes(endpointId)
        ? prev.filter(id => id !== endpointId)
        : [...prev, endpointId]
    );
  };

  const handleDeleteEndpoint = (endpointId) => {
    setEndpoints(prev => prev.filter(endpoint => endpoint.id !== endpointId));
    setSelectedEndpoints(prev => prev.filter(id => id !== endpointId));
  };

  const handleApplyPolicy = () => {
    console.log("Selected Policy:", selectedPolicy);
    console.log("Selected Branch:", selectedBranch);
    console.log("Selected Endpoints:", selectedEndpoints);
  };

  function Pill({ children, theme = "navy" }) {
    const themes = {
      navy: isDark 
        ? "border-[#2B3345] bg-[#1A2235] text-white"
        : "border-slate-300 bg-slate-100 text-slate-700",
      green: isDark
        ? "border-emerald-800/40 bg-emerald-950/30 text-emerald-400"
        : "border-emerald-300 bg-emerald-50 text-emerald-700",
      amber: isDark
        ? "border-amber-800/40 bg-amber-950/30 text-amber-400"
        : "border-amber-300 bg-amber-50 text-amber-700",
    };
    return (
      <span
        className={`rounded-lg border px-3 py-1.5 text-xs whitespace-nowrap ${themes[theme]}`}
      >
        {children}
      </span>
    );
  }

  function SectionHeader({ icon: Icon, iconColor, children }) {
    return (
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} style={{ color: iconColor }} />
        <h3 className={`text-sm font-medium whitespace-nowrap ${isDark ? 'text-white' : 'text-slate-700'}`}>
          {children}
        </h3>
        <div className={`flex-1 h-px ml-2 ${isDark ? 'bg-[#2B3345]' : 'bg-slate-200'}`} />
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {/* Header */}
      <div className={`rounded-xl border px-6 py-5 ${
        isDark 
          ? 'border-[#2B3345] bg-[#020617]' 
          : 'border-slate-200 bg-white'
      }`}>
        <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
          Apply Network Policy
        </h1>

        <p className={`mt-1 text-sm ${isDark ? 'text-[#dadbdd]' : 'text-slate-600'}`}>
          Configure policy, source, destination, control, details.
        </p>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="mt-6 flex gap-3">
        {/* Left Side - Policies */}
        <div className={`w-[360px] rounded-xl border p-4 ${
          isDark 
            ? 'border-[#2B3345] bg-[#020617]' 
            : 'border-slate-200 bg-white'
        }`}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Policies
          </h2>

          <p className={`mt-1 text-sm ${isDark ? 'text-[#8C93A8]' : 'text-slate-500'}`}>
            Configure policy, source, destination, control, details.
          </p>

          <div className="mt-5 max-h-[450px] overflow-y-auto space-y-3 pr-2">
            {policies.map((policy) => (
              <div
                key={policy.id}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                  selectedPolicy === policy.id
                    ? isDark 
                      ? "bg-[#1a2744] border-[#5A7BFF]"
                      : "bg-blue-50 border-blue-400"
                    : isDark
                      ? "bg-[#0b1220] border-[#2d3748] hover:border-[#4F7CFF]"
                      : "bg-white border-slate-200 hover:border-blue-400"
                }`}
                onClick={() => handlePolicySelect(policy.id)}
              >
                {/* Radio Button */}
                <div className="flex-shrink-0">
                  <input
                    type="radio"
                    name="policy"
                    checked={selectedPolicy === policy.id}
                    onChange={() => handlePolicySelect(policy.id)}
                    className={`w-4 h-4 cursor-pointer ${
                      isDark 
                        ? 'accent-[#5A7BFF] bg-[#0b1220] border-[#2d3748]'
                        : 'accent-blue-600'
                    }`}
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {policy.name}
                  </h3>

                  <p className={`mt-1 text-xs ${isDark ? 'text-[#8C93A8]' : 'text-slate-500'}`}>
                    {policy.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 space-y-3">
          {selectedPolicy ? (
            /* Policy Details View - All in One Card */
            <div className={`rounded-xl border p-6 ${
              isDark 
                ? 'border-[#2B3345] bg-[#020617]' 
                : 'border-slate-200 bg-white'
            }`}>
              {/* Policy Header */}
              <div className={`flex items-center gap-3 pb-5 mb-6 ${
                isDark ? 'border-[#2B3345]' : 'border-slate-200'
              }`}>
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                  isDark ? 'bg-[#020617]' : 'bg-white'
                }`}>
                  <ShieldCheck size={20} className="text-[#4F7CFF]" />
                </div>
                <div>
                  <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {policies.find(p => p.id === selectedPolicy)?.name || "Farewell Policy"}
                  </h2>
                  <p className={`mt-0.5 text-xs ${isDark ? 'text-[#8C93A8]' : 'text-slate-500'}`}>
                    Configure policy, source, destination, control, details.
                  </p>
                </div>
              </div>

              {/* 2-column grid of sections */}
              <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                {/* File Type */}
                <div>
                  <SectionHeader icon={Folder} iconColor="#4F7CFF">
                    File Type
                  </SectionHeader>
                  <div className="flex flex-wrap gap-2">
                    {policyDetails.fileType.map((item) => (
                      <Pill key={item} theme="navy">{item}</Pill>
                    ))}
                  </div>
                </div>

                {/* Keywords */}
                <div>
                  <SectionHeader icon={FolderOpen} iconColor="#F59E0B">
                    Keywords
                  </SectionHeader>
                  <div className="flex flex-wrap gap-2">
                    {policyDetails.keywords.map((item) => (
                      <Pill key={item} theme="amber">{item}</Pill>
                    ))}
                  </div>
                </div>

                {/* Channels */}
                <div>
                  <SectionHeader icon={Share2} iconColor="#10B981">
                    Channels
                  </SectionHeader>
                  <div className="flex flex-wrap gap-2">
                    {policyDetails.channels.map((item) => (
                      <Pill key={item} theme="green">{item}</Pill>
                    ))}
                  </div>
                </div>

                {/* REGEX */}
                <div>
                  <SectionHeader icon={Folder} iconColor="#4F7CFF">
                    REGEX
                  </SectionHeader>
                  <div className="flex flex-wrap gap-2">
                    {policyDetails.regex.map((item) => (
                      <Pill key={item} theme="navy">{item}</Pill>
                    ))}
                  </div>
                </div>

                {/* Application — spans both columns */}
                <div className="col-span-2">
                  <SectionHeader icon={Share2} iconColor="#10B981">
                    Application
                  </SectionHeader>
                  <div className="flex flex-wrap gap-2">
                    {policyDetails.application.map((item) => (
                      <Pill key={item} theme="navy">{item}</Pill>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* No Policy Selected View */
            <div className={`rounded-xl border ${
              isDark 
                ? 'border-[#2B3345] bg-[#020617]' 
                : 'border-slate-200 bg-white'
            }`}>
              <div className="flex h-[280px] flex-col items-center justify-center px-6 text-center">
                <div className={`flex h-16 w-16 items-center justify-center rounded-full ${
                  isDark ? 'bg-[#24304F]' : 'bg-blue-50'
                }`}>
                  <ShieldCheck size={30} color="#4F7CFF" strokeWidth={2} />
                </div>

                <h2 className={`mt-6 text-3xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  No Policy Selected
                </h2>

                <p className={`mt-3 text-sm ${isDark ? 'text-[#9CA3AF]' : 'text-slate-500'}`}>
                  Configure policy, source, destination, control, details.
                </p>

                <p className={`mt-2 max-w-md text-sm ${isDark ? 'text-[#7E8798]' : 'text-slate-400'}`}>
                  Configure policy, source, destination, source, destination,
                  control, details.
                </p>
              </div>
            </div>
          )}

          {/* Branch Selection & Endpoints */}
          <div className="flex gap-3">
            {/* Branch Selection - with radio buttons */}
            <div
              className={`w-[200px] flex-shrink-0 rounded-xl border p-4 flex flex-col ${
                isDark 
                  ? 'border-[#2B3345] bg-[#020617]' 
                  : 'border-slate-200 bg-white'
              }`}
              style={{ height: '240px' }}
            >
              <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                <Building2 size={16} className="text-[#4F7CFF]" />
                <label className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-700'}`}>
                  Branch Selection
                </label>
              </div>

              <div className="mt-2 flex-1 min-h-0 overflow-y-auto space-y-2 pr-1">
                {branches.map((b) => (
                  <div
                    key={b.id}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 transition ${
                      selectedBranch === b.id
                        ? isDark 
                          ? "bg-[#1a2744] border-[#5A7BFF]"
                          : "bg-blue-50 border-blue-400"
                        : isDark
                          ? "bg-[#0b1220] border-[#2d3748] hover:border-[#4F7CFF]"
                          : "bg-white border-slate-200 hover:border-blue-400"
                    }`}
                    onClick={() => handleBranchSelect(b.id)}
                  >
                    <input
                      type="radio"
                      name="branch"
                      checked={selectedBranch === b.id}
                      onChange={() => handleBranchSelect(b.id)}
                      className={`w-3.5 h-3.5 cursor-pointer flex-shrink-0 ${
                        isDark 
                          ? 'accent-[#5A7BFF] bg-[#0b1220] border-[#2d3748]'
                          : 'accent-blue-600'
                      }`}
                    />
                    <Building2 size={14} className={`flex-shrink-0 ${
                      selectedBranch === b.id 
                        ? isDark ? 'text-[#5A7BFF]' : 'text-blue-600'
                        : isDark ? 'text-[#8C93A8]' : 'text-slate-400'
                    }`} />
                    <span className={`text-xs ${isDark ? 'text-white' : 'text-slate-700'}`}>
                      {b.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Endpoints - With desktop icons */}
            <div className={`flex-1 rounded-xl border p-4 ${
              isDark 
                ? 'border-[#2B3345] bg-[#020617]' 
                : 'border-slate-200 bg-white'
            }`} style={{ height: '240px' }}>
              {selectedBranch ? (
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3 flex-shrink-0">
                    <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-700'}`}>
                      Endpoints
                    </h3>
                    <button
                      onClick={handleApplyPolicy}
                      className="rounded-lg bg-[#4F7CFF] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#3A66E0] transition"
                    >
                      Apply Policy
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1" style={{ overscrollBehavior: 'contain' }}>
                    {endpoints.map((endpoint) => (
                      <div
                        key={endpoint.id}
                        className={`flex items-center gap-3 rounded-lg border px-3 py-2 group hover:border-[#4F7CFF] transition flex-shrink-0 ${
                          isDark 
                            ? 'border-[#2B3345] bg-[#1A2235]' 
                            : 'border-slate-200 bg-slate-50'
                        }`}
                      >
                        <Monitor size={16} className="text-[#4F7CFF] flex-shrink-0" />
                        <span className={`text-xs flex-1 truncate ${isDark ? 'text-white' : 'text-slate-700'}`}>
                          {endpoint.name}
                        </span>
                        <span className={`text-xs flex-shrink-0 ${isDark ? 'text-[#8C93A8]' : 'text-slate-400'}`}>
                          {endpoint.ip}
                        </span>
                        <button
                          onClick={() => handleDeleteEndpoint(endpoint.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-500/20 flex-shrink-0"
                        >
                          <Trash2 size={14} className="text-red-400 hover:text-red-300" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-full ${
                    isDark ? 'bg-[#24304F]' : 'bg-blue-50'
                  }`}>
                    <ShieldCheck size={24} color="#4F7CFF" strokeWidth={2} />
                  </div>
                  <h3 className={`mt-3 text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    No Branch Selected
                  </h3>
                  <p className={`mt-1 text-sm ${isDark ? 'text-[#9CA3AF]' : 'text-slate-500'}`}>
                    Configure policy, source, destination, control, details.
                  </p>
                  <p className={`mt-1 max-w-sm text-xs ${isDark ? 'text-[#7E8798]' : 'text-slate-400'}`}>
                    Configure policy, source, destination, source, destination,
                    control, details.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplyNetworkPolicy;