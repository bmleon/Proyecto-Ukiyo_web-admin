<script setup lang="ts">
const columns = [
  { key: 'id', label: '#ID' },
  { key: 'name', label: 'Nombre Evento' },
  { key: 'type', label: 'Tipo' },
  { key: 'date', label: 'Fecha' },
  { key: 'guests', label: 'Invitados' },
  { key: 'status', label: 'Estado' },
  { key: 'actions' }
]

// Cargar datos (Sin datos falsos, si falla, muestra error)
const { data: events, error, refresh, pending } = await useFetch('/api/events', {
  lazy: true
})

const items = (row: any) => [
  [{
    label: 'Aprobar Presupuesto',
    icon: 'i-heroicons-check',
    click: () => alert('Aprobado')
  }, {
    label: 'Rechazar',
    icon: 'i-heroicons-x-mark',
    click: () => alert('Rechazado')
  }]
]
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Solicitudes de Catering</h1>
      <UButton icon="i-heroicons-arrow-path" color="gray" variant="ghost" :loading="pending" @click="refresh()">Actualizar</UButton>
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

    <UCard>
      <UTable 
        :columns="columns" 
        :rows="events || []"
        :loading="pending"
        :empty-state="{ icon: 'i-heroicons-calendar', label: 'No hay solicitudes de eventos.' }"
      >
        <template #status-data="{ row }">
          <UBadge :color="row.status === 'Confirmado' ? 'green' : row.status === 'Pendiente' ? 'orange' : 'red'" variant="subtle">
            {{ row.status }}
          </UBadge>
        </template>
        <template #actions-data="{ row }">
          <UDropdown :items="items(row)">
            <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
          </UDropdown>
        </template>
      </UTable>
    </UCard>
  </div>
</template>