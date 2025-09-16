<template>
  <div class="images-grid-container">
    <!-- Empty state -->
    <div v-if="!images || images.length === 0" class="text-center py-8">
      <p :style="{ color: 'var(--ui-text)' }">{{ emptyMessage }}</p>
      <slot name="empty-actions">
        <BaseButton 
          v-if="showBackButton"
          label="Back to Albums" 
          to="/albums" 
          icon="i-heroicons-arrow-uturn-left" 
          variant="primary"
          class="mt-4" 
        />
      </slot>
    </div>

    <!-- Images grid -->
    <div v-else :class="gridClasses">
      <BaseMediaItem
        v-for="image in images"
        :key="image.id"
        :item="image"
        :aspect-ratio="aspectRatio"
        :show-caption="showCaptions"
        :hover-effect="hoverEffect"
        :play-button-style="playButtonStyle"
        :container-class="itemClass"
        @click="handleItemClick"
        @image-error="handleImageError"
        @image-load="handleImageLoad"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AlbumImage } from '~/types/api';

interface Props {
  images: AlbumImage[];
  columns?: 'auto' | 1 | 2 | 3 | 4 | 5 | 6;
  aspectRatio?: 'square' | 'video' | 'auto' | 'portrait';
  showCaptions?: boolean;
  hoverEffect?: boolean;
  playButtonStyle?: 'interactive' | 'static' | 'subtle';
  gap?: 'sm' | 'md' | 'lg';
  emptyMessage?: string;
  showBackButton?: boolean;
  itemClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  columns: 'auto',
  aspectRatio: 'square',
  showCaptions: true,
  hoverEffect: true,
  playButtonStyle: 'interactive',
  gap: 'md',
  emptyMessage: 'No images found.',
  showBackButton: false
});

const emit = defineEmits<{
  itemClick: [item: AlbumImage];
  imageError: [event: Event, item: AlbumImage];
  imageLoad: [event: Event, item: AlbumImage];
}>();

const gridClasses = computed(() => {
  const baseClasses = 'grid';
  
  // Column classes
  let columnClasses = '';
  if (props.columns === 'auto') {
    columnClasses = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  } else {
    const colMap = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
      5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
      6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
    };
    columnClasses = colMap[props.columns as keyof typeof colMap] || colMap[3];
  }
  
  // Gap classes
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-6',
    lg: 'gap-8'
  };
  
  return `${baseClasses} ${columnClasses} ${gapClasses[props.gap]}`;
});

const handleItemClick = (item: AlbumImage) => {
  emit('itemClick', item);
};

const handleImageError = (event: Event, item: AlbumImage) => {
  emit('imageError', event, item);
};

const handleImageLoad = (event: Event, item: AlbumImage) => {
  emit('imageLoad', event, item);
};
</script>

<style scoped>
.images-grid-container {
  width: 100%;
}
</style>
