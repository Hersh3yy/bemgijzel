<template>
  <LayoutsPageContainer>
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-8">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-2xl text-gold-primary" />
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-8">
      <p class="text-gold-primary">{{ errorMessage }}</p>
    </div>

    <!-- Content -->
    <div v-else>
      <UCard class="bg-site-black border-gold-hover">
        <template #header>
          <h1 class="text-3xl font-bold text-center text-gold-primary">What's new</h1>
          <p v-if="album && album.description" class="text-center mt-2 text-gold-secondary">{{ album.description }}</p>
          <p v-else class="text-center mt-2 text-gold-secondary">Latest posted content and updates.</p>
        </template>

        <div class="p-4">
          <!-- Empty state -->
          <div v-if="!images || images.length === 0" class="text-center py-8">
            <p :style="{ color: 'var(--color-site-gold-100)' }">No latest updates found.</p>
          </div>

          <!-- Vertical feed layout for latest content -->
          <div v-else class="space-y-6 max-w-2xl mx-auto">
            <div 
              v-for="image in images" 
              :key="image.id" 
              class="bg-site-black border-gold-hover rounded-lg overflow-hidden shadow-lg card-hover-effect"
            >
              <BaseMediaItem
                :item="image"
                aspect-ratio="video"
                :show-caption="false"
                :hover-effect="true"
                play-button-style="interactive"
                @click="handleItemClick"
              />
              
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-2 text-gold-primary">
                  {{ image.title || image.caption || 'Latest Update' }}
                </h3>
                <p v-if="image.description || image.caption" class="text-sm text-gold-secondary">
                  {{ image.description || image.caption }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-center">
            <BaseButton label="Back to Home" to="/" icon="i-heroicons-arrow-uturn-left" variant="primary" />
          </div>
        </template>
      </UCard>

      <!-- Unified viewer for both images and videos -->
      <ItemViewer 
        v-if="showFullscreen && selectedImage" 
        :items="mutableImages" 
        :initialItem="selectedImage"
        @close="closeFullscreen"
      />
    </div>
  </LayoutsPageContainer>
</template>

<script setup lang="ts">
import type { Album, AlbumImage, AlbumData } from '~/types/api';
import { useAlbum } from '~/composables/useAlbum';

const { fetchAlbumById, isVideoItem, getVideoThumbnail } = useAlbum();

const showFullscreen = ref(false);
const selectedImage = ref<AlbumImage | null>(null);

// Use Nuxt's built-in useAsyncData for the "Latest" album
const { data: albumData, status, error } = await useAsyncData<AlbumData>(
  'latest-album',
  () => fetchAlbumById('9f3864ab-b887-4083-9a2b-c7863d801636'),
  {
    server: true,
    // Transform to sort images by newest first
    transform: (data: AlbumData) => {
      if (data?.images) {
        const sortedImages = [...data.images].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        return { ...data, images: sortedImages };
      }
      return data;
    }
  }
);

const loading = computed(() => status.value === 'pending');
const errorMessage = computed(() => error.value?.message || 'Failed to load latest updates');
const album = computed(() => albumData.value?.album || null);
const images = computed(() => albumData.value?.images || []);

// Create a mutable copy for the ItemViewer component
const mutableImages = computed(() => [...images.value]);

const handleItemClick = (image: AlbumImage) => {
  openFullscreen(image);
};

const openFullscreen = (image: AlbumImage) => {
  selectedImage.value = image;
  showFullscreen.value = true;
};

const closeFullscreen = () => {
  showFullscreen.value = false;
  selectedImage.value = null;
};

// Enhanced page metadata
useHead({
  title: 'Latest Updates',
  meta: [
    { 
      name: 'description',
      content: () => album.value?.description || 'Latest posted content and updates'
    }
  ]
});
</script>