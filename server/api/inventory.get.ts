export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const gatewayUrl = config.public.apiBase || 'http://194.163.170.169:30090'

  try {
    console.log(`🔌 Conectando Inventario a: ${gatewayUrl}/api/inventario`)

    const response: any = await $fetch(`${gatewayUrl}/api/inventario`, { 
      method: 'GET', 
      timeout: 5000 
    })
    
    return Array.isArray(response) ? response : response.data || []

  } catch (error: any) {
    console.error('❌ Error API Inventario:', error.message)
    
    // LANZAMOS ERROR REAL
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: `Fallo Inventario: ${error.message}`,
      data: { url: `${gatewayUrl}/api/inventario` }
    })
  }
})