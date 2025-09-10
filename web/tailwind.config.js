/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        'nexus': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // NEXUS OS Theme Colors
        background: {
          primary: '#0A0B0E',
          secondary: '#13151A',
          tertiary: '#1A1D23',
          card: '#1E2128',
          glass: 'rgba(19, 21, 26, 0.8)',
        },
        border: {
          primary: '#2A2D36',
          secondary: '#363A45',
          accent: '#00D4FF',
          success: '#00FF88',
          warning: '#FFB800',
          error: '#FF3B5C',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A0A3A9',
          tertiary: '#6B7280',
          accent: '#00D4FF',
        },
        accent: {
          cyan: '#00D4FF',
          neon: '#00FF88',
          purple: '#8B5CF6',
          orange: '#FF8C42',
          pink: '#FF3B8B',
        },
        surface: {
          0: 'rgba(0, 212, 255, 0.05)',
          1: 'rgba(0, 212, 255, 0.1)',
          2: 'rgba(0, 212, 255, 0.15)',
          3: 'rgba(0, 212, 255, 0.2)',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cyber-grid': "linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)",
        'nexus-gradient': 'linear-gradient(135deg, #0A0B0E 0%, #13151A 25%, #1A1D23 50%, #13151A 75%, #0A0B0E 100%)',
      },
      backgroundSize: {
        'grid': '20px 20px',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'cyber-flicker': 'cyber-flicker 2s infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 212, 255, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.6), 0 0 30px rgba(0, 212, 255, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'cyber-flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 212, 255, 0.3)',
        'glow-lg': '0 0 30px rgba(0, 212, 255, 0.4)',
        'neon': '0 0 5px rgba(0, 255, 136, 0.5), 0 0 20px rgba(0, 255, 136, 0.3)',
        'cyber': '0 4px 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}