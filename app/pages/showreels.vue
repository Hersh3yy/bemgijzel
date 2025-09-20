<template>
  <LayoutsPageContainer>
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-8">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-2xl text-gold-primary" />
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-8">
      <p class="text-gold-primary">{{ errorMessage }}</p>
      <BaseButton label="Back to Home" to="/" icon="i-heroicons-arrow-uturn-left" variant="primary" class="mt-4" />
    </div>

    <!-- Content -->
    <div v-else>
      <UCard class="bg-site-black border-gold-hover">
        <template #header>
          <h1 class="text-3xl font-bold text-center text-gold-primary">Showreels</h1>
          <p v-if="album && album.description" class="text-center mt-2 text-gold-secondary">{{ album.description }}</p>
          <p v-else class="text-center mt-2 text-gold-secondary">View our collection of showreels and video highlights.</p>
        </template>

        <div class="p-4">
          <!-- Empty state -->
          <div v-if="!videos || videos.length === 0" class="text-center py-8">
            <p :style="{ color: 'var(--color-site-gold-100)' }">No showreels found.</p>
            <BaseButton label="Back to Home" to="/" icon="i-heroicons-arrow-uturn-left" variant="primary" class="mt-4" />
          </div>

          <!-- Vertical feed layout for showreels -->
          <div v-else class="space-y-6 max-w-3xl mx-auto">
            <div 
              v-for="video in videos" 
              :key="video.id" 
              class="bg-site-black border-gold-hover rounded-lg overflow-hidden shadow-lg card-hover-effect"
            >
              <BaseMediaItem
                :item="video"
                aspect-ratio="video"
                :show-caption="false"
                :hover-effect="true"
                play-button-style="interactive"
                @click="handleItemClick"
              />
              
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-2 text-gold-primary">
                  {{ video.title || video.caption || 'Showreel' }}
                </h3>
                <p v-if="video.description || video.caption" class="text-sm text-gold-secondary">
                  {{ video.description || video.caption }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-center">
            <BaseButton label="Back to Home" to="/" icon="i-heroicons-arrow-uturn-left" variant="primary" />
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
  </LayoutsPageContainer>
</template>

<script setup lang="ts">
import type { AlbumData, AlbumImage } from '~/types/api';
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