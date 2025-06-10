<template>
  <div class="mosaic-grid">
    <!-- First Column (20%) -->
    <div class="mosaic-column first-column">
      <div 
        v-for="(image, index) in firstColumnImages" 
        :key="index" 
        class="mosaic-item"
        @click="navigateToPage(image)"
      >
        <img 
          :src="image.url" 
          :alt="image.alt"
          class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div class="overlay">
          <h3 class="text-xl font-bold text-white">{{ image.title }}</h3>
          <p class="text-white">{{ image.description }}</p>
        </div>
      </div>
    </div>

    <!-- Second Column (40%) -->
    <div class="mosaic-column second-column">
      <div 
        v-for="(image, index) in secondColumnImages" 
        :key="index" 
        class="mosaic-item"
        @click="navigateToPage(image)"
      >
        <img 
          :src="image.url" 
          :alt="image.alt"
          class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div class="overlay">
          <h3 class="text-xl font-bold text-white">{{ image.title }}</h3>
          <p class="text-white">{{ image.description }}</p>
        </div>
      </div>
    </div>

    <!-- Third Column (40%) -->
    <div class="mosaic-column third-column">
      <div 
        v-for="(image, index) in thirdColumnImages" 
        :key="index" 
        class="mosaic-item"
        @click="navigateToPage(image)"
      >
        <img 
          :src="image.url" 
          :alt="image.alt"
          class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div class="overlay">
          <h3 class="text-xl font-bold text-white">{{ image.title }}</h3>
          <p class="text-white">{{ image.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

export interface MosaicImage {
  url: string;
  alt: string;
  title: string;
  description: string;
  route?: string;
}

const props = defineProps<{
  images: MosaicImage[];
}>();

const router = useRouter();

// Split images into columns based on their titles
const firstColumnImages = computed(() => {
  return props.images.filter(img => 
    ['Click here to see what\'s new', 'Showreels', 'Commercials', 'Music Videos'].includes(img.title)
  );
});

const secondColumnImages = computed(() => {
  return props.images.filter(img => 
    ['Acting Fiction', 'Art'].includes(img.title)
  );
});

const thirdColumnImages = computed(() => {
  return props.images.filter(img => 
    ['Acting Corporate', 'Fashion', 'Modeling Corporate'].includes(img.title)
  );
});

const navigateToPage = (image: MosaicImage) => {
  if (image.route) {
    router.push(image.route);
  } else {
    // Map titles to routes
    const routeMap: Record<string, string> = {
      'Acting Fiction': '/fiction-actings',
      'Art': '/arts',
      'Acting Corporate': '/commercial-actings',
      'Fashion': '/fashion-modelings',
      'Modeling Corporate': '/corporate-modelings'
    };
    
    const route = routeMap[image.title];
    if (route) {
      router.push(route);
    }
  }
};
</script>

<style scoped>
.mosaic-grid {
  display: grid;
  grid-template-columns: 20% 40% 40%;
  gap: 1rem;
  padding: 1rem;
  min-height: 100vh;
}

.mosaic-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mosaic-item {
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
  cursor: pointer;
  aspect-ratio: 1;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  padding: 1rem;
  text-align: center;
}

.mosaic-item:hover .overlay {
  opacity: 1;
}

@media (max-width: 1024px) {
  .mosaic-grid {
    grid-template-columns: 1fr;
  }

  .mosaic-column {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 480px) {
  .mosaic-column {
    grid-template-columns: 1fr;
  }
}
</style> 