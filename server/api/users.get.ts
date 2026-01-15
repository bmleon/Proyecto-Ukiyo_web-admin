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
    // Consulta SQL a la tabla "Usuario"
    const rawUsers = await sql`
      SELECT id, username, email, roles, "createdAt" 
      FROM "Usuario"
    `
    
    return rawUsers.map((u: any) => {
      let mainRole = 'USER';
      if (Array.isArray(u.roles) && u.roles.length > 0) {
        mainRole = u.roles[0]; 
      } else if (typeof u.roles === 'string') {
        mainRole = u.roles;
      }

      return {
        id: u.id,
        name: u.username,
        email: u.email,
        role: mainRole,
        created_at: u.createdAt || new Date().toISOString()
      }
    })

  } catch (error: any) {
    console.error('❌ Error CRÍTICO en Base de Datos:', error)
    
    // AQUÍ ESTÁ EL CAMBIO:
    // En lugar de devolver datos falsos, lanzamos el error al frontend
    throw createError({
      statusCode: 500,
      statusMessage: 'Error de BD: ' + error.message,
      // Incluimos el detalle técnico para que puedas leerlo
      data: {
        code: error.code,
        detail: error.message
      }
    })
  }
})