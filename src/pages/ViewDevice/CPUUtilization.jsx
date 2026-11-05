import React, { useState } from "react";
import { Cpu, Activity, Server } from "lucide-react";
import {
  ZOOM_OPTIONS,
  buildLinePoints,
  formatPercent,
  formatStamp,
  getChartRange,
  getTimeTicks,
  getOneMinuteChange,
} from "./cpuRamChart";

const toChartY = (value) => 106 - value * 0.96;

function CPUUtilization({ isDark, cores, baseSpeed, samples = [], status = "connecting" }) {
  const [zoom, setZoom] = useState("1M");

  const latest = samples[samples.length - 1];
  const cpuUsage = latest?.cpuUsage;
  const isLive = status === "live";
  
  // Calculate the change over the last 1 minute
  const change = getOneMinuteChange(samples, "cpuUsage");

  const range = getChartRange(samples, zoom);
  const dynamicPointsStr = buildLinePoints(samples, "cpuUsage", range, toChartY);

  // Theme Colors
  const theme = {
    bg: isDark ? "#020617" : "#ffffff",
    border: isDark ? "#25374a" : "#e2e8f0",
    text: isDark ? "#e8eef7" : "#0f172a",
    textMuted: isDark ? "#8da2b9" : "#64748b",
    gridLine: isDark ? "#26364a" : "#e2e8f0",
    btnActive: isDark ? "#1e3a8a" : "#dbeafe",
    btnActiveText: isDark ? "#93c5fd" : "#1d4ed8",
    btnDefault: isDark ? "#152336" : "#f1f5f9",
    btnDefaultText: isDark ? "#c2d0e0" : "#64748b",
    accent: "#2f73e2", 
    graphColor: "#00e6a2", 
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: 16, boxSizing: "border-box", color: theme.text, background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 14, fontFamily: "Inter, system-ui, sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, display: "grid", placeItems: "center", color: theme.accent, background: isDark ? "#0a1e38" : "#eff6ff", border: `1px solid ${isDark ? "#1e3a8a" : "#bfdbfe"}`, borderRadius: 9 }}>
            <Cpu size={22} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 650 }}>CPU Utilization</h3>
            <p style={{ margin: "4px 0 0", color: theme.textMuted, fontSize: 11 }}>Real-time utilization</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", background: isLive ? (isDark ? "#1e293b" : "#eff6ff") : (isDark ? "#1e293b" : "#f1f5f9"), color: isLive ? theme.accent : theme.btnDefaultText, borderRadius: 20, fontSize: 10 }}>
            <span style={{ width: 6, height: 6, background: isLive ? theme.accent : theme.btnDefaultText, borderRadius: "50%" }} />
            {isLive ? "Live" : status === "connecting" ? "Connecting" : "Offline"}
          </div>
          <span style={{ color: theme.textMuted, fontSize: 10 }}>
            {formatStamp(latest?.time)}
          </span>
        </div>
      </div>

      {/* Main Chart Area */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, justifyContent: "center" }}>
        <div style={{ minWidth: 0, position: "relative" }}>
          
          {/* Zoom buttons matching RAM layout */}
          <div style={{ position: "absolute", top: -25, right: 0, display: "flex", alignItems: "center", gap: 4, fontSize: 9 }}>
            <span style={{ color: theme.textMuted, padding: "2px 4px", marginRight: 2 }}>Zoom</span>
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

          <div style={{ position: "relative", paddingLeft: 31, paddingBottom: 23 }}>
            <div style={{ position: "absolute", top: 0, bottom: 23, left: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", color: theme.textMuted, fontSize: 9 }}>
              <span>100%</span><span>50%</span><span>0%</span>
            </div>
            <svg viewBox="0 0 360 135" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 135 }}>
              {[10, 57, 106].map((y) => <line key={y} x1="0" y1={y} x2="360" y2={y} stroke={theme.gridLine} strokeDasharray="2 3" />)}
              {[0, 120, 240, 360].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="120" stroke={theme.gridLine} strokeDasharray="2 3" />)}
              
              {/* Green Graph Line */}
              <polyline points={dynamicPointsStr} fill="none" stroke={theme.graphColor} strokeWidth="1.7" vectorEffect="non-scaling-stroke" />
              {latest && (
                <>
                  <circle cx="360" cy={toChartY(Number(cpuUsage) || 0)} r="3" fill={theme.graphColor} />
                  <circle cx="360" cy={toChartY(Number(cpuUsage) || 0)} r="7" fill="none" stroke={theme.graphColor} strokeOpacity="0.35" />
                </>
              )}
            </svg>
            <div style={{ position: "absolute", bottom: 0, left: 31, right: 0, display: "flex", justifyContent: "space-between", gap: 4, color: theme.textMuted, fontSize: 8 }}>
              {getTimeTicks(range).map((time, index) => <span key={index}>{time}</span>)}
            </div>
          </div>
        </div>
      </div>

      {/* Footer metrics (3 columns like RAM) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: "auto", paddingTop: 12, borderTop: `1px solid ${theme.gridLine}` }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <Cpu size={16} color={theme.accent} style={{ marginTop: 2 }} />
          <div>
            <p style={{ margin: 0, fontSize: 9, color: theme.textMuted }}>Cores</p>
            <p style={{ margin: "2px 0", fontSize: 13, fontWeight: 650, color: theme.text }}>{cores ?? "-"}</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <Server size={16} color="#3b82f6" style={{ marginTop: 2 }} />
          <div>
            <p style={{ margin: 0, fontSize: 9, color: theme.textMuted }}>Base Speed</p>
            <p style={{ margin: "2px 0", fontSize: 13, fontWeight: 650, color: theme.text }}>{baseSpeed ?? "-"}</p>
          </div>
        </div>

        {/* Updated Usage Column with Red/Green indicator */}
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <Activity size={16} color={theme.accent} style={{ marginTop: 2 }} />
          <div>
            <p style={{ margin: 0, fontSize: 9, color: theme.textMuted }}>Usage</p>
            <p style={{ margin: "2px 0", fontSize: 13, fontWeight: 650, color: theme.text }}>{formatPercent(cpuUsage)}</p>
            {change !== null && (
              <p style={{ margin: 0, fontSize: 9, color: change > 0 ? "#ef4444" : "#10b981" }}>
                {change > 0 ? "▲" : "▼"} {Math.abs(change).toFixed(1)}% (1 min)
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CPUUtilization;