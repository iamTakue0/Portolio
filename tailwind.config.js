/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#efeee8",
        acid: "#c6ff3d",
        ink: "#0b0b0c",
      },
      fontFamily: {
        display: ["Anton", "Impact", "sans-serif"],
        sans: ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: [],
};
