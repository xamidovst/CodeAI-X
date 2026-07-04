/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          950: '#050507',
          900: '#0a0a0f',
          850: '#0d0d13',
          800: '#121218',
          700: '#1b1b23',
        },
        crimson: {
          300: '#ff8095',
          400: '#ff4d68',
          500: '#ff1b3c',
          600: '#e00e2c',
          700: '#b30d24',
          900: '#3d0710',
        },
        ash: {
          100: '#f5f5f7',
          300: '#c7c7cf',
          500: '#8f8f9a',
          700: '#54545e',
        },
      },
      fontFamily: {
        display: ['"Clash Display"', '"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(255, 27, 60, 0.35), 0 0 60px rgba(255, 27, 60, 0.12)',
        'glow-lg': '0 0 40px rgba(255, 27, 60, 0.45), 0 0 100px rgba(255, 27, 60, 0.18)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.45)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.55', filter: 'blur(60px)' },
          '50%': { opacity: '0.9', filter: 'blur(80px)' },
        },
        'grid-move': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '48px 48px' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 5s ease-in-out infinite',
        'grid-move': 'grid-move 3s linear infinite',
        blink: 'blink 1s step-start infinite',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
};
