<template>
  <div 
    class="relative overflow-hidden cursor-pointer rounded-lg min-h-[150px]"
    :class="{ 'cursor-default': !isClickable(item) }"
    :style="{ height: height }"
    @click="isClickable(item) ? navigateToItem(item) : null"
  >
    <img 
      :src="getImageUrl(item)"
      :alt="getImageAlt(item)"
      class="w-full h-full object-cover transition-all duration-300 hover:opacity-90"
    />
    <div v-if="getItemTitle(item)" class="absolute top-1/2 left-0 right-0 bg-black bg-opacity-60 text-white font-bold text-xl px-6 py-4 text-center opacity-80 transition-opacity duration-300 hover:opacity-100 z-10 transform -translate-y-1/2 text-shadow-lg">
      {{ getItemTitle(item) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MosaicItem } from '~/types/api';
import { useMosaic } from '~/composables/useMosaic';

const props = defineProps<{
  item: MosaicItem;
  height: string;
}>();

const {
  getImageUrl,
  getImageAlt,
  getItemTitle,
  isVideoItem,
  isClickable,
  navigateToItem,
} = useMosaic();
</script>

<style scoped>
.text-shadow-lg {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

/* Ensure text badge appears above video overlay for video items */
.video-item .absolute.top-1\/2 {
  z-index: 2;
}
</style>
