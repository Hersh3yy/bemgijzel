<template>
  <div class="image-viewer">
    <!-- Overlay backdrop -->
    <div 
      class="fixed inset-0 bg-black/80 z-40"
      @click="$emit('close')"
    ></div>
    
    <!-- Image container -->
    <div 
      class="fixed inset-0 flex items-center justify-center p-4 md:p-8 z-50"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <!-- Close button -->
      <button 
        class="absolute top-4 right-4 text-white hover:text-site-gold-300 z-10" 
        @click="$emit('close')"
      >
        <UIcon name="i-heroicons-x-mark" class="text-3xl" />
      </button>
      
      <!-- Previous button (hidden on mobile, swipe is used instead) -->
      <button 
        v-if="currentIndex > 0" 
        class="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-site-gold-300 hidden md:block z-10"
        @click="prevImage"
      >
        <UIcon name="i-heroicons-chevron-left" class="text-4xl" />
      </button>
      
      <!-- Next button (hidden on mobile, swipe is used instead) -->
      <button 
        v-if="currentIndex < images.length - 1" 
        class="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-site-gold-300 hidden md:block z-10"
        @click="nextImage"
      >
        <UIcon name="i-heroicons-chevron-right" class="text-4xl" />
      </button>
      
      <!-- Image and caption -->
      <div class="w-full h-full flex flex-col items-center justify-center">
        <div v-if="loading" class="text-white">
          <UIcon name="i-heroicons-arrow-path" class="animate-spin text-3xl" />
        </div>
        <img 
          v-else
          :src="currentImage?.path || currentImage?.webp_path" 
          :alt="currentImage?.caption || currentImage?.title || 'Image'"
          class="max-h-[80vh] max-w-full object-contain"
          @load="loading = false"
        />
        <div 
          v-if="currentImage?.caption || currentImage?.title" 
          class="mt-4 text-white text-center p-2 bg-black/50 rounded"
        >
          {{ currentImage?.caption || currentImage?.title }}
        </div>
        
        <!-- Image counter -->
        <div class="mt-4 text-white text-center">
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';

interface Image {
  id: number;
  title?: string;
  path: string;
  webp_path?: string;
  caption?: string;
  [key: string]: any;
}

interface Props {
  images: Image[];
  initialImageId?: number;
}

const props = defineProps<Props>();
const emit = defineEmits(['close', 'change']);

const currentIndex = ref(0);
const loading = ref(true);
const touchStartX = ref(0);
const touchEndX = ref(0);

const currentImage = computed(() => {
  return props.images[currentIndex.value] || null;
});

// Set initial image index based on provided ID
onMounted(() => {
  if (props.initialImageId) {
    const index = props.images.findIndex(img => img.id === props.initialImageId);
    if (index !== -1) {
      currentIndex.value = index;
    }
  }
  
  // Add keyboard event listeners
  window.addEventListener('keydown', handleKeyDown);
  
  // Clean up
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
});

// Watch for image changes to reset loading state
watch(currentIndex, () => {
  loading.value = true;
});

// Navigation methods
const nextImage = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++;
    emit('change', currentImage.value);
  }
};

const prevImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    emit('change', currentImage.value);
  }
};

// Keyboard navigation
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight') {
    nextImage();
  } else if (e.key === 'ArrowLeft') {
    prevImage();
  } else if (e.key === 'Escape') {
    emit('close');
  }
};

// Touch swipe navigation for mobile
const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX;
};

const handleTouchMove = (e: TouchEvent) => {
  touchEndX.value = e.touches[0].clientX;
};

const handleTouchEnd = () => {
  const minSwipeDistance = 50;
  const swipeDistance = touchEndX.value - touchStartX.value;
  
  if (swipeDistance > minSwipeDistance) {
    // Swiped right, show previous image
    prevImage();
  } else if (swipeDistance < -minSwipeDistance) {
    // Swiped left, show next image
    nextImage();
  }
  
  // Reset touch values
  touchStartX.value = 0;
  touchEndX.value = 0;
};
</script>

<style scoped>
.image-viewer {
  /* Prevent body scrolling when viewer is open */
  :deep(body) {
    overflow: hidden;
  }
}
</style> 