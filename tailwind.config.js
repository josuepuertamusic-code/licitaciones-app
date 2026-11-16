/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#14181F", light: "#3A3F47", soft: "#F1F0EC" },
        accent: "#9A7B4F",
        ok: "#3F6B4F",
        danger: "#A63D3D",
        ink: "#14181F",
        muted: "#8A8A85",
        line: "#E8E6E1",
        surface: "#FAFAF9",
      },
      fontFamily: {
        light: ["Poppins_300Light"],
        body: ["Poppins_400Regular"],
        semi: ["Poppins_500Medium"],
        bold: ["Poppins_500Medium"],
      },
    },
  },
  plugins: [],
};
