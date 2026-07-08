/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          light: '#3b82f6',
          dark: '#1d4ed8',
        },
        slate: {
          950: '#f8fafc',
          900: '#ffffff',
          800: '#f1f5f9',
          700: '#e2e8f0',
          600: '#cbd5e1',
          500: '#64748b',
          400: '#475569',
          300: '#334155',
          200: '#1e293b',
          100: '#0f172a',
          50: '#020617',
        },
        cyan: {
          950: '#ecfeff',
          900: '#cffafe',
          400: '#0284c7',
          300: '#0369a1',
        },
        blue: {
          950: '#eff6ff',
          900: '#dbeafe',
          400: '#2563eb',
          300: '#1d4ed8',
        },
        emerald: {
          950: '#ecfdf5',
          900: '#d1fae5',
          400: '#059669',
          300: '#047857',
        },
        amber: {
          950: '#fffbeb',
          900: '#fef3c7',
          400: '#d97706',
          300: '#b45309',
        },
        rose: {
          950: '#fff1f2',
          900: '#ffe4e6',
          400: '#e11d48',
          300: '#be123c',
        },
      },
    },
  },
  plugins: [],
}
