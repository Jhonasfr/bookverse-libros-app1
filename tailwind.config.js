/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./context/**/*.{js,jsx,ts,tsx}",
    "./services/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#1F3A5F',
        secondary: '#C17C3A',
        accent: '#7B2D26',
        cream: '#F7F1E8',
        paper: '#FFFDFC',
        ink: '#1E293B',
        muted: '#64748B',
      },
      boxShadow: {
        card: '0 10px 24px rgba(31, 58, 95, 0.08)',
      }
    },
  },
  plugins: [],
};
