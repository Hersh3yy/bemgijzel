<template>
  <div class="site-container">
    <Mosaic :images="mosaicImages" />
  </div>
</template>

<script setup lang="ts">
import type { MosaicImage } from '~/components/Mosaic.vue';

const mosaicImages: MosaicImage[] = [
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
