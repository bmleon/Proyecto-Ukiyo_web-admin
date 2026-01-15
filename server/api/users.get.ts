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
    // CORRECCIÓN: Pedimos 'roles' (plural) en lugar de 'rol'
    const rawUsers = await sql`
      SELECT id, username, email, roles, "createdAt" 
      FROM "Usuario"
    `
    
    return rawUsers.map((u: any) => {
      // Lógica para sacar el rol principal del array
      // Si roles es ["ADMIN", "USER"], nos quedamos con "ADMIN"
      let mainRole = 'USER';
      if (Array.isArray(u.roles) && u.roles.length > 0) {
        mainRole = u.roles[0]; 
      } else if (typeof u.roles === 'string') {
        mainRole = u.roles; // Por si acaso viene como string
      }

      return {
        id: u.id,
        name: u.username,
        email: u.email,
        role: mainRole, // Asignamos el rol procesado
        created_at: u.createdAt || new Date().toISOString()
      }
    })

  } catch (error: any) {
    console.warn('⚠️ Fallo al leer la tabla "Usuario". Error:', error.message)
    
    // MOCK DATA DE EMERGENCIA
    return [
      { id: 'ERR', name: 'Error SQL', email: error.message, role: 'ERROR', created_at: new Date().toISOString() },
      { id: '1', name: 'Yamila (Demo)', email: 'yamila@ukiyo.rest', role: 'ADMIN', created_at: new Date().toISOString() }
    ]
  }
})