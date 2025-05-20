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
              <div class="image-container block rounded-lg overflow-hidden">
                <img 
                  :src="image.thumbnail_url || image.path" 
                  :alt="image.caption || 'Album image'" 
                  class="w-full aspect-[4/3] object-cover transition-all duration-300"
                />
                <div class="middle-overlay">
                  <div class="middle-overlay-text">
                    <p v-if="image.caption" class="text-sm">{{ image.caption }}</p>
                    <UButton 
                      icon="i-heroicons-arrows-pointing-out" 
                      color="primary" 
                      variant="ghost"
                      @click="openFullscreen(image)"
                    />
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

      <!-- Fullscreen viewer -->
      <ImageViewer 
        v-if="showFullscreen" 
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

const route = useRoute();
const album = ref<Album | null>(null);
const images = ref<Image[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const showFullscreen = ref(false);
const selectedImage = ref<Image | null>(null);

const fetchAlbum = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await fetch(`https://vams-main-qvek1c.laravel.cloud/api/albums/title/${route.params.title}`);
    if (!response.ok) {
      throw new Error('Failed to fetch album');
    }
    
    const data = await response.json();
    album.value = data.album;
    images.value = data.images;
  } catch (err) {
    console.error('Error fetching album data:', err);
    error.value = err instanceof Error ? err.message : 'An error occurred while fetching the album';
  } finally {
    loading.value = false;
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