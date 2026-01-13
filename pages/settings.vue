<script setup lang="ts">
import { ref } from 'vue'

const restaurantName = ref('Ukiyo Sushi Bar')
const isOpen = ref(true)
const notificationEmail = ref('pedidos@ukiyo.rest')
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Configuración del Restaurante</h1>

    <div class="space-y-6">
      
      <!-- Estado de la Tienda -->
      <UCard>
        <template #header>
          <h3 class="font-bold">Estado de la Tienda Online</h3>
        </template>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Abierto para pedidos</p>
            <p class="text-sm text-gray-500">Si lo desactivas, los clientes verán un mensaje de "Cerrado".</p>
          </div>
          <UToggle v-model="isOpen" size="lg" color="green" />
        </div>
      </UCard>

      <!-- Datos Generales -->
      <UCard>
        <template #header>
          <h3 class="font-bold">Datos Generales</h3>
        </template>
        <form class="space-y-4">
          <UFormGroup label="Nombre del Restaurante">
            <UInput v-model="restaurantName" />
          </UFormGroup>
          <UFormGroup label="Email para Notificaciones">
            <UInput v-model="notificationEmail" icon="i-heroicons-envelope" />
          </UFormGroup>
        </form>
        <template #footer>
          <UButton color="black">Guardar Cambios</UButton>
        </template>
      </UCard>

    </div>
  </div>
</template>