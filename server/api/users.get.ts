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
    // INTENTO 1: Usando la definición exacta de tu TypeORM ("Usuario")
    // Seleccionamos 'username' y lo renombramos a 'name' para que el frontend lo entienda
    try {
      const users = await sql`
        SELECT id, username as name, email, rol as role, "createdAt" as created_at 
        FROM "Usuario"
      `
      return users
    } catch (e) {
      console.log('Intento 1 ("Usuario") falló, probando minúsculas...')
      
      // INTENTO 2: Probamos en minúsculas por si acaso ('usuario')
      const users = await sql`
        SELECT id, username as name, email, rol as role, created_at 
        FROM usuario
      `
      return users
    }

  } catch (error: any) {
    console.error('❌ Error FATAL leyendo usuarios:', error.message)
    
    // Si llegamos aquí, mostramos un error visible en la tabla falsa para que sepas qué pasa
    return [
      { 
        id: 'ERR', 
        name: 'ERROR CONEXIÓN', 
        email: error.message, // <--- Aquí verás el error real en la web
        role: 'ERROR', 
        created_at: new Date().toISOString() 
      },
      { id: 1, name: 'Yamila (Demo)', email: 'yamila@ukiyo.rest', role: 'ADMIN', created_at: new Date().toISOString() }
    ]
  }
})