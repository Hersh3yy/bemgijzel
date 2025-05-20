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
    alt: 'Acting Fiction',
    title: 'Acting Fiction',
    description: 'Fiction acting portfolio'
  },
  {
    url: 'https://picsum.photos/800/800?random=6',
    alt: 'Art',
    title: 'Art',
    description: 'Artistic work'
  },
  {
    url: 'https://picsum.photos/800/800?random=7',
    alt: 'Acting Corporate',
    title: 'Acting Corporate',
    description: 'Corporate acting work'
  },
  {
    url: 'https://picsum.photos/800/800?random=8',
    alt: 'Fashion',
    title: 'Fashion',
    description: 'Fashion portfolio'
  },
  {
    url: 'https://picsum.photos/800/800?random=9',
    alt: 'Modeling Corporate',
    title: 'Modeling Corporate',
    description: 'Corporate modeling work'
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
