// import "./SecurityAnimation.css";

export default function SecurityAnimation() {
  return (
    <div className="security-wrapper">

      <svg
        viewBox="0 0 1200 1200"
        className="security-svg"
      >

        <defs>

          <filter id="glow">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="ringGradient">
            <stop offset="0%" stopColor="#67d7ff"/>
            <stop offset="100%" stopColor="#2d5cff"/>
          </linearGradient>

        </defs>

        {/* CENTER */}
        <g transform="translate(600 600)">

          <circle
            r="230"
            className="center-disc"
          />

          <g className="rotating-ring">
            <circle
              r="300"
              className="ring"
            />
          </g>

          {/* Lock */}
          <g className="lock-icon">
            <rect
              x="-70"
              y="-10"
              width="140"
              height="120"
              rx="20"
            />

            <path d="
              M -40 -10
              V -70
              A 40 40 0 0 1 40 -70
              V -10
            " />
          </g>

        </g>

        {/* NETWORK */}
        <Node
          x={360}
          y={180}
          label="Network Protection"
          delay="0s"
        />

        {/* WEB */}
        <Node
          x={900}
          y={300}
          label="Web Control"
          delay="2s"
        />

        {/* DATA */}
        <Node
          x={1000}
          y={600}
          label="Data Classification"
          delay="4s"
        />

        {/* EMAIL */}
        <Node
          x={850}
          y={900}
          label="Email DLP"
          delay="6s"
        />

        {/* ENDPOINT */}
        <Node
          x={350}
          y={950}
          label="Endpoint DLP"
          delay="8s"
        />

        {/* CONNECTIONS */}

        <AnimatedLine
          x1={600}
          y1={300}
          x2={360}
          y2={180}
          delay="0s"
        />

        <AnimatedLine
          x1={800}
          y1={420}
          x2={900}
          y2={300}
          delay="2s"
        />

        <AnimatedLine
          x1={900}
          y1={600}
          x2={1000}
          y2={600}
          delay="4s"
        />

        <AnimatedLine
          x1={800}
          y1={800}
          x2={850}
          y2={900}
          delay="6s"
        />

        <AnimatedLine
          x1={500}
          y1={900}
          x2={350}
          y2={950}
          delay="8s"
        />

      </svg>

    </div>
  );
}

function Node({ x, y, label, delay }) {
  return (
    <g
      transform={`translate(${x},${y})`}
      className="node"
      style={{ animationDelay: delay }}
    >
      <circle
        r="65"
        className="node-circle"
      />

      <circle
        r="80"
        className="node-border"
      />

      <text
        x="100"
        y="10"
        className="node-label"
      >
        {label}
      </text>
    </g>
  );
}

function AnimatedLine({
  x1,
  y1,
  x2,
  y2,
  delay
}) {
  return (
    <>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className="connector"
      />

      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className="pulse-line"
        style={{
          animationDelay: delay
        }}
      />
    </>
  );
}