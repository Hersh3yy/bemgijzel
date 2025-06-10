<template>
  <div>
    <h1 class="text-3xl font-bold mb-6 text-center" :style="{ color: 'var(--site-gold)' }">Fiction Acting Gallery</h1>
    <AlbumGrid albumTitle="FictionActings" />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Fiction Acting - Acting Portfolio',
  meta: [
    { name: 'description', content: 'Browse through a collection of fiction acting work.' }
  ]
})
</script> 