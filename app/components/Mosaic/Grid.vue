<template>
  <div class="grid grid-cols-3 gap-4 p-4 min-h-screen items-stretch">
    <!-- First Column (20%) -->
    <div class="flex flex-col gap-4 h-full">
      <div 
        v-for="(image, index) in firstColumnImages" 
        :key="index" 
        class="relative overflow-hidden rounded-lg cursor-pointer flex-1 min-h-[150px] aspect-[4/3]"
        @click="navigateToPage(image)"
      >
        <img 
          :src="image.url" 
          :alt="image.alt"
          class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div class="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center opacity-0 transition-opacity duration-300 hover:opacity-100 p-4 text-center">
          <h3 class="text-xl font-bold text-white">{{ image.title }}</h3>
          <p class="text-white">{{ image.description }}</p>
        </div>
      </div>
    </div>

    <!-- Second Column (40%) -->
    <div class="flex flex-col gap-4 h-full">
      <div 
        v-for="(image, index) in secondColumnImages" 
        :key="index" 
        class="relative overflow-hidden rounded-lg cursor-pointer flex-1 min-h-[150px] aspect-[4/5]"
        @click="navigateToPage(image)"
      >
        <img 
          :src="image.url" 
          :alt="image.alt"
          class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div class="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center opacity-0 transition-opacity duration-300 hover:opacity-100 p-4 text-center">
          <h3 class="text-xl font-bold text-white">{{ image.title }}</h3>
          <p class="text-white">{{ image.description }}</p>
        </div>
      </div>
    </div>

    <!-- Third Column (40%) -->
    <div class="flex flex-col gap-4 h-full">
      <div 
        v-for="(image, index) in thirdColumnImages" 
        :key="index" 
        class="relative overflow-hidden rounded-lg cursor-pointer flex-1 min-h-[150px] aspect-square"
        @click="navigateToPage(image)"
      >
        <img 
          :src="image.url" 
          :alt="image.alt"
          class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div class="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center opacity-0 transition-opacity duration-300 hover:opacity-100 p-4 text-center">
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
      'Acting Fiction': '/ActingFiction',
      'Art': '/Art',
      'Acting Corporate': '/Commercials',
      'Fashion': '/Fashion',
      'Modeling Corporate': '/Corporate'
    };
    
    const route = routeMap[image.title];
    if (route) {
      router.push(route);
    }
  }
};
</script>

<style scoped>
/* Mobile responsive */
@media (max-width: 1024px) {
  .grid {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .flex {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    height: auto;
  }
  
  .aspect-\[4\/3\],
  .aspect-\[4\/5\],
  .aspect-square {
    aspect-ratio: 1;
  }
}

@media (max-width: 480px) {
  .flex {
    grid-template-columns: 1fr !important;
  }
}
</style>
