import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          sky: "#6ec6f1",
          skyDark: "#4dafe2",
          skyLight: "#eaf7fd",
          skyGlow: "rgba(110, 198, 241, 0.35)",
        },
        concrete: {
          50: "#f8f9fa",
          100: "#f1f3f5",
          200: "#e9ecef",
          300: "#dee2e6",
          400: "#ced4da",
          500: "#adb5bd",
          600: "#6c757d",
          700: "#495057",
          800: "#343a40",
          900: "#212529",
        },
        noir: {
          base: "#111114",
          surface: "#18181d",
          card: "#202026",
          hover: "#272730",
        }
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "sans-serif"],
        mono: ["var(--font-space)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
