export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  const gatewayUrl = config.public.apiBase || 'http://194.163.170.169:3000'

  try {
    console.log(`🔌 Conectando Usuarios a: ${gatewayUrl}/api/usuarios`)

    const response: any = await $fetch(`${gatewayUrl}/api/usuarios`, {
      method: 'GET',
      timeout: 5000
    })

    const usersList = Array.isArray(response) ? response : response.data || []

    return usersList.map((u: any) => ({
      id: u.id,
      name: u.username || u.nombre || 'Sin Nombre',
      email: u.email,
      role: Array.isArray(u.roles) ? u.roles[0] : (u.rol || 'USER'),
      created_at: u.createdAt || u.fechaCreacion || new Date().toISOString()
    }))

  } catch (error: any) {
    // Imprimimos el error completo en la consola de tu servidor (PowerShell)
    console.error(`❌ Error Gateway Usuarios:`, error)
    
    // Lanzamos un error HTTP real hacia el navegador
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.message || 'Fallo de conexión con el API Gateway',
      // Si el servidor de tu compañero llega a devolver un JSON con un mensaje de error, lo pasamos aquí
      data: error.data || null 
    })
  }
})