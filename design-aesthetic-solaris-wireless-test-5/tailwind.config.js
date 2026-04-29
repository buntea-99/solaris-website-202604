/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        solaris: {
          50: '#fcfceb',
          100: '#f8f9cd',
          200: '#f3f19c',
          300: '#efe661',
          400: '#ebd92e',
          500: '#dfc618',
          600: '#c49a1a', // Original brand gold
          700: '#9d7311',
          800: '#815b15',
          900: '#6c4a17',
          950: '#3f280a',
        },
        slate: {
          850: '#162032',
          900: '#0f172a',
          950: '#090e1a', // Deeper premium black
        }
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
