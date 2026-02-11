// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Volvemos a una fecha estable
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  
  modules: ['@nuxt/ui'],

  ui: {
    global: true
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

  runtimeConfig: {
    public: {
      // SOLUCIÓN: Ponemos la URL "a fuego" aquí. 
      // Así nos aseguramos de que siempre apunte al Gateway de Kubernetes (30090).
      apiBase: 'http://194.163.170.169:30090'
    }
  }
})