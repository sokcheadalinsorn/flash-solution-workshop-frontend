/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#25291F',
        muted: '#77786B',
        cream: '#F5F3E9',
        rose: '#71865A',
        blush: '#E4E8D5',
        line: '#D9DDCE',
        sage: '#8B9A6D',
        gold: '#C5C9A8',
        wine: '#40563B'
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Lato', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 12px 35px rgba(45, 35, 28, 0.08)',
        luxe: '0 24px 65px rgba(79,49,42,.16)'
      }
    }
  },
  plugins: []
}
