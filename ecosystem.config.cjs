module.exports = {
  apps: [
    {
      name: 'ukiyo-admin',
      port: '3001',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      env: {
        // CONFIGURACIÓN DEL SERVIDOR
        PORT: 3001,
        HOST: '0.0.0.0',
        NODE_ENV: 'production',

        // NUEVA URL DEL GATEWAY (KUBERNETES)
        NUXT_PUBLIC_API_BASE: 'http://194.163.170.169:30090'
      }
    }
  ]
}