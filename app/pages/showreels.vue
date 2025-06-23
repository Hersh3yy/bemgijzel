<template>
  <div class="page-container">
    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold text-center" :style="{ color: 'var(--site-gold)' }">Showreels</h1>
      </template>

      <div class="p-4">
        <p class="text-center mb-8" :style="{ color: 'var(--ui-text)' }">
          View our collection of showreels and video highlights.
        </p>

        <!-- Vertical scroll layout for showreels -->
        <div class="showreels-feed space-y-6 max-w-3xl mx-auto">
          <!-- Placeholder showreel items -->
          <div class="showreel-item rounded-lg overflow-hidden shadow-lg">
            <div class="relative aspect-video">
              <img 
                src="https://picsum.photos/800/450?random=showreel1" 
                alt="Showreel thumbnail"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                <UIcon name="i-heroicons-play" class="text-6xl text-white" />
              </div>
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold mb-2" :style="{ color: 'var(--site-gold)' }">Acting Showreel 2024</h3>
              <p class="text-sm" :style="{ color: 'var(--ui-text)' }">A collection of recent acting work and performances.</p>
            </div>
          </div>
          
          <div class="showreel-item rounded-lg overflow-hidden shadow-lg">
            <div class="relative aspect-video">
              <img 
                src="https://picsum.photos/800/450?random=showreel2" 
                alt="Showreel thumbnail"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                <UIcon name="i-heroicons-play" class="text-6xl text-white" />
              </div>
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold mb-2" :style="{ color: 'var(--site-gold)' }">Modeling Showreel</h3>
              <p class="text-sm" :style="{ color: 'var(--ui-text)' }">Highlights from fashion and commercial modeling work.</p>
            </div>
          </div>

          <div class="showreel-item rounded-lg overflow-hidden shadow-lg">
            <div class="relative aspect-video">
              <img 
                src="https://picsum.photos/800/450?random=showreel3" 
                alt="Showreel thumbnail"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                <UIcon name="i-heroicons-play" class="text-6xl text-white" />
              </div>
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold mb-2" :style="{ color: 'var(--site-gold)' }">Behind the Scenes</h3>
              <p class="text-sm" :style="{ color: 'var(--ui-text)' }">Behind the scenes footage from various projects.</p>
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
  title: 'Showreels - Video Portfolio',
  meta: [
    { name: 'description', content: 'Watch our showreels and video highlights.' }
  ]
})
</script>

<style scoped>
.page-container {
  padding: 2rem;
}

.showreels-feed {
  max-height: 70vh;
  overflow-y: auto;
}

.showreel-item {
  background: var(--ui-bg);
  border: 1px solid var(--ui-border);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.showreel-item:hover {
  transform: translateY(-2px);
}

.showreel-item:hover .relative::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
}
</style> 