/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontSize: {
        sm: ".889rem",
        md: "1rem",
        lg: "1.125rem",
        xl: "1.266rem",
        "2xl": "1.424rem",
        "3xl": "1.602rem",
        "4xl": "2.281rem",
      },
      colors: {
        gray: {
          300: "#ECEFFF",
        },
        blue: {
          100: "#f8f9ff",
          200: "#ecefff",
          500: "#4760E2",
          800: "#243763",
        },
        yellow: {
          100: "#F8F9FF",
        },
      },
    },
  },
  plugins: [],
};
