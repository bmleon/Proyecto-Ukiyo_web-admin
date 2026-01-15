// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // MÓDULO DE DISEÑO (Trae Tailwind y los componentes bonitos)
  modules: ['@nuxt/ui'],

  // Configuración de UI
  ui: {
    global: true,
  },

  // CSS Global (Para tus fuentes y ajustes finos)
  css: ['~/assets/css/main.css'],

  // Configuración de la cabecera
  app: {
    head: {
      title: 'Ukiyo Admin Panel',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        // Importamos la fuente Inter de Google Fonts para que se vea igual que la plantilla
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' }
      ]
    }
  },

  // Preferencia de color (Oscuro por defecto para Ukiyo)
  colorMode: {
    preference: 'dark'
  },
  
  // Variables de entorno (BD)
  runtimeConfig: {
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbName: process.env.DB_NAME,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    
    dbProdPort: process.env.DB_PROD_PORT,
    dbProdName: process.env.DB_PROD_NAME,
    dbProdUser: process.env.DB_PROD_USER,
    dbProdPassword: process.env.DB_PROD_PASSWORD
  },

  nitro: {
    externals: {
      inline: ['postgres']
    }
  }
})