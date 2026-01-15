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

        // BASE DE DATOS USUARIOS (Actualizado con tus credenciales)
        DB_HOST: '194.163.170.169',
        DB_PORT: '5435',
        DB_NAME: 'bd_usuarios',
        DB_USER: 'belen',
        DB_PASSWORD: 'belen123',

        // BASE DE DATOS PRODUCTOS (Copiado de tu .env)
        DB_PROD_PORT: '5436',
        DB_PROD_NAME: 'bd_productos',
        DB_PROD_USER: 'user_productos',
        DB_PROD_PASSWORD: 'password_productos'
      }
    }
  ]
}