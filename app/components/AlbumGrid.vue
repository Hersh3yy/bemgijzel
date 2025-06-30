<template>
  <div>
    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold text-center" :style="{ color: 'var(--site-gold)' }">{{ album?.title || 'Album' }}</h1>
        <p v-if="album?.description" class="text-center mt-2" :style="{ color: 'var(--ui-text)' }">{{ album.description }}</p>
      </template>

      <div class="p-4">
        <!-- Loading state -->
        <BaseLoading v-if="loading" message="Loading album..." />

        <!-- Error state -->
        <BaseError 
          v-else-if="error" 
          :message="errorMessage" 
          title="Failed to Load Album"
          show-retry 
          @retry="fetchAlbum" 
        />

        <!-- Empty state -->
        <div v-else-if="!images || images.length === 0" class="text-center py-8">
          <p :style="{ color: 'var(--ui-text)' }">No images found in this album.</p>
        </div>

        <!-- Grid of images and videos -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div 
            v-for="image in images" 
            :key="image.id" 
            class="image-container aspect-square rounded-md overflow-hidden cursor-pointer relative"
            @click="openImage(image.id)"
          >
            <!-- Video thumbnail with play button -->
            <template v-if="isVideoItem(image)">
              <div class="relative w-full h-full">
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
                :src="image.thumbnail_url || image.webp_url || image.path || ''" 
                :alt="image.caption || 'Album image'" 
                class="image-responsive image-hover-darken" 
                @error="handleImageError($event, image)"
                @load="handleImageLoad($event, image)"
              />
            </template>

            <!-- Caption overlay -->
            <div v-if="image.caption" class="middle-overlay">
              <div class="middle-overlay-text">{{ image.caption }}</div>
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { Album, AlbumImage, AlbumData } from '~/composables/useAlbum';
import { useAlbum } from '~/composables/useAlbum';
import { logger } from '~/utils/logger';

interface Props {
  albumId?: string;
  albumTitle?: string;
}

const props = defineProps<Props>();
const router = useRouter();
const { fetchAlbumByTitle, fetchAlbumById, isVideoItem, getVideoThumbnail } = useAlbum();

// Create fetcher function based on props
const fetcher = async (): Promise<AlbumData> => {
  if (!props.albumId && !props.albumTitle) {
    throw new Error('Either albumId or albumTitle must be provided');
  }
  
  if (props.albumId) {
    return await fetchAlbumById(props.albumId);
  } else {
    return await fetchAlbumByTitle(props.albumTitle!);
  }
};

// Use Nuxt's built-in useAsyncData with automatic caching and SSR optimization
const { data: albumData, status, error, refresh } = await useAsyncData(
  // Unique key for caching - changes when props change
  () => `album-${props.albumId || props.albumTitle}`,
  fetcher,
  {
    // Transform the data and ensure proper type safety
    transform: (data: AlbumData) => data,
    // Don't fetch on server if we want client-side only (optional)
    server: true,
    // Use lazy loading for better UX (optional)
    lazy: false
  }
);

const loading = computed(() => status.value === 'pending');
const errorMessage = computed(() => error.value?.message || 'An error occurred while loading the album');
const album = computed(() => albumData.value?.album || null);
const images = computed(() => albumData.value?.images || []);

const openImage = (imageId: string) => {
  router.push(`/albums/${imageId}`);
};

// Simple refresh function
const fetchAlbum = () => {
  refresh();
};

const handleImageError = (event: Event, image: AlbumImage) => {
  const target = event.target as HTMLImageElement;
  logger.error('Error loading image in AlbumGrid:', {
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
  logger.debug('Image loaded successfully in AlbumGrid:', {
    title: image.title,
    src: target.src,
    isVideo: isVideoItem(image)
  });
};
</script>

<style scoped>
/* Any additional component-specific styles can go here */
/* The image overlay styles are in main.css */
</style> 