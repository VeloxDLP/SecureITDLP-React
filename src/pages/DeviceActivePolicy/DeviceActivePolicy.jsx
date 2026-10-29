import React from "react";
import {
  ShieldCheck,
  Search,
  FileText,
  Globe,
  AppWindow,
  Code,
  ShieldAlert,
  CheckCircle2,
  ChevronDown,
  Pin,
  Printer,
  RefreshCw
} from "lucide-react";

export default function EndpointPolicyDashboard() {
  // Reusable progress bar component
  const ProgressBar = ({ percent }) => {
    const getColor = (val) => {
      if (val < 30) return "#fbbf24";
      if (val < 50) return "#f59e0b";
      return "#ef4444";
    };

    return (
      <div className="flex items-center gap-2">
        <div className="w-14 h-1 bg-[#1e293b] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${percent}%`, backgroundColor: getColor(percent) }}
          ></div>
        </div>
        <span className="text-[#94a3b8] text-[10px] font-medium w-6">{percent}%</span>
      </div>
    );
  };

  // Reusable Table Component
  const DataTable = ({ title }) => {
    const rows = [
      { appName: "Aximp.ni.exe", appPath: "C:\\WINDOWS\\assembly\\NativeImages_v4.0.30319_32\\Aximp1ed56606ce3e\\253d7580966db877dc76\\Aximp.ni.exe" },
      { appName: "Aximp.ni.exe", appPath: "C:\\WINDOWS\\assembly\\NativeImages_v4.0.30319_32\\Aximp1ed56606ce3e\\253d7580966db877dc76\\Aximp.ni.exe" },
      { appName: "Aximp.ni.exe", appPath: "C:\\WINDOWS\\assembly\\NativeImages_v4.0.30319_32\\Aximp1ed56606ce3e\\253d7580966db877dc76\\Aximp.ni.exe" },
      { appName: "Aximp.ni.exe", appPath: "C:\\WINDOWS\\assembly\\NativeImages_v4.0.30319_32\\Aximp1ed56606ce3e\\253d7580966db877dc76\\Aximp.ni.exe" },
    ];

    return (
      <div className="bg-[#0f172a] rounded-lg p-3 flex flex-col gap-2 border border-[#1e293b]">
        <div className="flex justify-between items-center">
          <h3 className="text-[#e2e8f0] text-[11px] font-medium">{title}</h3>
          <div className="flex items-center gap-1.5 bg-[#0b1120] border border-[#1e293b] px-2 py-1 rounded-md">
            <Search size={12} className="text-[#64748b]" />
            <input
              type="text"
              placeholder="Search application..."
              className="bg-transparent border-none outline-none text-[10px] text-[#e2e8f0] placeholder-[#475569] w-24"
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1e293b]">
                <th className="py-1.5 px-2 text-[9px] font-semibold text-[#64748b] uppercase tracking-wider w-[25%]">Application Name</th>
                <th className="py-1.5 px-2 text-[9px] font-semibold text-[#64748b] uppercase tracking-wider w-[75%]">Application Path</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className="border-b border-[#1e293b] last:border-none hover:bg-[#1e293b]/50 transition-colors">
                  <td className="py-2 px-2 text-[10px] text-[#e2e8f0] font-medium align-top">
                    {row.appName}
                  </td>
                  <td className="py-2 px-2 text-[9px] text-[#94a3b8] break-all leading-snug align-top">
                    {row.appPath}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Website Protection Policies Component
  const WebsiteProtectionPolicies = () => {
    const rows = [
      { branch: "HQ - Mumbai", mode: "Prevent" },
      { branch: "Branch - Delhi", mode: "Allow" },
      { branch: "Branch - Bengaluru", mode: "Prevent" },
      { branch: "HQ - Mumbai", mode: "Allow" },
      { branch: "Branch - Chennai", mode: "Prevent" },
    ];

    return (
      <div className="bg-[#0f172a] rounded-lg border border-[#1e293b] flex flex-col">
        <div className="flex justify-between items-center p-3 border-b border-[#1e293b]">
          <div className="flex items-center gap-1.5">
            <ShieldAlert size={14} className="text-[#4f75ff]" />
            <h2 className="text-[#e2e8f0] text-[11px] font-medium m-0">Website Protection Policies</h2>
            <span className="bg-[#1e293b] text-[#94a3b8] text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-1">
              5
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#0b1120] border border-[#1e293b] px-2.5 py-1 rounded-md">
              <Search size={12} className="text-[#64748b]" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-[10px] text-[#e2e8f0] placeholder-[#475569] w-24"
              />
            </div>
            <div className="flex items-center gap-2 bg-[#1e293b] px-2.5 py-1 rounded-md cursor-pointer hover:bg-[#334155] transition-colors">
              <span className="text-[10px] text-[#e2e8f0] font-medium">All Modes</span>
              <ChevronDown size={12} className="text-[#94a3b8]" />
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1e293b] bg-[#0b1120]/50">
                <th className="py-2 px-3 text-[9px] font-semibold text-[#64748b] uppercase tracking-wider w-1/2">Branch</th>
                <th className="py-2 px-3 text-[9px] font-semibold text-[#64748b] uppercase tracking-wider w-1/2">Mode</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className="border-b border-[#1e293b] last:border-none hover:bg-[#1e293b]/30 transition-colors">
                  <td className="py-2 px-3 text-[10px] text-[#cbd5e1]">
                    {row.branch}
                  </td>
                  <td className="py-2 px-3">
                    {row.mode === "Prevent" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#ff4757]/30 bg-[#ff4757]/10 text-[#ff4757] text-[10px] font-medium tracking-wide">
                        <ShieldAlert size={10} /> Prevent
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#31d6a0]/30 bg-[#31d6a0]/10 text-[#31d6a0] text-[10px] font-medium tracking-wide">
                        <CheckCircle2 size={10} /> Allow
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Security Policy Details Component (Channels & REGEX Side-by-Side)
  const SecurityPolicyDetails = () => {
    return (
      <div className="bg-[#0f172a] rounded-lg p-3 flex flex-col gap-0 border border-[#1e293b]">
        
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[#e2e8f0] text-[11px] font-medium flex items-center gap-1.5 m-0">
            <ShieldCheck size={14} className="text-[#4f75ff]" /> Security Policy Details
          </h3>
          <span className="text-[9px] text-[#64748b]">Configure policy source, destination control, details.</span>
        </div>

        <div className="flex flex-col gap-3">
          
          {/* Row 1: File Type & Keywords */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-[10px] text-[#cbd5e1]">
                <FileText size={20} /> File Type
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['PDF', 'Doc', 'xlsx', 'csv', 'txt'].map(tag => (
                  <span key={tag} className="px-1.5 py-0.5 text-[11px] rounded bg-[#1a2744] text-[#cbd5e1] border border-[#1b4236]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-[10px] text-[#cbd5e1]">
                <FileText size={20} /> Keywords
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-[#cbd5e1]-[#cbd5e1] w-fit pb-0.5">salary detail document pancard</span>
                {/* <span className="text-[10px] text-[#ffd43b] border-b border-dashed border-[#ffd43b] w-fit pb-0.5"></span> */}
              </div>
            </div>
          </div>

          {/* Row 2: Channels & REGEX (Now Side-by-Side) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-[10px] text-[#cbd5e1]">
                <Globe size={20} /> Channels
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Browser Upload', 'FTP Transfer', 'Clipboard copy'].map(tag => (
                  <span key={tag} className="px-1.5 py-0.5 text-[11px] rounded bg-[#1a2744] text-[#cbd5e1] border border-[#1b4236]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-[10px] text-[#cbd5e1]">
                <Code size={20} /> REGEX
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['PDF', 'Doc', 'xlsx', 'csv', 'txt'].map(tag => (
                  <span key={tag} className="px-1.5 py-0.5 text-[11px] rounded bg-[#1a2744] text-[#cbd5e1] border border-[#1b4236]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: Application (Full Width) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-[10px] text-[#cbd5e1]">
              <AppWindow size={20} /> Application
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['Chrome', 'Edge', 'Firefox', 'Brave', 'Safari'].map(tag => (
                <span key={tag} className="px-1.5 py-0.5 text-[11px] rounded bg-[#1a2744] text-[#cbd5e1] border border-[#1b4236]">
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="w-full font-sans flex flex-col gap-3">
      
      {/* 1. HEADER SECTION */}
      <div className="bg-[#0f172a] rounded-lg p-3.5 flex flex-col gap-1 border border-[#1e293b]">
        <h1 className="text-[14px] font-semibold text-[#f8fafc] m-0 tracking-wide">
          Endpoint Policy
        </h1>
        <p className="text-[10px] text-[#94a3b8] m-0">
          Configure policy source, destination control, details.
        </p>
      </div>

      {/* 2. METRICS CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-3.5 flex justify-between items-center">
          <div className="flex flex-col gap-0.5">
            <span className="text-[15px] font-semibold text-[#f8fafc] leading-tight">USB Control</span>
            <span className="text-[10px] text-[#94a3b8]"></span>
            <span className="text-[10px] text-[#ff4757] font-medium mt-0.5">Prevent</span>
          </div>
          <div className="w-8 h-8 rounded-full border border-[#1e293b] flex items-center justify-center shrink-0">
            <Pin size={20} className="text-[#ff4757]" />
          </div>
        </div>
        
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-3.5 flex justify-between items-center">
          <div className="flex flex-col gap-0.5">
            <span className="text-[15px] font-semibold text-[#f8fafc] leading-tight">Printer Control</span>
            <span className="text-[10px] text-[#94a3b8]"></span>
            <span className="text-[10px] text-[#31d6a0] font-medium mt-0.5">Allow</span>
          </div>
          <div className="w-8 h-8 rounded-full border border-[#1e293b] flex items-center justify-center shrink-0">
            <Printer size={20} className="text-[#31d6a0]" />
          </div>
        </div>
        
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-3.5 flex justify-between items-center">
          <div className="flex flex-col gap-0.5">
            <span className="text-[15px] font-semibold text-[#f8fafc] leading-tight">Application mode</span>
            <span className="text-[10px] text-[#94a3b8]"></span>
            <span className="text-[10px] text-[#4f75ff] font-medium mt-0.5">Manage</span>
          </div>
          <div className="w-8 h-8 rounded-full border border-[#1e293b] flex items-center justify-center shrink-0">
            <AppWindow size={20} className="text-[#ff4757]" />
          </div>
        </div>
        
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-3.5 flex justify-between items-center">
          <div className="flex flex-col gap-0.5">
            <span className="text-[15px] font-semibold text-[#f8fafc] leading-tight">Drive Control</span>
            <span className="text-[10px] text-[#94a3b8]"></span>
            <span className="text-[10px] text-[#4f75ff] font-medium mt-0.5">Manage</span>
          </div>
          <div className="w-8 h-8 rounded-full border border-[#1e293b] flex items-center justify-center shrink-0">
            <RefreshCw size={20} className="text-[#ffd43b]" />
          </div>
        </div>
      </div>

      {/* 3. MIDDLE ROW (Two Application Tables) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <DataTable title="Whitelisted Application" />
        <DataTable title="Blacklisted Application" />
      </div>

      {/* 4. BOTTOM ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <WebsiteProtectionPolicies />
        <SecurityPolicyDetails />
      </div>
    </div>
  );
}