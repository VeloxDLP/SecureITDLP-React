import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  ChevronUp,
  CalendarDays,
  Minus,
  Database,
  HardDrive,
  Activity,
  Server,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

import CPUUtilization from "./CPUUtilization";
import useCpuRamLive from "./useCpuRamLive";
import {
  ZOOM_OPTIONS,
  buildLinePoints,
  formatPercent,
  formatStamp,
  getChartRange,
  getOneMinuteChange,
  getTimeTicks,
  toRatio,
} from "./cpuRamChart";
import { dashboardService } from "../../services/dashboardService";

// API sends total RAM in MB; the RAM card shows GB
const formatRam = (mb) => {
  const value = Number(mb ?? NaN);
  return Number.isFinite(value) ? `${(value / 1024).toFixed(2)} GB` : "-";
};

// RAM chart y coordinates: 0% sits at y=120, 100% at y=0
const toRamChartY = (value) => 120 - value * 1.2;

// --- SUB-COMPONENT: RAM Utilization (LIVE) ---
const RAMCard = ({ isDark, totalMemory = "-", samples = [], status = "connecting" }) => {
  const [zoom, setZoom] = useState("1M");

  const latest = samples[samples.length - 1];
  const ramUsage = latest?.ramUsage;
  const isLive = status === "live";

  const range = getChartRange(samples, zoom);
  const linePoints = buildLinePoints(samples, "ramUsage", range, toRamChartY);
  const firstX = linePoints.split(" ")[0].split(",")[0];
  const change = getOneMinuteChange(samples, "ramUsage");

  const theme = {
    bg: isDark ? "#020617" : "#ffffff",
    border: isDark ? "#1e293b" : "#e2e8f0",
    text: isDark ? "#e8eef7" : "#0f172a",
    textMuted: isDark ? "#8da2b9" : "#64748b",
    textLight: isDark ? "#94a3b8" : "#94a3b8",
    cardBg: isDark ? "#020617" : "#f8fafc",
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
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", background: isLive ? theme.liveBg : theme.btnDefault, color: isLive ? theme.liveText : theme.btnDefaultText, borderRadius: 20, fontSize: 10 }}>
            <span style={{ width: 6, height: 6, background: isLive ? theme.liveText : theme.btnDefaultText, borderRadius: "50%" }} /> {isLive ? "Live" : status === "connecting" ? "Connecting" : "Offline"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: theme.textMuted, fontSize: 10 }}>
            <CalendarDays size={12} /> {formatStamp(latest?.time)}
            <button style={{ background: theme.btnDefault, border: "none", color: theme.btnDefaultText, borderRadius: 4, width: 20, height: 20, display: "grid", placeItems: "center", cursor: "pointer" }}><Minus size={12} /></button>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 20, alignItems: "center", marginBottom: 20, flex: 1 }}>
        <div style={{ position: "relative", width: 140, height: 140 }}>
          <svg viewBox="0 0 160 160" style={{ width: "100%", height: "100%" }}>
            <circle cx="80" cy="80" r="65" fill="none" stroke={theme.gridLine} strokeWidth="12" />
            <circle cx="80" cy="80" r="65" fill="none" stroke="url(#ramGradient)" strokeWidth="12" strokeDasharray={`${2 * Math.PI * 65 * toRatio(ramUsage)} ${2 * Math.PI * 65}`} strokeLinecap="round" transform="rotate(-90 80 80)" />
            <defs>
              <linearGradient id="ramGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#d946ef" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <strong style={{ fontSize: 28, color: theme.text }}>{formatPercent(ramUsage)}</strong>
            <span style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>Used</span>
          </div>
        </div>

        <div style={{ position: "relative", height: 120 }}>
          <div style={{ position: "absolute", top: -20, right: 0, display: "flex", gap: 4, fontSize: 9 }}>
            <span style={{ color: theme.textMuted, padding: "2px 4px" }}>Zoom</span>
            {ZOOM_OPTIONS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setZoom(item)}
                style={{
                  background: zoom === item ? theme.btnActive : theme.btnDefault,
                  color: zoom === item ? theme.btnActiveText : theme.btnDefaultText,
                  border: "none",
                  borderRadius: 3,
                  padding: "2px 6px",
                  cursor: "pointer",
                }}
              >
                {item}
              </button>
            ))}
          </div>
          <svg viewBox="0 0 360 120" preserveAspectRatio="none" style={{ width: "100%", height: "100%", overflow: "visible" }}>
            {[0, 60, 120].map(y => <line key={y} x1="0" y1={y} x2="360" y2={y} stroke={theme.gridLine} strokeDasharray="3 3" />)}
            <defs>
              <linearGradient id="ramArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity={isDark ? "0.4" : "0.2"} />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
              </linearGradient>
            </defs>
            {linePoints && (
              <>
                <polygon points={`${firstX},120 ${linePoints} 360,120`} fill="url(#ramArea)" />
                <polyline points={linePoints} fill="none" stroke="#c084fc" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
                <circle cx="360" cy={toRamChartY(Number(ramUsage) || 0)} r="3" fill="#c084fc" />
              </>
            )}
            </svg>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: -14, display: "flex", justifyContent: "space-between", fontSize: 8, color: theme.textMuted }}>
            {getTimeTicks(range).map((time, index) => (
              <span key={index}>{time}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, borderTop: `1px solid ${theme.border}`, paddingTop: 16 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Database size={16} color="#a855f7" style={{ marginTop: 2 }} />
          <div><p style={{ margin: 0, fontSize: 10, color: theme.textMuted }}>Used Memory</p><p style={{ margin: "2px 0", fontSize: 14, fontWeight: 600, color: theme.text }}>{formatRam(latest?.ramUsedMb)}</p><p style={{ margin: 0, fontSize: 9, color: theme.textMuted }}>of {totalMemory}</p></div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Server size={16} color="#3b82f6" style={{ marginTop: 2 }} />
          <div><p style={{ margin: 0, fontSize: 10, color: theme.textMuted }}>Free Memory</p><p style={{ margin: "2px 0", fontSize: 14, fontWeight: 600, color: theme.text }}>{formatRam(latest?.ramFreeMb)}</p><p style={{ margin: 0, fontSize: 9, color: theme.textMuted }}>of {totalMemory}</p></div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Activity size={16} color="#6366f1" style={{ marginTop: 2 }} />
          <div><p style={{ margin: 0, fontSize: 10, color: theme.textMuted }}>Usage</p><p style={{ margin: "2px 0", fontSize: 14, fontWeight: 600, color: theme.text }}>{formatPercent(ramUsage)}</p>{change !== null && <p style={{ margin: 0, fontSize: 9, color: change > 0 ? "#ef4444" : "#10b981" }}>{change > 0 ? "▲" : "▼"} {Math.abs(change).toFixed(1)}% (1 min)</p>}</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <HardDrive size={16} color={theme.textMuted} style={{ marginTop: 2 }} />
          <div style={{ width: "100%" }}><p style={{ margin: 0, fontSize: 10, color: theme.textMuted }}>Total Memory</p><p style={{ margin: "2px 0", fontSize: 14, fontWeight: 600, color: theme.text }}>{totalMemory}</p><div style={{ width: "100%", height: 4, background: theme.gridLine, borderRadius: 2, marginTop: 4 }}><div style={{ width: `${toRatio(ramUsage) * 100}%`, height: "100%", background: "#a855f7", borderRadius: 2 }}></div></div></div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: Shared DataRow ---
const DataRow = ({ label, value }) => (
  <div className="hw-row">
    <div className="hw-label" style={{ flexShrink: 0 }}>
      <span className="dot"></span>
      {label}
    </div>
    <div
      className="hw-value"
      title={value || "-"}
      style={{
        maxWidth: "65%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        textAlign: "right",
        fontWeight: 500,
      }}
    >
      {value || "-"}
    </div>
  </div>
);

// --- SUB-COMPONENT: Drive Details (LIVE) ---
const DriveDetails = ({ isDark, hostName }) => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!hostName) return;
    let cancelled = false;
    (async () => {
      try {
        const response = await dashboardService.getDriveDetailsByHost(hostName);
        if (!cancelled) setDrives(Array.isArray(response?.data) ? response.data : []);
      } catch (err) {
        if (!cancelled) {
          if (err?.response?.status !== 404) {
            setError(err.message || "Failed to load drives");
          } else {
            setDrives([]);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [hostName]);

  return (
    <div className={`inner-card ${isDark ? 'dark' : 'light'}`} style={{ height: "100%" }}>
      <div className="inner-card-header">
        <h3>Drive Details</h3>
        <div className="search-box">
          <Search size={12} className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      
      {loading ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, color: "#94a3b8", fontSize: 11 }}>
          <Loader2 size={16} className="animate-spin" style={{ marginRight: 8 }} /> Loading drives…
        </div>
      ) : error ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444", fontSize: 11 }}>
          <AlertCircle size={16} style={{ marginRight: 8 }} /> {error}
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Drive</th>
                <th>Total</th>
                <th>Free</th>
                <th>File System</th>
              </tr>
            </thead>
            <tbody>
              {drives.length > 0 ? drives.map((d, idx) => (
                <tr key={idx}>
                  <td>{d.drive || "-"}</td>
                  <td>{d.totalGb ? `${d.totalGb} GB` : "-"}</td>
                  <td>{d.freeGb ? `${d.freeGb} GB` : "-"}</td>
                  <td>{d.fileSystem || "-"}</td>
                </tr>
              )) : (
                <tr><td colSpan={4} style={{ textAlign: "center", padding: "24px" }}>No drives found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// --- SUB-COMPONENT: OS Details (LIVE) ---
const OSDetails = ({ isDark, hostName, onLoad }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!hostName) return;
    let cancelled = false;
    (async () => {
      try {
        const response = await dashboardService.getOperatingSystemByHost(hostName);
        if (!cancelled) {
          const first = response?.data?.[0] || null;
          setData(first);
          onLoad?.(first);
        }
      } catch (err) {
        if (!cancelled) {
          if (err?.response?.status !== 404) {
            setError(err.message || "Failed to load OS details");
          } else {
            setData(null);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [hostName, onLoad]);

  return (
    <div className={`inner-card ${isDark ? 'dark' : 'light'}`} style={{ height: "100%" }}>
      <div className="inner-card-header">
        <h3>OS Details</h3>
        <button className="collapse-btn"><ChevronUp size={14} /></button>
      </div>

      {loading ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, color: "#94a3b8", fontSize: 11 }}>
          <Loader2 size={16} className="animate-spin" style={{ marginRight: 8 }} /> Loading OS…
        </div>
      ) : error ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444", fontSize: 11 }}>
          <AlertCircle size={16} style={{ marginRight: 8 }} /> {error}
        </div>
      ) : !data ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, color: "#94a3b8", fontSize: 11 }}>No OS data available</div>
      ) : (
        <>
          <div className="hw-section">
            <p className="hw-section-title">System</p>
            <div className="hw-grid" style={{ marginBottom: 6 }}>
              <DataRow label="OS" value={data.os} />
              <DataRow label="Version" value={data.version} />
            </div>
            <div className="hw-grid">
              <DataRow label="Architecture" value={data.architecture} />
              <DataRow label="Installed" value={data.installDate} />
            </div>
          </div>

          <div className="hw-section">
            <p className="hw-section-title">Memory</p>
            <div className="hw-grid">
              <DataRow label="Total RAM" value={data.totalRamMb ? `${data.totalRamMb} MB` : "-"} />
              <DataRow label="Last Check-in" value={data.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : "-"} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// --- SUB-COMPONENT: Hardware Details (LIVE) ---
const HardwareDetails = ({ isDark, hostName, onLoad }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!hostName) {
      setError("Host name is required");
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const response = await dashboardService.getHardwareDetailsByHost(hostName);
        const first = Array.isArray(response?.data) ? response.data[0] : null;
        if (!first) throw new Error("No hardware details available");
        if (!cancelled) {
          setData(first);
          onLoad?.(first);
        }
      } catch (err) {
        if (!cancelled) {
          if (err?.response?.status !== 404) {
            setError(err?.response?.data?.message || err?.message || "Failed to load hardware details");
          } else {
            setData(null);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [hostName, onLoad]);

  return (
    <div className={`inner-card ${isDark ? "dark" : "light"}`}>
      <div className="inner-card-header">
        <h3>Hardware Details</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {hostName && (
            <span style={{ fontSize: 9, padding: "2px 6px", background: isDark ? "#0b1120" : "#f1f5f9", border: `1px solid ${isDark ? "#1e293b" : "#e2e8f0"}`, borderRadius: 4, color: isDark ? "#94a3b8" : "#64748b", maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={hostName}>
              {hostName}
            </span>
          )}
          <button className="collapse-btn"><ChevronUp size={14} /></button>
        </div>
      </div>

      {loading ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "#94a3b8", fontSize: 11, padding: 24 }}>
          <Loader2 size={16} className="animate-spin" /> Loading hardware…
        </div>
      ) : error ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, color: "#ef4444", fontSize: 11, textAlign: "center", padding: 24 }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      ) : !data ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 11, padding: 24 }}>
          No hardware data available
        </div>
      ) : (
        <>
          <div className="hw-section">
            <p className="hw-section-title">Processor</p>
            <div className="hw-grid" style={{ marginBottom: 4 }}>
              <DataRow label="Processor" value={data.processor} />
              <DataRow label="BIOS" value={data.bios} />
            </div>
            <div className="hw-grid">
              <DataRow label="CPU Cores" value={data.cpuCores} />
              <DataRow label="Base Speed" value={data.cpuBaseSpeed} />
            </div>
          </div>

          <div className="hw-section">
            <p className="hw-section-title">Memory & Graphics</p>
            <div className="hw-grid">
              <DataRow label="RAM Size" value={data.ramSize ? `${data.ramSize}` : "-"} />
              <DataRow label="Graphic Card" value={data.graphicCard} />
            </div>
          </div>

          <div className="hw-section">
            <p className="hw-section-title">Storage & Motherboard</p>
            <div className="hw-grid">
              <DataRow label="Drives" value={data.drives} />
              <DataRow label="Motherboard" value={data.motherboard} />
            </div>
          </div>

          <div className="hw-section">
            <p className="hw-section-title">Identity</p>
            <div className="hw-grid">
              <DataRow label="MAC Address" value={data.macAddress} />
              <DataRow label="Updated" value={formatDate(data.updatedAt)} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Helper
function formatDate(iso) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

// --- MAIN PAGE COMPONENT ---
function DeviceDetail({ isDark = true }) {
  const location = useLocation();
  const navigate = useNavigate();

  const hostName = location.state?.hostName || location.state?.device?.host || "PRATHAMESH-B";

  // Filled by the Hardware / OS cards once they load, shared with the CPU / RAM cards
  const [hardware, setHardware] = useState(null);
  const [osInfo, setOsInfo] = useState(null);

  // Live CPU / RAM readings, refreshed every 5 sec
  const { samples, status } = useCpuRamLive(hostName);
  const latestSample = samples[samples.length - 1];

  return (
    <div className={`device-detail-container ${isDark ? 'dark' : 'light'}`}>
      
      {/* 🛠️ HEADER: Matches the Screenshot */}
      <div 
        style={{
          background: isDark ? "#020617" : "#ffffff",
          border: `1px solid ${isDark ? "#1e293b" : "#e2e8f0"}`,
          borderRadius: 12,
          padding: "20px 24px",
          marginBottom: 8,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: isDark ? "#f8fafc" : "#0f172a" }}>
            Endpoint Details
          </h2>
          <p style={{ margin: 0, fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>
            System Configuration For <span style={{ color: isDark ? "#818cf8" : "#4f46e5", fontWeight: 600 }}>{hostName}</span>
          </p>
        </div>

        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            background: "#6366f1", // Purple/Indigo matching screenshot
            border: "none", 
            color: "#ffffff", 
            cursor: "pointer",
            padding: "8px 16px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "background 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#4f46e5"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#6366f1"}
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* Top Row: CPU & RAM */}
      <div className="device-utilization-grid">
        <div className="device-utilization-card">
          <CPUUtilization
            isDark={isDark}
            cores={hardware?.cpuCores}
            baseSpeed={hardware?.cpuBaseSpeed}
            samples={samples}
            status={status}
          />
        </div>
        <div className="device-utilization-card">
          <RAMCard
            isDark={isDark}
            totalMemory={formatRam(latestSample?.ramTotalMb ?? osInfo?.totalRamMb)}
            samples={samples}
            status={status}
          />
        </div>
      </div>

      {/* Bottom Row 1: Drive & OS Details */}
      <div className="device-info-grid-2">
        <DriveDetails isDark={isDark} hostName={hostName} />
        <OSDetails isDark={isDark} hostName={hostName} onLoad={setOsInfo} />
      </div>

           {/* Bottom Row 2: Hardware Details */}
      <div style={{ marginTop: 8 }}> {/* 👈 CHANGE THIS (was 24) */}
        <HardwareDetails isDark={isDark} hostName={hostName} onLoad={setHardware} />
      </div>

     
<style>{`
  * {
    box-sizing: border-box;
  }

    .device-detail-container {
    width: 100%;
    min-height: 100vh;
    padding: 8px; /* 👈 CHANGE THIS (was 24px) */
    font-family: "Inter", system-ui, sans-serif;
  }

  /* Header */
  .device-detail-header {
    margin-bottom: 8px !important;
    border-radius: 8px !important;
  }

    /* CPU & RAM */
  .device-utilization-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px; /* 👈 CHANGE THIS (controls space between CPU and RAM) */
    margin-bottom: 8px; /* 👈 CHANGE THIS (controls space below them) */
    align-items: stretch;
  }

  .device-utilization-card {
    min-width: 0;
    width: 100%;
    display: flex;
  }

    /* Drive & OS */
  .device-info-grid-2 {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px; /* 👈 CHANGE THIS */
    margin-bottom: 8px; /* 👈 CHANGE THIS */
    align-items: stretch;
  }

  /* Hardware */
  .hardware-wrapper {
    width: 100%;
    margin-top: 0;
    padding: 0;
  }

  /* All cards */
  .inner-card {
    width: 100%;
    min-width: 0;
    height: 100%;
    border-radius: 8px;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    transition: background-color 0.3s, border-color 0.3s;
  }

  .dark .inner-card {
    background: #020617;
    border: 1px solid #1e293b;
  }

  .light .inner-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
  }

  /* Card headers */
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

  .dark .inner-card-header h3 {
    color: #f1f5f9;
  }

  .light .inner-card-header h3 {
    color: #0f172a;
  }

  /* Search */
  .search-box {
    display: flex;
    align-items: center;
    border-radius: 6px;
    padding: 4px 8px;
    gap: 4px;
  }

  .dark .search-box {
    background: #0b1120;
    border: 1px solid #1e293b;
  }

  .light .search-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
  }

  .search-box input {
    background: transparent;
    border: none;
    font-size: 10px;
    outline: none;
    width: 100px;
  }

  .dark .search-box input {
    color: #94a3b8;
  }

  .light .search-box input {
    color: #64748b;
  }

  /* Tables */
  .table-container {
    width: 100%;
    overflow-x: auto;
  }

  .inner-card table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
  }

  .inner-card th {
    text-align: left;
    padding: 8px 10px;
    font-weight: 500;
  }

  .dark .inner-card th {
    background: #0b1120;
    color: #94a3b8;
  }

  .light .inner-card th {
    background: #f1f5f9;
    color: #64748b;
  }

  .inner-card td {
    padding: 8px 10px;
    border-bottom: 1px solid;
    white-space: nowrap;
  }

  .dark .inner-card td {
    border-color: #1e293b;
    color: #cbd5e1;
  }

  .light .inner-card td {
    border-color: #e2e8f0;
    color: #334155;
  }

  /* Hardware details */
  .hw-section {
    margin-bottom: 6px;
  }

  .hw-section:last-child {
    margin-bottom: 0;
  }

  .hw-section-title {
    margin: 0 0 4px;
    font-size: 10px;
    font-weight: 500;
  }

  .dark .hw-section-title {
    color: #94a3b8;
  }

  .light .hw-section-title {
    color: #64748b;
  }

  .hw-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }

  .hw-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 8px;
    border-radius: 4px;
    font-size: 10px;
    min-width: 0;
  }

  .dark .hw-row {
    background: #0b1120;
  }

  .light .hw-row {
    background: #f8fafc;
  }

  .hw-label {
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
  }

  .dot {
    width: 6px;
    height: 6px;
    flex-shrink: 0;
    background: #10b981;
    border-radius: 50%;
  }

  /* Loading and error */
  .loading-state,
  .error-state {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 24px;
    font-size: 11px;
  }

  .loading-state {
    color: #94a3b8;
  }

  .error-state {
    color: #ef4444;
  }

  /* Responsive */
  @media (max-width: 1200px) {
    .device-info-grid-2 {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 900px) {
    .device-utilization-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 600px) {
    .device-detail-container {
      padding: 12px;
    }

    .hw-grid {
      grid-template-columns: 1fr;
    }
  }
`}</style>

    </div>
  );
}

export default DeviceDetail;