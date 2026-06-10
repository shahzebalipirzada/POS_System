/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"DM Mono"', 'monospace'],
        body: ['"Inter"', 'sans-serif'],
      },
      colors: {
        pos: {
          bg: 'var(--pos-bg)',
          surface: 'var(--pos-surface)',
          card: 'var(--pos-card)',
          border: 'var(--pos-border)',
          accent: 'var(--pos-accent)',
          accentHover: 'var(--pos-accent-hover)',
          success: 'var(--pos-success)',
          warning: 'var(--pos-warning)',
          danger: 'var(--pos-danger)',
          text: 'var(--pos-text)',
          muted: 'var(--pos-muted)',
        }
      },
      animation: {
        'slide-in': 'slideIn 0.2s ease-out',
        'fade-in': 'fadeIn 0.15s ease-out',
        'bounce-in': 'bounceIn 0.3s ease-out',
      },
      keyframes: {
        slideIn: { from: { transform: 'translateX(20px)', opacity: 0 }, to: { transform: 'translateX(0)', opacity: 1 } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        bounceIn: { '0%': { transform: 'scale(0.95)', opacity: 0 }, '70%': { transform: 'scale(1.02)' }, '100%': { transform: 'scale(1)', opacity: 1 } },
      }
    },
  },
  plugins: [],
}
