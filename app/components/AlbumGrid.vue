<template>
  <div>
    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold text-center" :style="{ color: 'var(--site-gold)' }">{{ album?.title || 'Album' }}</h1>
        <p v-if="album?.description" class="text-center mt-2" :style="{ color: 'var(--ui-text)' }">{{ album.description }}</p>
      </template>

      <div class="p-4">
        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center py-8">
          <UIcon name="i-heroicons-arrow-path" class="animate-spin text-site-gold-500 text-2xl" />
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center py-8">
          <p class="text-error-500">{{ error }}</p>
          <UButton label="Try Again" icon="i-heroicons-arrow-path" class="mt-4" @click="fetchAlbum" />
        </div>

        <!-- Empty state -->
        <div v-else-if="!images || images.length === 0" class="text-center py-8">
          <p :style="{ color: 'var(--ui-text)' }">No images found in this album.</p>
        </div>

        <!-- Grid of images -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div 
            v-for="image in images" 
            :key="image.id" 
            class="image-container aspect-square rounded-md overflow-hidden cursor-pointer"
            @click="openImage(image.id)"
          >
            <img 
              :src="image.webp_path || image.path || image.thumbnail_url" 
              :alt="image.caption || image.title || 'Album image'" 
              class="w-full h-full object-cover" 
            />
            <div class="middle-overlay">
              <div class="middle-overlay-text">{{ image.caption || image.title || '' }}</div>
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Album {
  id: number;
  title: string;
  description: string;
  cover_image_path: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

interface Image {
  id: number;
  title: string;
  description: string;
  path: string;
  webp_path?: string;
  thumbnail_url?: string;
  webp_url?: string;
  caption?: string;
  order: number;
  properties: any;
  created_at: string;
  updated_at: string;
}

interface Props {
  albumId?: number;
  albumTitle?: string;
}

const props = defineProps<Props>();
const router = useRouter();

const album = ref<Album | null>(null);
const images = ref<Image[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const openImage = (imageId: number) => {
  router.push(`/albums/${imageId}`);
};

const fetchAlbum = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    let url = '';
    
    if (props.albumId) {
      url = `/api/albums/${props.albumId}`;
    } else if (props.albumTitle) {
      url = `/api/albums/title/${props.albumTitle}`;
    } else {
      throw new Error('Either albumId or albumTitle must be provided');
    }
    
    // Mock API response for development
    if (process.env.NODE_ENV === 'development' && !url.includes('http')) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data based on the album requested
      const mockImages = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        title: `Image ${i + 1}`,
        description: `Description for image ${i + 1}`,
        path: `https://picsum.photos/500/500?random=${i + 1}`,
        thumbnail_url: `https://picsum.photos/200/200?random=${i + 1}`,
        caption: `Caption ${i + 1}`,
        order: i,
        properties: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      
      const mockAlbum = {
        id: props.albumId || 1,
        title: props.albumTitle || (props.albumId === 1 ? 'Fiction' : 'Fashion'),
        description: `This is the ${props.albumTitle || (props.albumId === 1 ? 'Fiction' : 'Fashion')} album showcasing various images.`,
        cover_image_path: 'https://picsum.photos/800/400',
        user_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      album.value = mockAlbum;
      images.value = mockImages;
    } else {
      // Real API call for production
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch album: ${response.statusText}`);
      }
      
      const data = await response.json();
      album.value = data.album;
      images.value = data.images;
    }
  } catch (err) {
    console.error('Error fetching album data:', err);
    error.value = err instanceof Error ? err.message : 'An error occurred while fetching the album';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAlbum();
});
</script>

<style scoped>
/* Any additional component-specific styles can go here */
/* The image overlay styles are in main.css */
</style> 