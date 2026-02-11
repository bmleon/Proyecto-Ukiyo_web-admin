<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter(); // En Nuxt automático, a veces ayuda importar explícitamente si falla navigateTo
const isSaving = ref(false);
const showSuccess = ref(false);
const errorMessage = ref('');

// Modelo del nuevo plato (SIN IMAGEN)
const newDish = ref({
  name: '',
  description: '',
  price: undefined as number | undefined,
  category: 'Sushi'
});

const categories = ['Sushi', 'Nigiri', 'Calientes', 'Postres', 'Bebidas'];

const saveDish = async () => {
  isSaving.value = true;
  errorMessage.value = '';
  showSuccess.value = false;

  try {
    // Enviamos los datos a nuestro servidor interno
    await $fetch('/api/products', {
      method: 'POST',
      body: {
        name: newDish.value.name,
        description: newDish.value.description,
        price: newDish.value.price,
        category: newDish.value.category,
        // No enviamos imagen desde el formulario
        active: true
      }
    });

    // Si todo va bien:
    showSuccess.value = true;
    
    // Redirigir a la lista de platos
    setTimeout(async () => {
       await navigateTo('/menu'); 
    }, 1500);

  } catch (error: any) {
    console.error('Error al guardar:', error);
    errorMessage.value = 'Error al guardar: ' + (error.statusMessage || error.message || 'Error desconocido');
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto pb-20">
    
    <!-- Cabecera -->
    <div class="flex items-center gap-4 mb-8">
      <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" to="/menu" />
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Añadir Nuevo Producto</h1>
        <p class="text-gray-500 text-sm">Introduce los datos del plato.</p>
      </div>
    </div>

    <!-- Alertas -->
    <UAlert 
      v-if="showSuccess" 
      title="¡Guardado!" 
      description="El plato se ha registrado correctamente."
      color="green" 
      variant="soft" 
      icon="i-heroicons-check-circle"
      class="mb-6"
    />

    <UAlert 
      v-if="errorMessage" 
      title="Error" 
      :description="errorMessage"
      color="red" 
      variant="soft" 
      icon="i-heroicons-exclamation-triangle"
      class="mb-6"
    />

    <!-- Formulario (Limpio) -->
    <UCard>
      <form @submit.prevent="saveDish" class="space-y-6">
        
        <UFormGroup label="Nombre del Plato" required>
          <UInput v-model="newDish.name" placeholder="Ej: Dragon Roll" autofocus />
        </UFormGroup>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormGroup label="Categoría" required>
            <USelect 
              v-model="newDish.category" 
              :options="categories" 
            />
          </UFormGroup>

          <UFormGroup label="Precio (€)" required>
            <UInput 
              v-model="newDish.price" 
              type="number" 
              step="0.10" 
              min="0"
              placeholder="0.00" 
              icon="i-heroicons-currency-euro" 
            />
          </UFormGroup>
        </div>

        <UFormGroup label="Descripción">
          <UTextarea 
            v-model="newDish.description" 
            placeholder="Ingredientes..." 
            :rows="3"
          />
        </UFormGroup>

        <div class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <UButton color="gray" variant="ghost" to="/menu">Cancelar</UButton>
          <UButton type="submit" color="primary" :loading="isSaving" icon="i-heroicons-check">
            Guardar Plato
          </UButton>
        </div>

      </form>
    </UCard>
  </div>
</template>