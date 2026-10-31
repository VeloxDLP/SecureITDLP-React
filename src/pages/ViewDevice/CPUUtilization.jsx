import React, { useState, useEffect } from "react";
import { Cpu, CalendarDays, Minus } from "lucide-react";

// Helper to generate a slightly varied static data point
const generatePoint = (index) => {
  const x = (index / 99) * 360;
  // Creates a subtle, realistic looking wave that hugs the bottom (0%)
  const y =
    106 +
    Math.sin(index * 0.7) * 0.7 +
    Math.sin(index * 0.19) * 0.8 +
    Math.cos(index * 1.7) * 0.25;
  return { x, y };
};

function CPUUtilization() {
  // Generate static initial data
  const [dataPoints, setDataPoints] = useState(() =>
    Array.from({ length: 100 }, (_, i) => generatePoint(i))
  );

  // Effect to simulate dynamic real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDataPoints((prev) => {
        // Remove the first point, shift everything left
        const newPoints = prev.slice(1);
        // Add a new point at the end based on a static mock formula
        const nextIndex = 100 + (Date.now() % 10); 
        newPoints.push({
          x: 360,
          y: 106 + Math.sin(nextIndex * 0.7) * 0.7 + Math.cos(nextIndex * 0.25) * 0.5,
        });
        
        // Recalculate X coordinates so the line stretches perfectly from 0 to 360
        return newPoints.map((p, i) => ({
          x: (i / 99) * 360,
          y: p.y
        }));
      });
    }, 1000); // Updates every 1 second

    return () => clearInterval(interval);
  }, []);

  // Convert the array of objects into the SVG polyline string format ("x,y x,y")
  const dynamicPointsStr = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

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
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
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
          <span>2026-Sep-25 5:17 PM</span>
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
                strokeDasharray={`${2 * Math.PI * 65 * 0.005} ${2 * Math.PI * 65}`}
                transform="rotate(-90 80 80)"
              />

              <circle cx="80" cy="15" r="5" fill="#12e5b0" />
            </svg>

            <div style={styles.gaugeCenter}>
              <strong style={{ fontSize: 36, lineHeight: 1 }}>
                0<span style={{ fontSize: 17 }}>%</span>
              </strong>
              <small style={{ marginTop: 6, color: "#9cb0c8", fontSize: 10 }}>
                CPU Usage
              </small>
            </div>
          </div>

          <div style={styles.live}>
            <span
              style={{
                width: 6,
                height: 6,
                background: "#00e5aa",
                borderRadius: "50%",
              }}
            />
            Live
          </div>
        </div>

        <div style={styles.chartSection}>
          <div style={styles.toolbar}>
            <span style={{ marginRight: 2 }}>Zoom</span>
            <button style={{ ...styles.button, ...styles.activeButton }}>1M</button>
            <button style={styles.button}>5M</button>
            <button style={styles.button}>All</button>
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

              {[0, 72, 144, 216, 288, 360].map((x) => (
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

              <circle cx="225" cy="106" r="3" fill="#00e6a2" />
              <circle
                cx="225"
                cy="106"
                r="7"
                fill="none"
                stroke="#00e6a2"
                strokeOpacity="0.35"
              />
              <circle cx="359" cy="106" r="3" fill="#00e6a2" />
            </svg>

            <div
              style={{
                position: "absolute",
                top: "28%",
                left: "40%",
                display: "flex",
                gap: 6,
                padding: 7,
                background: "#15283a",
                border: "1px solid #2d455e",
                borderRadius: 5,
                fontSize: 8,
              }}
            >
              <span style={{ color: "#00e5aa" }}>●</span>
              <div>
                <div>CPU Utilization: 0</div>
                <small style={{ color: "#9bb0c8" }}>
                  Wednesday, Oct 28, 18:07:48
                </small>
              </div>
            </div>

            <div style={styles.xLabels}>
              {["18:07:20", "18:07:30", "18:07:40", "18:07:50", "18:08:00", "18:08:10"].map(
                (time) => (
                  <span key={time}>{time}</span>
                )
              )}
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
                points={dynamicPointsStr} // Reusing the dynamic points for the mini chart for consistency
                fill="none"
                stroke="#00b995"
                strokeWidth="1"
                transform="scale(1, 0.15) translate(0, 160)" // Scaling down to fit the brush box
              />

              <rect
                x="285"
                y="3"
                width="58"
                height="22"
                rx="2"
                fill="#254c70"
                fillOpacity="0.65"
                stroke="#527ca5"
              />
              <rect x="282" y="5" width="4" height="18" rx="1" fill="#8bc4ff" />
              <rect x="342" y="5" width="4" height="18" rx="1" fill="#8bc4ff" />
            </svg>

            <button style={styles.button}>›</button>
          </div>
        </div>
      </div>

      <div style={styles.metrics}>
        {[
          { label: "Cores", value: "8 / 16" },
          { label: "Frequency", value: "3.2 GHz" },
          { label: "Temperature", value: "56 °C" },
        ].map((metric, index) => (
          <div
            key={metric.label}
            style={{
              ...styles.metric,
              ...(index === 0 ? { paddingLeft: 0 } : {}),
              ...(index === 2 ? { paddingRight: 0, borderRight: "none" } : {}),
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