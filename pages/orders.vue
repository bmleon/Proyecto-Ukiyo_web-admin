<script setup lang="ts">
import { ref, computed } from 'vue'

// --- TIPOS DE DATOS ---
interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  customer: string
  email: string
  total: number
  status: string
  date: string
  items: OrderItem[]
}

// --- CONFIGURACIÓN TABLA ---
const columns = [
  { key: 'id', label: 'ID Pedido' },
  { key: 'customer', label: 'Cliente', sortable: true },
  { key: 'date', label: 'Hora', sortable: true },
  { key: 'total', label: 'Total', sortable: true },
  { key: 'status', label: 'Estado' },
  { key: 'actions', label: 'Acciones' }
]

// Estados posibles y sus colores
const statusOptions = ['Pendiente', 'En Cocina', 'Listo', 'Entregado', 'Cancelado']

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pendiente': return 'orange'
    case 'En Cocina': return 'blue'
    case 'Listo': return 'purple'
    case 'Entregado': return 'green'
    case 'Cancelado': return 'red'
    default: return 'gray'
  }
}

// --- 1. CARGA DE DATOS REALES ---
// Llamamos a la API. Si falla o no hay datos, empieza vacío.
// NO hay datos falsos aquí.
const { data: orders, pending, error, refresh } = await useFetch<Order[]>('/api/orders', {
  lazy: true,
  default: () => [] 
})

// --- 2. FILTROS ---
const search = ref('')
const statusFilter = ref('Todos')

const filteredOrders = computed(() => {
  if (!orders.value) return []
  
  return orders.value.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(search.value.toLowerCase()) || 
                          order.id.toLowerCase().includes(search.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'Todos' || order.status === statusFilter.value
    
    return matchesSearch && matchesStatus
  })
})

// --- 3. DETALLES DEL PEDIDO (MODAL) ---
const isModalOpen = ref(false)
const selectedOrder = ref<Order | null>(null)

const openOrderDetails = (order: Order) => {
  selectedOrder.value = order
  isModalOpen.value = true
}

// --- 4. CAMBIAR ESTADO ---
const updateStatus = async (order: Order, newStatus: string) => {
  const oldStatus = order.status
  // Cambio optimista (visual)
  order.status = newStatus 

  try {
    await $fetch('/api/orders', {
      method: 'PUT',
      body: { id: order.id, status: newStatus }
    })
    // Éxito silencioso
  } catch (e: any) {
    // Si falla, revertimos el cambio visual y avisamos
    order.status = oldStatus
    alert('Error al actualizar estado: ' + e.message)
  }
}

// Menú de acciones por fila
const items = (row: Order) => [
  statusOptions.map(status => ({
    label: 'Marcar como ' + status,
    click: () => updateStatus(row, status)
  }))
]
</script>

<template>
  <div>
    <!-- CABECERA -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Pedidos en Curso</h1>
      <UButton 
        icon="i-heroicons-arrow-path" 
        color="gray" 
        variant="ghost" 
        :loading="pending" 
        @click="refresh()"
      >
        Actualizar
      </UButton>
    </div>

    <!-- ALERTA DE ERROR (Si la API falla) -->
    <UAlert 
      v-if="error"
      title="Error de Conexión"
      :description="'No se pudieron cargar los pedidos: ' + (error.statusMessage || error.message)"
      color="red"
      variant="soft"
      icon="i-heroicons-exclamation-triangle"
      class="mb-6"
    />

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      
      <!-- BARRA DE FILTROS -->
      <div class="flex flex-col md:flex-row gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <UInput 
          v-model="search" 
          icon="i-heroicons-magnifying-glass" 
          placeholder="Buscar por cliente o ID..." 
          class="flex-1"
        />
        <USelect 
          v-model="statusFilter" 
          :options="['Todos', ...statusOptions]" 
          class="w-full md:w-48" 
        />
      </div>

      <!-- TABLA DE PEDIDOS -->
      <UTable 
        :columns="columns" 
        :rows="filteredOrders" 
        :loading="pending"
        class="w-full"
        :empty-state="{ icon: 'i-heroicons-shopping-bag', label: 'No hay pedidos con este criterio.' }"
      >
        <!-- ID -->
        <template #id-data="{ row }">
          <span class="font-mono text-xs font-bold">{{ row.id }}</span>
        </template>

        <!-- Cliente -->
        <template #customer-data="{ row }">
          <div class="flex flex-col">
            <span class="font-medium text-gray-900 dark:text-white">{{ row.customer }}</span>
            <span class="text-xs text-gray-500">{{ row.email }}</span>
          </div>
        </template>

        <!-- Total -->
        <template #total-data="{ row }">
          <span class="font-bold">{{ Number(row.total).toFixed(2) }}€</span>
        </template>

        <!-- Fecha -->
        <template #date-data="{ row }">
          <span class="text-xs text-gray-500">
            {{ row.date ? new Date(row.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--' }}
          </span>
        </template>

        <!-- Estado -->
        <template #status-data="{ row }">
          <UBadge :color="getStatusColor(row.status)" variant="subtle" size="xs">
            {{ row.status }}
          </UBadge>
        </template>

        <!-- Acciones -->
        <template #actions-data="{ row }">
          <div class="flex items-center gap-2">
            <!-- Botón Ver Detalles -->
            <UTooltip text="Ver Ticket">
              <UButton icon="i-heroicons-eye" color="gray" variant="ghost" @click="openOrderDetails(row)" />
            </UTooltip>
            
            <!-- Botón Cambiar Estado -->
            <UDropdown :items="items(row)">
              <UButton icon="i-heroicons-pencil-square" color="gray" variant="ghost" />
            </UDropdown>
          </div>
        </template>
      </UTable>
    </UCard>

    <!-- MODAL DE DETALLES DEL PEDIDO -->
    <UModal v-model="isModalOpen">
      <UCard v-if="selectedOrder">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-lg">Ticket #{{ selectedOrder.id }}</h3>
            <UBadge :color="getStatusColor(selectedOrder.status)">{{ selectedOrder.status }}</UBadge>
          </div>
        </template>

        <div class="space-y-4">
          <!-- Datos Cliente -->
          <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
            <p><span class="font-bold">Cliente:</span> {{ selectedOrder.customer }}</p>
            <p><span class="font-bold">Email:</span> {{ selectedOrder.email }}</p>
            <p><span class="font-bold">Hora:</span> {{ new Date(selectedOrder.date).toLocaleString() }}</p>
          </div>

          <!-- Lista de Platos -->
          <table class="w-full text-sm">
            <thead class="border-b border-gray-200 dark:border-gray-700 text-left">
              <tr>
                <th class="py-2">Cant.</th>
                <th class="py-2">Producto</th>
                <th class="py-2 text-right">Precio</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in (selectedOrder.items || [])" :key="i" class="border-b border-gray-100 dark:border-gray-800">
                <td class="py-2 font-bold text-primary-500">{{ item.quantity }}x</td>
                <td class="py-2">{{ item.name }}</td>
                <td class="py-2 text-right">{{ (item.price * item.quantity).toFixed(2) }}€</td>
              </tr>
            </tbody>
          </table>

          <!-- Total -->
          <div class="flex justify-between items-center pt-2 text-xl font-black">
            <span>TOTAL</span>
            <span>{{ Number(selectedOrder.total).toFixed(2) }}€</span>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton color="gray" variant="ghost" @click="isModalOpen = false">Cerrar</UButton>
            <UButton color="primary" class="ml-2" @click="isModalOpen = false">Imprimir Ticket</UButton>
          </div>
        </template>
      </UCard>
    </UModal>

  </div>
</template>