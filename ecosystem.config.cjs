module.exports = {
  apps: [
    {
      name: 'ukiyo-admin',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs' // Esta es la ruta donde Nuxt construye la app
    }
  ]
}