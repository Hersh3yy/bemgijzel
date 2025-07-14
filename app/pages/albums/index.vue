<template>
  <div class="page-container">
    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold text-center" :style="{ color: 'var(--site-gold)' }">Albums</h1>
      </template>

      <div class="p-4">
        <p class="text-center mb-8" :style="{ color: 'var(--ui-text)' }">
          Browse through our collection of albums.
        </p>

        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center py-8">
          <UIcon name="i-heroicons-arrow-path" class="animate-spin text-site-gold-500 text-2xl" />
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-600 mb-4">{{ errorMessage }}</p>
          <button 
            @click="fetchAlbums"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>

        <!-- Albums grid -->
        <div v-else-if="albums && albums.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="album in albums" :key="album.id" class="album-card">
            <NuxtLink :to="`/albums/${album.title}`" class="image-container block rounded-lg overflow-hidden">
              <img 
                :src="album.cover_image_path" 
                :alt="album.title" 
                class="w-full aspect-[4/3] object-cover transition-all duration-300"
              />
              <div class="middle-overlay">
                <div class="middle-overlay-text text-xl">{{ album.title }}</div>
              </div>
            </NuxtLink>
            <div class="mt-2 text-center">
              <h2 class="text-lg font-bold" :style="{ color: 'var(--site-gold)' }">{{ album.title }}</h2>
              <p class="text-sm" :style="{ color: 'var(--ui-text)' }">{{ album.description }}</p>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-8">
          <p class="text-site-gold-300">No albums found.</p>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { Album } from '~/types/api';
import { useAlbum } from '~/composables/useAlbum';

const { fetchAllAlbums } = useAlbum();

// Use Nuxt's built-in useAsyncData with SSR optimization and caching
const { data: albumsData, status, error, refresh } = await useAsyncData<Album[]>(
  'albums-list',
  fetchAllAlbums,
  {
    // Automatically refresh on page focus
    server: true,
    // Default value while loading
    default: () => []
  }
);

const loading = computed(() => status.value === 'pending');
const albums = computed(() => albumsData.value || []);
const errorMessage = computed(() => error.value?.message || 'Failed to load albums');

// Simple refresh function
const fetchAlbums = () => {
  refresh();
};

useHead({
  title: 'Albums',
  meta: [
    { name: 'description', content: 'Browse through our collection of photo and video albums.' }
  ]
});
</script>

<style scoped>
.page-container {
  padding: 2rem;
}

.album-card {
  transition: transform 0.3s ease;
}

.album-card:hover {
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
  font-weight: bold;
}
</style> 