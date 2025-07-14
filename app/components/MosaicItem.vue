<template>
  <div 
    class="image-container-mosaic"
    :class="{ 'clickable': isClickable(item), 'video-item': isVideoItem(item) }"
    :style="{ height: height }"
    @click="isClickable(item) ? navigateToItem(item) : null"
  >
    <img 
      :src="getImageUrl(item)"
      :alt="getImageAlt(item)"
      class="image-responsive image-hover-darken"
    />
    
    <!-- Video play icon overlay - NO background for thumbnails to show -->
    <div v-if="isVideoItem(item)" class="video-overlay-hover-only">
      <UIcon name="i-heroicons-play" class="play-icon-subtle" />
    </div>
    
    <!-- Text overlay - Full width banner style -->
    <div v-if="getItemTitle(item)" class="text-badge-banner">
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
.mosaic-item.clickable {
  cursor: pointer;
}

.mosaic-item:not(.clickable) {
  cursor: default;
}

/* Ensure text badge appears above video overlay for video items */
.video-item .text-badge-banner {
  z-index: 2;
}
</style> 