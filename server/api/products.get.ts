export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // Usamos la configuración pública
  const gatewayUrl = config.public.apiBase 

  try {
    console.log(`🔌 Conectando Productos a: ${gatewayUrl}/api/productos`)

    // Petición con un timeout de 5s
    const response: any = await $fetch(`${gatewayUrl}/api/productos`, {
      method: 'GET',
      timeout: 5000
    })

    const productsList = Array.isArray(response) ? response : response.data || []
    
    return productsList.map((p: any) => ({
      id: p.id,
      name: p.nombre || p.name || 'Sin Nombre',
      description: p.descripcion || '',
      price: Number(p.precio),
      category: p.categoria || 'General',
      status: p.disponible ?? true
    }))

  } catch (error: any) {
    console.error('❌ Error Gateway Productos:', error)
    
    // CAMBIO: Lanzamos el error con el formato estándar para que coincida con Pedidos
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: `Fallo al cargar productos: ${error.message}`,
      data: error.data
    })
  }
})