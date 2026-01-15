// @ts-ignore
import postgres from 'postgres'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const sql = postgres({
    host: config.dbHost,
    port: Number(config.dbPort),
    database: config.dbName,
    username: config.dbUser,
    password: config.dbPassword,
    ssl: false,
    connect_timeout: 3
  })

  try {
    // 1. Consulta SQL usando el nombre EXACTO de la tabla: "Usuario"
    // Seleccionamos las columnas que vimos en tu entidad
    const rawUsers = await sql`
      SELECT id, username, email, rol, "createdAt" 
      FROM "Usuario"
    `
    
    // 2. Mapeo de datos para el Frontend
    // Convertimos lo que viene de la BD a lo que espera tu tabla visual (name, role...)
    return rawUsers.map((u: any) => ({
      id: u.id,
      name: u.username,       // En tu entidad es 'username', en el frontend 'name'
      email: u.email,
      role: u.rol,           // En tu entidad es 'rol', en el frontend 'role'
      created_at: u.createdAt || u.created_at || new Date().toISOString()
    }))

  } catch (error: any) {
    console.warn('⚠️ Fallo al leer la tabla "Usuario". Error:', error.message)
    
    // DATOS DE RESPALDO (Si falla la conexión, mostramos esto)
    return [
      { id: '1', name: 'Yamila (Admin Mock)', email: 'yamila@ukiyo.rest', role: 'ADMIN', created_at: new Date().toISOString() },
      { id: '2', name: 'Juan (Staff Mock)', email: 'juan@ukiyo.rest', role: 'STAFF', created_at: new Date().toISOString() }
    ]
  }
})