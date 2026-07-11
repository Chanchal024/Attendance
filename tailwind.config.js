/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#800020',
        },
        dark: {
          primary: '#800020',
          secondary: '#5a0017',
          accent: '#a0002a',
          surface: '#1a0008',
          card: '#2a0010',
        }
      },
    },
  },
  plugins: [],
}




