import React from "react";
import { Search, ChevronUp, CalendarDays, Minus, Database, HardDrive, Activity, Server } from "lucide-react";

import CPUUtilization from "./CPUUtilization"; 
// Note: Ensure your CPUUtilization component also accepts a theme or uses the same context

// --- SUB-COMPONENT: RAM Utilization ---
const RAMCard = ({ isDark }) => {
  const theme = {
    bg: isDark ? "#111827" : "#ffffff",
    border: isDark ? "#1e293b" : "#e2e8f0",
    text: isDark ? "#e8eef7" : "#0f172a",
    textMuted: isDark ? "#8da2b9" : "#64748b",
    textLight: isDark ? "#94a3b8" : "#94a3b8",
    cardBg: isDark ? "#0b1120" : "#f8fafc",
    borderLight: isDark ? "#1e293b" : "#e2e8f0",
    gridLine: isDark ? "#1e293b" : "#e2e8f0",
    btnActive: isDark ? "#1e3a8a" : "#dbeafe",
    btnActiveText: isDark ? "#93c5fd" : "#1d4ed8",
    btnDefault: isDark ? "#1e293b" : "#f1f5f9",
    btnDefaultText: isDark ? "#94a3b8" : "#64748b",
    liveBg: isDark ? "#2e1065" : "#f3e8ff",
    liveText: isDark ? "#d8b4fe" : "#9333ea",
  };

  return (
    <div style={{ width: "100%", height: "100%", background: theme.bg, borderRadius: 12, padding: 20, boxSizing: "border-box", border: `1px solid ${theme.border}`, color: theme.text, fontFamily: "Inter, system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, background: theme.liveBg, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: theme.liveText }}>
            <Database size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>RAM Utilization</h3>
            <p style={{ margin: "4px 0 0", fontSize: 11, color: theme.textMuted }}>Real-time utilization</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", background: theme.liveBg, color: theme.liveText, borderRadius: 20, fontSize: 10 }}>
            <span style={{ width: 6, height: 6, background: theme.liveText, borderRadius: "50%" }} /> Live
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: theme.textMuted, fontSize: 10 }}>
            <CalendarDays size={12} /> 2026-Sep-25 5:17 PM
            <button style={{ background: theme.btnDefault, border: "none", color: theme.btnDefaultText, borderRadius: 4, width: 20, height: 20, display: "grid", placeItems: "center", cursor: "pointer" }}><Minus size={12} /></button>
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 20, alignItems: "center", marginBottom: 20, flex: 1 }}>
        <div style={{ position: "relative", width: 140, height: 140 }}>
          <svg viewBox="0 0 160 160" style={{ width: "100%", height: "100%" }}>
            <circle cx="80" cy="80" r="65" fill="none" stroke={theme.gridLine} strokeWidth="12" />
            <circle cx="80" cy="80" r="65" fill="none" stroke="url(#ramGradient)" strokeWidth="12" strokeDasharray={`${2 * Math.PI * 65 * 0.96} ${2 * Math.PI * 65}`} strokeLinecap="round" transform="rotate(-90 80 80)" />
            <defs>
              <linearGradient id="ramGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#d946ef" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <strong style={{ fontSize: 28, color: theme.text }}>96.0%</strong>
            <span style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>Used</span>
          </div>
        </div>

        <div style={{ position: "relative", height: 120 }}>
           <div style={{ position: "absolute", top: -20, right: 0, display: "flex", gap: 4, fontSize: 9 }}>
             <span style={{ color: theme.textMuted, padding: "2px 4px" }}>Zoom</span>
             <button style={{ background: theme.btnActive, color: theme.btnActiveText, border: "none", borderRadius: 3, padding: "2px 6px" }}>1M</button>
             <button style={{ background: theme.btnDefault, color: theme.btnDefaultText, border: "none", borderRadius: 3, padding: "2px 6px" }}>5M</button>
             <button style={{ background: theme.btnDefault, color: theme.btnDefaultText, border: "none", borderRadius: 3, padding: "2px 6px" }}>All</button>
           </div>
           <svg viewBox="0 0 360 120" preserveAspectRatio="none" style={{ width: "100%", height: "100%", overflow: "visible" }}>
             {[0, 50, 100].map(y => <line key={y} x1="0" y1={y} x2="360" y2={y} stroke={theme.gridLine} strokeDasharray="3 3" />)}
             <defs>
               <linearGradient id="ramArea" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stopColor="#a855f7" stopOpacity={isDark ? "0.4" : "0.2"} />
                 <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
               </linearGradient>
             </defs>
             
             <path d="M 0 90 L 30 60 L 45 75 L 70 20 L 100 70 L 130 40 L 160 80 L 200 60 L 240 90 L 290 10 L 320 60 L 350 50 L 360 25 L 360 120 L 0 120 Z" fill="url(#ramArea)" />
             <path d="M 0 90 L 30 60 L 45 75 L 70 20 L 100 70 L 130 40 L 160 80 L 200 60 L 240 90 L 290 10 L 320 60 L 350 50 L 360 25" fill="none" stroke="#c084fc" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
             
             <circle cx="360" cy="25" r="3" fill="#c084fc" />
             <g fontSize="8" fill={theme.textMuted}>
                <text x="0" y="130">17:12</text><text x="60" y="130">17:13</text><text x="120" y="130">17:14</text><text x="180" y="130">17:15</text><text x="240" y="130">17:16</text><text x="300" y="130">17:17</text><text x="340" y="130">17:17</text>
             </g>
           </svg>
        </div>
      </div>

      {/* Footer Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, borderTop: `1px solid ${theme.border}`, paddingTop: 16 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Database size={16} color="#a855f7" style={{ marginTop: 2 }} />
          <div><p style={{ margin: 0, fontSize: 10, color: theme.textMuted }}>Used Memory</p><p style={{ margin: "2px 0", fontSize: 14, fontWeight: 600, color: theme.text }}>15.36 GB</p><p style={{ margin: 0, fontSize: 9, color: theme.textMuted }}>of 16.00 GB</p></div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Server size={16} color="#3b82f6" style={{ marginTop: 2 }} />
          <div><p style={{ margin: 0, fontSize: 10, color: theme.textMuted }}>Free Memory</p><p style={{ margin: "2px 0", fontSize: 14, fontWeight: 600, color: theme.text }}>0.64 GB</p><p style={{ margin: 0, fontSize: 9, color: theme.textMuted }}>of 16.00 GB</p></div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Activity size={16} color="#6366f1" style={{ marginTop: 2 }} />
          <div><p style={{ margin: 0, fontSize: 10, color: theme.textMuted }}>Usage</p><p style={{ margin: "2px 0", fontSize: 14, fontWeight: 600, color: theme.text }}>96.0%</p><p style={{ margin: 0, fontSize: 9, color: "#ef4444" }}>▲ 2.4% (1 min)</p></div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <HardDrive size={16} color={theme.textMuted} style={{ marginTop: 2 }} />
          <div style={{ width: "100%" }}><p style={{ margin: 0, fontSize: 10, color: theme.textMuted }}>Total Memory</p><p style={{ margin: "2px 0", fontSize: 14, fontWeight: 600, color: theme.text }}>16.00 GB</p><div style={{ width: "100%", height: 4, background: theme.gridLine, borderRadius: 2, marginTop: 4 }}><div style={{ width: "96%", height: "100%", background: "#a855f7", borderRadius: 2 }}></div></div></div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: Drive Details Table ---
const DriveDetails = ({ isDark }) => {
  const drives = [
    { ip: "10.30.13.60", atm: "SIANBY95", date: "2/02/2026", time: "72 hrs" },
    { ip: "10.30.13.75", atm: "SIANBY95", date: "2/02/2026", time: "28 hrs" },
    { ip: "10.30.13.75", atm: "SIANBY95", date: "2/02/2026", time: "42 hrs" },
    { ip: "10.30.13.75", atm: "SIANBY95", date: "2/02/2026", time: "10hrs" },
    { ip: "10.30.13.75", atm: "SIANBY95", date: "2/02/2026", time: "9 hrs" },
  ];

  return (
    <div className={`inner-card ${isDark ? 'dark' : 'light'}`} style={{ height: "100%" }}>
      <div className="inner-card-header">
        <h3>Drive Details</h3>
        <div className="search-box">
          <Search size={12} className="search-icon" />
          <input type="text" placeholder="Search Identifiers" />
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>IP Address</th>
              <th>ATM ID</th>
              <th>Date</th>
              <th>Time Taken</th>
            </tr>
          </thead>
          <tbody>
            {drives.map((drive, idx) => (
              <tr key={idx}>
                <td>{drive.ip}</td>
                <td>{drive.atm}</td>
                <td>{drive.date}</td>
                <td>{drive.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: Hardware Details Card ---
const HardwareDetails = ({ isDark }) => {
  const DataRow = ({ label, value = "No" }) => (
    <div className="hw-row">
      <div className="hw-label">
        <span className="dot"></span>
        {label}
      </div>
      <div className="hw-value">{value}</div>
    </div>
  );

  return (
    <div className={`inner-card ${isDark ? 'dark' : 'light'}`}>
      <div className="inner-card-header">
        <h3>Hardware Details</h3>
        <button className="collapse-btn">
          <ChevronUp size={14} />
        </button>
      </div>
      <div className="hw-section">
        <p className="hw-section-title">Identity</p>
        <div className="hw-grid">
          <DataRow label="Serial No." />
          <DataRow label="Mac Address" />
        </div>
      </div>
      <div className="hw-section">
        <p className="hw-section-title">Processor</p>
        <div className="hw-grid">
          <DataRow label="Processor" />
          <DataRow label="BIOS Info" />
        </div>
      </div>
      <div className="hw-section">
        <p className="hw-section-title">Storage & Memory</p>
        <div className="hw-grid">
          <DataRow label="All Drives" />
          <DataRow label="Ram Size" />
          <DataRow label="Hard Disk Model" />
          <DataRow label="Graphic Card" />
        </div>
      </div>
    </div>
  );
};


// --- MAIN PAGE COMPONENT ---
function DeviceDetail({ isDark = true }) { // Defaulting to true, but pass your useTheme() value
  return (
    <div className={`device-detail-container ${isDark ? 'dark' : 'light'}`}>
      
      {/* Top Row: CPU & RAM */}
      <div className="device-utilization-grid">
        <div className="device-utilization-card" style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Note: You will need to pass isDark to CPUUtilization as well if it has hardcoded colors */}
            <CPUUtilization isDark={isDark} />
          </div>
        </div>
        <div className="device-utilization-card">
          <RAMCard isDark={isDark} />
        </div>
      </div>

      {/* Bottom Row: 3 Cards in One Line */}
      <div className="device-info-grid">
        <DriveDetails isDark={isDark} />
        <HardwareDetails isDark={isDark} />
        <HardwareDetails isDark={isDark} />
      </div>

      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        /* --- THEME VARIABLES --- */
        .device-detail-container {
          width: 100%;
          height: 100vh;
          overflow-y: auto; 
          box-sizing: border-box;
          font-family: "Inter", system-ui, sans-serif;
          padding: 24px;
          transition: background-color 0.3s, color 0.3s;
        }

        .device-detail-container.dark {
          color: #e8eef7;
          background: #060b13; 
        }

        .device-detail-container.light {
          color: #0f172a;
          background: #f8fafc; 
        }

        /* Top Grid */
        .device-utilization-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;
          margin-bottom: 24px;
          align-items: stretch; 
        }

        .device-utilization-card {
          min-width: 0;
          width: 100%;
          display: flex;
        }

        /* Bottom Grid */
        .device-info-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr)); 
          gap: 24px;
          align-items: stretch; 
        }

        /* --- CARD STYLES (Theme Dependent) --- */
        .inner-card {
          border-radius: 12px;
          padding: 12px 16px; 
          display: flex;
          flex-direction: column;
          transition: background-color 0.3s, border-color 0.3s;
        }

        .dark .inner-card {
          background: #111827;
          border: 1px solid #1e293b;
        }

        .light .inner-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
        }

        .inner-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px; 
        }

        .inner-card-header h3 {
          margin: 0;
          font-size: 14px; 
          font-weight: 600;
        }

        .dark .inner-card-header h3 { color: #f1f5f9; }
        .light .inner-card-header h3 { color: #0f172a; }

        .collapse-btn {
          border: none;
          border-radius: 4px;
          display: grid;
          place-items: center;
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .dark .collapse-btn { background: #1e293b; color: #94a3b8; }
        .light .collapse-btn { background: #f1f5f9; color: #64748b; }

        .search-box {
          display: flex;
          align-items: center;
          border-radius: 6px;
          padding: 4px 8px; 
          gap: 4px;
        }

        .dark .search-box { background: #0b1120; border: 1px solid #1e293b; }
        .light .search-box { background: #f8fafc; border: 1px solid #e2e8f0; }

        .search-box input {
          background: transparent;
          border: none;
          font-size: 10px;
          outline: none;
          width: 100px;
        }

        .dark .search-box input { color: #94a3b8; }
        .light .search-box input { color: #64748b; }

        .search-icon { color: #64748b; }

        .table-container { width: 100%; }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
        }

        th {
          text-align: left;
          padding: 8px 10px; 
          font-weight: 500;
        }

        .dark th { background: #0b1120; color: #94a3b8; }
        .light th { background: #f1f5f9; color: #64748b; }

        th:first-child { border-radius: 4px 0 0 4px; }
        th:last-child { border-radius: 0 4px 4px 0; }
        
        td {
          padding: 8px 10px; 
          border-bottom: 1px solid;
        }

        .dark td { border-color: #1e293b; color: #cbd5e1; }
        .light td { border-color: #e2e8f0; color: #334155; }

        tr:last-child td { border-bottom: none; }

        .hw-section { margin-bottom: 8px; }
        .hw-section:last-child { margin-bottom: 0; }

        .hw-section-title {
          margin: 0 0 6px 0; 
          font-size: 10px;
          font-weight: 500;
        }

        .dark .hw-section-title { color: #94a3b8; }
        .light .hw-section-title { color: #64748b; }

        .hw-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px; 
        }

        .hw-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 10px; 
          border-radius: 4px;
          font-size: 10px;
        }

        .dark .hw-row { background: #0b1120; }
        .light .hw-row { background: #f8fafc; }

        .hw-label {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .dark .hw-label { color: #cbd5e1; }
        .light .hw-label { color: #334155; }

        .dot {
          width: 6px;
          height: 6px;
          background: #10b981;
          border-radius: 50%;
        }

        .dark .hw-value { color: #94a3b8; }
        .light .hw-value { color: #64748b; }

        /* Responsive */
        @media (max-width: 1200px) {
          .device-info-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 900px) {
          .device-info-grid, .device-utilization-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .device-detail-container { padding: 16px; }
          .hw-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

export default DeviceDetail;