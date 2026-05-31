/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eaeffa',
          100: '#d5dfF5',
          200: '#afbfeb',
          500: '#2a4891',
          600: '#1e3a7a',
          700: '#162f65',
        },
        bg: '#f3f3f8',
      },
      keyframes: {
        scrollDot: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '60%': { transform: 'translateY(10px)', opacity: '0' },
          '61%': { transform: 'translateY(0)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        arrowBounce: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.3' },
          '50%': { transform: 'translateY(6px)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'scroll-dot': 'scrollDot 1.8s ease-in-out infinite',
        'arrow-1': 'arrowBounce 1.8s ease-in-out infinite 0s',
        'arrow-2': 'arrowBounce 1.8s ease-in-out infinite 0.2s',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
