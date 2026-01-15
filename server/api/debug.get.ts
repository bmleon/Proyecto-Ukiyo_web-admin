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
    // 1. Preguntar qué tablas existen en el esquema público
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    // 2. Intentar sacar una fila de ejemplo de la tabla 'users' (si existe)
    let sampleData = 'La tabla users no existe'
    try {
        // Intentamos leer la primera fila para ver los nombres de las columnas
        const data = await sql`SELECT * FROM users LIMIT 1`
        sampleData = data
    } catch (e: any) { // <--- CORRECCIÓN AQUÍ: Añadido : any
        sampleData = 'Error al leer users: ' + e.message
    }

    return { 
      estado_conexion: '✅ CONECTADO',
      tablas_encontradas: tables,
      prueba_tabla_users: sampleData
    }

  } catch (error: any) { // <--- CORRECCIÓN AQUÍ: Añadido : any
    return { 
      estado_conexion: '❌ ERROR',
      detalle: error.message 
    }
  }
})