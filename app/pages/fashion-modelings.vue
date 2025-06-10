<template>
  <div>
    <h1 class="text-3xl font-bold mb-6 text-center" :style="{ color: 'var(--site-gold)' }">Fashion Modeling Gallery</h1>
    <AlbumGrid albumTitle="FashionModelings" />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Fashion Modeling - Modeling Portfolio',
  meta: [
    { name: 'description', content: 'Browse through a collection of fashion modeling work.' }
  ]
})
</script> 