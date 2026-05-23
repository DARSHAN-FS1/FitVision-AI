/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0a0c0f',
          2: '#111418',
          3: '#181c22',
          4: '#1e2430',
        },
        card: {
          DEFAULT: '#161b24',
          2: '#1c2235',
        },
        cyan: {
          DEFAULT: '#00d4b8',
          2: '#00b8a0',
          3: 'rgba(0,212,184,0.12)',
          4: 'rgba(0,212,184,0.06)',
        },
        primary: '#00d4b8',
        danger: '#ff5c5c',
        success: '#2ecc8f',
        warning: '#f59e0b',
        info: '#4a9eff',
        purple: '#8b5cf6',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        xl2: '20px',
        xl3: '28px',
      },
    },
  },
  plugins: [],
};
