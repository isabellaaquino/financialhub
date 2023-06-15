/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        logo: ["Poppins", "ui-sans-serif", "system-ui"],
      },
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
          200: "#94a4b5",
          300: "#363c42",
          400: "#768493",
        },
        black: {
          300: "#363a3e",
          400: "#272b2f",
          500: "#1a1d20",
        },
        blue: {
          100: "#f9fafb",
          200: "#ecefff",
          300: "#a2b5d7",
          500: "#4760E2",
          600: "#41418e",
          700: "#304880",
          800: "#243763",
          900: "#1e305b",
        },
        green: {
          500: "#28bd62",
          600: "#219950",
        },
      },
    },
  },
  plugins: [],
};
