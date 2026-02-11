<script setup lang="ts">
const columns = [
  { key: 'item', label: 'Ingrediente' },
  { key: 'stock', label: 'Stock Actual' },
  { key: 'min', label: 'Mínimo' },
  { key: 'provider', label: 'Proveedor' }, // NUEVA COLUMNA
  { key: 'status', label: 'Estado' }
]

// Cargar datos reales
const { data: inventory, error, refresh, pending } = await useFetch('/api/inventory', {
  lazy: true
})
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Inventario de Cocina</h1>
      <UButton icon="i-heroicons-arrow-path" color="gray" variant="ghost" :loading="pending" @click="refresh()">Recargar</UButton>
    </div>

    <!-- ALERTA DE ERROR VISIBLE -->
    <UAlert 
      v-if="error"
      title="Error de Conexión"
      :description="error.statusMessage || error.message"
      color="red"
      variant="soft"
      icon="i-heroicons-exclamation-triangle"
      class="mb-6"
    />
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Resumen rápido (Estático por ahora, o podrías calcularlo si hubiera datos) -->
      <UCard class="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900">
        <div class="text-red-500 font-bold text-lg">Productos Agotados</div>
        <div class="text-3xl font-black mt-2">-</div>
      </UCard>
      <UCard class="bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-900">
        <div class="text-orange-500 font-bold text-lg">Stock Bajo</div>
        <div class="text-3xl font-black mt-2">-</div>
      </UCard>
      <UCard class="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900">
        <div class="text-green-500 font-bold text-lg">Stock Saludable</div>
        <div class="text-3xl font-black mt-2">-</div>
      </UCard>
    </div>

    <UCard>
      <UTable 
        :columns="columns" 
        :rows="inventory || []"
        :loading="pending"
        :empty-state="{ icon: 'i-heroicons-archive-box', label: 'Inventario vacío o sin conexión.' }"
      >
        <!-- COLUMNA PROVEEDOR (NUEVA) -->
        <template #provider-data="{ row }">
          <div class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <UIcon name="i-heroicons-truck" class="w-4 h-4" />
            <span class="text-sm">{{ row.provider || 'Sin asignar' }}</span>
          </div>
        </template>

        <template #status-data="{ row }">
          <UBadge :color="row.status === 'OK' ? 'green' : row.status === 'BAJO' ? 'orange' : 'red'" variant="solid">
            {{ row.status }}
          </UBadge>
        </template>
        
        <template #stock-data="{ row }">
          <span class="font-mono font-bold">{{ row.stock }}</span>
        </template>
      </UTable>
    </UCard>
  </div>
</template>