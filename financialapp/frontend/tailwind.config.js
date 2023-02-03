/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        gray: {
          300: "#ECEFFF",
        },
        blue: {
          500: "#4760E2",
        },
        yellow: {
          100: "#F8F9FF",
        },
      },
    },
  },
  plugins: [],
};
