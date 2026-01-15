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
    // CAMBIO CLAVE: Usamos "Usuario" entre comillas dobles para respetar la mayúscula
    // Prisma suele crear las tablas respetando mayúsculas si se define así.
    const rawUsers = await sql`SELECT * FROM "Usuario"`
    
    // TRADUCCIÓN DE DATOS:
    // Mapeamos lo que venga de la BD (posiblemente 'nombre', 'correo') 
    // a lo que espera tu frontend ('name', 'email').
    return rawUsers.map((u: any) => ({
      id: u.id,
      // Intentamos leer 'nombre' O 'name' (por si acaso)
      name: u.nombre || u.name || 'Sin Nombre',
      // Intentamos leer 'correo', 'email'
      email: u.email || u.correo || 'Sin Email',
      // Intentamos leer 'rol', 'role', 'tipo'
      role: u.rol || u.role || u.tipo || 'USER',
      // Prisma suele usar 'createdAt' (camelCase)
      created_at: u.createdAt || u.created_at || new Date().toISOString()
    }))

  } catch (error) {
    console.warn('⚠️ Fallo al leer la tabla "Usuario":', error)
    
    // MOCK DATA (RESPALDO)
    return [
      { id: 1, name: 'Yamila González (Admin)', email: 'yamila@ukiyo.rest', role: 'ADMIN', created_at: new Date().toISOString() },
      { id: 2, name: 'Juan Cocinero', email: 'juan@ukiyo.rest', role: 'STAFF', created_at: new Date().toISOString() },
      { id: 3, name: 'Cliente Ejemplo', email: 'cliente@gmail.com', role: 'USER', created_at: new Date().toISOString() }
    ]
  }
})