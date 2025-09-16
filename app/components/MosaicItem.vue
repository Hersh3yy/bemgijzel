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
.image-container-mosaic {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border-radius: 0.5rem;
  min-height: 150px;
}

.mosaic-item.clickable {
  cursor: pointer;
}

.mosaic-item:not(.clickable) {
  cursor: default;
}

/* Image responsive styles */
.image-responsive {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.image-hover-darken:hover {
  opacity: 0.9;
}

/* Video overlay styles */
.video-overlay-hover-only {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.video-overlay-hover-only:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

/* Play icon styles */
.play-icon-subtle {
  color: white;
  font-size: 3.75rem;
  opacity: 0.8;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
}

/* Text badge styles */
.text-badge-banner {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  font-weight: bold;
  font-size: 1.25rem;
  padding: 1rem 1.5rem;
  text-align: center;
  opacity: 0.8;
  transition: opacity 0.3s ease;
  z-index: 10;
  transform: translateY(-50%);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

.text-badge-banner:hover {
  opacity: 1;
}

/* Ensure text badge appears above video overlay for video items */
.video-item .text-badge-banner {
  z-index: 2;
}
</style> 