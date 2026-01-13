<script setup lang="ts">
// Indicamos que esta página NO usa el diseño normal (con barra lateral), sino el de 'auth'
definePageMeta({
  layout: 'auth'
})

import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const router = useRouter()

const handleLogin = () => {
  isLoading.value = true
  // Simulación de login (esperar 1 segundo y entrar)
  setTimeout(() => {
    isLoading.value = false
    // Redirigir al Dashboard principal
    router.push('/')
  }, 1000)
}
</script>

<template>
  <div class="w-full max-w-md">
    
    <!-- Logo o Título -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-black tracking-widest text-gray-900 dark:text-white mb-2">
        UKIYO <span class="text-primary-500 text-base font-normal">ADMIN</span>
      </h1>
      <p class="text-gray-500 text-sm">Acceso exclusivo para personal autorizado</p>
    </div>

    <!-- Tarjeta de Login -->
    <UCard class="shadow-xl">
      <form @submit.prevent="handleLogin" class="space-y-6">
        
        <UFormGroup label="Correo Electrónico" name="email">
          <UInput 
            v-model="email" 
            type="email" 
            placeholder="admin@ukiyo.rest" 
            icon="i-heroicons-envelope" 
            autofocus
          />
        </UFormGroup>

        <UFormGroup label="Contraseña" name="password">
          <UInput 
            v-model="password" 
            type="password" 
            placeholder="••••••••" 
            icon="i-heroicons-lock-closed" 
          />
        </UFormGroup>

        <div class="flex items-center justify-between text-sm">
          <UCheckbox label="Recordarme" />
          <a href="#" class="text-primary-500 hover:text-primary-600 font-medium">¿Olvidaste la contraseña?</a>
        </div>

        <UButton 
          type="submit" 
          block 
          color="primary" 
          size="lg" 
          :loading="isLoading"
        >
          Iniciar Sesión
        </UButton>

      </form>
    </UCard>

    <p class="text-center text-gray-400 text-xs mt-8">
      &copy; {{ new Date().getFullYear() }} Ukiyo System. Panel de Control v1.0
    </p>

  </div>
</template>