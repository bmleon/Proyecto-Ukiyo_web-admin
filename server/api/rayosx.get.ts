// @ts-ignore
import postgres from 'postgres'

export default defineEventHandler(async (event) => {
  // Leemos la configuración de arranque (ecosystem.config.cjs)
  // O usamos process.env directamente si no hay runtimeConfig
  const dbConfig = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: false,
    connect_timeout: 3
  }

  const sql = postgres(dbConfig)

  try {
    // 1. LISTAR TODAS LAS TABLAS (Esquema public)
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    // 2. LISTAR COLUMNAS DE TODAS LAS TABLAS ENCONTRADAS
    // CORRECCIÓN: Definimos el tipo para permitir claves dinámicas
    const structure: Record<string, any[]> = {}
    
    for (const t of tables) {
      const tableName = t.table_name
      const columns = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = ${tableName}
      `
      // CORRECCIÓN: Tipamos 'c' como any
      structure[tableName] = columns.map((c: any) => c.column_name)
    }

    return {
      estado: '✅ CONEXIÓN EXITOSA',
      config_usada: { host: dbConfig.host, db: dbConfig.database, user: dbConfig.username }, // No mostramos password por seguridad
      estructura_real: structure
    }

  } catch (error: any) {
    return {
      estado: '❌ ERROR DE CONEXIÓN',
      mensaje: error.message,
      codigo: error.code,
      pista: error.code === '28P01' ? 'Contraseña incorrecta' : 'Revisa IP o Puerto'
    }
  }
})