export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  
  // Usamos el puerto 30090
  const gatewayBase = config.public.apiBase || 'http://194.163.170.169:30090'
  
  // Ruta en español (la que te dio error 400, lo que significa que la ruta existe)
  const targetUrl = `${gatewayBase}/api/productos`

  try {
    // PREPARAR DATOS LIMPIOS (Payload)
    // Solo enviamos lo que funcionó en Postman. Nada más.
    const payload = {
      nombre: body.name,
      descripcion: body.description,
      precio: Number(body.price), // Nos aseguramos que sea un número
      disponible: true            // Forzamos a true
    }

    console.log('📤 Enviando a:', targetUrl)
    console.log('📦 Datos limpios:', payload)

    const response = await $fetch(targetUrl, {
      method: 'POST',
      body: payload
    })

    return response

  } catch (error: any) {
    // SI FALLA, MOSTRAMOS EL ERROR DETALLADO DEL BACKEND
    // El backend suele devolver un mensaje explicando qué campo falla
    console.error('❌ El Gateway rechazó los datos:', error.data)
    
    const mensajeBackend = error.data?.message || error.message;

    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: `Rechazado por Backend: ${Array.isArray(mensajeBackend) ? mensajeBackend.join(', ') : mensajeBackend}`,
      data: error.data
    })
  }
})