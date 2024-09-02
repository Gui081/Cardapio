/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",    // Inclui arquivos HTML na pasta principal
    "./*.js",      // Inclui arquivos JS na pasta principal
  ],
  theme: {
    fontFamily:{
      'sans': ['Poppins, sans-serif']
    },
    extend: {
      backgroundImage:{
        "home": "url('/assets/bg.png')"
      }
    },
  },
  plugins: [],
}


