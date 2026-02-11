export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  // Usamos la IP pública del Gateway o la de defecto
  const gatewayUrl = config.public.apiBase || 'http://194.163.170.169:30090'

  try {
    console.log(`🔌 Conectando Pedidos a: ${gatewayUrl}/api/pedidos`)

    // 1. Intentar conectar con el Gateway
    // Asumimos ruta /api/pedidos (o /orders si es en inglés)
    const response: any = await $fetch(`${gatewayUrl}/api/pedidos`, {
      method: 'GET',
      timeout: 5000 // 5 segundos de espera máxima
    })

    const ordersList = Array.isArray(response) ? response : response.data || []
    
    // Si no hay pedidos, devolvemos array vacío (no es un error)
    // Pero si el servicio falla, saltará al catch
    
    return ordersList

  } catch (error: any) {
    // CAMBIO IMPORTANTE:
    // Ya no devolvemos datos falsos. Ahora lanzamos el error para verlo en pantalla.
    console.error(`❌ Error CRÍTICO conectando con Gateway Pedidos:`, error.message)
    
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: `Fallo al cargar pedidos: ${error.message}`,
      data: {
        url: `${gatewayUrl}/api/pedidos`,
        cause: error.cause
      }
    })
  }
})