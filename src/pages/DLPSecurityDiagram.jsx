/**
 * DLPSecurityDiagram.jsx
 * Faithful recreation with original layout + smooth professional animations
 */
import React from "react";

const SATS = [
  { id: "network", label: ["Network", "Protection"], angle: -118, dist: 198, delay: "0s", labelSide: "left" },
  { id: "web", label: ["Web", "Control"], angle: -48, dist: 185, delay: "0.5s", labelSide: "right" },
  { id: "dataclass", label: ["Data", "Classification"], angle: 38, dist: 192, delay: "1.0s", labelSide: "right" },
  { id: "email", label: ["Email", "DLP"], angle: 88, dist: 172, delay: "1.5s", labelSide: "right" },
  { id: "endpoint", label: ["Endpoint", "DLP"], angle: 155, dist: 175, delay: "2.0s", labelSide: "left" },
];

const toRad = (d) => (d * Math.PI) / 180;
const CX = 300, CY = 300;

function satXY(sat) {
  return {
    x: CX + Math.cos(toRad(sat.angle)) * sat.dist,
    y: CY + Math.sin(toRad(sat.angle)) * sat.dist,
  };
}

// ==================== ICONS ====================
function IconNetwork() {
  const s = 16;
  return (
    <g stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round">
      {[-90, 180, -25, -155].map((a, i) => {
        const x = Math.cos(toRad(a)) * s * 0.95;
        const y = Math.sin(toRad(a)) * s * 0.95;
        return (
          <g key={i}>
            <line x1={0} y1={0} x2={x} y2={y} />
            <circle cx={x} cy={y} r={s * 0.18} />
          </g>
        );
      })}
      <circle cx={0} cy={0} r={s * 0.28} />
    </g>
  );
}

function IconWeb() {
  const s = 16;
  return (
    <g stroke="currentColor" strokeWidth="1.8" fill="none">
      <circle cx={0} cy={0} r={s} />
      <ellipse cx={0} cy={0} rx={s * 0.45} ry={s} />
      <line x1={-s} y1={0} x2={s} y2={0} />
    </g>
  );
}

function IconDataClass() {
  const s = 16;
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = toRad(i * 60 - 30);
    return `${Math.cos(a) * s},${Math.sin(a) * s}`;
  }).join(" ");
  return (
    <g stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polygon points={pts} />
      <line x1={0} y1={-s * 0.45} x2={0} y2={s * 0.45} />
      <polyline points={`-${s*0.25},${s*0.3} 0,${-s*0.3-1} ${s*0.25},${s*0.3}`} />
      <polyline points={`-${s*0.25},${-s*0.3} 0,${s*0.3+1} ${s*0.25},${-s*0.3}`} />
    </g>
  );
}

function IconEmail() {
  const s = 16;
  return (
    <g stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x={-s} y={-s * 0.55} width={s * 2} height={s * 1.1} rx={3} />
      <polyline points={`-${s},${-s*0.55} 0,${-s*0.1} ${s},${-s*0.55}`} />
      <circle cx={s*0.45} cy={s*0.1} r={s*0.35} fill="#050d1e" />
    </g>
  );
}

function IconEndpoint() {
  const s = 16;
  const cell = s * 0.48;
  const gap = s * 0.08;
  const cells = [[-1,-1],[0,-1],[-1,0],[0,0]];
  return (
    <g stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round">
      {cells.map(([gx, gy], i) => {
        const ox = gx * (cell + gap);
        const oy = gy * (cell + gap);
        return (
          <g key={i}>
            <rect x={ox} y={oy} width={cell} height={cell} rx={1.5} />
            {i === 3 && (
              <>
                <line x1={ox + cell * 0.25} y1={oy + cell / 2} x2={ox + cell * 0.75} y2={oy + cell / 2} />
                <line x1={ox + cell / 2} y1={oy + cell * 0.25} x2={ox + cell / 2} y2={oy + cell * 0.75} />
              </>
            )}
          </g>
        );
      })}
    </g>
  );
}

const ICONS = {
  network: IconNetwork,
  web: IconWeb,
  dataclass: IconDataClass,
  email: IconEmail,
  endpoint: IconEndpoint,
};

// ==================== STYLES ====================
const CSS = `
  @keyframes dlp-breathe{0%,100%{opacity:.22;transform:scale(1)}50%{opacity:.58;transform:scale(1.04)}}
  @keyframes dlp-breathe2{0%,100%{opacity:.09;transform:scale(1)}50%{opacity:.27;transform:scale(1.07)}}
  @keyframes dlp-glow{0%,100%{opacity:.25}50%{opacity:.68}}
  @keyframes dlp-lock{0%,100%{transform:scale(1);opacity:.9}50%{transform:scale(1.035);opacity:1}}
  @keyframes dlp-dash{from{stroke-dashoffset:0}to{stroke-dashoffset:-90}}
  @keyframes dlp-conn{0%,100%{opacity:.35}50%{opacity:.78}}
  @keyframes dlp-sat-icon{0%,100%{transform:scale(1);opacity:.85}50%{transform:scale(1.07);opacity:1}}
  @keyframes dlp-sat-w1{0%{r:36px;opacity:0}12%{opacity:.52}82%{r:74px;opacity:0}100%{r:74px;opacity:0}}
`;

export default function DLPSecurityDiagram({ size = 620 }) {
  return (
    <div style={{ width: size, height: size, background: "#0a0e1a" }}>
      <style>{CSS}</style>
      <svg viewBox="0 0 600 600" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id="dlp-bg" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#1a3a6b" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#050d1e" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="dlp-disc" cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#1e4799" />
            <stop offset="100%" stopColor="#060f2a" />
          </radialGradient>
          <radialGradient id="dlp-sat" cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#183a80" />
            <stop offset="100%" stopColor="#05101f" />
          </radialGradient>
        </defs>

        {/* Ambient background glow */}
        <circle cx={CX} cy={CY} r={255} fill="url(#dlp-bg)" style={{ animation: "dlp-glow 4.2s ease-in-out infinite" }} />

        {/* Outer rings */}
        <circle cx={CX} cy={CY} r={202} fill="none" stroke="#2e64b8" strokeWidth="1.4" style={{ animation: "dlp-breathe 4.2s ease-in-out infinite" }} />
        <circle cx={CX} cy={CY} r={222} fill="none" stroke="#2a56a0" strokeWidth="0.9" style={{ animation: "dlp-breathe2 4.2s ease-in-out infinite 0.4s" }} />

        {/* Main structure */}
        <circle cx={CX} cy={CY} r={170} fill="none" stroke="#2e64b8" strokeWidth="2.5" strokeOpacity="0.75" />
        <circle cx={CX} cy={CY} r={152} fill="none" stroke="#4a9fe0" strokeWidth="1.3" strokeDasharray="9 6" strokeOpacity="0.45"
          style={{ transformOrigin: `${CX}px ${CY}px`, animation: "dlp-dash 18s linear infinite" }} />

        {/* Center */}
        <circle cx={CX} cy={CY} r={108} fill="url(#dlp-disc)" />
        <circle cx={CX} cy={CY} r={108} fill="none" stroke="#3e7fd6" strokeWidth="2" strokeOpacity="0.8" />

        {/* Central Lock */}
        <g color="#5cb8f5" style={{ transformOrigin: `${CX}px ${CY}px`, animation: "dlp-lock 4.2s ease-in-out infinite" }}>
          <path d={`M${CX - 32},${CY - 10} L${CX - 32},${CY - 36} A32,32 0 0,1 ${CX + 32},${CY - 36} L${CX + 32},${CY - 10}`} fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <rect x={CX - 34} y={CY - 10} width={68} height={48} rx={8} fill="none" stroke="currentColor" strokeWidth="3.5" />
          <circle cx={CX} cy={CY + 14} r={7} fill="none" stroke="currentColor" strokeWidth="2.4" />
          <line x1={CX} y1={CY + 21} x2={CX} y2={CY + 31} stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </g>

        {/* Satellite Elements */}
        {SATS.map((sat) => {
          const { x: sx, y: sy } = satXY(sat);
          const rad = toRad(sat.angle);
          const ex = CX + Math.cos(rad) * 112;
          const ey = CY + Math.sin(rad) * 112;
          const Icon = ICONS[sat.id];
          const SAT_R = 37;
          const lx = sat.labelSide === "left" ? sx - SAT_R - 20 : sx + SAT_R + 20;
          const anchor = sat.labelSide === "left" ? "end" : "start";
          const ly0 = sy - ((sat.label.length - 1) * 19) / 2;

          return (
            <g key={sat.id}>
              {/* Connection Line */}
              <line x1={ex} y1={ey} x2={sx} y2={sy} stroke="#3672cc" strokeWidth="1.7"
                style={{ animation: `dlp-conn 4.2s ease-in-out infinite ${sat.delay}` }} />

              {/* Satellite Waves */}
              <circle cx={sx} cy={sy} r={SAT_R} fill="none" stroke="#4a9fe0" strokeWidth="1.6"
                style={{ animation: `dlp-sat-w1 4.2s ease-out infinite ${sat.delay}` }} />

              {/* Satellite Body */}
              <circle cx={sx} cy={sy} r={SAT_R} fill="url(#dlp-sat)" />
              <circle cx={sx} cy={sy} r={SAT_R} fill="none" stroke="#3672cc" strokeWidth="2.1" strokeOpacity="0.85" />

              {/* Icon */}
              <g color="#5cb8f5" transform={`translate(${sx},${sy})`}
                style={{ transformOrigin: `${sx}px ${sy}px`, animation: `dlp-sat-icon 4.2s ease-in-out infinite ${sat.delay}` }}>
                <Icon />
              </g>

              {/* Labels */}
              {sat.label.map((line, i) => (
                <text
                  key={i}
                  x={lx}
                  y={ly0 + i * 19}
                  textAnchor={anchor}
                  dominantBaseline="middle"
                  fill="#5cb8f5"
                  fontSize="14.5"
                  fontFamily="'Segoe UI', system-ui, sans-serif"
                  fontWeight="500"
                  letterSpacing="0.35px"
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}