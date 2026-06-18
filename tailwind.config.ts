import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // warm rose/pink brand
        brand: { DEFAULT: "#e84a8a", fg: "#ffffff", soft: "#fff0f6", deep: "#c81e6a" },
        blush: "#fff5f9",
      },
      fontFamily: {
        sans: ["var(--font-quicksand)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 6px 20px -8px rgba(232,74,138,0.25)",
      },
    },
  },
  plugins: [],
} satisfies Config;
