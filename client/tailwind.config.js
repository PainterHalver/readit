module.exports = {
  content: ["./src/**/*.tsx"],
  darkMode: "class",
  theme: {
    fontFamily: {
      body: ["IBM Plex Sans"],
    },
    extend: {
      // ADDING MORE TO TAILWIND
      colors: {
        blue: {
          100: "#cce4f6",
          200: "#99c9ed",
          300: "#66afe5",
          400: "#3394dc",
          500: "#0079d3",
          600: "#0061a9",
          700: "#00497f",
          800: "#003054",
          900: "#00182a",
        },
        gray: {
          body: "#DAE0E6",
        },
        dark: {
          body: "#030303",
          navbar: "#1A1A1B",
          search: "#272729",
          border: "#474748",
          card: "#1A1A1B",
          vote: "#161617"
        }
      },
      spacing: {
        70: "17.5rem", // 280px
        160: "40rem", // p-160, m-160, h-160
      },
      container: false, // disable default
    },
  },
  variants: {
    extend: {
      backgroundColor: ["disabled"],
      borderColor: ["disabled"],
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".container": {
          width: "100%",
          marginLeft: "auto",
          marginRight: "auto",
          "@screen sm": { maxWidth: "640px" },
          "@screen md": { maxWidth: "768px" },
          "@screen lg": { maxWidth: "975px" },
        },
      });
    },
  ],
};
