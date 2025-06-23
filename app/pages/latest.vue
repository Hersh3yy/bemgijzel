<template>
  <div class="page-container">
    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold text-center" :style="{ color: 'var(--site-gold)' }">Latest Updates</h1>
      </template>

      <div class="p-4">
        <p class="text-center mb-8" :style="{ color: 'var(--ui-text)' }">
          Latest posted content and updates.
        </p>

        <!-- Vertical scroll layout for latest content -->
        <div class="latest-feed space-y-6 max-w-2xl mx-auto">
          <!-- Placeholder content -->
          <div class="feed-item rounded-lg overflow-hidden shadow-lg">
            <img 
              src="https://picsum.photos/800/600?random=latest1" 
              alt="Latest content"
              class="w-full aspect-video object-cover"
            />
            <div class="p-4">
              <h3 class="text-lg font-semibold mb-2" :style="{ color: 'var(--site-gold)' }">Latest Update</h3>
              <p class="text-sm" :style="{ color: 'var(--ui-text)' }">This is a placeholder for the latest content feed.</p>
            </div>
          </div>
          
          <div class="feed-item rounded-lg overflow-hidden shadow-lg">
            <img 
              src="https://picsum.photos/800/600?random=latest2" 
              alt="Latest content"
              class="w-full aspect-video object-cover"
            />
            <div class="p-4">
              <h3 class="text-lg font-semibold mb-2" :style="{ color: 'var(--site-gold)' }">Recent Update</h3>
              <p class="text-sm" :style="{ color: 'var(--ui-text)' }">This is another placeholder for the latest content feed.</p>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-center">
          <UButton label="Back to Home" to="/" icon="i-heroicons-arrow-uturn-left" color="primary" />
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Latest Updates - What\'s New',
  meta: [
    { name: 'description', content: 'Browse through the latest updates and content.' }
  ]
})
</script>

<style scoped>
.page-container {
  padding: 2rem;
}

.latest-feed {
  max-height: 70vh;
  overflow-y: auto;
}

.feed-item {
  background: var(--ui-bg);
  border: 1px solid var(--ui-border);
  transition: transform 0.3s ease;
}

.feed-item:hover {
  transform: translateY(-2px);
}
</style> 