<template>
  <div class="page-container">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-8">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-2xl" :style="{ color: 'var(--color-site-gold-500)' }" />
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-8">
      <p :style="{ color: 'var(--color-site-gold-500)' }">{{ errorMessage }}</p>
      <UButton label="Back to Home" to="/" icon="i-heroicons-arrow-uturn-left" class="mt-4" />
    </div>

    <!-- Content -->
    <div v-else>
      <UCard>
        <template #header>
          <h1 class="text-3xl font-bold text-center" :style="{ color: 'var(--color-site-gold-500)' }">Showreels</h1>
          <p v-if="album && album.description" class="text-center mt-2" :style="{ color: 'var(--color-site-gold-100)' }">{{ album.description }}</p>
          <p v-else class="text-center mt-2" :style="{ color: 'var(--color-site-gold-100)' }">View our collection of showreels and video highlights.</p>
        </template>

        <div class="p-4">
          <!-- Empty state -->
          <div v-if="!videos || videos.length === 0" class="text-center py-8">
            <p :style="{ color: 'var(--color-site-gold-100)' }">No showreels found.</p>
            <UButton label="Back to Home" to="/" icon="i-heroicons-arrow-uturn-left" class="mt-4" />
          </div>

          <!-- Vertical feed layout for showreels -->
          <div v-else class="showreels-feed space-y-6 max-w-3xl mx-auto">
            <div 
              v-for="video in videos" 
              :key="video.id" 
              class="showreel-item rounded-lg overflow-hidden shadow-lg cursor-pointer"
              @click="handleItemClick(video)"
            >
              <!-- Video thumbnail with play button -->
              <template v-if="isVideoItem(video)">
                <div class="relative aspect-video">
                  <img 
                    :src="getVideoThumbnail(video)" 
                    :alt="video.caption || 'Showreel thumbnail'" 
                    class="image-responsive"
                  />
                  <div class="video-overlay-interactive">
                    <UIcon name="i-heroicons-play" class="play-icon-medium" />
                  </div>
                </div>
              </template>
              
              <!-- Regular image (treated as video item for showreels) -->
              <template v-else>
                <div class="relative aspect-video">
                  <img 
                    :src="video.thumbnail_url || video.path" 
                    :alt="video.caption || 'Showreel thumbnail'" 
                    class="image-responsive image-hover-darken"
                  />
                  <div class="video-overlay-static">
                    <UIcon name="i-heroicons-play" class="play-icon-subtle" />
                  </div>
                </div>
              </template>
              
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-2" :style="{ color: 'var(--color-site-gold-500)' }">
                  {{ video.title || video.caption || 'Showreel' }}
                </h3>
                <p v-if="video.description || video.caption" class="text-sm" :style="{ color: 'var(--color-site-gold-100)' }">
                  {{ video.description || video.caption }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-center">
            <UButton label="Back to Home" to="/" icon="i-heroicons-arrow-uturn-left" color="primary" />
          </div>
        </template>
      </UCard>

      <!-- Unified viewer for both images and videos -->
      <ItemViewer 
        v-if="showFullscreen && selectedImage" 
        :items="mutableImages" 
        :initialItem="selectedImage"
        @close="closeFullscreen"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AlbumData, AlbumImage } from '~/composables/useAlbum';
import { useAlbum } from '~/composables/useAlbum';

const { fetchAlbumByTitle, isVideoItem, getVideoThumbnail, getYouTubeEmbedUrl } = useAlbum();

const showFullscreen = ref(false);
const selectedImage = ref<AlbumImage | null>(null);

// Use Nuxt's built-in useAsyncData for the "Showreels" album
const { data: albumData, status, error } = await useAsyncData<AlbumData>(
  'showreels-album',
  () => fetchAlbumByTitle('Showreels'),
  {
    server: true
  }
);

const loading = computed(() => status.value === 'pending');
const errorMessage = computed(() => error.value?.message || 'Failed to load showreels');
const album = computed(() => albumData.value?.album || null);
const videos = computed(() => {
  const allImages = albumData.value?.images || [];
  return allImages.filter(isVideoItem);
});

const getEmbedUrl = (video: any) => {
  return getYouTubeEmbedUrl(video);
};

// Create a mutable copy for the ItemViewer component
const mutableImages = computed(() => [...videos.value]);

const handleItemClick = (video: AlbumImage) => {
  openFullscreen(video);
};

const openFullscreen = (video: AlbumImage) => {
  selectedImage.value = video;
  showFullscreen.value = true;
};

const closeFullscreen = () => {
  showFullscreen.value = false;
  selectedImage.value = null;
};

// Update page metadata
useHead({
  title: 'Showreels',
  meta: [
    { 
      name: 'description', 
      content: () => album.value?.description || 'Video showreels and highlights'
    }
  ]
});
</script>

<style scoped>
.page-container {
  padding: 2rem;
}

.showreels-feed {
  /* Natural page scroll - no height constraints */
}

.showreel-item {
  background: var(--color-site-black);
  border: 1px solid var(--color-site-gold-700);
  transition: all 0.3s ease;
}

.showreel-item:hover {
  transform: translateY(-2px);
  border-color: var(--color-site-gold-500);
  box-shadow: 0 8px 25px rgba(196, 147, 38, 0.2);
}

.showreel-item:hover .relative::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
}
</style> 