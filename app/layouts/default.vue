<template>
  <div>
    <TheNavbar />
    <UContainer class="mt-4">
      <slot />
    </UContainer>
    <!-- You can add a TheFooter component here later -->
  </div>
</template>

<script setup lang="ts">
// Layout-specific logic can go here
</script>

<style scoped>
/* Scoped styles for the default layout */
</style> 