/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        // TUS COLORES DE MARCA
        'ukiyo-gold': '#C5A059',
        'ukiyo-dark': '#121212',
        'ukiyo-nav': '#1E1E1E',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Usamos Inter como la plantilla original
      }
    },
  },
  plugins: [],
}