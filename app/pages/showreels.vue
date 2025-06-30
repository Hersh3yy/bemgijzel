<template>
  <div class="page-container">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-8">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-2xl" :style="{ color: 'var(--color-site-gold-500)' }" />
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-8">
      <p :style="{ color: 'var(--color-site-gold-500)' }">{{ error }}</p>
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
          <div v-if="!images || images.length === 0" class="text-center py-8">
            <p :style="{ color: 'var(--color-site-gold-100)' }">No showreels found.</p>
            <UButton label="Back to Home" to="/" icon="i-heroicons-arrow-uturn-left" class="mt-4" />
          </div>

          <!-- Vertical feed layout for showreels -->
          <div v-else class="showreels-feed space-y-6 max-w-3xl mx-auto">
            <div 
              v-for="image in images" 
              :key="image.id" 
              class="showreel-item rounded-lg overflow-hidden shadow-lg cursor-pointer"
              @click="handleItemClick(image)"
            >
              <!-- Video thumbnail with play button -->
              <template v-if="isVideoItem(image)">
                <div class="relative aspect-video">
                  <img 
                    :src="image.thumbnail_url || getVideoThumbnail(image)" 
                    :alt="image.caption || 'Showreel thumbnail'" 
                    class="w-full h-full object-cover transition-all duration-300"
                  />
                  <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                    <UIcon name="i-heroicons-play" class="text-6xl text-white" />
                  </div>
                </div>
              </template>
              
              <!-- Regular image (treated as video item for showreels) -->
              <template v-else>
                <div class="relative aspect-video">
                  <img 
                    :src="image.thumbnail_url || image.path" 
                    :alt="image.caption || 'Showreel thumbnail'" 
                    class="w-full h-full object-cover transition-all duration-300"
                  />
                  <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                    <UIcon name="i-heroicons-play" class="text-6xl text-white opacity-80" />
                  </div>
                </div>
              </template>
              
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-2" :style="{ color: 'var(--color-site-gold-500)' }">
                  {{ image.title || image.caption || 'Showreel' }}
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
        :images="images" 
        :initialImage="selectedImage"
        @close="closeFullscreen"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Album {
  id: string;
  title: string;
  description: string;
  cover_image_path: string;
  user_id: string;
  created_at: string;
  updated_at: string;
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
  properties: any;
  created_at: string;
  updated_at: string;
}

const album = ref<Album | null>(null);
const images = ref<Image[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const showFullscreen = ref(false);
const selectedImage = ref<Image | null>(null);

const fetchShowreels = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const config = useRuntimeConfig();
    const apiUrl = config.public.apiUrl || config.public.vamsUrl;
    const apiKey = config.public.apiKey || config.public.vamsBgApiKey;
    
    console.log('Showreels page - API URL:', apiUrl);
    console.log('Showreels page - API Key exists:', !!apiKey);
    
    if (!apiUrl) {
      error.value = 'API URL not configured. Please check your environment variables (VAMS_URL).';
      return;
    }
    
    const albumTitle = 'Showreels';
    const url = `${apiUrl}/public/albums/by-title/${albumTitle}`;
    console.log('Fetching showreels from URL:', url);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    if (apiKey) {
      headers['X-API-Key'] = apiKey;
    }
    
    const response = await fetch(url, { headers });
    
    console.log('Showreels response status:', response.status);
    console.log('Showreels response headers:', [...response.headers.entries()]);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Showreels response error:', errorText);
      
      if (response.status === 404) {
        error.value = 'Showreels album not found.';
      } else if (response.status === 401) {
        error.value = 'Authentication failed. Please check your API key.';
      } else if (response.status === 403) {
        error.value = 'Access forbidden. You may not have permission to view this album.';
      } else if (response.status >= 500) {
        error.value = 'Server error. Please try again later.';
      } else {
        error.value = `Failed to fetch showreels (${response.status}): ${errorText}`;
      }
      return;
    }
    
    const apiResponse = await response.json();
    console.log('Showreels API Response:', apiResponse);
    
    album.value = apiResponse.data?.album || apiResponse.album;
    images.value = (apiResponse.data?.images || apiResponse.images || [])
      .filter((img: Image | null): img is Image => img !== null)
      .sort((a: Image, b: Image) => a.order - b.order); // Sort by order
    
    console.log('Showreels Album:', album.value);
    console.log('Showreels Images count:', images.value.length);
    
    if (!album.value) {
      error.value = 'Showreels album not found in the response.';
    }
    
  } catch (err) {
    console.error('Error fetching showreels data:', err);
    if (err instanceof TypeError && err.message.includes('fetch')) {
      error.value = 'Network error. Please check your internet connection and API URL.';
    } else {
      error.value = err instanceof Error ? err.message : 'An unexpected error occurred while fetching showreels';
    }
  } finally {
    loading.value = false;
  }
};

const handleItemClick = (image: Image) => {
  // Now all items open in the unified ImageViewer
  openFullscreen(image);
};

const openFullscreen = (image: Image) => {
  selectedImage.value = image;
  showFullscreen.value = true;
};

const closeFullscreen = () => {
  showFullscreen.value = false;
  selectedImage.value = null;
};

const isVideoItem = (image: Image) => {
  if (image.properties) {
    try {
      let properties;
      if (typeof image.properties === 'string') {
        properties = JSON.parse(image.properties);
      } else {
        properties = image.properties;
      }
      
      if (properties.type === 'video') return true;
    } catch (e) {
      // Ignore parsing errors
    }
  }
  
  const path = image.path.toLowerCase();
  return path.includes('youtube.com') || 
         path.includes('youtu.be') || 
         path.includes('vimeo.com');
};

const getVideoThumbnail = (image: Image) => {
  if (image.properties) {
    try {
      let properties;
      if (typeof image.properties === 'string') {
        properties = JSON.parse(image.properties);
      } else {
        properties = image.properties;
      }
      
      if (properties.thumbnail_url) {
        return properties.thumbnail_url;
      }
    } catch (e) {
      console.warn('Failed to parse image properties for thumbnail:', e);
    }
  }
  
  if (image.thumbnail_url) {
    return image.thumbnail_url;
  }
  
  return `https://picsum.photos/800/450?random=${image.id.slice(-3)}`;
};



onMounted(() => {
  fetchShowreels();
});

useHead({
  title: 'Showreels - Video Portfolio',
  meta: [
    { name: 'description', content: 'Watch our showreels and video highlights.' }
  ]
})
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