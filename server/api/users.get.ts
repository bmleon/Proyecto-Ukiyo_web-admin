import postgres from 'postgres'

// Configuración usando las variables de entorno
const sql = postgres({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: false // Prueba con 'require' si falla, pero si DBeaver va sin SSL, aquí también
})

export default defineEventHandler(async (event) => {
  try {
    // Consulta SQL simple para traer todos los usuarios
    // Asegúrate de que la tabla se llama 'usuarios' o como la veas en DBeaver
    const usuarios = await sql`SELECT * FROM usuarios` 
    return usuarios
  } catch (error) {
    console.error('Error conectando a BD:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error de conexión a Base de Datos'
    })
  }
})