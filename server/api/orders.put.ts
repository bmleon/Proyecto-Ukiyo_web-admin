export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  
  const gatewayUrl = config.public.apiBase || 'http://194.163.170.169:30090'

  // ID del pedido que queremos actualizar
  // Si tu frontend envía el ID dentro del body, lo sacamos de ahí.
  // Si la ruta del gateway es /api/pedidos/:id, la construimos.
  const orderId = body.id
  const newStatus = body.status

  try {
    console.log(`📤 Actualizando pedido #${orderId} a estado: ${newStatus}`)

    // Petición PUT/PATCH al Gateway
    const response = await $fetch(`${gatewayUrl}/api/pedidos/${orderId}`, {
      method: 'PATCH', // O 'PUT', depende de cómo lo tenga tu compañero
      body: { 
        estado: newStatus, // O 'status' si es en inglés
        status: newStatus 
      }
    })

    return response

  } catch (error: any) {
    console.error('❌ Error actualizando pedido:', error.message)
    
    // Lanzamos el error real para que el frontend muestre la alerta roja
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.data?.message || error.message || 'No se pudo actualizar el estado'
    })
  }
})