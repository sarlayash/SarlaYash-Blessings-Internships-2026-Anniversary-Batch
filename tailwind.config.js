/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./app.js"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#E5A93C',
          goldLight: '#F5D061',
          goldDark: '#B87A1E',
          crimson: '#880E1C',
          ruby: '#6B0915',
          velvet: '#45060D',
          dark: '#0A0A0C',
          surface: '#121217',
          card: '#181820',
          border: 'rgba(229, 169, 60, 0.2)',
          glow: 'rgba(229, 169, 60, 0.4)'
        }
      },
      fontFamily: {
        heading: ['Cinzel', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(229, 169, 60, 0.25)',
        'ruby-glow': '0 0 30px rgba(136, 14, 28, 0.35)',
        'theatre': '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(107, 9, 21, 0.4)'
      }
    }
  },
  plugins: [],
}
