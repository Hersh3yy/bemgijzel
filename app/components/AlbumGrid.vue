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
                  class="w-full h-full object-cover" 
                />
                <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-40 transition-all duration-300">
                  <UIcon name="i-heroicons-play" class="text-4xl text-white drop-shadow-lg" />
                </div>
              </div>
            </template>
            
            <!-- Regular image -->
            <template v-else>
              <img 
                :src="image.thumbnail_url || image.webp_url || image.path || ''" 
                :alt="image.caption || 'Album image'" 
                class="w-full h-full object-cover" 
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
</script>

<style scoped>
/* Any additional component-specific styles can go here */
/* The image overlay styles are in main.css */
</style> 