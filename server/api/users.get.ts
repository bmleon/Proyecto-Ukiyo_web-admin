import postgres from 'postgres'

// Creamos la conexión usando los datos del archivo .env
const sql = postgres({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: false // Si en DBeaver no usaste SSL, aquí tampoco
})

export default defineEventHandler(async (event) => {
  try {
    // Hacemos la consulta SQL a la tabla real
    // IMPORTANTE: Verifica en DBeaver si la tabla se llama 'users' o 'usuarios'
    const users = await sql`
      SELECT id, name, email, role, created_at 
      FROM users
    `
    return users
  } catch (error) {
    console.error('Error FATAL conectando a la BD:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error de conexión con la Base de Datos'
    })
  }
})