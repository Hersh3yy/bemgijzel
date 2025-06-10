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

        <!-- Grid of images and videos -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div 
            v-for="image in images" 
            :key="image.id" 
            class="image-container aspect-square rounded-md overflow-hidden cursor-pointer relative"
            @click="openImage(image.id)"
          >
            <!-- Video thumbnail with play button -->
            <template v-if="isVideo(image)">
              <img 
                :src="image.thumbnail_url || ''" 
                :alt="image.caption || 'Video thumbnail'" 
                class="w-full h-full object-cover" 
              />
              <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                <UIcon name="i-heroicons-play" class="text-4xl text-white" />
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
import { ref, onMounted } from 'vue'

interface Album {
  id: string;
  title: string;
  description: string;
  cover_image_path: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface ImageProperties {
  webp_url?: string;
  type?: string;
  video_id?: string;
  video_type?: string;
  year?: number;
  thumbnail_url?: string;
}

interface Image {
  id: string;
  title: string | null;
  description: string | null;
  path: string;
  webp_path: string | null;
  thumbnail_url: string | null;
  webp_url: string | null;
  caption: string | null;
  order: number;
  properties: string | ImageProperties;
  created_at: string;
  updated_at: string;
}

interface Props {
  albumId?: string;
  albumTitle?: string;
}

const props = defineProps<Props>();
const router = useRouter();

const album = ref<Album | null>(null);
const images = ref<Image[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const isVideo = (image: Image) => {
  if (typeof image.properties === 'string') {
    try {
      const props = JSON.parse(image.properties);
      return props.type === 'video';
    } catch {
      return false;
    }
  }
  return image.properties?.type === 'video';
};

const openImage = (imageId: string) => {
  router.push(`/albums/${imageId}`);
};

const fetchAlbum = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const runtimeConfig = useRuntimeConfig();
    let baseUrl = runtimeConfig.public.vamsUrl || 'localhost:8000';
    
    // Ensure baseUrl doesn't have protocol prefix
    baseUrl = baseUrl.replace(/^https?:\/\//, '');
    
    if (!baseUrl) {
      throw new Error('VAMS_URL environment variable is not configured');
    }
    
    let url = '';
    
    if (props.albumId) {
      url = `http://${baseUrl}/api/albums/${props.albumId}`;
    } else if (props.albumTitle) {
      url = `http://${baseUrl}/api/public/albums/by-title/${props.albumTitle}`;
    } else {
      throw new Error('Either albumId or albumTitle must be provided');
    }
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add API key header if available
    if (runtimeConfig.public.vamsBgApiKey) {
      headers['x-api-key'] = runtimeConfig.public.vamsBgApiKey as string;
    }
    
    console.log('Fetching from:', url);
    console.log('Headers:', headers);
    
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch album: ${response.status} ${response.statusText}`);
    }
    
    const apiResponse = await response.json();
    console.log('API Response:', apiResponse);
    
    // Handle the nested response structure
    if (apiResponse.data && apiResponse.data.data) {
      album.value = apiResponse.data.data.album;
      
      // Parse properties for each image if it's a string
      images.value = apiResponse.data.data.images.map((img: Image) => ({
        ...img,
        properties: typeof img.properties === 'string' ? JSON.parse(img.properties) : img.properties
      }));
    } else {
      throw new Error('Invalid response structure');
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