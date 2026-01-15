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
    // 1. Listar tablas
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    // 2. Intentar leer la tabla "Usuario" (con comillas por si acaso)
    let pruebaUsuario = 'No se pudo leer'
    try {
        // OJO: Usamos comillas dobles para respetar la mayúscula
        const data = await sql`SELECT * FROM "Usuario" LIMIT 1`
        pruebaUsuario = data as any
    } catch (e: any) {
        pruebaUsuario = 'Error leyendo "Usuario": ' + e.message
    }

    return { 
      estado: 'CONECTADO ✅',
      tablas: tables,
      datos_usuario: pruebaUsuario
    }

  } catch (error: any) {
    return { 
      estado: 'ERROR DE CONEXIÓN ❌',
      error: error.message,
      stack: error.stack
    }
  }
})