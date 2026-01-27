/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10b981',
          dark: '#059669',
          light: '#34d399',
        },
        accent: {
          DEFAULT: '#8b5cf6',
          light: '#a78bfa',
        },
        dark: {
          DEFAULT: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
        },
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
      },
      screens: {
        'sm': '480px',
        'md': '768px',
        'lg': '992px',
      },
    },
  },
  plugins: [],
}
