/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1F4E79',
          dark: '#153654',
          light: '#2B6396',
          sidebar: '#122B43',
        },
        orange: {
          accent: '#F97316',
          hover: '#EA580C',
          light: '#FFF0EA',
        },
        app: {
          bg: '#F4F6F9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(31, 78, 121, 0.05)',
        'card-hover': '0 10px 25px -5px rgba(31, 78, 121, 0.1)',
      },
    },
  },
  plugins: [],
};
