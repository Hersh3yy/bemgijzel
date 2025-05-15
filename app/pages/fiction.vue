<template>
  <div>
    <h1 class="text-3xl font-bold mb-6 text-center" :style="{ color: 'var(--site-gold)' }">Acting Fiction Gallery</h1>
    <AlbumGrid albumTitle="Fiction" />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Fiction - Acting Portfolio',
  meta: [
    { name: 'description', content: 'Browse through a collection of acting fiction work.' }
  ]
})
</script> 