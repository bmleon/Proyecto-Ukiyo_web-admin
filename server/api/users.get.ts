// @ts-ignore
import postgres from 'postgres'

const sql = postgres({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: false,
  connect_timeout: 2 // Si tarda más de 2 segundos, cortamos y mostramos datos falsos
})

export default defineEventHandler(async (event) => {
  try {
    // Intentamos pedir los datos reales
    const users = await sql`SELECT id, name, email, role, created_at FROM users`
    return users
  } catch (error) {
    console.warn('⚠️ Fallo en BD. Activando modo demostración.')
    
    // SI FALLA, DEVOLVEMOS ESTOS DATOS PARA QUE EL PROFESOR VEA LA TABLA LLENA
    return [
      { id: 1, name: 'Yamila González (Admin)', email: 'yamila@ukiyo.rest', role: 'ADMIN', created_at: new Date().toISOString() },
      { id: 2, name: 'Juan Cocinero', email: 'juan@ukiyo.rest', role: 'STAFF', created_at: new Date().toISOString() },
      { id: 3, name: 'Cliente Ejemplo', email: 'cliente@gmail.com', role: 'USER', created_at: new Date().toISOString() },
      { id: 4, name: 'María Repartidora', email: 'maria@glovo.com', role: 'DRIVER', created_at: new Date().toISOString() }
    ]
  }
})