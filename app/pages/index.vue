<template>
  <div class="site-container">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-8">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-site-gold-500 text-2xl" />
    </div>

    <!-- Error state with fallback -->
    <div v-else-if="error">
      <div class="text-center py-4 mb-6">
        <p class="text-error-500 text-sm">{{ error }}</p>
        <p class="text-gray-600 text-sm">Showing default layout</p>
      </div>
      <Mosaic :images="fallbackMosaicImages" />
    </div>

    <!-- Dynamic mosaic from API -->
    <DynamicMosaic v-else-if="mosaicData" :mosaic-data="mosaicData" />

    <!-- Fallback static mosaic -->
    <Mosaic v-else :images="fallbackMosaicImages" />
  </div>
</template>

<script setup lang="ts">
import type { MosaicImage } from '~/components/Mosaic.vue';

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

// Fallback hardcoded mosaic images (keep current design as fallback)
const fallbackMosaicImages: MosaicImage[] = [
  {
    url: 'https://picsum.photos/800/800?random=1',
    alt: 'Latest Updates',
    title: 'Click here to see what\'s new',
    description: 'Latest updates and news'
  },
  {
    url: 'https://picsum.photos/800/800?random=2',
    alt: 'Showreels',
    title: 'Showreels',
    description: 'View our showreels'
  },
  {
    url: 'https://picsum.photos/800/800?random=3',
    alt: 'Commercials',
    title: 'Commercials',
    description: 'Commercial work'
  },
  {
    url: 'https://picsum.photos/800/800?random=4',
    alt: 'Music Videos',
    title: 'Music Videos',
    description: 'Music video productions'
  },
  {
    url: 'https://picsum.photos/800/800?random=5',
    alt: 'Fiction Acting',
    title: 'Acting Fiction',
    description: 'Fiction acting portfolio',
    route: '/fiction-actings'
  },
  {
    url: 'https://picsum.photos/800/800?random=6',
    alt: 'Arts',
    title: 'Art',
    description: 'Artistic work',
    route: '/arts'
  },
  {
    url: 'https://picsum.photos/800/800?random=7',
    alt: 'Commercial Acting',
    title: 'Acting Corporate',
    description: 'Corporate acting work',
    route: '/commercial-actings'
  },
  {
    url: 'https://picsum.photos/800/800?random=8',
    alt: 'Fashion Modeling',
    title: 'Fashion',
    description: 'Fashion modeling portfolio',
    route: '/fashion-modelings'
  },
  {
    url: 'https://picsum.photos/800/800?random=9',
    alt: 'Corporate Modeling',
    title: 'Modeling Corporate',
    description: 'Corporate modeling work',
    route: '/corporate-modelings'
  }
];

const fetchMosaic = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const config = useRuntimeConfig();
    const apiUrl = config.public.apiUrl || config.public.vamsUrl;
    const apiKey = config.public.apiKey || config.public.vamsBgApiKey;
    
    console.log('Index page - API URL:', apiUrl);
    console.log('Index page - API Key exists:', !!apiKey);
    
    if (!apiUrl) {
      throw new Error('API URL not configured. Please check your environment variables.');
    }
    
    // You can make this configurable later or fetch a specific mosaic by title
    const mosaicTitle = 'main'; // or get from config/environment
    const url = `${apiUrl}/public/mosaics/by-title/${mosaicTitle}`;
    console.log('Fetching mosaic from URL:', url);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    if (apiKey) {
      headers['X-API-Key'] = apiKey;
    }
    
    const response = await fetch(url, { headers });
    
    console.log('Mosaic response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mosaic response error:', errorText);
      throw new Error(`Failed to fetch mosaic data (${response.status}): ${errorText}`);
    }
    
    const apiResponse = await response.json();
    console.log('Mosaic API Response:', apiResponse);
    
    mosaicData.value = apiResponse.data?.data || apiResponse.data || apiResponse;
  } catch (err) {
    console.error('Error fetching mosaic data:', err);
    error.value = err instanceof Error ? err.message : 'Failed to load dynamic layout';
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
</style>
