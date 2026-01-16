/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // <--- THIS LINE IS CRITICAL
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ea580c', // Your custom orange color
      }
    },
  },
  plugins: [],
}