<script setup lang="ts">
// Definimos las columnas de la tabla
const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nombre' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Rol' },
  { key: 'status', label: 'Estado' }
]

// Datos falsos para ver el diseño (luego vendrán de la BD)
const users = [
  { id: 1, name: 'Yamila González', email: 'yamila@ukiyo.rest', role: 'Admin', status: 'Activo' },
  { id: 2, name: 'Juan Cocinero', email: 'juan@ukiyo.rest', role: 'Staff', status: 'Activo' },
  { id: 3, name: 'María Repartidora', email: 'maria@glovo.com', role: 'Driver', status: 'Inactivo' }
]
</script>

<template>
  <div>
    <!-- Cabecera -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
      <UButton icon="i-heroicons-plus" color="primary" variant="solid">Nuevo Usuario</UButton>
    </div>

    <!-- Tabla -->
    <UCard>
      <UTable :columns="columns" :rows="users">
        <!-- Personalizar la columna de estado con colores -->
        <template #status-data="{ row }">
          <UBadge :color="row.status === 'Activo' ? 'green' : 'gray'" variant="subtle">
            {{ row.status }}
          </UBadge>
        </template>
      </UTable>
    </UCard>
  </div>
</template>