<script setup lang="ts">
import { ref } from 'vue'

const links = [
  { label: 'Dashboard', icon: 'i-heroicons-home', to: '/' },
  { label: 'Usuarios', icon: 'i-heroicons-users', to: '/users' },
  { label: 'Carta / Menú', icon: 'i-heroicons-cake', to: '/menu' },
  { label: 'Pedidos', icon: 'i-heroicons-shopping-bag', to: '/orders' },
  { label: 'Configuración', icon: 'i-heroicons-cog-6-tooth', to: '/settings' }
]

const isOpen = ref(false)
</script>

<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
    
    <!-- SIDEBAR (Escritorio) -->
    <aside class="w-64 hidden md:flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <!-- Logo -->
      <div class="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
        <span class="font-black text-xl tracking-widest text-gray-900 dark:text-white">
          UKIYO <span class="text-primary-500 text-xs font-normal">ADMIN</span>
        </span>
      </div>

      <!-- Menú -->
      <div class="flex-1 overflow-y-auto py-4 px-3">
        <UVerticalNavigation :links="links" :ui="{
          padding: 'py-2.5',
          font: 'font-medium',
          active: 'text-primary-500 dark:text-primary-400 bg-gray-100 dark:bg-gray-800',
          inactive: 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }" />
      </div>

      <!-- Perfil Abajo -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-800">
        <div class="flex items-center gap-3">
          <UAvatar src="https://ui-avatars.com/api/?name=Yamila+G&background=C5A059&color=fff" alt="Admin" size="sm" />
          <div class="text-sm">
            <p class="font-medium text-gray-900 dark:text-white">Yamila G.</p>
            <p class="text-xs text-gray-500">Propietaria</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- ZONA PRINCIPAL -->
    <div class="flex-1 flex flex-col min-w-0">
      
      <!-- HEADER (Móvil y Escritorio) -->
      <header class="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <!-- Botón Menú Móvil -->
        <UButton 
          icon="i-heroicons-bars-3" 
          color="gray" 
          variant="ghost" 
          class="md:hidden" 
          @click="isOpen = true"
        />
        
        <!-- Título o Migas de pan -->
        <div class="hidden md:block text-sm text-gray-500">
          Panel de Control > <span class="text-gray-900 dark:text-white font-medium">Vista General</span>
        </div>

        <!-- Acciones Derecha -->
        <div class="flex items-center gap-2">
          <UButton icon="i-heroicons-bell" color="gray" variant="ghost" />
          <ColorModeButton /> <!-- Si tienes componente de tema, si no quítalo -->
        </div>
      </header>

      <!-- CONTENIDO DE LA PÁGINA -->
      <main class="flex-1 overflow-auto p-4 md:p-8">
        <slot />
      </main>
    </div>

    <!-- SIDEBAR MÓVIL (Slideover) -->
    <USlideover v-model="isOpen" side="left">
      <div class="p-4 flex-1 flex flex-col bg-white dark:bg-gray-900 h-full">
        <div class="h-16 flex items-center mb-4">
          <span class="font-black text-xl tracking-widest">UKIYO ADMIN</span>
        </div>
        <UVerticalNavigation :links="links" @click="isOpen = false" />
      </div>
    </USlideover>

  </div>
</template>