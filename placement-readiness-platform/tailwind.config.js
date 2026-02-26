/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(245, 58%, 51%)',
          50: 'hsl(245, 58%, 95%)',
          100: 'hsl(245, 58%, 90%)',
          200: 'hsl(245, 58%, 80%)',
          300: 'hsl(245, 58%, 70%)',
          400: 'hsl(245, 58%, 60%)',
          500: 'hsl(245, 58%, 51%)',
          600: 'hsl(245, 58%, 45%)',
          700: 'hsl(245, 58%, 35%)',
          800: 'hsl(245, 58%, 25%)',
          900: 'hsl(245, 58%, 15%)',
        },
      },
    },
  },
  plugins: [],
}
