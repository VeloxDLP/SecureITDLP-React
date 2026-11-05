import React, { useState } from "react";
import { Database, Activity, HardDrive, Server } from "lucide-react";
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

const toRamChartY = (value) => 120 - value * 1.2;

const formatRam = (mb) => {
  const value = Number(mb ?? NaN);
  return Number.isFinite(value) ? `${(value / 1024).toFixed(2)} GB` : "-";
};

function RAMUtilization({ isDark, totalMemory = "-", samples = [], status = "connecting" }) {
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
    gridLine: isDark ? "#1e293b" : "#e2e8f0",
    btnActive: isDark ? "#1e3a8a" : "#dbeafe",
    btnActiveText: isDark ? "#93c5fd" : "#1d4ed8",
    btnDefault: isDark ? "#1e293b" : "#f1f5f9",
    btnDefaultText: isDark ? "#94a3b8" : "#64748b",
    accent: "#2f73e2", 
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: theme.bg, borderRadius: 14, padding: 16, boxSizing: "border-box", border: `1px solid ${theme.border}`, color: theme.text, fontFamily: "Inter, system-ui, sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, background: isDark ? "#1e293b" : "#eff6ff", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", color: theme.accent }}>
            <Database size={22} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 650, color: theme.text }}>RAM Utilization</h3>
            <p style={{ margin: "4px 0 0", fontSize: 11, color: theme.textMuted }}>Real-time utilization</p>
          </div>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", background: isLive ? (isDark ? "#1e293b" : "#eff6ff") : theme.btnDefault, color: isLive ? theme.accent : theme.btnDefaultText, borderRadius: 20, fontSize: 10 }}>
            <span style={{ width: 6, height: 6, background: isLive ? theme.accent : theme.btnDefaultText, borderRadius: "50%" }} /> {isLive ? "Live" : status === "connecting" ? "Connecting" : "Offline"}
          </div>
          <span style={{ color: theme.textMuted, fontSize: 10 }}>
            {formatStamp(latest?.time)}
          </span>
        </div>
      </div>

      {/* Main Body */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16, flex: 1, justifyContent: "center" }}>
        
        {/* Line Chart */}
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", top: -25, right: 0, display: "flex", gap: 4, fontSize: 9 }}>
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
                  borderRadius: 4,
                  padding: "2px 6px",
                  cursor: "pointer",
                }}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Added paddingLeft: 31 to match CPU card layout */}
          <div style={{ position: "relative", paddingLeft: 31, paddingBottom: 23 }}>
            
            {/* Y-Axis Labels (Added 100%, 50%, 0%) */}
            <div style={{ position: "absolute", top: 0, bottom: 23, left: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", color: theme.textMuted, fontSize: 9 }}>
              <span>100%</span>
              <span>50%</span>
              <span>0%</span>
            </div>

            <svg viewBox="0 0 360 120" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 120, overflow: "visible" }}>
              {[0, 60, 120].map(y => <line key={y} x1="0" y1={y} x2="360" y2={y} stroke={theme.gridLine} strokeDasharray="3 3" />)}
              {[0, 60, 120, 180, 240, 300, 359].map((x) => (
                <line key={x} x1={x} y1="0" x2={x} y2="120" stroke={theme.gridLine} strokeDasharray="3 3" />
              ))}
              <defs>
                <linearGradient id="ramArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={theme.accent} stopOpacity={isDark ? "0.4" : "0.2"} />
                  <stop offset="100%" stopColor={theme.accent} stopOpacity="0" />
                </linearGradient>
              </defs>
              {linePoints && (
                <>
                  <polygon points={`${firstX},120 ${linePoints} 360,120`} fill="url(#ramArea)" />
                  <polyline points={linePoints} fill="none" stroke={theme.accent} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
                  <circle cx="360" cy={toRamChartY(Number(ramUsage) || 0)} r="3" fill={theme.accent} />
                </>
              )}
            </svg>
            
            <div style={{ position: "absolute", left: 31, right: 0, bottom: 0, display: "flex", justifyContent: "space-between", fontSize: 8, color: theme.textMuted }}>
              {getTimeTicks(range).map((time, index) => (
                <span key={index}>{time}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer (4 Columns like CPU) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, borderTop: `1px solid ${theme.border}`, paddingTop: 12, marginTop: "auto" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <Database size={16} color={theme.accent} style={{ marginTop: 2 }} />
          <div>
            <p style={{ margin: 0, fontSize: 9, color: theme.textMuted }}>Used Memory</p>
            <p style={{ margin: "2px 0", fontSize: 13, fontWeight: 650, color: theme.text }}>{formatRam(latest?.ramUsedMb)}</p>
            <p style={{ margin: 0, fontSize: 9, color: theme.textMuted }}>of {totalMemory}</p>
          </div>
        </div>
        
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <Server size={16} color="#3b82f6" style={{ marginTop: 2 }} />
          <div>
            <p style={{ margin: 0, fontSize: 9, color: theme.textMuted }}>Free Memory</p>
            <p style={{ margin: "2px 0", fontSize: 13, fontWeight: 650, color: theme.text }}>{formatRam(latest?.ramFreeMb)}</p>
            <p style={{ margin: 0, fontSize: 9, color: theme.textMuted }}>of {totalMemory}</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <Activity size={16} color={theme.accent} style={{ marginTop: 2 }} />
          <div>
            <p style={{ margin: 0, fontSize: 9, color: theme.textMuted }}>Usage</p>
            <p style={{ margin: "2px 0", fontSize: 13, fontWeight: 650, color: theme.text }}>{formatPercent(ramUsage)}</p>
            {change !== null && <p style={{ margin: 0, fontSize: 9, color: change > 0 ? "#ef4444" : "#10b981" }}>{change > 0 ? "▲" : "▼"} {Math.abs(change).toFixed(1)}% (1 min)</p>}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <HardDrive size={16} color={theme.textMuted} style={{ marginTop: 2 }} />
          <div style={{ width: "100%" }}>
            <p style={{ margin: 0, fontSize: 9, color: theme.textMuted }}>Total Memory</p>
            <p style={{ margin: "2px 0", fontSize: 13, fontWeight: 650, color: theme.text }}>{totalMemory}</p>
            <div style={{ width: "100%", height: 4, background: theme.gridLine, borderRadius: 2, marginTop: 4 }}>
              <div style={{ width: `${toRatio(ramUsage) * 100}%`, height: "100%", background: theme.accent, borderRadius: 2 }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RAMUtilization;