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

        <!-- Albums grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </UCard>
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

const albums = ref<Album[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchAlbums = async () => {
  try {
    const response = await fetch('https://vams-main-qvek1c.laravel.cloud/api/albums');
    if (!response.ok) {
      throw new Error('Failed to fetch albums');
    }
    const data = await response.json();
    albums.value = data.albums;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred while fetching albums';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAlbums();
});

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