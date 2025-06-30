<template>
  <div class="dynamic-mosaic" :class="mosaicClasses">
    <div 
      v-for="columnIndex in numberOfColumns" 
      :key="columnIndex - 1"
      class="mosaic-column"
      :class="getColumnClass(columnIndex - 1)"
    >
      <div 
        v-for="item in getItemsForColumnIndex(columnIndex - 1)" 
        :key="item.id"
        class="mosaic-item"
        :class="{ 'clickable': isClickable(item), 'video-item': isVideoItem(item) }"
        :style="{ height: getTileHeight(columnIndex - 1) }"
        @click="isClickable(item) ? navigateToItem(item) : null"
      >
        <img 
          :src="getImageUrl(item)"
          :alt="getImageAlt(item)"
          class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        
        <!-- Video play icon overlay -->
        <div v-if="isVideoItem(item)" class="video-overlay">
          <UIcon name="i-heroicons-play" class="text-6xl text-white opacity-80" />
        </div>
        
        <!-- Text overlay -->
        <div class="overlay" v-if="getItemTitle(item) || getItemDescription(item)">
          <h3 v-if="getItemTitle(item)" class="text-xl font-bold text-white">{{ getItemTitle(item) }}</h3>
          <!-- <p v-if="getItemDescription(item)" class="text-white">{{ getItemDescription(item) }}</p> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MosaicItem, MosaicData } from '~/composables/useMosaic';
import { useMosaic } from '~/composables/useMosaic';

const props = defineProps<{
  mosaicData: MosaicData;
}>();

const {
  getImageUrl,
  getImageAlt,
  getItemTitle,
  isVideoItem,
  isClickable,
  navigateToItem,
  getItemsForColumn,
  calculateColumnHeights,
  calculateTileHeight
} = useMosaic();

const numberOfColumns = computed(() => props.mosaicData.mosaic.columns || 3);

const getItemsForColumnIndex = (columnIndex: number) => {
  return getItemsForColumn(props.mosaicData.items, columnIndex);
};

// Calculate items count per column
const itemsPerColumn = computed(() => {
  return calculateColumnHeights(props.mosaicData.items, numberOfColumns.value);
});

// Calculate tile height for equal column heights
const getTileHeight = (columnIndex: number) => {
  const itemsInThisColumn = itemsPerColumn.value[columnIndex] || 0;
  return calculateTileHeight(itemsInThisColumn);
};

const mosaicClasses = computed(() => ({
  'mosaic-2-cols': numberOfColumns.value === 2,
  'mosaic-3-cols': numberOfColumns.value === 3,
  'mosaic-4-cols': numberOfColumns.value === 4,
}));

const getColumnClass = (columnIndex: number) => {
  const totalColumns = numberOfColumns.value;
  
  if (totalColumns === 3) {
    // First column gets 4 items, others get 3 (as requested)
    if (columnIndex === 0) return 'column-first';
    return 'column-regular';
  }
  
  return 'column-regular';
};

// All functionality now handled by useMosaic composable
</script>

<style scoped>
.dynamic-mosaic {
  display: grid;
  gap: 1rem;
  padding: 1rem;
  height: 90vh; /* Fixed height for consistent layout */
  align-items: stretch;
}

.mosaic-2-cols {
  grid-template-columns: 1fr 1fr;
}

.mosaic-3-cols {
  grid-template-columns: 20% 40% 40%;
}

.mosaic-4-cols {
  grid-template-columns: repeat(4, 1fr);
}

.mosaic-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 85vh; /* Fixed height for all columns */
  overflow: hidden;
}

.mosaic-item {
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
  cursor: pointer;
  flex: 1; /* Allow items to grow and fill available space */
  min-height: 150px; /* Minimum height to prevent tiny images */
}

.mosaic-item.clickable {
  cursor: pointer;
}

.mosaic-item:not(.clickable) {
  cursor: default;
}

.video-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  transition: background 0.3s ease;
}

.mosaic-item:hover .video-overlay {
  background: rgba(0, 0, 0, 0.5);
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  padding: 1rem;
  text-align: center;
}

.mosaic-item:hover .overlay {
  opacity: 1;
}

.video-item .overlay {
  background: rgba(0, 0, 0, 0.7);
}

/* Mobile responsive - single column */
@media (max-width: 1024px) {
  .dynamic-mosaic {
    grid-template-columns: 1fr !important;
    height: auto; /* Allow natural height on mobile */
  }

  .mosaic-column {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    height: auto; /* Allow natural height on mobile */
    gap: 1rem;
  }

  .mosaic-item {
    min-height: 200px; /* Fixed height on mobile for grid layout */
    flex: none; /* Remove flex behavior on mobile */
  }
}

@media (max-width: 480px) {
  .mosaic-column {
    grid-template-columns: 1fr !important;
  }
  
  .mosaic-item {
    min-height: 180px; /* Slightly smaller on very small screens */
  }
}
</style> 