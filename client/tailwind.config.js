/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // This is how to initialize any font and use it like font-lato as it's fontFamily
      fontFamily:{
        lato:"'Lato',sans-serif"
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

