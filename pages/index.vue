<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// --- LÓGICA DE SALUDO INTELIGENTE ---
const userName = ref('Usuario') 

const timeGreeting = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 12) return 'Buenos días'
  if (hour >= 12 && hour < 20) return 'Buenas tardes'
  return 'Buenas noches'
})

onMounted(() => {
  const savedName = localStorage.getItem('userName')
  if (savedName) {
    userName.value = savedName
  } else {
    userName.value = 'Admin' 
  }
})

// --- CARGA DE DATOS (Con Refresh) ---
// Extraemos la función 'refresh' para poder recargar cada cosa individualmente
const { data: products, refresh: refreshProducts } = await useFetch<any[]>('/api/products', { lazy: true, default: () => [] })
const { data: users, refresh: refreshUsers } = await useFetch<any[]>('/api/users', { lazy: true, default: () => [] })
const { data: orders, refresh: refreshOrders } = await useFetch<any[]>('/api/orders', { lazy: true, default: () => [] })

// Estado de carga para el botón manual
const isRefreshing = ref(false)

// Función para recargar todo el dashboard a la vez
const refreshDashboard = async () => {
  isRefreshing.value = true
  try {
    await Promise.all([
      refreshProducts(),
      refreshUsers(),
      refreshOrders()
    ])
  } finally {
    isRefreshing.value = false
  }
}

// --- ESTADÍSTICAS ---
const stats = computed(() => {
  const totalIncome = orders.value?.reduce((acc: number, order: any) => acc + Number(order.total || 0), 0) || 0
  const ordersToday = orders.value?.length || 0

  return [
    { label: 'Ingresos Totales', value: `${totalIncome.toFixed(2)}€`, icon: 'i-heroicons-currency-euro', color: 'text-green-500' },
    { label: 'Pedidos Totales', value: ordersToday.toString(), icon: 'i-heroicons-shopping-bag', color: 'text-blue-500' },
    { label: 'Usuarios Registrados', value: users.value?.length.toString() || '0', icon: 'i-heroicons-user-group', color: 'text-purple-500' },
    { label: 'Platos en Carta', value: products.value?.length.toString() || '0', icon: 'i-heroicons-cake', color: 'text-orange-500' }
  ]
})

const recentOrders = computed(() => {
  if (!orders.value || orders.value.length === 0) return []
  return orders.value.slice(0, 5)
})

// --- ACCIONES RÁPIDAS ---
const toggleKitchen = ref(true) 
const showReportModal = ref(false) // Control del modal de reporte

const closeKitchen = () => {
  toggleKitchen.value = !toggleKitchen.value
  if (toggleKitchen.value) {
    alert('✅ COCINA ABIERTA: Los clientes ya pueden realizar pedidos.')
  } else {
    alert('⛔ COCINA CERRADA: La web mostrará que no se aceptan más pedidos.')
  }
}

// 1. IMPRIMIR (Abre diálogo de impresora)
const printReport = () => {
  window.print()
}

// 2. DESCARGAR PDF (Usa la función de impresión nativa para "Guardar como PDF")
const downloadReport = () => {
  // Al abrir el diálogo de impresión, el usuario puede seleccionar "Guardar como PDF"
  window.print()
}
</script>

<template>
  <div>
    <!-- CABECERA -->
    <div class="mb-8 print:hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ timeGreeting }}, <span class="text-primary-500">{{ userName }}</span>
        </h1>
        <p class="text-gray-500 mt-1">Aquí tienes el resumen de Ukiyo en tiempo real.</p>
      </div>

      <!-- BOTÓN DE RECARGA (NUEVO) -->
      <UButton 
        icon="i-heroicons-arrow-path" 
        color="white" 
        variant="solid" 
        :loading="isRefreshing"
        @click="refreshDashboard"
      >
        Actualizar Datos
      </UButton>
    </div>

    <!-- TARJETAS (Ocultas al imprimir) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 print:hidden">
      <UCard v-for="stat in stats" :key="stat.label">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 font-medium">{{ stat.label }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stat.value }}</p>
          </div>
          <div :class="`p-3 rounded-full bg-gray-50 dark:bg-gray-800 ${stat.color}`">
            <UIcon :name="stat.icon" class="w-6 h-6" />
          </div>
        </div>
      </UCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 print:hidden">
      
      <!-- TABLA PEDIDOS -->
      <UCard class="lg:col-span-2">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-gray-900 dark:text-white">Últimos Pedidos</h3>
            <UButton size="xs" color="gray" variant="ghost" to="/orders">Ver todos</UButton>
          </div>
        </template>
        
        <div v-if="recentOrders.length === 0" class="text-center py-8 text-gray-500">
          <UIcon name="i-heroicons-inbox" class="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No hay pedidos registrados en el sistema.</p>
        </div>

        <table v-else class="w-full text-sm text-left">
          <thead>
            <tr class="text-gray-500 border-b border-gray-100 dark:border-gray-800">
              <th class="pb-3 font-medium">ID</th>
              <th class="pb-3 font-medium">Cliente</th>
              <th class="pb-3 font-medium">Total</th>
              <th class="pb-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="order in recentOrders" :key="order.id">
              <td class="py-3 font-mono text-gray-500">#{{ order.id }}</td>
              <td class="py-3 font-medium">{{ order.customer || 'Cliente Web' }}</td>
              <td class="py-3">{{ Number(order.total).toFixed(2) }}€</td>
              <td class="py-3">
                <UBadge :color="order.status === 'completed' ? 'green' : 'orange'" variant="subtle" size="xs">
                  {{ order.status || 'Pendiente' }}
                </UBadge>
              </td>
            </tr>
          </tbody>
        </table>
      </UCard>

      <!-- ACCIONES RÁPIDAS -->
      <UCard>
        <template #header>
          <h3 class="font-bold text-gray-900 dark:text-white">Acciones Rápidas</h3>
        </template>
        <div class="space-y-3">
          
          <UButton block color="primary" icon="i-heroicons-plus" to="/menu/new">
            Nuevo Plato
          </UButton>
          
          <UButton block :color="toggleKitchen ? 'red' : 'green'" :icon="toggleKitchen ? 'i-heroicons-pause' : 'i-heroicons-play'" @click="closeKitchen">
            {{ toggleKitchen ? 'Cerrar Cocina Temporalmente' : 'Abrir Cocina' }}
          </UButton>
          
          <!-- BOTÓN REPORTE (Abre Modal) -->
          <UButton block color="gray" icon="i-heroicons-document-text" @click="showReportModal = true">
            Ver Reporte del Día
          </UButton>

        </div>
      </UCard>
    </div>

    <!-- MODAL DE PREVISUALIZACIÓN DEL REPORTE -->
    <UModal v-model="showReportModal" :ui="{ width: 'w-full sm:max-w-3xl' }">
      <UCard :ui="{ body: { padding: 'p-0' } }">
        <template #header>
          <div class="flex justify-between items-center p-4 pb-0">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-heroicons-clipboard-document-list" />
              Reporte de Cierre - {{ new Date().toLocaleDateString() }}
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" @click="showReportModal = false" />
          </div>
        </template>

        <!-- Contenido Visual del Reporte -->
        <div class="p-6 space-y-6">
          <!-- Resumen -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center border border-gray-100 dark:border-gray-700">
              <p class="text-sm text-gray-500 uppercase tracking-wide">Total Ventas</p>
              <p class="text-3xl font-black text-green-500 mt-1">{{ stats[0].value }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center border border-gray-100 dark:border-gray-700">
              <p class="text-sm text-gray-500 uppercase tracking-wide">Pedidos</p>
              <p class="text-3xl font-black text-blue-500 mt-1">{{ stats[1].value }}</p>
            </div>
          </div>

          <!-- Lista Detallada -->
          <div>
            <h4 class="font-bold mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Detalle de Operaciones</h4>
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left">
                <thead class="text-gray-500 bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th class="p-2 rounded-l-lg">ID</th>
                    <th class="p-2">Cliente</th>
                    <th class="p-2 text-right">Total</th>
                    <th class="p-2 rounded-r-lg text-center">Estado</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                  <tr v-for="order in (orders || [])" :key="order.id">
                    <td class="p-2 font-mono text-xs">#{{ order.id }}</td>
                    <td class="p-2">{{ order.customer || 'Cliente Web' }}</td>
                    <td class="p-2 text-right font-medium">{{ Number(order.total).toFixed(2) }}€</td>
                    <td class="p-2 text-center">{{ order.status || 'Pendiente' }}</td>
                  </tr>
                  <tr v-if="!orders || orders.length === 0">
                    <td colspan="4" class="p-4 text-center text-gray-400 italic">No hay movimientos registrados hoy.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3 p-4 pt-0">
            <!-- BOTÓN DESCARGAR PDF (Abre diálogo de impresión) -->
            <UButton color="white" icon="i-heroicons-document-arrow-down" @click="downloadReport">Descargar PDF</UButton>
            <!-- BOTÓN IMPRIMIR (Mismo comportamiento, por claridad) -->
            <UButton color="black" icon="i-heroicons-printer" @click="printReport">Imprimir</UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- DISEÑO DE IMPRESIÓN (SOLO VISIBLE AL IMPRIMIR) -->
    <div class="hidden print:block fixed inset-0 bg-white z-[9999] p-10 text-black">
      <!-- Cabecera Factura -->
      <div class="text-center mb-10 border-b-2 border-black pb-6">
        <h1 class="text-4xl font-bold tracking-[0.2em] mb-2">UKIYO</h1>
        <p class="text-sm text-gray-600 uppercase">Reporte Diario de Operaciones</p>
        <p class="text-lg font-bold mt-4">{{ new Date().toLocaleDateString() }} - {{ new Date().toLocaleTimeString() }}</p>
      </div>

      <!-- Resumen Grande -->
      <div class="flex justify-between mb-10 px-8">
        <div>
           <p class="text-xs uppercase text-gray-500 mb-1">Total Facturado</p>
           <p class="text-5xl font-black">{{ stats[0].value }}</p>
        </div>
        <div class="text-right">
           <p class="text-xs uppercase text-gray-500 mb-1">Total Pedidos</p>
           <p class="text-5xl font-black">{{ stats[1].value }}</p>
        </div>
      </div>

      <!-- Tabla Limpia -->
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b-2 border-black">
            <th class="py-2 text-left">ID PEDIDO</th>
            <th class="py-2 text-left">CLIENTE</th>
            <th class="py-2 text-center">HORA</th>
            <th class="py-2 text-right">IMPORTE</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in (orders || [])" :key="order.id" class="border-b border-gray-200">
            <td class="py-3 font-mono">#{{ order.id }}</td>
            <td class="py-3">{{ order.customer || 'Cliente Web' }}</td>
            <td class="py-3 text-center text-gray-500">{{ order.created_at ? new Date(order.created_at).toLocaleTimeString().slice(0,5) : '--:--' }}</td>
            <td class="py-3 text-right font-bold">{{ Number(order.total).toFixed(2) }}€</td>
          </tr>
        </tbody>
      </table>

      <!-- Pie de página -->
      <div class="mt-12 text-center text-xs text-gray-400 border-t border-gray-200 pt-4">
        Generado automáticamente por Ukiyo Admin Panel. Documento interno.
      </div>
    </div>

  </div>
</template>