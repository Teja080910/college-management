/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        'primary-dark': '#4f46e5',
        'primary-light': '#e0e7ff',
        secondary: '#64748b',
        success: '#16a34a',
        warning: '#d97706',
        danger: '#dc2626',
        bg: '#f8fafc',
        surface: '#ffffff',
        border: '#e2e8f0',
        text: '#1e293b',
        'text-secondary': '#64748b',
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
}
