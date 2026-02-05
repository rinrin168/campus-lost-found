import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
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
};

export default config;

