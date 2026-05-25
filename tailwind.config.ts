import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        raleway: ["var(--font-raleway)", "sans-serif"],
      },
      colors: {
        brand: {
          700: "#0A7B75",
          900: "#10514E",
        },
        mist: {
          25: "#FCFCFC",
          100: "#F1F3F3",
          400: "#9CA8AB",
          600: "#4B585B",
          900: "#161B1D",
        },
      },
    },
  },
  plugins: [],
};

export default config;
