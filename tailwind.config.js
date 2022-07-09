/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'scb1': 'rgb(75,40,133)',
        'scb2': 'rgb(180,30,142)',
        'scb3': 'rgb(252,175,23)',
      },
      gridTemplateColumns: {
        'transfer': 'minmax(10%, 250px) minmax(30%, 1fr) minmax(10%, 100px)',
      },
      screens: {
        'xs': '320px',
      }
    },
  },
  plugins: [],
}
