export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // CORRECCIÓN: Actualizamos el fallback a 30090
  const gatewayUrl = config.public.apiBase || 'http://194.163.170.169:30090'

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
    console.error(`❌ Error Gateway Usuarios:`, error.message)
    // Devolvemos demo si falla
    return [
      { id: 1, name: 'Yamila (Demo)', email: 'admin@ukiyo.rest', role: 'ADMIN', created_at: new Date().toISOString() },
      { id: 2, name: 'Juan (Staff)', email: 'staff@ukiyo.rest', role: 'STAFF', created_at: new Date().toISOString() }
    ]
  }
})