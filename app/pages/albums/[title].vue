<template>
  <div class="page-container">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-8">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-site-gold-500 text-2xl" />
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-8">
      <p class="text-error-500">{{ error }}</p>
      <UButton label="Back to Albums" to="/albums" icon="i-heroicons-arrow-uturn-left" class="mt-4" />
    </div>
    
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
                  <img 
                    :src="image.thumbnail_url || getVideoThumbnail(image)" 
                    :alt="image.caption || 'Video thumbnail'" 
                    class="w-full aspect-[4/3] object-cover transition-all duration-300"
                  />
                  <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                    <UIcon name="i-heroicons-play" class="text-4xl text-white" />
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

      <!-- Video Player Modal -->
      <UModal v-model="showVideoPlayer" class="sm:max-w-4xl">
        <UCard v-if="selectedVideo">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">{{ selectedVideo.title }}</h3>
              <UButton 
                color="neutral" 
                variant="ghost" 
                icon="i-heroicons-x-mark-20-solid" 
                @click="closeVideoPlayer"
              />
            </div>
          </template>

          <div class="aspect-video">
            <iframe
              :src="getYouTubeEmbedUrl(selectedVideo)"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              class="w-full h-full rounded-lg"
            ></iframe>
          </div>

          <template #footer v-if="selectedVideo.caption">
            <p class="text-sm text-gray-600">{{ selectedVideo.caption }}</p>
          </template>
        </UCard>
      </UModal>

      <!-- Fullscreen viewer for images -->
      <ImageViewer 
        v-if="showFullscreen && selectedImage" 
        :images="images.filter(img => !isVideoItem(img))" 
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

const route = useRoute();
const album = ref<Album | null>(null);
const images = ref<Image[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const showFullscreen = ref(false);
const selectedImage = ref<Image | null>(null);
const showVideoPlayer = ref(false);
const selectedVideo = ref<Image | null>(null);

const fetchAlbum = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const config = useRuntimeConfig();
    const apiUrl = config.public.apiUrl || config.public.vamsUrl;
    const apiKey = config.public.apiKey || config.public.vamsBgApiKey;
    
    console.log('API URL:', apiUrl);
    console.log('API Key exists:', !!apiKey);
    console.log('Route params:', route.params);
    
    if (!apiUrl) {
      error.value = 'API URL not configured. Please check your environment variables (VAMS_URL).';
      return;
    }
    
    if (!route.params.title) {
      error.value = 'Album title is required.';
      return;
    }
    
    const url = `${apiUrl}/public/albums/by-title/${route.params.title}`;
    console.log('Fetching from URL:', url);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    if (apiKey) {
      headers['X-API-Key'] = apiKey;
    }
    
    const response = await fetch(url, { headers });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error:', errorText);
      
      // More specific error messages based on status code
      if (response.status === 404) {
        error.value = `Album "${route.params.title}" not found.`;
      } else if (response.status === 401) {
        error.value = 'Authentication failed. Please check your API key.';
      } else if (response.status === 403) {
        error.value = 'Access forbidden. You may not have permission to view this album.';
      } else if (response.status >= 500) {
        error.value = 'Server error. Please try again later.';
      } else {
        error.value = `Failed to fetch album (${response.status}): ${errorText}`;
      }
      return;
    }
    
    const apiResponse = await response.json();
    console.log('API Response:', apiResponse);
    
    // Handle the nested response structure
    album.value = apiResponse.data?.album || apiResponse.album;
    images.value = (apiResponse.data?.images || apiResponse.images || [])
      .filter((img: Image | null): img is Image => img !== null);
    
    console.log('Album:', album.value);
    console.log('Images count:', images.value.length);
    
    // If no album found but no error, show appropriate message
    if (!album.value) {
      error.value = `Album "${route.params.title}" not found in the response.`;
    }
    
  } catch (err) {
    console.error('Error fetching album data:', err);
    if (err instanceof TypeError && err.message.includes('fetch')) {
      error.value = 'Network error. Please check your internet connection and API URL.';
    } else {
      error.value = err instanceof Error ? err.message : 'An unexpected error occurred while fetching the album';
    }
  } finally {
    loading.value = false;
  }
};

const handleItemClick = (image: Image) => {
  console.log('Item clicked:', image.title, image.path);
  console.log('Is video item:', isVideoItem(image));
  
  if (isVideoItem(image)) {
    console.log('Opening video player for:', image.title);
    openVideoPlayer(image);
  } else {
    console.log('Opening fullscreen for:', image.title);
    openFullscreen(image);
  }
};

const openFullscreen = (image: Image) => {
  selectedImage.value = image;
  showFullscreen.value = true;
};

const closeFullscreen = () => {
  showFullscreen.value = false;
  selectedImage.value = null;
};

const openVideoPlayer = (video: Image) => {
  console.log('openVideoPlayer called with:', video.title);
  console.log('Video properties:', video.properties);
  selectedVideo.value = video;
  showVideoPlayer.value = true;
  console.log('showVideoPlayer set to:', showVideoPlayer.value);
};

const closeVideoPlayer = () => {
  showVideoPlayer.value = false;
  selectedVideo.value = null;
};

const isVideoItem = (image: Image) => {
  // Check properties JSON for video type first
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
  
  // Check if the path contains common video URL patterns
  const path = image.path.toLowerCase();
  return path.includes('youtube.com') || 
         path.includes('youtu.be') || 
         path.includes('vimeo.com');
};

const getVideoThumbnail = (image: Image) => {
  // Try to get thumbnail from properties JSON
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
  
  // Check if thumbnail_url is directly available
  if (image.thumbnail_url) {
    return image.thumbnail_url;
  }
  
  // Fallback thumbnail for videos
  return `https://picsum.photos/800/600?random=${image.id.slice(-3)}`;
};

const getYouTubeEmbedUrl = (video: Image) => {
  try {
    // First try to get video_id from properties
    if (video.properties) {
      let properties;
      if (typeof video.properties === 'string') {
        properties = JSON.parse(video.properties);
      } else {
        properties = video.properties;
      }
      
      if (properties.video_id) {
        return `https://www.youtube.com/embed/${properties.video_id}`;
      }
    }
    
    // Try to get URL from properties.video_url if available
    let url = video.path;
    if (video.properties) {
      try {
        const properties = typeof video.properties === 'string' ? JSON.parse(video.properties) : video.properties;
        if (properties.video_url) {
          url = properties.video_url;
        }
      } catch (e) {
        // Use path as fallback
      }
    }
    
    let videoId = '';
    
    // Handle different YouTube URL formats
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('youtube.com/watch?v=')[1]?.split('&')[0] || '';
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  } catch (error) {
    console.error('Error parsing video URL:', error);
    return '';
  }
};

onMounted(() => {
  fetchAlbum();
});

// Update page metadata
useHead({
  title: computed(() => {
    return album.value?.title || 'Album';
  }),
  meta: [
    { 
      name: 'description',
      content: computed(() => {
        return album.value?.description || `Viewing album ${album.value?.title || ''}`;
      })
    }
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