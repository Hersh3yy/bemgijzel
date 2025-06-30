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
                      class="image-responsive"
                      @error="handleImageError($event, image)"
                      @load="handleImageLoad($event, image)"
                    />
                    <div class="video-overlay-interactive">
                      <UIcon name="i-heroicons-play" class="play-icon-small" />
                    </div>
                  </div>
                </template>
                
                <!-- Regular image -->
                <template v-else>
                  <img 
                    :src="image.thumbnail_url || image.path" 
                    :alt="image.caption || 'Album image'" 
                    class="w-full aspect-[4/3] object-cover image-hover-darken"
                    @error="handleImageError($event, image)"
                    @load="handleImageLoad($event, image)"
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
import type { AlbumData } from '~/composables/useAlbum';
import { useAlbum } from '~/composables/useAlbum';
import { logger } from '~/utils/logger';

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

const handleImageError = (event: Event, image: AlbumImage) => {
  const target = event.target as HTMLImageElement;
  logger.error('Error loading image:', {
    title: image.title,
    path: image.path,
    thumbnail_url: image.thumbnail_url,
    properties: image.properties,
    src: target.src,
    isVideo: isVideoItem(image)
  });
  
  // For video items, try multiple fallback strategies
  if (isVideoItem(image)) {
    // First fallback: try thumbnail_url if we weren't using it already
    if (target.src !== image.thumbnail_url && image.thumbnail_url) {
      logger.info('Trying thumbnail_url fallback for video:', image.thumbnail_url);
      target.src = image.thumbnail_url;
      return;
    }
    
    // Second fallback: try properties.thumbnail_url if different
    if (typeof image.properties === 'object' && 
        image.properties?.thumbnail_url && 
        target.src !== image.properties.thumbnail_url) {
      logger.info('Trying properties.thumbnail_url fallback for video:', image.properties.thumbnail_url);
      target.src = image.properties.thumbnail_url;
      return;
    }
    
    // Third fallback: try YouTube default thumbnail if we can extract video ID
    let videoId = '';
    let url = image.path;
    
    if (typeof image.properties === 'object' && image.properties?.video_id) {
      videoId = image.properties.video_id;
    } else if (typeof image.properties === 'object' && image.properties?.video_url) {
      url = image.properties.video_url;
    }
    
    if (!videoId && url) {
      if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('youtube.com/watch?v=')[1]?.split('&')[0] || '';
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
      }
    }
    
    if (videoId) {
      const youtubeFallback = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      if (target.src !== youtubeFallback) {
        logger.info('Trying YouTube API fallback for video:', youtubeFallback);
        target.src = youtubeFallback;
        return;
      }
      
      // Try medium quality if maxres fails
      const youtubeMedium = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
      if (target.src !== youtubeMedium) {
        logger.info('Trying YouTube medium quality fallback for video:', youtubeMedium);
        target.src = youtubeMedium;
        return;
      }
    }
    
    // Final fallback: placeholder image
    const placeholder = `https://via.placeholder.com/800x600/333333/ffffff?text=Video+Thumbnail+Unavailable`;
    if (target.src !== placeholder) {
      logger.info('Using placeholder fallback for video:', placeholder);
      target.src = placeholder;
    }
  } else {
    // For regular images, try webp_url or thumbnail_url fallbacks
    if (image.webp_url && target.src !== image.webp_url) {
      logger.info('Trying webp_url fallback for image:', image.webp_url);
      target.src = image.webp_url;
    } else if (image.thumbnail_url && target.src !== image.thumbnail_url) {
      logger.info('Trying thumbnail_url fallback for image:', image.thumbnail_url);
      target.src = image.thumbnail_url;
    }
  }
};

const handleImageLoad = (event: Event, image: AlbumImage) => {
  const target = event.target as HTMLImageElement;
  logger.debug('Image loaded successfully:', {
    title: image.title,
    src: target.src,
    isVideo: isVideoItem(image)
  });
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