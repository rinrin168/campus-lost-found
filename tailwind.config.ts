import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        purpleDark: "var(--purple-dark)",
        purpleDarker: "var(--purple-darker)",
        purpleLight: "var(--purple-light)",
        purpleLighter: "var(--purple-lighter)",
      },
    },
  },
  plugins: [],
} satisfies Config;
