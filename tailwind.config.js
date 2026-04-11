/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#166534",     // deep farm green
        accent: "#4ade80",      // fresh leaf green
        earth: "#854d0e",       // soil brown
      },
    },
  },
  plugins: [],
}