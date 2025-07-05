<template>
  <div class="site-container">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-8">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-site-gold-500 text-2xl" />
    </div>

    <!-- Dynamic mosaic from API -->
    <DynamicMosaic v-else-if="mosaicData" :mosaic-data="mosaicData" />

    <!-- Fallback static mosaic -->
    <Mosaic v-else :images="fallbackMosaicImages" />
  </div>
</template>

<script setup lang="ts">
import type { MosaicImage } from '~/components/Mosaic.vue';
import { useApi } from '~/composables/useApi';
import { logger } from '~/utils/logger';

interface MosaicItem {
  id: string;
  column_index: number;
  type: string;
  content: string | null;
  album_id: string | null;
  properties: {
    album: {
      id: string;
      title: string;
      cover_image_path: string;
    };
    selected_image: {
      id: string;
      path: string;
      title: string | null;
      caption: string | null;
    };
  };
  order: number;
  is_active: boolean;
}

interface MosaicData {
  mosaic: {
    id: string;
    title: string;
    description: string;
    columns: number;
    display_settings: any;
  };
  items: MosaicItem[];
}

const mosaicData = ref<MosaicData | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// Fallback hardcoded mosaic images - 3 columns: 4, 2, 3 items respectively
const fallbackMosaicImages: MosaicImage[] = [
  // Column 1 - 4 items (using titles that Mosaic component recognizes)
  {
    url: 'https://picsum.photos/800/600?random=1',
    alt: 'Latest Updates',
    title: 'Latest',
    description: 'Latest updates and news',
    route: '/latest'
  },
  {
    url: 'https://picsum.photos/800/500?random=2',
    alt: 'Showreels',
    title: 'Showreels',
    description: 'View our showreels',
    route: '/showreels'
  },
  {
    url: 'https://picsum.photos/800/700?random=3',
    alt: 'Commercial Actings',
    title: 'Commercials',
    description: 'Commercial acting work',
    route: '/albums/Commercials'
  },
  {
    url: 'https://picsum.photos/800/550?random=4',
    alt: 'Music Videos',
    title: 'Music Videos',
    description: 'Music video productions',
    route: '/albums/MusicVideos'
  },
  
  // Column 2 - 2 items  
  {
    url: 'https://picsum.photos/800/800?random=5',
    alt: 'Fiction Actings',
    title: 'Acting Fiction',
    description: 'Fiction acting portfolio',
    route: '/albums/FictionActings'
  },
  {
    url: 'https://picsum.photos/800/800?random=6',
    alt: 'Art',
    title: 'Art',
    description: 'Artistic work',
    route: '/albums/Art'
  },
  
  // Column 3 - 3 items
  {
    url: 'https://picsum.photos/800/600?random=7',
    alt: 'Commercial Actings',
    title: 'Acting Corporate',
    description: 'Commercial acting work',
    route: '/albums/Commercials'
  },
  {
    url: 'https://picsum.photos/800/650?random=8',
    alt: 'Fashion Modelings',
    title: 'Fashion',
    description: 'Fashion modeling portfolio',
    route: '/albums/Fashion'
  },
  {
    url: 'https://picsum.photos/800/550?random=9',
    alt: 'Corporate Modelings',
    title: 'Modeling Corporate',
    description: 'Corporate modeling work',
    route: '/albums/Corporate'
  }
];

const fetchMosaic = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const { fetchApi } = useApi();
    
    // You can make this configurable later or fetch a specific mosaic by title
    const mosaicTitle = 'LandingPage'; // or get from config/environment
    
    const response = await fetchApi(`/public/mosaics/by-title/${mosaicTitle}`);
    mosaicData.value = response;
  } catch (err) {
    logger.warn('Using fallback mosaic due to API error:', err);
    // Fallback to static mosaic - this is expected behavior
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchMosaic();
});

useHead({
  title: 'Home',
  meta: [
    { name: 'description', content: 'Welcome to our site' }
  ]
});
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  padding: 1rem;
}

.site-container {
  min-height: 90vh; /* Ensure adequate height for mosaic */
}
</style>
