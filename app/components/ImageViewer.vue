<template>
  <div class="modal-backdrop" @click="close">
    <div class="modal-container" @click.stop>
      <!-- Close button -->
      <button class="nav-button-close" @click="close">
        <UIcon name="i-heroicons-x-mark" class="w-6 h-6 md:w-8 md:h-8" />
      </button>

      <!-- Navigation buttons -->
      <button v-if="currentIndex > 0" class="nav-button-prev" @click.stop="previous">
        <UIcon name="i-heroicons-chevron-left" class="w-6 h-6 md:w-8 md:h-8" />
      </button>

      <button v-if="currentIndex < images.length - 1" class="nav-button-next" @click.stop="next">
        <UIcon name="i-heroicons-chevron-right" class="w-6 h-6 md:w-8 md:h-8" />
      </button>

      <!-- Content Area -->
      <div class="modal-content">
        <!-- Image Display -->
        <img 
          v-if="currentImage"
          :src="currentImage.path || currentImage.thumbnail_url || ''" 
          :alt="currentImage.caption || 'Full size image'"
          class="modal-image"
        />

        <!-- Caption/Title -->
        <div v-if="currentImage && (currentImage.title || currentImage.caption)" class="modal-caption">
          <h3 v-if="currentImage.title" class="modal-title">{{ currentImage.title }}</h3>
          <p v-if="currentImage.caption" class="modal-description">{{ currentImage.caption }}</p>
        </div>

        <!-- Navigation indicators -->
        <div v-if="images.length > 1" class="modal-indicators">
          <div 
            v-for="(_, index) in images" 
            :key="index"
            class="modal-indicator"
            :class="index === currentIndex ? 'modal-indicator-active' : 'modal-indicator-inactive'"
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
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.9);
  padding: 0.5rem;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.modal-container {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 100vw;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.modal-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.modal-image {
  max-width: 100%;
  max-height: 80vh;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 0.5rem;
}

.modal-caption {
  text-align: center;
  max-width: 90%;
  padding: 0 1rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
}

.modal-description {
  color: #d1d5db;
  font-size: 0.875rem;
  line-height: 1.5;
}

.modal-indicators {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.modal-indicator {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.modal-indicator-active {
  background-color: white;
}

.modal-indicator-inactive {
  background-color: #6b7280;
}

.nav-button-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: white;
  z-index: 10;
  transition: color 0.3s ease;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
}

.nav-button-close:hover {
  color: #d1d5db;
  background: rgba(0, 0, 0, 0.7);
}

.nav-button-prev,
.nav-button-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  z-index: 10;
  transition: color 0.3s ease;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
}

.nav-button-prev {
  left: 1rem;
}

.nav-button-next {
  right: 1rem;
}

.nav-button-prev:hover,
.nav-button-next:hover {
  color: #d1d5db;
  background: rgba(0, 0, 0, 0.7);
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .modal-backdrop {
    padding: 0.25rem;
  }
  
  .modal-container {
    max-width: 100vw;
    max-height: 100vh;
  }
  
  .modal-image {
    max-height: 70vh;
    max-width: 95vw;
  }
  
  .nav-button-close,
  .nav-button-prev,
  .nav-button-next {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .nav-button-prev {
    left: 0.25rem;
  }
  
  .nav-button-next {
    right: 0.25rem;
  }
  
  .modal-title {
    font-size: 1rem;
  }
  
  .modal-description {
    font-size: 0.8rem;
  }
}
</style> 