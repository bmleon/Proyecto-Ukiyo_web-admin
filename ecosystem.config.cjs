module.exports = {
  apps: [
    {
      name: 'ukiyo-admin',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      // AQUÍ ESTÁ EL CAMBIO: Forzamos las variables de entorno
      env: {
        PORT: 3001,
        HOST: '0.0.0.0',
        NODE_ENV: 'production'
      }
    }
  ]
}