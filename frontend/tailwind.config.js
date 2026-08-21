/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        governance: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          500: '#334e68',
          700: '#102a43',
          800: '#081c24',
          900: '#030e12',
        },
        indiaSaffron: '#FF9933',
        indiaGreen: '#138808',
        indiaBlue: '#000080',
      }
    },
  },
  plugins: [],
}
