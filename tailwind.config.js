/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E8D095',
          pale: '#FAF6EC',
        },
        charcoal: '#141416',
        dark: '#1C1C1E',
        mid: '#8E8E93',
        silver: '#E5E5EA',
        warm: '#FAFAF8',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        cairo: ['Cairo', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(40px)', filter: 'blur(4px)' },
          '100%': { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(201,168,76,0.4)' },
          '50%': { boxShadow: '0 0 20px rgba(201,168,76,0.8)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
