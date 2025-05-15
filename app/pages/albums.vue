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
            <NuxtLink :to="album.route" class="image-container block rounded-lg overflow-hidden">
              <img 
                :src="album.coverImage" 
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
import { ref } from 'vue';

// For a real application, this data would be fetched from an API
const albums = ref([
  {
    id: 1,
    title: 'Fiction',
    description: 'Acting in fiction productions',
    coverImage: 'https://picsum.photos/400/300?random=1',
    route: '/fiction'
  },
  {
    id: 2,
    title: 'Fashion',
    description: 'Fashion modeling portfolio',
    coverImage: 'https://picsum.photos/400/300?random=2',
    route: '/fashion'
  },
  // Add more albums as needed
  {
    id: 3,
    title: 'Corporate',
    description: 'Corporate modeling work',
    coverImage: 'https://picsum.photos/400/300?random=3',
    route: '/corporate'
  },
  {
    id: 4,
    title: 'Commercial',
    description: 'Acting in commercials',
    coverImage: 'https://picsum.photos/400/300?random=4',
    route: '/commercial'
  },
  {
    id: 5,
    title: 'Music Videos',
    description: 'Performances in music videos',
    coverImage: 'https://picsum.photos/400/300?random=5',
    route: '/music-videos'
  },
  {
    id: 6,
    title: 'Art',
    description: 'Artistic photography',
    coverImage: 'https://picsum.photos/400/300?random=6',
    route: '/art'
  }
]);

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
</style> 