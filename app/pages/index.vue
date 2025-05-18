<template>
  <div class="container mx-auto px-4 py-8">
    <Mosaic />
  </div>
</template>

<script setup lang="ts">
// The Mosaic component will be auto-imported by Nuxt
useHead({
  title: 'Home - Mosaic Showcase',
  meta: [
    { name: 'description', content: 'Homepage featuring a dynamic visual mosaic.' }
  ]
})
</script>

<style scoped>
.page-container {
  padding: 2rem;
}
</style>
