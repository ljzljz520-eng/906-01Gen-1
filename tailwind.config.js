/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1536px",
      },
    },
    extend: {
      colors: {
        industrial: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1E40AF",
          800: "#1E3A8A",
          900: "#172554",
          950: "#0B1638",
        },
        steel: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
          950: "#030712",
        },
        status: {
          active: "#059669",
          obsolete: "#DC2626",
          superseded: "#D97706",
        },
      },
      fontFamily: {
        oswald: ['"Oswald"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Noto Sans Mono"', 'ui-monospace', 'monospace'],
        sans: ['"Source Han Sans CN"', '"Noto Sans SC"', '"PingFang SC"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'industrial': '0 2px 0 0 rgba(30, 58, 138, 0.15), 0 4px 20px -4px rgba(0,0,0,0.1)',
        'industrial-lg': '0 4px 0 0 rgba(30, 58, 138, 0.2), 0 12px 40px -8px rgba(0,0,0,0.2)',
        'inner-inset': 'inset 0 2px 4px 0 rgba(0,0,0,0.08)',
      },
      keyframes: {
        'breath': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(5, 150, 105, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(5, 150, 105, 0)' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-24px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(24px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-up': {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'breath': 'breath 2.4s ease-in-out infinite',
        'slide-in-left': 'slide-in-left 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in-right': 'slide-in-right 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in-up': 'slide-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.4s ease both',
      },
    },
  },
  plugins: [],
};
