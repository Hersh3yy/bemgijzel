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

      <button v-if="currentIndex < videos.length - 1" class="absolute top-1/2 right-4 transform -translate-y-1/2 text-white z-10 transition-colors duration-300 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center border-none cursor-pointer hover:text-gray-300 hover:bg-black hover:bg-opacity-70" @click.stop="next">
        <UIcon name="i-heroicons-chevron-right" class="w-6 h-6 md:w-8 md:h-8" />
      </button>

      <!-- Content Area -->
      <div class="w-full h-full flex flex-col items-center justify-center gap-4">
        <!-- Video Player -->
        <div v-if="isPlayingVideo && currentVideo" class="w-full max-w-[95vw] aspect-video">
          <iframe
            :src="getYouTubeEmbedUrl(currentVideo)"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="w-full h-full rounded-lg"
          ></iframe>
        </div>

        <!-- Video Thumbnail with Play Button -->
        <div v-else-if="currentVideo" class="w-full max-w-[95vw] aspect-video cursor-pointer" @click="playVideo">
          <div class="relative w-full h-full">
            <img 
              :src="getVideoThumbnail(currentVideo)" 
              :alt="currentVideo?.caption || currentVideo?.title || 'Video thumbnail'"
              class="w-full h-full object-cover rounded-lg"
            />
            <div class="absolute inset-0 flex items-center justify-center transition-all duration-300 hover:bg-black hover:bg-opacity-20 rounded-lg">
              <UIcon name="i-heroicons-play" class="text-white text-8xl drop-shadow-lg" />
            </div>
          </div>
        </div>

        <!-- Caption/Title -->
        <div v-if="currentVideo && (currentVideo.title || currentVideo.caption)" class="text-center max-w-[90%] px-4">
          <h3 v-if="currentVideo.title" class="text-xl font-semibold text-white mb-2">{{ currentVideo.title }}</h3>
          <p v-if="currentVideo.caption" class="text-gray-300 text-sm leading-relaxed">{{ currentVideo.caption }}</p>
        </div>

        <!-- Navigation indicators -->
        <div v-if="videos.length > 1" class="flex items-center gap-2 mt-2">
          <div 
            v-for="(_, index) in videos" 
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
import { useAlbum } from '~/composables/useAlbum';

const props = defineProps<{
  videos: AlbumImage[];
  initialVideo: AlbumImage;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const currentIndex = ref(0);
const currentVideo = computed(() => props.videos[currentIndex.value]);
const isPlayingVideo = ref(false);

// Set initial video
onMounted(() => {
  const index = props.videos.findIndex(video => video.id === props.initialVideo.id);
  if (index !== -1) {
    currentIndex.value = index;
  }
  isPlayingVideo.value = false;
});

// Reset video playing state when navigating between videos
watch(currentIndex, () => {
  isPlayingVideo.value = false;
});

// Navigation methods
const next = () => {
  if (currentIndex.value < props.videos.length - 1) {
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

// Video methods
const playVideo = () => {
  isPlayingVideo.value = true;
};

const { getYouTubeEmbedUrl, getVideoThumbnail } = useAlbum();

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
  
  .w-full.max-w-\[95vw\] {
    max-width: 95vw;
    max-height: 70vh;
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
