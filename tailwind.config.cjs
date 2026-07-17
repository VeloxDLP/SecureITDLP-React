/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
      colors: {
        // ── Replaced cold navy with warm charcoal (Claude-style) ──
        navy: {
          950: '#111111',
          900: '#161616',
          800: '#1a1a1a',
          700: '#1f1f1f',
          600: '#242424',
          500: '#2a2a2a',
        },
        azure: {
          400: '#7094ff',
          500: '#5a7ef5',
          600: '#4060d4',
          700: '#2e4db8',
        },
        gold:    { 400: '#fbbf24', 500: '#f59e0b' },
        emerald: { 400: '#34d399', 500: '#10b981' },
        rose:    { 400: '#f87171', 500: '#ef4444' },
        amber:   { 400: '#fbbf24', 500: '#f59e0b' },
        violet:  { 400: '#a78bfa', 500: '#8b5cf6' },
        cyan:    { 400: '#22d3ee', 500: '#06b6d4' },
      },
      boxShadow: {
        'glow-blue':  '0 0 20px rgba(112,148,255,0.25)',
        'glow-sm':    '0 0 12px rgba(112,148,255,0.15)',
        'card-dark':  '0 4px 24px rgba(0,0,0,0.5)',
        'card-light': '0 2px 16px rgba(0,0,0,0.08)',
        'glass':      '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
      },
      animation: {
        'fade-in':   'fadeIn 0.4s ease both',
        'slide-up':  'slideUp 0.4s cubic-bezier(0.22,1,0.36,1) both',
        'float':     'float 6s ease-in-out infinite',
        'ping-slow': 'ping 2s cubic-bezier(0,0,0.2,1) infinite',
        'stagger-1': 'slideUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.05s both',
        'stagger-2': 'slideUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.10s both',
        'stagger-3': 'slideUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.15s both',
        'stagger-4': 'slideUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.20s both',
        'stagger-5': 'slideUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.25s both',
        'stagger-6': 'slideUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.30s both',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' },                                to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        float:   { '0%,100%': { transform: 'translateY(0)' },             '50%': { transform: 'translateY(-8px)' } },
      },
    },
  },
  plugins: [],
}


// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     './index.html',
//     './src/**/*.{js,ts,jsx,tsx}',
//   ],
//   darkMode: 'class',
//   theme: {
//     extend: {
//       fontFamily: {
//         display: ['Syne', 'sans-serif'],
//         body:    ['DM Sans', 'sans-serif'],
//       },
//       colors: {
//         navy: {
//           950: '#040d1a',
//           900: '#070f1f',
//           800: '#0d1628',
//           700: '#111e35',
//           600: '#162440',
//           500: '#1c2d4f',
//         },
//         azure: {
//           400: '#60a5fa',
//           500: '#3b82f6',
//           600: '#2563eb',
//           700: '#1d4ed8',
//         },
//         gold: {
//           400: '#fbbf24',
//           500: '#f59e0b',
//         },
//         emerald: { 400: '#34d399', 500: '#10b981' },
//         rose:    { 400: '#f87171', 500: '#ef4444' },
//         amber:   { 400: '#fbbf24', 500: '#f59e0b' },
//         violet:  { 400: '#a78bfa', 500: '#8b5cf6' },
//         cyan:    { 400: '#22d3ee', 500: '#06b6d4' },
//       },
//       boxShadow: {
//         'glow-blue':  '0 0 20px rgba(59,130,246,0.3)',
//         'glow-sm':    '0 0 12px rgba(59,130,246,0.2)',
//         'card-dark':  '0 4px 24px rgba(0,0,0,0.4)',
//         'card-light': '0 2px 16px rgba(0,0,0,0.08)',
//         'glass':      '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
//       },
//       animation: {
//         'fade-in':   'fadeIn 0.4s ease both',
//         'slide-up':  'slideUp 0.4s cubic-bezier(0.22,1,0.36,1) both',
//         'float':     'float 6s ease-in-out infinite',
//         'ping-slow': 'ping 2s cubic-bezier(0,0,0.2,1) infinite',
//         'stagger-1': 'slideUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.05s both',
//         'stagger-2': 'slideUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.10s both',
//         'stagger-3': 'slideUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.15s both',
//         'stagger-4': 'slideUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.20s both',
//         'stagger-5': 'slideUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.25s both',
//         'stagger-6': 'slideUp 0.4s cubic-bezier(0.22,1,0.36,1) 0.30s both',
//       },
//       keyframes: {
//         fadeIn:  { from: { opacity: '0' },                                to: { opacity: '1' } },
//         slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
//         float:   { '0%,100%': { transform: 'translateY(0)' },             '50%': { transform: 'translateY(-8px)' } },
//       },
//     },
//   },
//   plugins: [],
// }