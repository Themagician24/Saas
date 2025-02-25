import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      // Ajout des animations personnalisées
      animation: {
        sparkle: "sparkle 1.5s infinite",
        thunder: "thunder 2s infinite",
      },
      keyframes: {
        sparkle: {
          "0%, 100%": {
            "text-shadow":
              "0 0 5px #00FFFF, 0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 40px #00FFFF",
          },
          "50%": {
            "text-shadow":
              "0 0 10px #00FF7F, 0 0 20px #00FF7F, 0 0 40px #00FF7F, 0 0 80px #00FF7F",
          },
        },
        thunder: {
          "0%, 100%": { opacity: "0" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [require("daisyui")],

  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
    ],
  },
} satisfies Config;