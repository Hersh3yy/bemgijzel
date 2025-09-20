<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-2 w-screen h-screen overflow-hidden" @click="close">
    <div class="relative w-full h-full max-w-screen max-h-screen flex flex-col items-center justify-center overflow-hidden" @click.stop>
      <!-- Close button -->
      <button class="absolute top-4 right-4 text-white z-10 transition-colors duration-300 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center border-none cursor-pointer hover:text-gray-300 hover:bg-black hover:bg-opacity-70" @click="close">
        <UIcon name="i-heroicons-x-mark" class="w-6 h-6 md:w-8 md:h-8" />
      </button>

      <!-- Navigation buttons -->
      <button v-if="currentIndex > 0" class="absolute top-1/2 left-4 transform -translate-y-1/2 text-white z-10 transition-colors duration-300 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center border-none cursor-pointer hover:text-gray-300 hover:bg-black hover:bg-opacity-70" @click.stop="previous">
        <UIcon name="i-heroicons-chevron-left" class="w-6 h-6 md:w-8 md:h-8" />
      </button>

      <button v-if="currentIndex < images.length - 1" class="absolute top-1/2 right-4 transform -translate-y-1/2 text-white z-10 transition-colors duration-300 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center border-none cursor-pointer hover:text-gray-300 hover:bg-black hover:bg-opacity-70" @click.stop="next">
        <UIcon name="i-heroicons-chevron-right" class="w-6 h-6 md:w-8 md:h-8" />
      </button>

      <!-- Content Area -->
      <div class="w-full h-full flex flex-col items-center justify-center gap-4">
        <!-- Image Display -->
        <img 
          v-if="currentImage"
          :src="currentImage.path || currentImage.thumbnail_url || ''" 
          :alt="currentImage.caption || 'Full size image'"
          class="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-lg"
        />

        <!-- Caption/Title -->
        <div v-if="currentImage && (currentImage.title || currentImage.caption)" class="text-center max-w-[90%] px-4">
          <h3 v-if="currentImage.title" class="text-xl font-semibold text-white mb-2">{{ currentImage.title }}</h3>
          <p v-if="currentImage.caption" class="text-gray-300 text-sm leading-relaxed">{{ currentImage.caption }}</p>
        </div>

        <!-- Navigation indicators -->
        <div v-if="images.length > 1" class="flex items-center gap-2 mt-2">
          <div 
            v-for="(_, index) in images" 
            :key="index"
            class="w-2 h-2 rounded-full transition-all duration-200"
            :class="index === currentIndex ? 'bg-white' : 'bg-gray-500'"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AlbumImage } from '~/types/api';

const props = defineProps<{
  images: AlbumImage[];
  initialImage: AlbumImage;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const currentIndex = ref(0);
const currentImage = computed(() => props.images[currentIndex.value]);

// Set initial image
onMounted(() => {
  const index = props.images.findIndex(img => img.id === props.initialImage.id);
  if (index !== -1) {
    currentIndex.value = index;
  }
});

// Navigation methods
const next = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++;
  }
};

const previous = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

// Close method
const close = () => {
  emit('close');
};

// Keyboard navigation
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

const handleKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowRight':
      next();
      break;
    case 'ArrowLeft':
      previous();
      break;
    case 'Escape':
      close();
      break;
  }
};
</script>

<style scoped>
/* Mobile optimizations */
@media (max-width: 768px) {
  .fixed {
    padding: 1px;
  }
  
  .max-h-\[80vh\] {
    max-height: 70vh;
    max-width: 95vw;
  }
  
  .absolute.top-4.right-4,
  .absolute.top-1\/2.left-4,
  .absolute.top-1\/2.right-4 {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .absolute.top-1\/2.left-4 {
    left: 1px;
  }
  
  .absolute.top-1\/2.right-4 {
    right: 1px;
  }
  
  .text-xl {
    font-size: 1rem;
  }
  
  .text-sm {
    font-size: 0.8rem;
  }
}
</style>
