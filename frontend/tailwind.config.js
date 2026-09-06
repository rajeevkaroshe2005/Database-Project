/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: {
          950: '#06080d',
          900: '#0a0d15',
          850: '#0f1422',
          800: '#141b2e',
          750: '#1b233d',
          700: '#232e4d',
        },
        cyanGlow: {
          DEFAULT: '#00f2fe',
          light: '#4facfe',
          dark: '#00c4d4'
        },
        electric: {
          blue: '#2563eb',
          cyan: '#06b6d4',
          indigo: '#4f46e5',
          purple: '#8b5cf6',
          violet: '#7c3aed'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-radial': 'radial-gradient(circle at 50% 30%, rgba(37, 99, 235, 0.18) 0%, rgba(139, 92, 246, 0.12) 40%, rgba(6, 8, 13, 0) 75%)',
        'glass-card': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'glow-accent': 'linear-gradient(90deg, #00f2fe 0%, #4facfe 50%, #8b5cf6 100%)'
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.4)',
        'glow-purple': '0 0 30px -5px rgba(139, 92, 246, 0.4)',
        'glow-blue': '0 0 35px -5px rgba(37, 99, 235, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
