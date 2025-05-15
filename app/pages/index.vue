<template>
  <div class="page-container">
    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold text-center" :style="{ color: 'var(--site-gold)' }">Welcome - Visual Mosaic (Coming Soon)</h1>
      </template>

      <div class="p-4">
        <p class="text-center" :style="{ color: 'var(--ui-text)' }">
          This page will feature a dynamic, visually editable mosaic of content managed by the new CMS.
        </p>
        <p class="text-center mt-4" :style="{ color: 'var(--ui-text)' }">
          The layout will be fetched or generated to create an engaging entry point to the site.
        </p>
        <div class="mt-8 text-center">
          <UButton label="Explore (Placeholder)" icon="i-heroicons-arrow-right-circle" size="xl" to="/albums" color="primary" variant="outline" />
        </div>
      </div>

      <template #footer>
        <p class="text-xs text-center opacity-70" :style="{ color: 'var(--ui-text)' }">Stay tuned for updates!</p>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
// Page-specific logic for the index page (e.g., fetching mosaic data in the future)
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
