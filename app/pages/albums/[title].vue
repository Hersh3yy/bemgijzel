<template>
  <div class="page-container">
    <!-- Loading state -->
    <BaseLoading v-if="loading" message="Loading album..." />

    <!-- Error state -->
    <BaseError 
      v-else-if="error" 
      :message="errorMessage"
      title="Failed to Load Album"
    >
      <template #actions>
        <UButton label="Back to Albums" to="/albums" icon="i-heroicons-arrow-uturn-left" />
      </template>
    </BaseError>
    
    <!-- Content -->
    <div v-else>
      <UCard>
        <template #header v-if="album">
          <h1 class="text-2xl font-bold text-center" :style="{ color: 'var(--site-gold)' }">{{ album.title }}</h1>
          <p v-if="album.description" class="text-center mt-2" :style="{ color: 'var(--ui-text)' }">{{ album.description }}</p>
        </template>

        <div class="p-4">
          <!-- Empty state -->
          <div v-if="!images || images.length === 0" class="text-center py-8">
            <p :style="{ color: 'var(--ui-text)' }">No images found in this album.</p>
            <UButton label="Back to Albums" to="/albums" icon="i-heroicons-arrow-uturn-left" class="mt-4" />
          </div>

          <!-- Images grid -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="image in images" :key="image.id" class="image-card">
              <div class="image-container block rounded-lg overflow-hidden cursor-pointer" @click="handleItemClick(image)">
                <!-- Video thumbnail with play button -->
                <template v-if="isVideoItem(image)">
                  <div class="relative w-full aspect-[4/3]">
                    <img 
                      :src="getVideoThumbnail(image)" 
                      :alt="image.caption || 'Video thumbnail'" 
                      class="w-full h-full object-cover transition-all duration-300"
                    />
                    <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-40 transition-all duration-300">
                      <UIcon name="i-heroicons-play" class="text-4xl text-white drop-shadow-lg" />
                    </div>
                  </div>
                </template>
                
                <!-- Regular image -->
                <template v-else>
                  <img 
                    :src="image.thumbnail_url || image.path" 
                    :alt="image.caption || 'Album image'" 
                    class="w-full aspect-[4/3] object-cover transition-all duration-300"
                  />
                </template>
                
                <div class="middle-overlay">
                  <div class="middle-overlay-text">
                    <p v-if="image.caption" class="text-sm">{{ image.caption }}</p>
                    <p v-else-if="image.title" class="text-sm">{{ image.title }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-between">
            <UButton label="Back to Albums" to="/albums" icon="i-heroicons-arrow-uturn-left" color="primary" />
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
import type { AlbumData } from '~/composables/useAlbum';
import { useAlbum } from '~/composables/useAlbum';

const route = useRoute();
const { fetchAlbumByTitle, isVideoItem, getVideoThumbnail } = useAlbum();

const showFullscreen = ref(false);
const selectedImage = ref<AlbumImage | null>(null);

// Use Nuxt's built-in useAsyncData with dynamic key based on route params
const { data: albumData, status, error, refresh } = await useAsyncData<AlbumData>(
  // Dynamic key that changes when route changes
  () => `album-${route.params.title}`,
  () => fetchAlbumByTitle(route.params.title as string),
  {
    // Watch for route changes and refetch
    watch: [() => route.params.title],
    // Server-side rendering enabled
    server: true,
    // Don't use lazy loading for better SEO
    lazy: false
  }
);

const loading = computed(() => status.value === 'pending');
const album = computed(() => albumData.value?.album || null);
const images = computed(() => albumData.value?.images || []);
const errorMessage = computed(() => error.value?.message || 'Album not found');

// Create a mutable copy for the ImageViewer component
const mutableImages = computed(() => [...(albumData.value?.images || [])]);

const handleItemClick = (image: AlbumImage) => {
  logger.debug('Item clicked:', image.title, image.path);
  logger.debug('Is video item:', isVideoItem(image));
  
  // Now all items open in the unified ImageViewer
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

// Enhanced meta tags for SEO
useHead({
  title: () => album.value?.title || 'Album',
  meta: [
    { name: 'description', content: () => album.value?.description || 'Photo album' },
    { property: 'og:title', content: () => album.value?.title || 'Album' },
    { property: 'og:description', content: () => album.value?.description || 'Photo album' },
    { property: 'og:image', content: () => album.value?.cover_image_path || '' }
  ]
});
</script>

<style scoped>
.page-container {
  padding: 2rem;
}

.image-card {
  transition: transform 0.3s ease;
}

.image-card:hover {
  transform: translateY(-5px);
}

.middle-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-container {
  position: relative;
}

.image-container:hover .middle-overlay {
  opacity: 1;
}

.middle-overlay-text {
  color: white;
  text-align: center;
  padding: 1rem;
}
</style> 