/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        //red
        primary: {
          50: "#FFE8E8",
          100: "#FFD1D1",
          200: "#FFA3A3",
          300: "#FF7575",
          400: "#FF4747",
          500: "#E53935", // Main primary red
          600: "#CC2D2A",
          700: "#B32220",
          800: "#991615",
          900: "#800B0A",
        },
        //blue
        secondary: {
          50: "#E8EEF6",
          100: "#D1DEE9",
          200: "#A3BDD3",
          300: "#759CBD",
          400: "#477BA7",
          500: "#2C4B7C", // Main secondary blue
          600: "#234063",
          700: "#1A354A",
          800: "#112A31",
          900: "#081F18",
        },
        //Teal
        accent: {
          50: "#E6F6F5",
          100: "#CCEDEB",
          200: "#99DBD7",
          300: "#66C9C3",
          400: "#4DB6AC", // Main accent teal
          500: "#339E93",
          600: "#297E75",
          700: "#1F5E57",
          800: "#143E39",
          900: "#0A1F1C",
        },
        // Neutral gray for backgrounds
        neutral: {
          50: "#F5F5F5",
          60: "#ededed",
          100: "#EBEBEB",
          200: "#D6D6D6",
          300: "#C2C2C2",
          400: "#ADADAD",
          500: "#999999",
          600: "#757575",
          700: "#666666",
          800: "#424242", // Dark gray for text
          900: "#1A1A1A",
        },
      },
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
        kufi: ["Noto Kufi Arabic", "sans-serif"],
        ibm: ["IBM Plex Sans Arabic", "sans-serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.25rem" }],
        sm: ["0.875rem", { lineHeight: "1.5rem" }],
        base: ["1rem", { lineHeight: "1.75rem" }],
        lg: ["1.125rem", { lineHeight: "2rem" }],
        xl: ["1.25rem", { lineHeight: "2.25rem" }],
        "2xl": ["1.5rem", { lineHeight: "2.5rem" }],
        "3xl": ["2rem", { lineHeight: "2.75rem" }],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 3s infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        }
      },
    },
  },
  plugins: [],
};
