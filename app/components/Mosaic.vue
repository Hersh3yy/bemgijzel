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
    ['Latest', 'Showreels', 'Commercials', 'Music Videos'].includes(img.title)
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
      'Acting Fiction': '/FictionActings',
      'Art': '/Art',
      'Acting Corporate': '/CommercialActings',
      'Fashion': '/FashionModelings',
      'Modeling Corporate': '/CorporateModelings'
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
  grid-template-columns: 33% 33% 34%;
  gap: 1rem;
  padding: 1rem;
  min-height: 100vh;
  align-items: stretch;
}

.mosaic-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
}

.first-column .mosaic-item {
  /* 4 items in first column - smaller aspect ratio */
  aspect-ratio: 4/3;
}

.second-column .mosaic-item {
  /* 2 items in second column - larger aspect ratio */
  aspect-ratio: 4/5;
}

.third-column .mosaic-item {
  /* 3 items in third column - medium aspect ratio */
  aspect-ratio: 4/4;
}

.mosaic-item {
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
  cursor: pointer;
  flex: 1;
  min-height: 150px;
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
    min-height: auto;
  }

  .mosaic-column {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    height: auto;
  }
  
  .mosaic-item,
  .first-column .mosaic-item,
  .second-column .mosaic-item,
  .third-column .mosaic-item {
    aspect-ratio: 1;
  }
}

@media (max-width: 480px) {
  .mosaic-column {
    grid-template-columns: 1fr !important;
  }
}
</style> 