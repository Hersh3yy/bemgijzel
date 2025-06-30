<template>
  <div class="modal-backdrop" @click="close">
    <div class="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center" @click.stop>
      <!-- Close button -->
      <button class="nav-button-close" @click="close">
        <UIcon name="i-heroicons-x-mark" class="w-8 h-8" />
      </button>

      <!-- Navigation buttons -->
      <button v-if="currentIndex > 0" class="nav-button-prev" @click.stop="previous">
        <UIcon name="i-heroicons-chevron-left" class="w-8 h-8" />
      </button>

      <button v-if="currentIndex < images.length - 1" class="nav-button-next" @click.stop="next">
        <UIcon name="i-heroicons-chevron-right" class="w-8 h-8" />
      </button>

      <!-- Content Area -->
      <div class="w-full h-full flex flex-col items-center justify-center">
        <!-- Image Display -->
        <img 
          v-if="currentImage"
          :src="currentImage.path || currentImage.thumbnail_url || ''" 
          :alt="currentImage.caption || 'Full size image'"
          class="max-w-full max-h-[80vh] object-contain"
        />

        <!-- Caption/Title -->
        <div v-if="currentImage && (currentImage.title || currentImage.caption)" class="mt-4 text-center max-w-2xl">
          <h3 v-if="currentImage.title" class="text-xl font-semibold text-white mb-2">{{ currentImage.title }}</h3>
          <p v-if="currentImage.caption" class="text-gray-300">{{ currentImage.caption }}</p>
        </div>

        <!-- Navigation indicators -->
        <div v-if="images.length > 1" class="flex items-center space-x-2 mt-4">
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
import type { AlbumImage } from '~/composables/useAlbum';

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
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style> 