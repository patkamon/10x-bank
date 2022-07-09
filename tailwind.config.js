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
        'transfer': '250px minmax(30%, 1fr) 100px',
      }
    },
  },
  plugins: [],
}
