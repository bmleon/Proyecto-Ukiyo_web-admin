module.exports = {
  apps: [
    {
      name: 'ukiyo-admin',
      port: '3001', // CAMBIO: Usamos el 3001 para que no choque con el 3000
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}