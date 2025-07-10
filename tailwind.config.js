/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // Enables dark mode using 'class'
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'green-primary': '#2e7d32',       // Darker Green
        'green-secondary': '#66bb6a',     // Lighter Green
        'green-darkest': '#1b5e20',       // Even Darker Green for text
        'blue-gray-dark': '#2c3e50',
        'blue-gray-medium': '#546e7a',
        'light-blue-gray': '#c3cfe2',
        'light-green-bg': '#e8f5e8',
        'lighter-green-bg': '#f1f8e9',
        'mint-green': '#a5d6a7',
      },
      boxShadow: {
        'green-light': '0 8px 32px rgba(46, 125, 50, 0.1)',
        'green-medium': '0 10px 25px rgba(46, 125, 50, 0.3)',
        'green-large': '0 20px 60px rgba(46, 125, 50, 0.15)',
        'default': '0 10px 40px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        '4xl': '50px',
        '3xl': '30px',
        '20px': '20px',
        '15px': '15px',
      },
    },
  },
  plugins: [],
};
