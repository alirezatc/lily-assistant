import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#0f766e", fg: "#ffffff" },
      },
    },
  },
  plugins: [],
} satisfies Config;
