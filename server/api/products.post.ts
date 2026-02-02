export default defineEventHandler(async (event) => {
  // 1. Leemos los datos que nos envía el formulario (Vue)
  const body = await readBody(event)
  
  // 2. Obtenemos la URL del Gateway desde la configuración
  const config = useRuntimeConfig()
  // Si no está definida la variable, usamos la IP por defecto
  const gatewayBase = config.public.apiBase || 'http://194.163.170.169:3000'
  
  // Asumimos que el endpoint en el Gateway es '/productos'
  const targetUrl = `${gatewayBase}/productos`

  try {
    console.log('📤 Enviando nuevo plato al Gateway:', targetUrl)
    console.log('📦 Datos:', body)

    // 3. Hacemos la petición POST al Gateway
    // Mapeamos los campos por si el backend los espera en español
    const response = await $fetch(targetUrl, {
      method: 'POST',
      body: {
        nombre: body.name,
        descripcion: body.description,
        precio: Number(body.price), // Aseguramos que sea número
        categoria: body.category,
        imagen: body.image,
        activo: body.active ?? true
      }
    })

    // 4. Devolvemos la respuesta del Gateway al frontend
    return response

  } catch (error: any) {
    console.error('❌ Error al conectar con el Gateway:', error.message)
    
    // Si falla, lanzamos un error 500 para que la web lo sepa
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.message || 'Error de conexión con el servidor de productos',
      data: error.data
    })
  }
})