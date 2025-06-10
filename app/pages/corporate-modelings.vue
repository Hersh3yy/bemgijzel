<template>
  <div>
    <h1 class="text-3xl font-bold mb-6 text-center" :style="{ color: 'var(--site-gold)' }">Corporate Modeling Gallery</h1>
    <AlbumGrid albumTitle="CorporateModelings" />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Corporate Modeling - Modeling Portfolio',
  meta: [
    { name: 'description', content: 'Browse through a collection of corporate modeling work.' }
  ]
})
</script> 