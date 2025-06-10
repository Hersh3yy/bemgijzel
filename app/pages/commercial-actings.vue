<template>
  <div>
    <h1 class="text-3xl font-bold mb-6 text-center" :style="{ color: 'var(--site-gold)' }">Commercial Acting Gallery</h1>
    <AlbumGrid albumTitle="CommercialActings" />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Commercial Acting - Acting Portfolio',
  meta: [
    { name: 'description', content: 'Browse through a collection of commercial acting work.' }
  ]
})
</script> 