import React, { useState } from "react";
import { Cpu, Database, CalendarDays, CircleGauge } from "lucide-react";

function RAMUtilization() {
  const [zoom, setZoom] = useState("1M");

  const chartPoints = Array.from({ length: 100 }, (_, i) => {
    const x = (i / 99) * 360;
    const base = 30;
    const peaks = [4, 14, 27, 39, 53, 70, 88, 98];
    let peak = 0;

    peaks.forEach((p) => {
      const distance = Math.abs(i - p);
      peak += Math.max(0, 18 - distance * 2.2);
    });

    const y = base + Math.sin(i * 0.25) * 2 + peak * 0.6;
    return `${x},${Math.min(y, 65)}`;
  }).join(" ");

  const styles = {
    card: {
      width: "100%",
      minWidth: 0,
      padding: 16,
      boxSizing: "border-box",
      color: "#e8edff",
      background: "#020617",            // 👈 CARD BACKGROUND
      border: "1px solid #1d2b43",
      borderRadius: 12,
      fontFamily: "Inter, system-ui, sans-serif",
      overflow: "hidden",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      marginBottom: 12,
    },
    heading: {
      display: "flex",
      alignItems: "center",
      gap: 10,
    },
    iconBox: {
      display: "grid",
      placeItems: "center",
      width: 34,
      height: 34,
      color: "#bb8aff",
      background: "#34205c",
      border: "1px solid #51318a",
      borderRadius: 8,
      flexShrink: 0,
    },
    title: {
      margin: 0,
      color: "#f3f5ff",
      fontSize: 13,
      fontWeight: 650,
    },
    subtitle: {
      margin: "3px 0 0",
      color: "#91a3c3",
      fontSize: 10,
    },
    headerRight: {
      display: "flex",
      alignItems: "center",
      gap: 10,
    },
    live: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      padding: "5px 9px",
      color: "#c69aff",
      background: "#020617",            // 👈 LIVE BADGE BACKGROUND
      borderRadius: 20,
      fontSize: 9,
    },
    date: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      color: "#a3b2cf",
      fontSize: 8,
      whiteSpace: "nowrap",
    },
    collapse: {
      display: "grid",
      placeItems: "center",
      width: 20,
      height: 22,
      color: "#aab8d0",
      background: "#020617",            // 👈 COLLAPSE BUTTON BACKGROUND
      border: "1px solid #293b56",
      borderRadius: 4,
      fontSize: 15,
    },
    main: {
      display: "grid",
      gridTemplateColumns: "minmax(120px, 0.8fr) minmax(0, 1.8fr)",
      gap: 15,
      alignItems: "center",
    },
    gaugeSection: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    gauge: {
      width: "100%",
      maxWidth: 145,
      aspectRatio: "1",
      position: "relative",
    },
    gaugeCenter: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    },
    percentage: {
      color: "#f2f4ff",
      fontSize: 23,
      fontWeight: 700,
      lineHeight: 1.1,
    },
    used: {
      marginTop: 5,
      color: "#a0b0cf",
      fontSize: 9,
    },
    chartSection: {
      minWidth: 0,
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      marginBottom: 8,
    },
    zoomLabel: {
      color: "#9aaccb",
      fontSize: 9,
      marginRight: 3,
    },
    zoomButton: {
      padding: "3px 7px",
      color: "#d4dcf4",
      background: "#121f34",
      border: "1px solid #293b57",
      borderRadius: 4,
      fontSize: 8,
      cursor: "pointer",
    },
    chart: {
      position: "relative",
      paddingLeft: 26,
      paddingBottom: 22,
    },
    yLabels: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 22,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      color: "#91a4c5",
      fontSize: 8,
    },
    svg: {
      display: "block",
      width: "100%",
      height: 115,
      overflow: "visible",
    },
    xLabels: {
      position: "absolute",
      left: 26,
      right: 0,
      bottom: 0,
      display: "flex",
      justifyContent: "space-between",
      color: "#8498ba",
      fontSize: 8,
    },
    footer: {
      display: "grid",
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
      gap: 0,
      marginTop: 13,
      paddingTop: 12,
      borderTop: "1px solid #1d2b40",
    },
    metric: {
      display: "flex",
      gap: 8,
      padding: "0 10px",
      minWidth: 0,
      borderRight: "1px solid #1c2b40",
    },
    metricIcon: {
      flexShrink: 0,
      color: "#a16bff",
      marginTop: 1,
    },
    metricLabel: {
      color: "#a0b1d0",
      fontSize: 8,
      whiteSpace: "nowrap",
    },
    metricValue: {
      display: "block",
      marginTop: 3,
      color: "#f0f3ff",
      fontSize: 13,
      fontWeight: 650,
      whiteSpace: "nowrap",
    },
    metricSub: {
      marginTop: 4,
      color: "#8095b8",
      fontSize: 8,
      whiteSpace: "nowrap",
    },
  };

  return (
    <div style={styles.card}>
      <style>{`
        @media (max-width: 580px) {
          .ram-main {
            grid-template-columns: 1fr !important;
          }
          .ram-gauge {
            max-width: 145px !important;
          }
          .ram-footer {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            row-gap: 14px;
          }
          .ram-metric:nth-child(2) {
            border-right: none !important;
          }
          .ram-metric:nth-child(3),
          .ram-metric:nth-child(4) {
            padding-top: 10px;
          }
          .ram-header-date {
            display: none !important;
          }
        }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.heading}>
          <div style={styles.iconBox}>
            <Cpu size={21} />
          </div>
          <div>
            <h3 style={styles.title}>RAM Utilization</h3>
            <p style={styles.subtitle}>Real-time usage</p>
          </div>
        </div>

        <div style={styles.headerRight}>
          <div style={styles.live}>
            <span
              style={{
                width: 6,
                height: 6,
                background: "#bd75ff",
                borderRadius: "50%",
              }}
            />
            Live
          </div>

          <div style={styles.date} className="ram-header-date">
            <CalendarDays size={11} />
            2026-Sep-25 5:17 PM
          </div>

          <button style={styles.collapse} aria-label="Collapse">
            −
          </button>
        </div>
      </div>

      {/* Gauge and chart */}
      <div style={styles.main} className="ram-main">
        <div style={styles.gaugeSection}>
          <div style={styles.gauge} className="ram-gauge">
            <svg viewBox="0 0 150 150" width="100%" height="100%">
              <defs>
                <linearGradient id="ramGaugeGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1595ff" />
                  <stop offset="55%" stopColor="#397cff" />
                  <stop offset="100%" stopColor="#a05bff" />
                </linearGradient>
              </defs>

              <circle
                cx="75"
                cy="75"
                r="59"
                fill="none"
                stroke="#26354d"
                strokeWidth="11"
              />

              <circle
                cx="75"
                cy="75"
                r="59"
                fill="none"
                stroke="url(#ramGaugeGradient)"
                strokeWidth="11"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 59 * 0.96} ${2 * Math.PI * 59}`}
                transform="rotate(-90 75 75)"
              />

              <circle cx="75" cy="16" r="5" fill="#6fb5ff" />
            </svg>

            <div style={styles.gaugeCenter}>
              <strong style={styles.percentage}>96.0%</strong>
              <span style={styles.used}>Used</span>
            </div>
          </div>
        </div>

        <div style={styles.chartSection}>
          <div style={styles.toolbar}>
            <span style={styles.zoomLabel}>Zoom</span>
            {["1M", "5M", "All"].map((item) => (
              <button
                key={item}
                onClick={() => setZoom(item)}
                style={{
                  ...styles.zoomButton,
                  ...(zoom === item
                    ? {
                        color: "#fff",
                        background: "#394da4",
                        borderColor: "#697df4",
                      }
                    : {}),
                }}
              >
                {item}
              </button>
            ))}
          </div>

          <div style={styles.chart}>
            <div style={styles.yLabels}>
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>

            <svg
              viewBox="0 0 360 125"
              preserveAspectRatio="none"
              style={styles.svg}
            >
              <defs>
                <linearGradient id="ramAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#3267f7" stopOpacity="0.08" />
                </linearGradient>
                <filter id="ramGlow">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {[0, 31, 62, 93, 124].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="360"
                  y2={y}
                  stroke="#293851"
                  strokeDasharray="2 3"
                />
              ))}

              {[0, 60, 120, 180, 240, 300, 359].map((x) => (
                <line
                  key={x}
                  x1={x}
                  y1="0"
                  x2={x}
                  y2="124"
                  stroke="#223149"
                  strokeDasharray="2 3"
                />
              ))}

              <polygon
                points={`0,124 ${chartPoints} 360,124`}
                fill="url(#ramAreaGradient)"
              />

              <polyline
                points={chartPoints}
                fill="none"
                stroke="#a16cff"
                strokeWidth="2"
                strokeLinejoin="round"
                filter="url(#ramGlow)"
                vectorEffect="non-scaling-stroke"
              />

              <circle cx="359" cy="30" r="3.5" fill="#c6a0ff" />
              <circle
                cx="359"
                cy="30"
                r="6"
                fill="none"
                stroke="#a16cff"
                strokeOpacity="0.4"
              />
            </svg>

            <div style={styles.xLabels}>
              {["17:12", "17:13", "17:14", "17:15", "17:16", "17:17"].map(
                (time) => (
                  <span key={time}>{time}</span>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Memory statistics */}
      <div style={styles.footer} className="ram-footer">
        <div style={styles.metric} className="ram-metric">
          <Database size={16} style={styles.metricIcon} />
          <div>
            <div style={styles.metricLabel}>Used Memory</div>
            <strong style={styles.metricValue}>15.36 GB</strong>
            <div style={styles.metricSub}>of 16.00 GB</div>
          </div>
        </div>

        <div style={styles.metric} className="ram-metric">
          <Database size={16} style={{ ...styles.metricIcon, color: "#249bff" }} />
          <div>
            <div style={styles.metricLabel}>Free Memory</div>
            <strong style={styles.metricValue}>0.64 GB</strong>
            <div style={styles.metricSub}>of 16.00 GB</div>
          </div>
        </div>

        <div style={styles.metric} className="ram-metric">
          <CircleGauge size={16} style={{ ...styles.metricIcon, color: "#7765ff" }} />
          <div>
            <div style={styles.metricLabel}>Usage</div>
            <strong style={styles.metricValue}>96.0%</strong>
            <div style={{ ...styles.metricSub, color: "#6fa7ff" }}>
              ▲ +2.4% (1min)
            </div>
          </div>
        </div>

        <div
          style={{ ...styles.metric, borderRight: "none" }}
          className="ram-metric"
        >
          <Cpu size={16} style={{ ...styles.metricIcon, color: "#765dff" }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={styles.metricLabel}>Total Memory</div>
            <strong style={styles.metricValue}>16.00 GB</strong>
            <div
              style={{
                height: 6,
                marginTop: 5,
                background: "#26354d",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "96%",
                  height: "100%",
                  background: "linear-gradient(90deg, #8d73ff, #c38cff)",
                  borderRadius: 8,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RAMUtilization;