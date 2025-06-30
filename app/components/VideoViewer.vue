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

      <button v-if="currentIndex < videos.length - 1" class="nav-button-next" @click.stop="next">
        <UIcon name="i-heroicons-chevron-right" class="w-8 h-8" />
      </button>

      <!-- Content Area -->
      <div class="w-full h-full flex flex-col items-center justify-center">
        <!-- Video Player -->
        <div v-if="isPlayingVideo && currentVideo" class="aspect-video-responsive">
          <iframe
            :src="getYouTubeEmbedUrl(currentVideo)"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="w-full h-full rounded-lg"
          ></iframe>
        </div>

        <!-- Video Thumbnail with Play Button -->
        <div v-else-if="currentVideo" class="aspect-video-responsive cursor-pointer" @click="playVideo">
          <div class="relative w-full h-full">
            <img 
              :src="getVideoThumbnail(currentVideo)" 
              :alt="currentVideo?.caption || currentVideo?.title || 'Video thumbnail'"
              class="image-responsive rounded-lg"
            />
            <div class="video-overlay-hover-only rounded-lg">
              <UIcon name="i-heroicons-play" class="play-icon-large" />
            </div>
          </div>
        </div>

        <!-- Caption/Title -->
        <div v-if="currentVideo && (currentVideo.title || currentVideo.caption)" class="mt-4 text-center max-w-2xl">
          <h3 v-if="currentVideo.title" class="text-xl font-semibold text-white mb-2">{{ currentVideo.title }}</h3>
          <p v-if="currentVideo.caption" class="text-gray-300">{{ currentVideo.caption }}</p>
        </div>

        <!-- Navigation indicators -->
        <div v-if="videos.length > 1" class="flex items-center space-x-2 mt-4">
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
import type { AlbumImage } from '~/composables/useAlbum';
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