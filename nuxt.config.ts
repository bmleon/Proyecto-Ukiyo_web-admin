// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // Módulo principal para el diseño (incluye Tailwind por debajo)
  modules: ['@nuxt/ui'],

  // Configuración de la librería UI
  ui: {
    global: true, // Habilita componentes globales
    icons: ['heroicons'] // Pack de iconos por defecto
  },

  // Configuración de la cabecera (Título de la pestaña)
  app: {
    head: {
      title: 'Ukiyo Admin Panel',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  // Configuración opcional para forzar modo oscuro por defecto en el admin
  colorMode: {
    preference: 'dark'
  }
})
