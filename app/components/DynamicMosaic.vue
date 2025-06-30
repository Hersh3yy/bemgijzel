<template>
  <div class="dynamic-mosaic" :class="mosaicClasses">
    <div 
      v-for="columnIndex in numberOfColumns" 
      :key="columnIndex - 1"
      class="mosaic-column"
      :class="getColumnClass(columnIndex - 1)"
    >
      <MosaicItem 
        v-for="item in getItemsForColumnIndex(columnIndex - 1)" 
        :key="item.id"
        :item="item"
        :height="getTileHeight(columnIndex - 1)"
      />
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
}

@media (max-width: 480px) {
  .mosaic-column {
    grid-template-columns: 1fr !important;
  }
}
</style> 