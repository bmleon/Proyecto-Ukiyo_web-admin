<script setup lang="ts">
const columns = [
  { key: 'id', label: 'ID' },
  { key: 'image', label: 'Foto' },
  { key: 'name', label: 'Nombre del Plato' },
  { key: 'category', label: 'Categoría' },
  { key: 'price', label: 'Precio' },
  { key: 'status', label: 'Disponible' },
  { key: 'actions' }
]

const dishes = [
  { id: 1, name: 'Dragon Roll', category: 'Sushi', price: 14.50, status: true, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=100' },
  { id: 2, name: 'Ramen Tonkotsu', category: 'Calientes', price: 12.00, status: true, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100' },
  { id: 3, name: 'Mochi Té Verde', category: 'Postres', price: 5.50, status: false, image: 'https://images.unsplash.com/photo-1623596732263-06b03568e022?w=100' }
]

// CORRECCIÓN: Añadido ': any' al parámetro row
const items = (row: any) => [
  [{
    label: 'Editar Plato',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => console.log('Editar', row.id)
  }, {
    label: 'Borrar',
    icon: 'i-heroicons-trash-20-solid',
    class: 'text-red-500',
    click: () => console.log('Borrar', row.id)
  }]
]
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gestión de la Carta</h1>
      <UButton icon="i-heroicons-plus" color="primary" variant="solid">Nuevo Plato</UButton>
    </div>

    <UCard>
      <!-- Filtros -->
      <div class="flex gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
        <UInput icon="i-heroicons-magnifying-glass" placeholder="Buscar plato..." />
        <USelect placeholder="Categoría" :options="['Sushi', 'Nigiri', 'Calientes', 'Postres']" />
      </div>

      <UTable :columns="columns" :rows="dishes">
        
        <!-- Columna Foto -->
        <template #image-data="{ row }">
          <UAvatar :src="row.image" size="lg" />
        </template>

        <!-- Columna Precio -->
        <template #price-data="{ row }">
          <span class="font-mono">{{ row.price.toFixed(2) }}€</span>
        </template>

        <!-- Columna Estado (Switch) -->
        <template #status-data="{ row }">
          <UToggle v-model="row.status" color="green" />
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