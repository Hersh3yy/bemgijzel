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
    
    <!-- Viewer state -->
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

          <!-- Main image display -->
          <div v-else class="mt-8 aspect-video bg-neutral-900 rounded-md flex items-center justify-center overflow-hidden">
            <img 
              :src="currentImage?.path || currentImage?.webp_path" 
              :alt="currentImage?.caption || currentImage?.title || 'Album image'" 
              class="max-w-full max-h-full object-contain" 
            />
          </div>
          
          <!-- Image caption -->
          <div v-if="currentImage?.caption || currentImage?.title" class="mt-4 text-center p-2">
            <p :style="{ color: 'var(--site-gold)' }">{{ currentImage?.caption || currentImage?.title }}</p>
          </div>
          
          <!-- Navigation controls -->
          <div class="mt-6 flex justify-between">
            <UButton 
              v-if="currentIndex > 0"
              label="Previous" 
              icon="i-heroicons-arrow-left" 
              color="primary" 
              variant="outline" 
              @click="prevImage" 
            />
            <div v-else></div>
            
            <div class="text-center" :style="{ color: 'var(--ui-text)' }">
              {{ currentIndex + 1 }} / {{ images.length }}
            </div>
            
            <UButton 
              v-if="currentIndex < images.length - 1"
              label="Next" 
              icon="i-heroicons-arrow-right" 
              color="primary" 
              variant="outline" 
              @click="nextImage" 
            />
            <div v-else></div>
          </div>

          <!-- Thumbnail navigation -->
          <div class="mt-8 overflow-x-auto">
            <div class="flex space-x-2 pb-2">
              <div 
                v-for="(image, index) in images" 
                :key="image.id"
                class="flex-shrink-0 w-16 h-16 cursor-pointer rounded-md overflow-hidden"
                :class="{ 'ring-2 ring-site-gold-500': currentIndex === index }"
                @click="selectImage(index)"
              >
                <img 
                  :src="image.thumbnail_url || image.path" 
                  :alt="`Thumbnail ${index + 1}`" 
                  class="w-full h-full object-cover" 
                />
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-between">
            <UButton label="Back to Album" :to="albumRoutePath" icon="i-heroicons-arrow-uturn-left" color="gray" />
            
            <UButton 
              label="Fullscreen View" 
              icon="i-heroicons-arrows-pointing-out" 
              color="primary" 
              variant="solid" 
              @click="openFullscreen" 
            />
          </div>
        </template>
      </UCard>

      <!-- Fullscreen viewer -->
      <ImageViewer 
        v-if="showFullscreen" 
        :images="images" 
        :initialImageId="Number(route.params.id)" 
        @close="closeFullscreen"
        @change="updateCurrentImage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

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

const route = useRoute();
const router = useRouter();

const imageId = computed(() => Number(route.params.id));
const album = ref<Album | null>(null);
const images = ref<Image[]>([]);
const currentIndex = ref(0);
const loading = ref(true);
const error = ref<string | null>(null);
const showFullscreen = ref(false);

// Determine album route path based on image data
const albumRoutePath = computed(() => {
  // If a specific path is stored with the image, use that
  if (album.value) {
    // This is a simple mapping based on the album title
    // In a real app, you might have more complex logic or store the route in the API response
    const titleToRoute: Record<string, string> = {
      'Fiction': '/fiction',
      'Fashion': '/fashion',
      // Add more mappings as needed
    };
    
    const albumTitle = album.value.title;
    return titleToRoute[albumTitle] || '/albums';
  }
  
  return '/albums';
});

// Navigation methods
const nextImage = () => {
  if (currentIndex.value < images.value.length - 1) {
    currentIndex.value++;
    updateRoute();
  }
};

const prevImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    updateRoute();
  }
};

const selectImage = (index: number) => {
  currentIndex.value = index;
  updateRoute();
};

const updateRoute = () => {
  // Update URL without reloading the page
  const newId = images.value[currentIndex.value]?.id;
  if (newId !== undefined && newId !== Number(route.params.id)) {
    router.replace(`/albums/${newId}`);
  }
};

const currentImage = computed(() => {
  return images.value[currentIndex.value] || null;
});

// Fullscreen methods
const openFullscreen = () => {
  showFullscreen.value = true;
};

const closeFullscreen = () => {
  showFullscreen.value = false;
};

const updateCurrentImage = (image: Image) => {
  const index = images.value.findIndex(img => img.id === image.id);
  if (index !== -1) {
    currentIndex.value = index;
    updateRoute();
  }
};

// Fetch album data
const fetchImage = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // In a real app, you would first fetch the image to get its album_id
    // Then fetch the album with all its images
    // For this example, we'll simulate it

    // Mock API response for development
    if (process.env.NODE_ENV === 'development') {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockImages = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        title: `Image ${i + 1}`,
        description: `Description for image ${i + 1}`,
        path: `https://picsum.photos/600/400?random=${i + 1}`,
        thumbnail_url: `https://picsum.photos/100/100?random=${i + 1}`,
        caption: `Caption for image ${i + 1}`,
        order: i,
        properties: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      
      const mockAlbum = {
        id: 1,
        title: 'Fiction', // or 'Fashion' based on some condition if needed
        description: 'This is a sample album showcasing various acting fiction images.',
        cover_image_path: 'https://picsum.photos/800/400',
        user_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      album.value = mockAlbum;
      images.value = mockImages;
      
      // Set current index based on the requested image ID
      const index = mockImages.findIndex(img => img.id === imageId.value);
      if (index !== -1) {
        currentIndex.value = index;
      }
    } else {
      // Real API implementation would go here
      // First, get the image details to find its album
      const imageResponse = await fetch(`/api/images/${imageId.value}`);
      
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
      }
      
      const imageData = await imageResponse.json();
      const albumId = imageData.album_id;
      
      // Then fetch the album with all its images
      const albumResponse = await fetch(`/api/albums/${albumId}`);
      
      if (!albumResponse.ok) {
        throw new Error(`Failed to fetch album: ${albumResponse.statusText}`);
      }
      
      const data = await albumResponse.json();
      album.value = data.album;
      images.value = data.images;
      
      // Set current index based on the requested image ID
      const index = data.images.findIndex((img: Image) => img.id === imageId.value);
      if (index !== -1) {
        currentIndex.value = index;
      }
    }
  } catch (err) {
    console.error('Error fetching image data:', err);
    error.value = err instanceof Error ? err.message : 'An error occurred while fetching the image';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchImage();
  
  // Add keyboard event listeners
  window.addEventListener('keydown', handleKeyDown);
  
  // Clean up
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });
});

// Keyboard navigation
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight') {
    nextImage();
  } else if (e.key === 'ArrowLeft') {
    prevImage();
  } else if (e.key === 'f' || e.key === 'F') {
    if (!showFullscreen.value) {
      openFullscreen();
    } else {
      closeFullscreen();
    }
  } else if (e.key === 'Escape' && showFullscreen.value) {
    closeFullscreen();
  }
};

// Update page metadata
useHead({
  title: computed(() => {
    const imageName = currentImage.value?.title || currentImage.value?.caption || 'Image';
    const albumName = album.value?.title || 'Album';
    return `${imageName} - ${albumName}`;
  }),
  meta: [
    { 
      name: 'description',
      content: computed(() => {
        return currentImage.value?.description || 
              `Viewing image ${currentIndex.value + 1} of ${images.value.length} in ${album.value?.title || 'album'}.`;
      })
    }
  ]
});
</script>

<style scoped>
.page-container {
  padding: 2rem;
}
</style> 