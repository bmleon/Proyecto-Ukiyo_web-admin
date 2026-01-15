// @ts-ignore
import postgres from 'postgres'

export default defineEventHandler(async (event) => {
  // Leemos la configuración segura
  const config = useRuntimeConfig()

  // Creamos la conexión con los datos de config
  const sql = postgres({
    host: config.dbHost,
    port: Number(config.dbPort),
    database: config.dbName,
    username: config.dbUser,
    password: config.dbPassword,
    ssl: false,
    connect_timeout: 2
  })

  try {
    const users = await sql`SELECT id, name, email, role, created_at FROM users`
    return users
  } catch (error) {
    console.warn('⚠️ Fallo en BD Usuarios:', error)
    
    // MOCK DATA (RESPALDO)
    return [
      { id: 1, name: 'Yamila González (Admin)', email: 'yamila@ukiyo.rest', role: 'ADMIN', created_at: new Date().toISOString() },
      { id: 2, name: 'Juan Cocinero', email: 'juan@ukiyo.rest', role: 'STAFF', created_at: new Date().toISOString() },
      { id: 3, name: 'Cliente Ejemplo', email: 'cliente@gmail.com', role: 'USER', created_at: new Date().toISOString() },
      { id: 4, name: 'María Repartidora', email: 'maria@glovo.com', role: 'DRIVER', created_at: new Date().toISOString() }
    ]
  }
})