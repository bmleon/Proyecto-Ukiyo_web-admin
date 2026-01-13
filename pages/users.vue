<script setup lang="ts">
// 1. Definimos la "forma" que tiene un usuario para que TS no se líe
interface User {
  id: number
  name: string
  email: string
  role: string
  created_at: string
}

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nombre' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Rol' },
  { key: 'created_at', label: 'Fecha Registro' }
]

// 2. IMPORTANTE: Añadimos <User[]> al useFetch para forzar el tipo lista
const { data: users, pending, error } = await useFetch<User[]>('/api/users')
</script>

<template>
  <div>
    <!-- Cabecera -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
      <!-- Botón de recarga manual -->
      <UButton icon="i-heroicons-arrow-path" color="gray" variant="ghost" @click="refreshNuxtData()">Recargar</UButton>
    </div>

    <!-- Mensaje de Error Visual -->
    <UAlert
      v-if="error"
      icon="i-heroicons-exclamation-triangle"
      color="red"
      variant="soft"
      title="Error de Conexión"
      :description="'No se pudo conectar a la base de datos: ' + error.message"
      class="mb-4"
    />

    <!-- Tabla -->
    <UCard>
      <UTable 
        :columns="columns" 
        :rows="users || []" 
        :loading="pending"
        :empty-state="{ icon: 'i-heroicons-circle-stack', label: 'No hay usuarios registrados.' }"
      >
        <!-- Formato de Fecha -->
        <template #created_at-data="{ row }">
          <span class="text-gray-500 text-xs">
            {{ row.created_at ? new Date(row.created_at).toLocaleDateString() : '-' }}
          </span>
        </template>

        <!-- Formato de Rol -->
        <template #role-data="{ row }">
          <UBadge :color="row.role === 'ADMIN' ? 'red' : 'primary'" variant="subtle" size="xs">
            {{ row.role }}
          </UBadge>
        </template>
      </UTable>
    </UCard>
  </div>
</template>