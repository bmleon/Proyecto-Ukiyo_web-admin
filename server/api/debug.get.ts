// @ts-ignore
import postgres from 'postgres'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // 1. PRUEBA BASE DE DATOS (La que da problemas)
  let dbStatus = 'Pendiente'
  let tables = []
  
  try {
    const sql = postgres({
      host: config.dbHost,
      port: Number(config.dbPort),
      database: config.dbName,
      username: config.dbUser,
      password: config.dbPassword,
      ssl: false,
      connect_timeout: 2
    })
    
    const result = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
    dbStatus = '✅ CONECTADO A BD DIRECTA'
    tables = result.map((t: any) => t.table_name)
  } catch (error: any) {
    dbStatus = '❌ ERROR BD: ' + error.message
  }

  // 2. PRUEBA API GATEWAY (La solución recomendada)
  // Intentamos conectar al puerto 3000 donde está el Gateway de tu compañero
  let apiStatus = 'Pendiente'
  let apiData = null
  const gatewayUrl = `http://${config.dbHost}:3000` // Asumimos puerto 3000 estándar

  try {
    // Intentamos pedir la salud del sistema o la lista de usuarios al Gateway
    // Ajusta '/usuarios' o '/users' según las rutas de tu compañero
    apiData = await $fetch(`${gatewayUrl}/health`, { timeout: 2000 }).catch(() => 'Ruta /health no existe')
    apiStatus = '✅ CONECTADO A API GATEWAY (Puerto 3000 abierto)'
  } catch (error: any) {
    apiStatus = '❌ ERROR API GATEWAY: ' + error.message
  }

  return {
    diagnostico_base_datos: dbStatus,
    tablas_bd: tables,
    diagnostico_api_gateway: apiStatus,
    url_gateway_probada: gatewayUrl,
    mensaje: "Si el API Gateway conecta, DEBERÍAS usar eso en lugar de la BD directa."
  }
})