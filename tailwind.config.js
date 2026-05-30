/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          light: 'rgba(255,255,255,0.12)',
          lighter: 'rgba(255,255,255,0.10)',
          lightest: 'rgba(255,255,255,0.08)',
          subtle: 'rgba(255,255,255,0.06)',
          border: 'rgba(255,255,255,0.18)',
          'border-light': 'rgba(255,255,255,0.15)',
          'border-dashed': 'rgba(255,255,255,0.20)',
          'border-top': 'rgba(255,255,255,0.35)',
          highlight: 'rgba(255,255,255,0.15)',
          overlay: 'rgba(30,20,60,0.85)',
        },
        accent: {
          purple: 'rgba(180,140,255,0.06)',
          gradient: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(180,140,255,0.06) 100%)',
          'gradient-btn': 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        },
      },
      backdropBlur: {
        glass: '30px',
        'glass-heavy': '40px',
      },
      boxShadow: {
        glass: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.2)',
        'glass-dark': 'inset 0 1px 0 rgba(255,255,255,0.2), 0 20px 60px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}
