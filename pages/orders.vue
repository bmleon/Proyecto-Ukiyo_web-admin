<script setup lang="ts">
const columns = [
  { key: 'id', label: 'Pedido' },
  { key: 'customer', label: 'Cliente' },
  { key: 'total', label: 'Total' },
  { key: 'status', label: 'Estado' },
  { key: 'date', label: 'Fecha' }
]

const orders = [
  { id: '#1001', customer: 'Carlos Ruiz', total: '45.50€', status: 'Pendiente', date: 'Hace 5 min' },
  { id: '#1002', customer: 'Ana López', total: '22.00€', status: 'Completado', date: 'Hace 20 min' },
  { id: '#1003', customer: 'Pedro P.', total: '15.00€', status: 'Cancelado', date: 'Ayer' }
]
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Pedidos Recientes</h1>
    
    <UCard>
      <UTable :columns="columns" :rows="orders">
        <template #status-data="{ row }">
          <UBadge 
            :color="row.status === 'Completado' ? 'green' : row.status === 'Pendiente' ? 'orange' : 'red'" 
            variant="subtle"
          >
            {{ row.status }}
          </UBadge>
        </template>
      </UTable>
    </UCard>
  </div>
</template>