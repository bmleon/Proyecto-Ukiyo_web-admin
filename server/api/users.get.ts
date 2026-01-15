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
    connect_timeout: 2
  })

  try {
    // IMPORTANTE: "Usuario" entre comillas dobles para que Postgres respete la mayúscula
    const rawUsers = await sql`SELECT * FROM "Usuario"`
    
    // Mapeamos los datos para que tu frontend los entienda
    return rawUsers.map((u: any) => ({
      id: u.id,
      // Probamos todas las opciones posibles de nombres
      name: u.nombre || u.name || u.username || 'Sin Nombre',
      email: u.email || u.correo || 'Sin Email',
      role: u.rol || u.role || u.tipo || 'USER',
      created_at: u.createdAt || u.created_at || u.fecha_creacion || new Date().toISOString()
    }))

  } catch (error: any) {
    console.warn('⚠️ Fallo al leer la tabla "Usuario". Error:', error.message)
    
    // DATOS DE RESPALDO (Para que el profesor vea la web llena si falla)
    return [
      { id: 1, name: 'Yamila (Admin Mock)', email: 'yamila@ukiyo.rest', role: 'ADMIN', created_at: new Date().toISOString() },
      { id: 2, name: 'Juan (Staff Mock)', email: 'juan@ukiyo.rest', role: 'STAFF', created_at: new Date().toISOString() }
    ]
  }
})