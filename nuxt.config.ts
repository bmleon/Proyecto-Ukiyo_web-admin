// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  modules: ['@nuxt/ui'],

  ui: {
    global: true
    // La propiedad 'icons' se ha eliminado porque Heroicons ya viene por defecto
  },

  app: {
    head: {
      title: 'Ukiyo Admin Panel',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  colorMode: {
    preference: 'dark'
  },

  nitro: {
    externals: {
      inline: ['postgres']
    }
  },

  // --- AÑADE ESTO: Configuración de Variables ---
  runtimeConfig: {
    // Estas variables solo están disponibles en el servidor (seguro)
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbName: process.env.DB_NAME,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    
    dbProdPort: process.env.DB_PROD_PORT,
    dbProdName: process.env.DB_PROD_NAME,
    dbProdUser: process.env.DB_PROD_USER,
    dbProdPassword: process.env.DB_PROD_PASSWORD
  }
})