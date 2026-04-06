import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#005cbb",
          dim: "#0050a5",
          container: "#d7e2ff",
          "on-container": "#0050a3",
          fixed: "#d7e2ff",
          "fixed-dim": "#c1d5ff",
          "on-fixed": "#003e81",
          "on-fixed-variant": "#0059b6",
        },
        secondary: {
          DEFAULT: "#5d5f65",
          container: "#e2e2e9",
          "on-container": "#505157",
          fixed: "#e2e2e9",
          dim: "#515359",
          "on-fixed": "#3d3f45",
          "on-fixed-variant": "#5a5b61",
        },
        tertiary: {
          DEFAULT: "#5e5c78",
          container: "#dad6f7",
          "on-container": "#4b4a65",
          fixed: "#dad6f7",
          "on-fixed": "#393751",
          "on-fixed-variant": "#55536f",
          "fixed-dim": "#ccc9e9",
        },
        surface: {
          DEFAULT: "#faf8fe",
          bright: "#faf8fe",
          container: "#ecedf7",
          "container-low": "#f3f3fb",
          "container-lowest": "#ffffff",
          "container-high": "#e6e7f4",
          "container-highest": "#dfe2f0",
          dim: "#d6d9ea",
          tint: "#005cbb",
        },
        background: "#faf8fe",
        "on-surface": "#2e323d",
        "on-surface-variant": "#5b5f6b",
        outline: "#777a87",
        "outline-variant": "#aeb1bf",
        inverse: {
          surface: "#0d0e12",
          "on-surface": "#9d9ca1",
          primary: "#438fff",
        },
        error: {
          DEFAULT: "#9f403d",
          container: "#fe8983",
          "on-container": "#752121",
          dim: "#4e0309",
        },
        "on-error": "#fff7f6",
        "on-primary": "#f7f7ff",
        "on-secondary": "#f9f8ff",
        "on-tertiary": "#fcf7ff",
        "on-background": "#2e323d",
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
        full: "9999px",
      },
      fontFamily: {
        headline: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
      },
      boxShadow: {
        cloud: "0 20px 40px rgba(46, 50, 61, 0.06)",
        "cloud-sm": "0 10px 30px rgba(46, 50, 61, 0.03)",
        "cloud-hover": "0 20px 40px rgba(0, 92, 187, 0.08)",
        "primary/20": "0 10px 30px rgba(0, 92, 187, 0.2)",
      },
      spacing: {
        section: "8rem",
        component: "2rem",
        internal: "1.5rem",
      },
      backdropBlur: {
        glass: "20px",
      },
    },
  },
  plugins: [],
};
export default config;
