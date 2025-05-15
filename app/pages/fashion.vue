<template>
  <div>
    <h1 class="text-3xl font-bold mb-6 text-center" :style="{ color: 'var(--site-gold)' }">Modeling Fashion Gallery</h1>
    <AlbumGrid albumTitle="Fashion" />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Fashion - Modeling Portfolio',
  meta: [
    { name: 'description', content: 'Browse through a collection of fashion modeling work.' }
  ]
})
</script> 