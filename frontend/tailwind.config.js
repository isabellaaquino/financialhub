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
          100: "#f9fafb",
          200: "#ecefff",
          300: "#a2b5d7",
          500: "#4760E2",
          700: "#304880",
          800: "#243763",
          900: "#1e305b",
        },
      },
    },
  },
  plugins: [],
};
