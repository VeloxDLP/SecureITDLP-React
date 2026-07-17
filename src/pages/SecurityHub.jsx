import React from 'react';
import './SecurityHub.css'; // optional for custom styles

const SecurityHub = () => {
  return (
    <div className="security-hub-container">
      <svg width="100%" viewBox="0 0 620 600" role="img">
        <title>Security Hub</title>
        <desc>Security hub super fast animation</desc>
        <defs>
          <radialGradient id="bg" cx="45%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#0b1a35"/>
            <stop offset="100%" stopColor="#000810"/>
          </radialGradient>
          <radialGradient id="cg" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#122f60"/>
            <stop offset="100%" stopColor="#050e25"/>
          </radialGradient>
          <radialGradient id="ng" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#1b3c75"/>
            <stop offset="100%" stopColor="#060f28"/>
          </radialGradient>
          <filter id="sg">
            <feGaussianBlur stdDeviation="4" result="b"/>
            <feMerge>
              <feMergeNode in="b"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <rect width="620" height="600" fill="url(#bg)"/>

        <circle className="rp1" cx="245" cy="300" r="108" fill="none" stroke="#3a7fd4" strokeWidth="1" opacity="0"/>
        <circle className="rp2" cx="245" cy="300" r="108" fill="none" stroke="#3a7fd4" strokeWidth="1" opacity="0"/>

        <circle className="spin1" cx="245" cy="300" r="118" fill="none" stroke="#2a65c0" strokeWidth="1.2" strokeDasharray="7 5" opacity="0.55"/>

        <g className="spin2" opacity="0.4">
          <circle cx="245" cy="122" r="2.5" fill="#3a7fd4"/>
          <circle cx="390" cy="199" r="2" fill="#3a7fd4"/>
          <circle cx="390" cy="401" r="2" fill="#3a7fd4"/>
          <circle cx="245" cy="478" r="2.5" fill="#3a7fd4"/>
          <circle cx="100" cy="401" r="2" fill="#3a7fd4"/>
          <circle cx="100" cy="199" r="2" fill="#3a7fd4"/>
        </g>

        <circle cx="245" cy="300" r="108" fill="url(#cg)" stroke="#1e4a90" strokeWidth="1.5"/>
        <circle cx="245" cy="300" r="94" fill="none" stroke="#1a3a75" strokeWidth="0.7" opacity="0.6"/>
        <circle cx="245" cy="300" r="78" fill="none" stroke="#152e60" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.45"/>

        <g filter="url(#sg)" style={{ animation: 'glowLock 2s ease-in-out infinite' }}>
          <rect x="218" y="308" width="54" height="42" rx="6" fill="none" stroke="#6ab4e8" strokeWidth="2.5"/>
          <path d="M228 308 L228 293 Q245 277 262 293 L262 308" fill="none" stroke="#6ab4e8" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="245" cy="326" r="6" fill="none" stroke="#6ab4e8" strokeWidth="2"/>
          <line x1="245" y1="332" x2="245" y2="341" stroke="#6ab4e8" strokeWidth="2" strokeLinecap="round"/>
        </g>

        <g stroke="#3a7fd4" strokeWidth="0.9" fill="none" opacity="0.5">
          <path className="s1" d="M215 215 L215 160"/>
          <path className="s2" d="M295 220 L345 175"/>
          <path className="s3" d="M353 300 L430 300"/>
          <path className="s4" d="M305 380 L355 430"/>
          <path className="s5" d="M215 390 L215 455"/>
        </g>

        <g className="n1" style={{ transformOrigin: '215px 125px' }}>
          <circle cx="215" cy="125" r="36" fill="url(#ng)" stroke="#2a6fd4" strokeWidth="1.5"/>
          <circle cx="215" cy="125" r="29" fill="none" stroke="#1a4070" strokeWidth="0.5"/>
          <g stroke="#6ab4e8" strokeWidth="1.7" fill="none">
            <circle cx="215" cy="125" r="4" fill="#6ab4e8"/>
            <circle cx="203" cy="116" r="2.8" fill="#6ab4e8"/>
            <circle cx="227" cy="116" r="2.8" fill="#6ab4e8"/>
            <circle cx="203" cy="134" r="2.8" fill="#6ab4e8"/>
            <circle cx="227" cy="134" r="2.8" fill="#6ab4e8"/>
            <line x1="215" y1="125" x2="203" y2="116"/>
            <line x1="215" y1="125" x2="227" y2="116"/>
            <line x1="215" y1="125" x2="203" y2="134"/>
            <line x1="215" y1="125" x2="227" y2="134"/>
          </g>
        </g>

        <g className="l1" fontFamily="sans-serif" fontSize="13" fontWeight="500" fill="#3dd8e8">
          <text x="255" y="118">Network</text>
          <text x="255" y="134">Protection</text>
        </g>

        <g className="n2" style={{ transformOrigin: '345px 175px' }}>
          <circle cx="345" cy="175" r="36" fill="url(#ng)" stroke="#2a6fd4" strokeWidth="1.5"/>
          <circle cx="345" cy="175" r="29" fill="none" stroke="#1a4070" strokeWidth="0.5"/>
          <g stroke="#6ab4e8" strokeWidth="1.7" fill="none">
            <circle cx="345" cy="175" r="14"/>
            <ellipse cx="345" cy="175" rx="6" ry="14"/>
            <line x1="331" y1="175" x2="359" y2="175"/>
            <path d="M332 167 Q345 170 358 167"/>
            <path d="M332 183 Q345 180 358 183"/>
          </g>
        </g>

        <g className="l2" fontFamily="sans-serif" fontSize="13" fontWeight="500" fill="#3dd8e8">
          <text x="395" y="170">Web</text>
          <text x="395" y="186">Control</text>
        </g>

        <g className="n3" style={{ transformOrigin: '430px 300px' }}>
          <circle cx="430" cy="300" r="36" fill="url(#ng)" stroke="#2a6fd4" strokeWidth="1.5"/>
          <circle cx="430" cy="300" r="29" fill="none" stroke="#1a4070" strokeWidth="0.5"/>
          <g stroke="#6ab4e8" strokeWidth="1.7" fill="none">
            <path d="M430 282 L415 290 L415 303 Q415 316 430 322 Q445 316 445 303 L445 290 Z"/>
            <line x1="430" y1="291" x2="430" y2="312"/>
            <polyline points="425,296 430,291 435,296"/>
            <polyline points="425,307 430,312 435,307"/>
          </g>
        </g>

        <g className="l3" fontFamily="sans-serif" fontSize="13" fontWeight="500" fill="#3dd8e8">
          <text x="475" y="295">Data</text>
          <text x="475" y="311">Classification</text>
        </g>

        <g className="n4" style={{ transformOrigin: '355px 430px' }}>
          <circle cx="355" cy="430" r="36" fill="url(#ng)" stroke="#2a6fd4" strokeWidth="1.5"/>
          <circle cx="355" cy="430" r="29" fill="none" stroke="#1a4070" strokeWidth="0.5"/>
          <g stroke="#6ab4e8" strokeWidth="1.7" fill="none">
            <rect x="340" y="418" width="26" height="18" rx="3"/>
            <polyline points="340,418 355,428 366,418"/>
            <circle cx="368" cy="436" r="7" fill="#060f28" stroke="#6ab4e8" strokeWidth="1.7"/>
            <line x1="368" y1="431" x2="368" y2="441"/>
            <line x1="363" y1="436" x2="373" y2="436"/>
          </g>
        </g>

        <g className="l4" fontFamily="sans-serif" fontSize="13" fontWeight="500" fill="#3dd8e8">
          <text x="405" y="425">Email</text>
          <text x="405" y="441">DLP</text>
        </g>

        <g className="n5" style={{ transformOrigin: '215px 470px' }}>
          <circle cx="215" cy="470" r="36" fill="url(#ng)" stroke="#2a6fd4" strokeWidth="1.5"/>
          <circle cx="215" cy="470" r="29" fill="none" stroke="#1a4070" strokeWidth="0.5"/>
          <g stroke="#6ab4e8" strokeWidth="1.7" fill="none">
            <rect x="201" y="457" width="12" height="12" rx="2"/>
            <rect x="217" y="457" width="12" height="12" rx="2"/>
            <rect x="201" y="473" width="12" height="12" rx="2"/>
            <circle cx="223" cy="479" r="7" fill="#060f28" stroke="#6ab4e8" strokeWidth="1.7"/>
            <line x1="223" y1="474" x2="223" y2="484"/>
            <line x1="218" y1="479" x2="228" y2="479"/>
          </g>
        </g>

        <g className="l5" fontFamily="sans-serif" fontSize="13" fontWeight="500" fill="#3dd8e8">
          <text x="255" y="465">Endpoint</text>
          <text x="255" y="481">DLP</text>
        </g>
      </svg>
    </div>
  );
};

export default SecurityHub;