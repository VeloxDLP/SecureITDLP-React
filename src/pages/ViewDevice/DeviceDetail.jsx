import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

import CPUUtilization from "./CPUUtilization";
import RAMUtilization from "./RAMUtilization";
import useCpuRamLive from "./useCpuRamLive";
import { dashboardService } from "../../services/dashboardService";
import { useTheme } from "../../context/ThemeContext";

const formatRam = (mb) => {
  const value = Number(mb ?? NaN);
  return Number.isFinite(value) ? `${(value / 1024).toFixed(2)} GB` : "-";
};

// --- SUB-COMPONENT: Shared DataRow ---
const DataRow = ({ label, value, isDark }) => (
  <div className="hw-row" style={{ background: isDark ? "#0b1120" : "#f8fafc" }}>
    <div className="hw-label" style={{ flexShrink: 0, color: isDark ? "#e8eef7" : "#334155" }}>
      <span className="dot" style={{ background: "#10b981" }}></span>
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
        color: isDark ? "#e8eef7" : "#0f172a"
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
              <DataRow isDark={isDark} label="OS" value={data.os} />
              <DataRow isDark={isDark} label="Version" value={data.version} />
            </div>
            <div className="hw-grid">
              <DataRow isDark={isDark} label="Architecture" value={data.architecture} />
              <DataRow isDark={isDark} label="Installed" value={data.installDate} />
            </div>
          </div>

          <div className="hw-section">
            <p className="hw-section-title">Memory</p>
            <div className="hw-grid">
              <DataRow isDark={isDark} label="Total RAM" value={data.totalRamMb ? `${data.totalRamMb} MB` : "-"} />
              <DataRow isDark={isDark} label="Last Check-in" value={data.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : "-"} />
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
              <DataRow isDark={isDark} label="Processor" value={data.processor} />
              <DataRow isDark={isDark} label="BIOS" value={data.bios} />
            </div>
            <div className="hw-grid">
              <DataRow isDark={isDark} label="CPU Cores" value={data.cpuCores} />
              <DataRow isDark={isDark} label="Base Speed" value={data.cpuBaseSpeed} />
            </div>
          </div>

          <div className="hw-section">
            <p className="hw-section-title">Memory & Graphics</p>
            <div className="hw-grid">
              <DataRow isDark={isDark} label="RAM Size" value={data.ramSize ? `${data.ramSize}` : "-"} />
              <DataRow isDark={isDark} label="Graphic Card" value={data.graphicCard} />
            </div>
          </div>

          <div className="hw-section">
            <p className="hw-section-title">Storage & Motherboard</p>
            <div className="hw-grid">
              <DataRow isDark={isDark} label="Drives" value={data.drives} />
              <DataRow isDark={isDark} label="Motherboard" value={data.motherboard} />
            </div>
          </div>

          <div className="hw-section">
            <p className="hw-section-title">Identity</p>
            <div className="hw-grid">
              <DataRow isDark={isDark} label="MAC Address" value={data.macAddress} />
              <DataRow isDark={isDark} label="Updated" value={formatDate(data.updatedAt)} />
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
function DeviceDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { isDark } = useTheme(); 

  const hostName = location.state?.hostName || location.state?.device?.host || "PRATHAMESH-B";

  const [hardware, setHardware] = useState(null);
  const [osInfo, setOsInfo] = useState(null);

  const { samples, status } = useCpuRamLive(hostName);
  const latestSample = samples[samples.length - 1];

  return (
    <div className={`device-detail-container ${isDark ? 'dark' : 'light'}`}>
      
      {/* HEADER - MATCHING REPORT CENTER EXACTLY */}
      <div
        className={`
          w-full rounded-lg p-3.5 flex justify-between items-center gap-3 border mb-2
          ${
            isDark
              ? "bg-[#020617] border-[#1e293b]"
              : "bg-white border-slate-200"
          }
        `}
      >
        <div className="flex flex-col gap-1">
          <h1
            className={`
              text-[14px] font-semibold m-0 tracking-wide
              ${
                isDark
                  ? "text-[#f8fafc]"
                  : "text-gray-900"
              }
            `}
          >
            Endpoint Details
          </h1>

          <p
            className={`
              text-[10px] m-0
              ${
                isDark
                  ? "text-[#94a3b8]"
                  : "text-gray-500"
              }
            `}
          >
            System Configuration For <span style={{ color: isDark ? "#818cf8" : "#4f46e5", fontWeight: 600 }}>{hostName}</span>
          </p>
        </div>

        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            background: "transparent",
            border: "none", 
            color: "inherit",
            cursor: "pointer",
            padding: "6px 8px",
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "background 0.2s"
          }}
          className="text-gray-500 dark:text-[#94a3b8] hover:bg-gray-100 dark:hover:bg-[#0b1120] hover:text-gray-900 dark:hover:text-[#f8fafc]"
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
          <RAMUtilization
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
      <div style={{ marginTop: 8 }}>
        <HardwareDetails isDark={isDark} hostName={hostName} onLoad={setHardware} />
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .device-detail-container {
          width: 100%;
          min-height: 100vh;
          padding: 8px;
          font-family: "Inter", system-ui, sans-serif;
        }

        /* CPU & RAM */
        .device-utilization-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          margin-bottom: 8px;
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
          gap: 8px;
          margin-bottom: 8px;
          align-items: stretch;
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
          border-radius: 50%;
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