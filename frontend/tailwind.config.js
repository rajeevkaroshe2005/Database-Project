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
        // --- LUXURY TRAVEL BRAND PALETTE ---
        espresso: '#171513',   // Deep Espresso / Charcoal (Main Dark Background)
        charcoal: '#211F1B',   // Secondary Dark Background
        surface: '#25231F',    // Dark Card Surfaces
        ivory: '#F5F1E8',      // Warm Ivory (Main Light Background)
        cream: '#EEE8DC',      // Cream (Alternate Light Section)
        sand: '#D8C7AD',       // Soft Sand (Accents / Borders / Sections)
        warmwhite: '#FAF8F3',  // Clean Warm White for Cards

        // --- ACCENTS ---
        terracotta: {
          DEFAULT: '#B86B4B',  // Primary CTA, Selected States, Special Offers
          hover: '#A35C3E',
          light: '#D98E70',
          dark: '#8C4B31'
        },
        forest: {
          DEFAULT: '#243B35',  // Success States, Sports, Eco Actions
          light: '#365850',
          dark: '#172723'
        },
        gold: {
          DEFAULT: '#C9A96E',  // Muted Gold, Ratings, VIP Badges, Highlights
          light: '#DFC596',
          dark: '#A78548'
        },

        // --- SEMANTIC STATUS TOKENS ---
        semantic: {
          success: '#2E7D32',
          warning: '#D4A017',
          error: '#B94B3F',
          info: '#4A6FA5',
          disabled: '#9CA3AF'
        },

        // --- GRACEFUL COMPATIBILITY TOKENS ---
        space: {
          950: '#171513',
          900: '#211F1B',
          850: '#25231F',
          800: '#2e2b26',
          750: '#38342e',
          700: '#454038'
        },
        cyanGlow: {
          DEFAULT: '#C9A96E',
          light: '#DFC596',
          dark: '#A78548'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Cinzel', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-radial': 'radial-gradient(circle at 50% 30%, rgba(201, 169, 110, 0.12) 0%, rgba(184, 107, 75, 0.08) 35%, rgba(23, 21, 19, 0) 75%)',
        'sunset-warmth': 'linear-gradient(135deg, #B86B4B 0%, #D8C7AD 100%)',
        'forest-fade': 'linear-gradient(135deg, #243B35 0%, #171513 100%)',
        'sand-glow': 'linear-gradient(135deg, #D8C7AD 0%, #FAF8F3 100%)'
      },
      boxShadow: {
        'warm': '0 4px 20px -2px rgba(23, 21, 19, 0.08)',
        'luxury': '0 12px 36px -4px rgba(23, 21, 19, 0.16)',
        'card': '0 2px 12px -2px rgba(23, 21, 19, 0.06)',
        'terracotta': '0 6px 20px -2px rgba(184, 107, 75, 0.35)',
        'gold': '0 6px 20px -2px rgba(201, 169, 110, 0.3)',
        'glow-cyan': '0 4px 16px -2px rgba(201, 169, 110, 0.25)',
        'glow-purple': '0 4px 16px -2px rgba(184, 107, 75, 0.25)',
        'glow-blue': '0 4px 16px -2px rgba(36, 59, 53, 0.3)',
        'glass': '0 8px 32px 0 rgba(23, 21, 19, 0.25)',
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
