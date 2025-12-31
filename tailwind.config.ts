import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5fbff",
          100: "#e8f6ff",
          200: "#c7e9ff",
          300: "#96d4ff",
          400: "#5ab9ff",
          500: "#2f9fff",
          600: "#117ee5",
          700: "#0a62b7",
          800: "#0b4c8f",
          900: "#0c3f74",
          950: "#08264a"
        }
      },
      boxShadow: {
        card: "0 16px 32px rgba(15, 23, 42, 0.12)",
        section: "0 24px 48px rgba(14, 116, 144, 0.15)"
      }
    }
  },
  plugins: []
};

export default config;
