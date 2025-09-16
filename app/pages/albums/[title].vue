<template>
  <LayoutsPageContainer>
    <!-- Loading state -->
    <BaseLoading v-if="loading" message="Loading album..." />

    <!-- Error state -->
    <BaseError 
      v-else-if="error" 
      :message="errorMessage"
      title="Failed to Load Album"
    >
      <template #actions>
        <BaseButton label="Back to Home" to="/" icon="i-heroicons-arrow-uturn-left" variant="primary" />
      </template>
    </BaseError>
    
    <!-- Content -->
    <div v-else>
      <UCard class="bg-site-black border-gold-hover">
        <template #header v-if="album">
          <h1 class="text-2xl font-bold text-center text-gold-primary">{{ album.title }}</h1>
          <p v-if="album.description" class="text-center mt-2 text-gold-secondary">{{ album.description }}</p>
        </template>

        <div class="p-4">
          <MoleculesImagesGrid
            :images="images"
            :columns="3"
            aspect-ratio="square"
            :show-captions="true"
            :hover-effect="true"
            play-button-style="interactive"
            gap="md"
            empty-message="No images found in this album."
            :show-back-button="false"
            item-class="image-card rounded-lg overflow-hidden card-hover-effect"
            @item-click="handleItemClick"
            @image-error="handleImageErrorWrapper"
            @image-load="handleImageLoadWrapper"
          >
            <template #empty-actions>
              <BaseButton label="Back to Home" to="/" icon="i-heroicons-arrow-uturn-left" variant="primary" class="mt-4" />
            </template>
          </MoleculesImagesGrid>
        </div>

        <template #footer>
          <div class="flex justify-between">
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
import { useMedia } from '~/composables/useMedia';
import { logger } from '~/utils/logger';

const route = useRoute();
const { fetchAlbumByTitle, isVideoItem, getVideoThumbnail } = useAlbum();
const { handleImageError, handleImageLoad, getBestImageUrl } = useMedia();

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

// Create a mutable copy for the ItemViewer component
const mutableImages = computed(() => [...(albumData.value?.images || [])]);

const handleItemClick = (image: AlbumImage) => {
  logger.debug('Item clicked:', image.title, image.path);
  logger.debug('Is video item:', isVideoItem(image));
  
  // Now all items open in the unified ItemViewer
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

// Simplified image error and load handlers using the centralized utilities
const handleImageErrorWrapper = (event: Event, image: AlbumImage) => {
  handleImageError(event, image);
};

const handleImageLoadWrapper = (event: Event, image: AlbumImage) => {
  handleImageLoad(event, image);
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
/* Custom styles if needed - most styling now handled by Tailwind classes */
</style> 