<script setup lang="ts">
// Datos simulados (luego vendrán de tu BD)
const stats = [
  { label: 'Ingresos Totales', value: '12.450€', icon: 'i-heroicons-currency-euro', color: 'text-green-500' },
  { label: 'Pedidos Hoy', value: '24', icon: 'i-heroicons-shopping-bag', color: 'text-blue-500' },
  { label: 'Clientes Nuevos', value: '+12', icon: 'i-heroicons-user-group', color: 'text-purple-500' },
  { label: 'Platos Activos', value: '45', icon: 'i-heroicons-cake', color: 'text-orange-500' }
]

const recentOrders = [
  { id: '#U-1024', customer: 'Carlos Ruiz', total: '45.00€', status: 'pending', date: 'Hace 5 min' },
  { id: '#U-1023', customer: 'Ana López', total: '22.50€', status: 'completed', date: 'Hace 15 min' },
  { id: '#U-1022', customer: 'Miguel Ángel', total: '60.00€', status: 'completed', date: 'Hace 40 min' },
]
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Buenos días, Yamila</h1>
      <p class="text-gray-500 mt-1">Aquí tienes el resumen de Ukiyo hoy.</p>
    </div>

    <!-- 1. TARJETAS DE ESTADÍSTICAS -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 2. ÚLTIMOS PEDIDOS -->
      <UCard class="lg:col-span-2">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-gray-900 dark:text-white">Últimos Pedidos</h3>
            <UButton size="xs" color="gray" variant="ghost" to="/orders">Ver todos</UButton>
          </div>
        </template>
        
        <table class="w-full text-sm text-left">
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
              <td class="py-3 font-mono text-gray-500">{{ order.id }}</td>
              <td class="py-3 font-medium">{{ order.customer }}</td>
              <td class="py-3">{{ order.total }}</td>
              <td class="py-3">
                <UBadge :color="order.status === 'completed' ? 'green' : 'orange'" variant="subtle" size="xs">
                  {{ order.status === 'completed' ? 'Completado' : 'Pendiente' }}
                </UBadge>
              </td>
            </tr>
          </tbody>
        </table>
      </UCard>

      <!-- 3. ACCIONES RÁPIDAS -->
      <UCard>
        <template #header>
          <h3 class="font-bold text-gray-900 dark:text-white">Acciones Rápidas</h3>
        </template>
        <div class="space-y-3">
          <UButton block color="primary" icon="i-heroicons-plus">Nuevo Plato</UButton>
          <UButton block color="gray" icon="i-heroicons-pause">Cerrar Cocina Temporalmente</UButton>
          <UButton block color="gray" icon="i-heroicons-document-text">Imprimir Reporte del Día</UButton>
        </div>
      </UCard>
    </div>

  </div>
</template>