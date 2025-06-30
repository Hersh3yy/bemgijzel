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
          <h1 class="text-3xl font-bold text-center" :style="{ color: 'var(--color-site-gold-500)' }">What's new</h1>
          <p v-if="album && album.description" class="text-center mt-2" :style="{ color: 'var(--color-site-gold-100)' }">{{ album.description }}</p>
          <p v-else class="text-center mt-2" :style="{ color: 'var(--color-site-gold-100)' }">Latest posted content and updates.</p>
        </template>

        <div class="p-4">
          <!-- Empty state -->
          <div v-if="!images || images.length === 0" class="text-center py-8">
            <p :style="{ color: 'var(--color-site-gold-100)' }">No latest updates found.</p>
            <UButton label="Back to Home" to="/" icon="i-heroicons-arrow-uturn-left" class="mt-4" />
          </div>

          <!-- Vertical feed layout for latest content -->
          <div v-else class="latest-feed space-y-6 max-w-2xl mx-auto">
            <div 
              v-for="image in images" 
              :key="image.id" 
              class="feed-item rounded-lg overflow-hidden shadow-lg cursor-pointer"
              @click="handleItemClick(image)"
            >
              <!-- Video thumbnail with play button -->
              <template v-if="isVideoItem(image)">
                <div class="relative aspect-video">
                  <img 
                    :src="getVideoThumbnail(image)" 
                    :alt="image.caption || 'Video thumbnail'" 
                    class="w-full h-full object-cover transition-all duration-300"
                  />
                  <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-40 transition-all duration-300">
                    <UIcon name="i-heroicons-play" class="text-6xl text-white drop-shadow-lg" />
                  </div>
                </div>
              </template>
              
              <!-- Regular image -->
              <template v-else>
                <img 
                  :src="image.thumbnail_url || image.path" 
                  :alt="image.caption || 'Latest content'" 
                  class="w-full aspect-video object-cover transition-all duration-300"
                />
              </template>
              
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-2" :style="{ color: 'var(--color-site-gold-500)' }">
                  {{ image.title || image.caption || 'Latest Update' }}
                </h3>
                <p v-if="image.description || image.caption" class="text-sm" :style="{ color: 'var(--color-site-gold-100)' }">
                  {{ image.description || image.caption }}
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
      <ImageViewer 
        v-if="showFullscreen && selectedImage" 
        :images="mutableImages" 
        :initialImage="selectedImage"
        @close="closeFullscreen"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Album, AlbumImage, AlbumData } from '~/composables/useAlbum';
import { useAlbum } from '~/composables/useAlbum';

const { fetchAlbumByTitle, isVideoItem, getVideoThumbnail } = useAlbum();

const showFullscreen = ref(false);
const selectedImage = ref<AlbumImage | null>(null);

// Use Nuxt's built-in useAsyncData for the "Latest" album
const { data: albumData, status, error } = await useAsyncData<AlbumData>(
  'latest-album',
  () => fetchAlbumByTitle('Latest'),
  {
    server: true,
    // Transform to sort images by newest first
    transform: (data: AlbumData) => {
      if (data?.images) {
        const sortedImages = [...data.images].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        return { ...data, images: sortedImages };
      }
      return data;
    }
  }
);

const loading = computed(() => status.value === 'pending');
const errorMessage = computed(() => error.value?.message || 'Failed to load latest updates');
const album = computed(() => albumData.value?.album || null);
const images = computed(() => albumData.value?.images || []);

// Create a mutable copy for the ImageViewer component
const mutableImages = computed(() => [...images.value]);

const handleItemClick = (image: AlbumImage) => {
  openFullscreen(image);
};

const openFullscreen = (image: AlbumImage) => {
  selectedImage.value = image;
  showFullscreen.value = true;
};

const closeFullscreen = () => {
  showFullscreen.value = false;
  selectedImage.value = null;
};

// Enhanced page metadata
useHead({
  title: 'Latest Updates',
  meta: [
    { 
      name: 'description',
      content: () => album.value?.description || 'Latest posted content and updates'
    }
  ]
});
</script>

<style scoped>
.page-container {
  padding: 2rem;
}

.latest-feed {
  /* Natural page scroll - no height constraints */
}

.feed-item {
  background: var(--color-site-black);
  border: 1px solid var(--color-site-gold-700);
  transition: all 0.3s ease;
}

.feed-item:hover {
  transform: translateY(-2px);
  border-color: var(--color-site-gold-500);
  box-shadow: 0 8px 25px rgba(196, 147, 38, 0.2);
}
</style> 