export default defineNuxtConfig({
  // ... resto de config ...

  runtimeConfig: {
    // Variables privadas (solo servidor)
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    // ... resto de variables de BD ...

    // Variables públicas (disponibles en cliente y servidor)
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000'
    }
  }
})