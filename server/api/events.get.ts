export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const gatewayUrl = config.public.apiBase || 'http://194.163.170.169:30090'

  try {
    console.log(`🔌 Conectando Eventos a: ${gatewayUrl}/api/eventos`)

    // Intentamos conectar con el Gateway
    const response: any = await $fetch(`${gatewayUrl}/api/eventos`, {
        method: 'GET',
        timeout: 5000
    })

    const eventsList = Array.isArray(response) ? response : response.data || []
    return eventsList

  } catch (error: any) {
    console.error('❌ Error API Eventos:', error.message)
    
    // LANZAMOS EL ERROR REAL
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: `Fallo Eventos: ${error.message}`,
      data: { url: `${gatewayUrl}/api/eventos` }
    })
  }
})