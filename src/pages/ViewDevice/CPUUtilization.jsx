import React, { useState } from "react";
import { Cpu, CalendarDays, Minus } from "lucide-react";
import {
  ZOOM_OPTIONS,
  buildLinePoints,
  formatStamp,
  getChartRange,
  getTimeTicks,
  toRatio,
} from "./cpuRamChart";

// Chart y coordinates: 0% sits at y=106, 100% at y=10
const toChartY = (value) => 106 - value * 0.96;
const toBrushY = (value) => 25 - value * 0.22;

function CPUUtilization({ cores, baseSpeed, samples = [], status = "connecting" }) {
  const [zoom, setZoom] = useState("1M");

  const latest = samples[samples.length - 1];
  const cpuUsage = latest?.cpuUsage;
  const isLive = status === "live";

  const range = getChartRange(samples, zoom);
  const fullRange = getChartRange(samples, "All");
  const dynamicPointsStr = buildLinePoints(samples, "cpuUsage", range, toChartY);
  const brushPointsStr = buildLinePoints(samples, "cpuUsage", fullRange, toBrushY);

  // Zoom window highlighted on the mini chart
  const brushX = fullRange
    ? ((range.start - fullRange.start) / (fullRange.end - fullRange.start)) * 360
    : 0;
  const brushWidth = 360 - brushX;

  const styles = {
    card: {
      width: "100%",
      minWidth: 0,
      padding: 16,
      boxSizing: "border-box",
      color: "#e8eef7",
      background: "#020617",
      border: "1px solid #25374a",
      borderRadius: 14,
      fontFamily: "Inter, system-ui, sans-serif",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
      marginBottom: 14,
    },
    heading: {
      display: "flex",
      alignItems: "center",
      gap: 10,
    },
    iconBox: {
      width: 38,
      height: 38,
      display: "grid",
      placeItems: "center",
      color: "#00e5aa",
      background: "#073b39",
      border: "1px solid #07594e",
      borderRadius: 9,
    },
    title: {
      margin: 0,
      fontSize: 14,
      fontWeight: 650,
    },
    subtitle: {
      margin: "4px 0 0",
      color: "#8da2b9",
      fontSize: 11,
    },
    date: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      color: "#c4d0df",
      fontSize: 9,
      whiteSpace: "nowrap",
    },
    main: {
      display: "grid",
      gridTemplateColumns: "minmax(120px, 0.85fr) minmax(0, 1.65fr)",
      alignItems: "center",
      gap: 18,
    },
    gaugeSection: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 9,
    },
    gauge: {
      width: "100%",
      maxWidth: 170,
      aspectRatio: "1",
      position: "relative",
    },
    gaugeSvg: {
      width: "100%",
      height: "100%",
    },
    gaugeCenter: {
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 5,
    },
    live: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "4px 10px",
      color: "#00e7aa",
      background: "#06342f",
      borderRadius: 20,
      fontSize: 10,
    },
    chartSection: {
      minWidth: 0,
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginBottom: 8,
      fontSize: 10,
      color: "#9aadc4",
    },
    chart: {
      position: "relative",
      paddingLeft: 31,
      paddingBottom: 23,
    },
    yLabels: {
      position: "absolute",
      top: 0,
      bottom: 23,
      left: 0,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      color: "#8ca0b8",
      fontSize: 9,
    },
    chartSvg: {
      display: "block",
      width: "100%",
      height: 115,
    },
    xLabels: {
      position: "absolute",
      bottom: 0,
      left: 31,
      right: 0,
      display: "flex",
      justifyContent: "space-between",
      gap: 4,
      color: "#879ab2",
      fontSize: 8,
    },
    metrics: {
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      marginTop: 16,
      paddingTop: 12,
      borderTop: "1px solid #223247",
    },
    metric: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
      padding: "0 12px",
      borderRight: "1px solid #24364a",
    },
    metricLabel: {
      color: "#91a4bc",
      fontSize: 10,
    },
    metricValue: {
      color: "#f0f4fc",
      fontSize: 15,
      fontWeight: 650,
    },
    button: {
      padding: "3px 8px",
      color: "#c2d0e0",
      background: "#152336",
      border: "1px solid #2b3b50",
      borderRadius: 4,
      fontSize: 9,
      cursor: "pointer",
    },
    activeButton: {
      color: "#8fc4ff",
      background: "#183b5e",
      border: "1px solid #3b75ad",
    },
  };

  return (
    <div style={styles.card}>
      <style>{`
        @media (max-width: 560px) {
          .cpu-main-layout {
            grid-template-columns: 1fr !important;
          }
          .cpu-gauge-responsive {
            max-width: 150px !important;
          }
          .cpu-metric-responsive {
            padding-left: 8px !important;
            padding-right: 8px !important;
          }
          .cpu-metric-value {
            font-size: 13px !important;
          }
          .cpu-date-responsive {
            white-space: normal !important;
          }
        }
      `}</style>

      <div style={styles.header}>
        <div style={styles.heading}>
          <div style={styles.iconBox}>
            <Cpu size={22} />
          </div>

          <div>
            <h3 style={styles.title}>CPU Utilization</h3>
            <p style={styles.subtitle}>Real-time utilization</p>
          </div>
        </div>

        <div style={styles.date} className="cpu-date-responsive">
          <CalendarDays size={12} />
          <span>{formatStamp(latest?.time)}</span>
          <button
            aria-label="Collapse"
            style={{
              display: "grid",
              placeItems: "center",
              width: 22,
              height: 22,
              padding: 0,
              color: "#bdcadd",
              background: "#172538",
              border: "1px solid #2a3a4f",
              borderRadius: 5,
            }}
          >
            <Minus size={13} />
          </button>
        </div>
      </div>

      <div style={styles.main} className="cpu-main-layout">
        <div style={styles.gaugeSection}>
          <div
            style={styles.gauge}
            className="cpu-gauge-responsive"
          >
            <svg viewBox="0 0 160 160" style={styles.gaugeSvg}>
              <defs>
                <linearGradient id="cpuGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00e6a2" />
                  <stop offset="100%" stopColor="#08a987" />
                </linearGradient>
              </defs>

              <circle
                cx="80"
                cy="80"
                r="65"
                fill="none"
                stroke="#29394c"
                strokeWidth="11"
              />

              <circle
                cx="80"
                cy="80"
                r="65"
                fill="none"
                stroke="url(#cpuGradient)"
                strokeWidth="11"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 65 * toRatio(cpuUsage)} ${2 * Math.PI * 65}`}
                transform="rotate(-90 80 80)"
              />

              <circle cx="80" cy="15" r="5" fill="#12e5b0" />
            </svg>

            <div style={styles.gaugeCenter}>
              <strong style={{ fontSize: 36, lineHeight: 1 }}>
                {cpuUsage === undefined ? (
                  "-"
                ) : (
                  <>
                    {Number(cpuUsage).toFixed(1)}
                    <span style={{ fontSize: 17 }}>%</span>
                  </>
                )}
              </strong>
              <small style={{ marginTop: 6, color: "#9cb0c8", fontSize: 10 }}>
                CPU Usage
              </small>
            </div>
          </div>

          <div
            style={{
              ...styles.live,
              ...(isLive ? {} : { color: "#9cb0c8", background: "#172538" }),
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                background: isLive ? "#00e5aa" : "#9cb0c8",
                borderRadius: "50%",
              }}
            />
            {isLive ? "Live" : status === "connecting" ? "Connecting" : "Offline"}
          </div>
        </div>

        <div style={styles.chartSection}>
          <div style={styles.toolbar}>
            <span style={{ marginRight: 2 }}>Zoom</span>
            {ZOOM_OPTIONS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setZoom(item)}
                style={{
                  ...styles.button,
                  ...(zoom === item ? styles.activeButton : {}),
                }}
              >
                {item}
              </button>
            ))}
          </div>

          <div style={styles.chart}>
            <div style={styles.yLabels}>
              <span>100%</span>
              <span>50%</span>
              <span>0%</span>
            </div>

            <svg
              viewBox="0 0 360 135"
              preserveAspectRatio="none"
              style={styles.chartSvg}
            >
              {[10, 57, 106].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="360"
                  y2={y}
                  stroke="#26364a"
                  strokeDasharray="2 3"
                />
              ))}

              {[0, 120, 240, 360].map((x) => (
                <line
                  key={x}
                  x1={x}
                  y1="0"
                  x2={x}
                  y2="120"
                  stroke="#26364a"
                  strokeDasharray="2 3"
                />
              ))}

              {/* Dynamic animated polyline */}
              <polyline
                points={dynamicPointsStr}
                fill="none"
                stroke="#00e6a2"
                strokeWidth="1.7"
                vectorEffect="non-scaling-stroke"
              />

              {latest && (
                <>
                  <circle cx="360" cy={toChartY(Number(cpuUsage) || 0)} r="3" fill="#00e6a2" />
                  <circle
                    cx="360"
                    cy={toChartY(Number(cpuUsage) || 0)}
                    r="7"
                    fill="none"
                    stroke="#00e6a2"
                    strokeOpacity="0.35"
                  />
                </>
              )}
            </svg>

                        <div style={styles.xLabels}>
              {getTimeTicks(range).map((time, index) => (
                <span key={index}>{time}</span>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginTop: 2,
            }}
          >
            <button style={styles.button}>‹</button>

            <svg
              viewBox="0 0 360 28"
              preserveAspectRatio="none"
              style={{ width: "100%", height: 27 }}
            >
              <rect
                x="0"
                y="2"
                width="360"
                height="24"
                rx="3"
                fill="#101e2c"
                stroke="#29394c"
              />

              <polyline
                points={brushPointsStr}
                fill="none"
                stroke="#00b995"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />

              {fullRange && (
                <>
                  <rect
                    x={brushX}
                    y="3"
                    width={brushWidth}
                    height="22"
                    rx="2"
                    fill="#254c70"
                    fillOpacity="0.65"
                    stroke="#527ca5"
                  />
                  <rect x={brushX} y="5" width="4" height="18" rx="1" fill="#8bc4ff" />
                  <rect x="356" y="5" width="4" height="18" rx="1" fill="#8bc4ff" />
                </>
              )}
            </svg>

            <button style={styles.button}>›</button>
          </div>
        </div>
      </div>

      <div style={styles.metrics}>
        {[
          { label: "Cores", value: cores ?? "-" },
          { label: "Base Speed", value: baseSpeed ?? "-" },
        ].map((metric, index) => (
          <div
            key={metric.label}
            style={{
              ...styles.metric,
              ...(index === 0 ? { paddingLeft: 0 } : {}),
              ...(index === 1 ? { paddingRight: 0, borderRight: "none" } : {}),
            }}
            className="cpu-metric-responsive"
          >
            <span style={styles.metricLabel}>{metric.label}</span>
            <strong style={styles.metricValue} className="cpu-metric-value">
              {metric.value}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CPUUtilization;