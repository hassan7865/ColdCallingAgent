import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        "on-background": "var(--on-background)",
        surface: "var(--surface)",
        "surface-dim": "var(--surface-dim)",
        "surface-bright": "var(--surface-bright)",
        "surface-container-lowest": "var(--surface-container-lowest)",
        "surface-container-low": "var(--surface-container-low)",
        "surface-container": "var(--surface-container)",
        "surface-container-high": "var(--surface-container-high)",
        "surface-container-highest": "var(--surface-container-highest)",
        "surface-variant": "var(--surface-variant)",
        outline: "var(--outline)",
        "outline-variant": "var(--outline-variant)",
        primary: "var(--primary)",
        "primary-container": "var(--primary-container)",
        "on-primary": "var(--on-primary)",
        secondary: "var(--secondary)",
        "secondary-container": "var(--secondary-container)",
        "on-secondary": "var(--on-secondary)",
        tertiary: "var(--tertiary)",
        "tertiary-container": "var(--tertiary-container)",
      },
      borderRadius: {
        DEFAULT: "var(--radius-default)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
    },
  },
};

export default config;

