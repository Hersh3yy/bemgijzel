<template>
  <div>
    <h1 class="text-3xl font-bold mb-6 text-center" :style="{ color: 'var(--site-gold)' }">Arts Gallery</h1>
    <AlbumGrid albumTitle="Art" />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Art - Art Portfolio',
  meta: [
    { name: 'description', content: 'Browse through a collection of art work.' }
  ]
})
</script> 