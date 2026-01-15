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
    // PASO 1: DETECTIVE DE TABLAS
    // Buscamos cuál es el nombre real de la tabla de usuarios en la BD
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND (table_name ILIKE 'user%' OR table_name ILIKE 'usu%' OR table_name ILIKE 'User%')
    `

    // Si no encuentra ninguna tabla parecida, lanzamos error controlado
    if (tables.length === 0) throw new Error('No se encontró ninguna tabla de usuarios (ni Usuario, ni users, ni User)')

    // Nos quedamos con la primera que encuentre (ej: "Usuario")
    const realTableName = tables[0].table_name

    // PASO 2: CONSULTA DINÁMICA
    // Usamos sql.unsafe() porque el nombre de la tabla es variable. Es seguro aquí porque lo acabamos de leer de la propia BD.
    // Traemos TODAS las columnas (*) para no fallar si falta alguna.
    const rawUsers = await sql.unsafe(`SELECT * FROM "${realTableName}" LIMIT 100`)
    
    // PASO 3: MAPEO INTELIGENTE
    // Convertimos lo que llegue a lo que necesita tu web
    return rawUsers.map((u: any) => ({
      id: u.id,
      // Buscamos cualquier campo que parezca un nombre
      name: u.username || u.nombre || u.name || u.firstName || 'Sin Nombre',
      // Buscamos el email
      email: u.email || u.correo || u.mail || 'Sin Email',
      // Buscamos el rol
      role: u.rol || u.role || u.tipo || 'USER',
      // Buscamos la fecha
      created_at: u.createdAt || u.created_at || u.fecha_creacion || new Date().toISOString()
    }))

  } catch (error: any) {
    console.warn('⚠️ Error inteligente:', error.message)
    
    // DATOS DE RESPALDO (Si todo falla, mostramos esto)
    return [
      { id: 'MOCK-1', name: 'Yamila (Admin Mock)', email: 'yamila@ukiyo.rest', role: 'ADMIN', created_at: new Date().toISOString() },
      { id: 'MOCK-2', name: 'Fallo de Conexión', email: 'revisa@logs.com', role: 'ERROR', created_at: new Date().toISOString() }
    ]
  }
})