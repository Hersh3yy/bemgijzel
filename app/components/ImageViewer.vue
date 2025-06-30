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

      <!-- Content Area -->
      <div class="w-full h-full flex flex-col items-center justify-center">
        <!-- Video Player -->
        <div v-if="isVideoItem(currentImage)" class="w-full max-w-4xl aspect-video">
          <iframe
            :src="getYouTubeEmbedUrl(currentImage)"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="w-full h-full rounded-lg"
          ></iframe>
        </div>

        <!-- Image -->
        <img 
          v-else
          :src="currentImage?.path || currentImage?.thumbnail_url || ''" 
          :alt="currentImage?.caption || 'Full size image'"
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

// Video detection
const isVideoItem = (image: Image | undefined) => {
  if (!image) return false;
  
  if (image.properties) {
    try {
      let properties;
      if (typeof image.properties === 'string') {
        properties = JSON.parse(image.properties);
      } else {
        properties = image.properties;
      }
      
      if (properties.type === 'video') return true;
    } catch (e) {
      // Ignore parsing errors
    }
  }
  
  const path = image.path.toLowerCase();
  return path.includes('youtube.com') || 
         path.includes('youtu.be') || 
         path.includes('vimeo.com');
};

// YouTube embed URL generation
const getYouTubeEmbedUrl = (video: Image | undefined) => {
  if (!video) return '';
  
  try {
    if (video.properties) {
      let properties;
      if (typeof video.properties === 'string') {
        properties = JSON.parse(video.properties);
      } else {
        properties = video.properties;
      }
      
      if (properties.video_id) {
        return `https://www.youtube.com/embed/${properties.video_id}`;
      }
    }
    
    let url = video.path;
    if (video.properties) {
      try {
        const properties = typeof video.properties === 'string' ? JSON.parse(video.properties) : video.properties;
        if (properties.video_url) {
          url = properties.video_url;
        }
      } catch (e) {
        // Use path as fallback
      }
    }
    
    let videoId = '';
    
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('youtube.com/watch?v=')[1]?.split('&')[0] || '';
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  } catch (error) {
    console.error('Error parsing video URL:', error);
    return '';
  }
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