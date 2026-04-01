/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./App.jsx"],
  theme: {
    extend: {
      colors: {
        lime: {
          DEFAULT: '#CCFF00',
        }
      }
    },
  },
  plugins: [],
}
