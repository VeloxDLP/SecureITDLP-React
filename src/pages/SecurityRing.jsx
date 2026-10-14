import React from "react";

/* ─────────────────────────── Layout ───────────────────────────
   Coordinates are in SVG units (viewBox below). Everything is vector,
   so it stays crisp at any size. Edit NODES to change labels or positions.
   Keep NODES in clockwise order (top → bottom). */

const C = { x: 211, y: 367 }; // center of lock
const R_CORE = 99; // navy core disc
const R_DASH = 120; // dashed ring
const R_INNER = 141; // solid inner ring
const R_OUTER = 162; // dark partial arc (wraps left side)
const R_RAIL = 189; // right half-arc the nodes hang off
const R_NODE = 52; // feature node radius

const NODES = [
  { id: "network", label: ["Network", "Protection"], x: 211, y: 101, icon: "network" },
  { id: "web", label: ["Web", "Control"], x: 414, y: 170, icon: "web" },
  { id: "data", label: ["Data", "Classification"], x: 526, y: 367, icon: "data" },
  { id: "email", label: ["Email", "DLP"], x: 414, y: 577, icon: "email" },
  { id: "endpoint", label: ["Endpoint", "DLP"], x: 211, y: 648, icon: "endpoint" },
];

/* ─────────────────────────── Timeline (fractions of one cycle) ───────────────────────────
   rail draws top → bottom, pausing at each node while its connector draws,
   then the node lights and stays lit. Once all are lit, everything holds, fades, repeats. */

const TRAVEL = 0.4; // total time the rail spends moving
const HOLD = 0.05; // pause at each node (connector draws during this)
const ON_UNTIL = 0.85; // everything fully lit until here
const OFF_AT = 0.95; // faded out by here

const ICON_BG = "#0b2560";
const LABEL_BASE = "#2fa3d6";
const LABEL_LIT = "#d2efff";

/* ─────────────────────────── Helpers ─────────────────────────── */

const polar = (r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [C.x + r * Math.cos(a), C.y + r * Math.sin(a)];
};

// Clockwise arc from a1 to a2 (0° = 3 o'clock)
const arcPath = (r, a1, a2) => {
  const [x1, y1] = polar(r, a1);
  const [x2, y2] = polar(r, a2);
  const large = a2 - a1 > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
};

const hex = (r, rot = -90) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = ((rot + i * 60) * Math.PI) / 180;
    return `${(r * Math.cos(a)).toFixed(2)},${(r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");

const pct = (f) => `${(f * 100).toFixed(2)}%`;

const LAYOUT = NODES.map((n, i) => {
  const dx = n.x - C.x;
  const dy = n.y - C.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI; // -90 (top) → 90 (bottom)
  const progress = (angle + 90) / 180; // 0 at top of rail, 1 at bottom
  const arrive = TRAVEL * progress + HOLD * i; // rail reaches this node
  return {
    ...n,
    conn: `M ${C.x + ux * R_RAIL} ${C.y + uy * R_RAIL} L ${n.x - ux * R_NODE} ${n.y - uy * R_NODE}`,
    progress,
    arrive,
    lit: arrive + HOLD, // connector finished → node lights
  };
});

const SWEEP_END = LAYOUT[LAYOUT.length - 1].lit;

/* ─────────────────────────── Generated keyframes ───────────────────────────
   All animations share one duration with no delays, so they never drift apart. */

const litFrames = (name, start) => `
  @keyframes ${name} {
    0%, ${pct(start)} { opacity: 0; }
    ${pct(start + 0.03)} { opacity: 1; }
    ${pct(ON_UNTIL)} { opacity: 1; }
    ${pct(OFF_AT)} { opacity: 0; }
    100% { opacity: 0; }
  }`;

const KEYFRAMES = [
  // rail: draw → pause at each node → continue → full glow → fade
  `@keyframes srRail {
    0% { stroke-dashoffset: 1000; opacity: 1; }
    ${LAYOUT.map((n) => {
      const off = (1000 * (1 - n.progress)).toFixed(1);
      return `${pct(n.arrive)} { stroke-dashoffset: ${off}; opacity: 1; }
    ${pct(n.lit)} { stroke-dashoffset: ${off}; opacity: 1; }`;
    }).join("\n    ")}
    ${pct(ON_UNTIL)} { stroke-dashoffset: 0; opacity: 1; }
    ${pct(OFF_AT)} { stroke-dashoffset: 0; opacity: 0; }
    100% { stroke-dashoffset: 1000; opacity: 0; }
  }`,

  ...LAYOUT.map(
    (n, i) => `
  @keyframes srConn${i} {
    0%, ${pct(n.arrive)} { opacity: 0; stroke-dashoffset: 1; }
    ${pct(n.arrive + 0.001)} { opacity: 1; stroke-dashoffset: 1; }
    ${pct(n.lit)} { opacity: 1; stroke-dashoffset: 0; }
    ${pct(ON_UNTIL)} { opacity: 1; stroke-dashoffset: 0; }
    ${pct(OFF_AT)} { opacity: 0; stroke-dashoffset: 0; }
    100% { opacity: 0; stroke-dashoffset: 1; }
  }

  @keyframes srPop${i} {
    0%, ${pct(n.lit)} { transform: scale(1); }
    ${pct(n.lit + 0.025)} { transform: scale(1.08); }
    ${pct(n.lit + 0.05)} { transform: scale(0.98); }
    ${pct(n.lit + 0.07)} { transform: scale(1); }
    100% { transform: scale(1); }
  }

  ${litFrames(`srLit${i}`, n.lit)}

  @keyframes srLabel${i} {
    0%, ${pct(n.lit)} { fill: ${LABEL_BASE}; }
    ${pct(n.lit + 0.03)} { fill: ${LABEL_LIT}; }
    ${pct(ON_UNTIL)} { fill: ${LABEL_LIT}; }
    ${pct(OFF_AT)} { fill: ${LABEL_BASE}; }
    100% { fill: ${LABEL_BASE}; }
  }`
  ),

  litFrames("srLock", SWEEP_END),
].join("\n");

/* ─────────────────────────── Icons (drawn around 0,0) ─────────────────────────── */

const Icon = ({ type }) => {
  switch (type) {
    case "network": {
      const sats = [[-24, -22], [20, -22], [28, 0], [-24, 22], [20, 24]];
      return (
        <>
          {sats.map(([x, y], i) => (
            <line key={`l${i}`} x1="0" y1="0" x2={x} y2={y} />
          ))}
          <polygon points={hex(9)} fill={ICON_BG} />
          {sats.map(([x, y], i) => (
            <polygon key={`h${i}`} points={hex(5.5)} transform={`translate(${x} ${y})`} fill={ICON_BG} />
          ))}
        </>
      );
    }
    case "web":
      return (
        <>
          <circle r="26" />
          <ellipse rx="11" ry="26" />
          <line x1="-24.7" y1="-8" x2="24.7" y2="-8" />
          <line x1="-24.7" y1="8" x2="24.7" y2="8" />
        </>
      );
    case "data":
      return (
        <>
          <polygon points={hex(30)} />
          <line x1="-9" y1="-12" x2="-9" y2="14" />
          <polyline points="-15,8 -9,14 -3,8" />
          <line x1="9" y1="14" x2="9" y2="-14" />
          <polyline points="3,-8 9,-14 15,-8" />
        </>
      );
    case "email":
      return (
        <>
          <path d="M 2 12 H -24 V -18 H 24 V -2" />
          <path d="M -24 -18 L 0 0 L 24 -18" />
          <circle cx="16" cy="14" r="12" fill={ICON_BG} />
          <line x1="16" y1="8" x2="16" y2="20" />
          <line x1="10" y1="14" x2="22" y2="14" />
        </>
      );
    case "endpoint":
      return (
        <>
          <rect x="-22" y="-22" width="16" height="16" rx="2" />
          <rect x="6" y="-22" width="16" height="16" rx="2" />
          <rect x="-22" y="6" width="16" height="16" rx="2" />
          <line x1="14" y1="6" x2="14" y2="22" />
          <line x1="6" y1="14" x2="22" y2="14" />
        </>
      );
    default:
      return null;
  }
};

const Lock = () => (
  <>
    <path d={`M ${C.x - 23} ${C.y - 15} V ${C.y - 31} A 23 23 0 0 1 ${C.x + 23} ${C.y - 31} V ${C.y - 15}`} />
    <rect x={C.x - 40} y={C.y - 15} width="80" height="62" rx="12" />
    <circle cx={C.x} cy={C.y + 8} r="6" />
    <line x1={C.x} y1={C.y + 14} x2={C.x} y2={C.y + 28} />
  </>
);

/* ─────────────────────────── Component ─────────────────────────── */

const SecurityRing = ({ cycle = 6, className = "", style }) => {
  const anim = (name, easing = "linear") => ({ animation: `${name} ${cycle}s ${easing} infinite` });

  return (
    <>
      <style>{`
        .sr-svg {
          width: 100%;
          max-width: 560px;
          height: auto;
          display: block;
          overflow: visible;
          font-family: 'Poppins', 'Segoe UI', sans-serif;
        }
        .sr-spin {
          transform-box: fill-box;
          transform-origin: center;
          animation: srSpin 40s linear infinite;
        }
        .sr-pop {
          transform-box: fill-box;
          transform-origin: center;
        }
        .sr-rail-lit {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
        }
        .sr-conn-lit {
          opacity: 0;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
        }
        .sr-lit { opacity: 0; }
        .sr-label { fill: ${LABEL_BASE}; font-size: 18px; }

        @keyframes srSpin { to { transform: rotate(360deg); } }
        ${KEYFRAMES}
      `}</style>

      <svg
        viewBox="20 20 720 720"
        className={`sr-svg ${className}`}
        style={style}
        role="img"
        aria-label="SecureIT modules: Network Protection, Web Control, Data Classification, Email DLP, Endpoint DLP"
      >
        <defs>
          <linearGradient id="sr-navy" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#0a2a72" />
            <stop offset="100%" stopColor="#081b48" />
          </linearGradient>
          <radialGradient id="sr-bloom">
            <stop offset="0%" stopColor="#2979ff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#2979ff" stopOpacity="0" />
          </radialGradient>
          <filter id="sr-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="sr-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ambient bloom behind the core */}
        <circle cx={C.x} cy={C.y} r="230" fill="url(#sr-bloom)" />

        {/* ── rings ── */}
        <path
          d={arcPath(R_OUTER, 90, 365)}
          fill="none"
          stroke="rgba(70,140,225,0.45)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx={C.x} cy={C.y} r={R_INNER} fill="none" stroke="rgba(70,140,225,0.6)" strokeWidth="3" />
        <circle
          className="sr-spin"
          cx={C.x}
          cy={C.y}
          r={R_DASH}
          fill="none"
          stroke="rgba(91,170,230,0.6)"
          strokeWidth="1.3"
          strokeDasharray="7 6"
        />

        {/* ── core + lock ── */}
        <circle cx={C.x} cy={C.y} r={R_CORE} fill="url(#sr-navy)" stroke="rgba(61,145,216,0.7)" strokeWidth="2" />
        <g fill="none" stroke="#7da3cf" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
          <Lock />
        </g>
        <g
          className="sr-lit"
          style={anim("srLock")}
          fill="none"
          stroke="#cfe9ff"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#sr-glow)"
        >
          <Lock />
          <circle cx={C.x} cy={C.y} r={R_CORE} strokeWidth="2.5" stroke="#5ba3f0" />
        </g>

        {/* ── right rail: dim base + progressive glow ── */}
        <path d={arcPath(R_RAIL, -90, 90)} fill="none" stroke="#6f9ad0" strokeWidth="2.5" filter="url(#sr-soft)" />
        <path
          className="sr-rail-lit"
          style={anim("srRail", "ease-in-out")}
          d={arcPath(R_RAIL, -90, 90)}
          pathLength="1000"
          fill="none"
          stroke="#cfe9ff"
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="url(#sr-glow)"
        />

        {/* ── connectors ── */}
        {LAYOUT.map((n, i) => (
          <g key={`c-${n.id}`}>
            <path d={n.conn} stroke="rgba(111,154,208,0.7)" strokeWidth="2.2" fill="none" />
            <path
              className="sr-conn-lit"
              style={anim(`srConn${i}`)}
              d={n.conn}
              pathLength="1"
              stroke="#cfe9ff"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
              filter="url(#sr-glow)"
            />
          </g>
        ))}

        {/* ── nodes + labels ── */}
        {LAYOUT.map((n, i) => (
          <g key={`n-${n.id}`}>
            <g transform={`translate(${n.x} ${n.y})`}>
              <g className="sr-pop" style={anim(`srPop${i}`, "ease-out")}>
                {/* base node */}
                <circle r={R_NODE} fill="url(#sr-navy)" stroke="rgba(175,198,230,0.75)" strokeWidth="3.5" />
                <circle r={R_NODE - 6} fill="none" stroke="rgba(120,160,215,0.35)" strokeWidth="1" />
                <g fill="none" stroke="#6f8fbd" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <Icon type={n.icon} />
                </g>

                {/* lit layer: same ring + icon, brighter — no extra circle */}
                <g
                  className="sr-lit"
                  style={anim(`srLit${i}`)}
                  fill="none"
                  stroke="#cfe9ff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#sr-glow)"
                >
                  <circle r={R_NODE} stroke="#7dc0ff" strokeWidth="3.5" />
                  <g strokeWidth="2.6">
                    <Icon type={n.icon} />
                  </g>
                </g>
              </g>
            </g>

            <text className="sr-label" style={anim(`srLabel${i}`)} x={n.x + 70} y={n.y - 12}>
              <tspan x={n.x + 70} dy="0">{n.label[0]}</tspan>
              <tspan x={n.x + 70} dy="28">{n.label[1]}</tspan>
            </text>
          </g>
        ))}
      </svg>
    </>
  );
};

export default SecurityRing;