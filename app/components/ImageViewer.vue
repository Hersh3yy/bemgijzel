<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90" @click="close">
    <div class="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center" @click.stop>
      <!-- Close button -->
      <button 
        class="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        @click="close"
      >
        <UIcon name="i-heroicons-x-mark" class="w-8 h-8" />
      </button>

      <!-- Navigation buttons -->
      <button 
        v-if="currentIndex > 0"
        class="absolute left-4 text-white hover:text-gray-300 z-10"
        @click.stop="previous"
      >
        <UIcon name="i-heroicons-chevron-left" class="w-8 h-8" />
      </button>

      <button 
        v-if="currentIndex < images.length - 1"
        class="absolute right-4 text-white hover:text-gray-300 z-10"
        @click.stop="next"
      >
        <UIcon name="i-heroicons-chevron-right" class="w-8 h-8" />
      </button>

      <!-- Image -->
      <img 
        :src="currentImage?.path || currentImage?.thumbnail_url || ''" 
        :alt="currentImage?.caption || 'Full size image'"
        class="max-w-full max-h-[90vh] object-contain"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Image {
  id: string;
  title: string | null;
  description: string | null;
  path: string;
  webp_path: string | null;
  thumbnail_url: string | null;
  webp_url: string | null;
  caption: string | null;
  order: number;
  properties: any;
  created_at: string;
  updated_at: string;
}

const props = defineProps<{
  images: Image[];
  initialImage: Image;
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