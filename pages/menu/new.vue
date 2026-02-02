<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isSaving = ref(false);
const showSuccess = ref(false);
const errorMessage = ref('');

// Modelo del nuevo plato
const newDish = ref({
  name: '',
  description: '',
  price: undefined as number | undefined,
  category: 'Sushi',
  image: ''
});

const categories = ['Sushi', 'Nigiri', 'Calientes', 'Postres', 'Bebidas'];

const saveDish = async () => {
  isSaving.value = true;
  errorMessage.value = '';
  showSuccess.value = false;

  try {
    // Enviamos los datos a nuestro servidor interno (que luego hablará con el Gateway)
    await $fetch('/api/products', {
      method: 'POST',
      body: {
        nombre: newDish.value.name,       // Adaptamos nombres al español si el backend lo requiere
        descripcion: newDish.value.description,
        precio: newDish.value.price,
        categoria: newDish.value.category,
        imagen: newDish.value.image,
        activo: true
      }
    });

    // ÉXITO
    showSuccess.value = true;
    
    // Redirigir al menú tras 1.5 segundos
    setTimeout(() => {
       router.push('/menu'); 
    }, 1500);

  } catch (error: any) {
    console.error('Error al guardar:', error);
    errorMessage.value = 'Error al guardar el plato: ' + (error.statusMessage || error.message);
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
        <p class="text-gray-500 text-sm">Rellena los datos para añadir un plato a la carta.</p>
      </div>
    </div>

    <!-- Mensajes de Estado -->
    <UAlert 
      v-if="showSuccess" 
      title="¡Producto Creado!" 
      description="El plato se ha enviado correctamente."
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

    <!-- Formulario -->
    <UCard>
      <form @submit.prevent="saveDish" class="space-y-6">
        
        <!-- Nombre -->
        <UFormGroup label="Nombre del Plato" required>
          <UInput v-model="newDish.name" placeholder="Ej: Dragon Roll Imperial" />
        </UFormGroup>

        <!-- Categoría y Precio -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <!-- Descripción -->
        <UFormGroup label="Descripción">
          <UTextarea 
            v-model="newDish.description" 
            placeholder="Ingredientes, alérgenos, detalles..." 
            :rows="4"
          />
        </UFormGroup>

        <!-- Imagen URL -->
        <UFormGroup label="URL de la Imagen" help="Enlace directo a la foto">
          <div class="flex gap-4 items-start">
            <div class="flex-1">
              <UInput v-model="newDish.image" placeholder="https://..." icon="i-heroicons-photo" />
            </div>
            <!-- Preview pequeña -->
            <div v-if="newDish.image" class="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 flex-shrink-0">
              <img :src="newDish.image" alt="Preview" class="w-full h-full object-cover" @error="newDish.image = ''" />
            </div>
          </div>
        </UFormGroup>

        <!-- Botones -->
        <div class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <UButton color="gray" variant="ghost" to="/menu">Cancelar</UButton>
          <UButton type="submit" color="primary" :loading="isSaving">Guardar Plato</UButton>
        </div>

      </form>
    </UCard>
  </div>
</template>