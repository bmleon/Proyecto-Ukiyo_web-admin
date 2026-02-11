<script setup lang="ts">
import { ref, computed } from 'vue';

// Definimos la estructura de un plato
interface Dish {
  id: number | string
  name: string
  category: string
  price: number
  image: string
  status: boolean
}

// CAMBIO: Eliminada la columna { key: 'image', label: 'Foto' }
const columns = [
  { key: 'name', label: 'Nombre', sortable: true },
  { key: 'category', label: 'Categoría', sortable: true },
  { key: 'price', label: 'Precio', sortable: true },
  { key: 'status', label: 'Estado' },
  { key: 'actions', label: 'Acciones' }
]

// 1. CARGAR DATOS REALES
const { data: dbDishes, pending, error, refresh } = await useFetch<Dish[]>('/api/products', {
  lazy: true,
  default: () => []
})

// Filtros Locales
const search = ref('')
const selectedCategory = ref('Todas')
const categories = ['Todas', 'Sushi', 'Nigiri', 'Calientes', 'Postres', 'Bebidas']

// 2. LÓGICA DE FILTRADO
const filteredDishes = computed(() => {
  if (!dbDishes.value) return []
  
  return dbDishes.value.filter((dish) => {
    const matchesSearch = dish.name.toLowerCase().includes(search.value.toLowerCase())
    const matchesCategory = selectedCategory.value === 'Todas' || dish.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

// Acciones de la tabla
const items = (row: any) => [
  [{
    label: 'Editar',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => console.log('Editar', row.id)
  }, {
    label: 'Borrar',
    icon: 'i-heroicons-trash-20-solid',
    class: 'text-red-500',
    click: () => alert('Funcionalidad de borrar pendiente de conectar')
  }]
]
</script>

<template>
  <div>
    <!-- Cabecera -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gestión de la Carta</h1>
        <p class="text-gray-500 text-sm">Administra los productos visibles en la web.</p>
      </div>
      
      <div class="flex gap-2 w-full md:w-auto">
        <UButton 
          icon="i-heroicons-arrow-path" 
          color="gray" 
          variant="ghost" 
          :loading="pending" 
          @click="refresh()"
        >
          Recargar
        </UButton>
        
        <UButton icon="i-heroicons-plus" color="primary" variant="solid" to="/menu/new">
          Nuevo Plato
        </UButton>
      </div>
    </div>

    <!-- Alerta de Error -->
    <UAlert 
      v-if="error"
      title="Error de Conexión"
      :description="'No se pudieron cargar los productos: ' + error.message"
      color="red"
      variant="soft"
      icon="i-heroicons-exclamation-triangle"
      class="mb-6"
    />

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      
      <!-- Barra de Filtros -->
      <div class="flex flex-col md:flex-row gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <UInput 
          v-model="search" 
          icon="i-heroicons-magnifying-glass" 
          placeholder="Buscar plato..." 
          class="flex-1"
        />
        <USelect 
          v-model="selectedCategory" 
          :options="categories" 
          class="w-full md:w-48" 
        />
      </div>

      <!-- Tabla de Datos -->
      <UTable 
        :columns="columns" 
        :rows="filteredDishes" 
        :loading="pending"
        class="w-full"
        :empty-state="{ icon: 'i-heroicons-circle-stack', label: 'No hay platos registrados.' }"
      >
        
        <!-- CAMBIO: Eliminado el template de #image-data -->

        <!-- Nombre Destacado -->
        <template #name-data="{ row }">
          <span class="font-bold text-gray-900 dark:text-white text-base">{{ row.name }}</span>
        </template>

        <!-- Precio -->
        <template #price-data="{ row }">
          <span class="font-mono font-bold text-gray-900 dark:text-white">{{ Number(row.price).toFixed(2) }}€</span>
        </template>

        <!-- Estado -->
        <template #status-data="{ row }">
          <UBadge :color="row.status ? 'green' : 'gray'" variant="subtle" size="xs">
            {{ row.status ? 'Activo' : 'Inactivo' }}
          </UBadge>
        </template>

        <!-- Acciones -->
        <template #actions-data="{ row }">
          <UDropdown :items="items(row)">
            <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
          </UDropdown>
        </template>
      </UTable>
    </UCard>
  </div>
</template>