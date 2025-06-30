<template>
  <div class="dynamic-mosaic" :class="mosaicClasses">
    <div 
      v-for="columnIndex in numberOfColumns" 
      :key="columnIndex - 1"
      class="mosaic-column"
      :class="getColumnClass(columnIndex - 1)"
    >
      <div 
        v-for="item in getItemsForColumn(columnIndex - 1)" 
        :key="item.id"
        class="mosaic-item"
        :class="{ 'clickable': isClickable(item), 'video-item': isVideoItem(item) }"
        :style="{ height: getTileHeight(columnIndex - 1) }"
        @click="isClickable(item) ? navigateToAlbum(item) : null"
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
interface MosaicItem {
  id: string;
  column_index: number;
  type: string;
  content: string | null;
  album_id: string | null;
  properties: {
    album: {
      id: string;
      title: string;
      cover_image_path: string;
    };
    selected_image?: {
      id: string;
      path: string;
      title: string | null;
      caption: string | null;
      properties?: string; // JSON string containing additional properties
    };
    link?: string;
    edit_text?: string; // This is what contains the display title
  };
  order: number;
  is_active: boolean;
}

interface MosaicData {
  mosaic: {
    id: string;
    title: string;
    description: string;
    columns: number;
    display_settings: any;
  };
  items: MosaicItem[];
}

const props = defineProps<{
  mosaicData: MosaicData;
}>();

const router = useRouter();

const numberOfColumns = computed(() => props.mosaicData.mosaic.columns || 3);

const getItemsForColumn = (columnIndex: number) => {
  return props.mosaicData.items
    .filter(item => item.column_index === columnIndex && item.is_active)
    .sort((a, b) => a.order - b.order);
};

// Calculate items count per column
const itemsPerColumn = computed(() => {
  const counts: number[] = [];
  for (let i = 0; i < numberOfColumns.value; i++) {
    const items = getItemsForColumn(i);
    counts.push(items.length);
  }
  return counts;
});

// Find the maximum number of items in any column
const maxItemsInColumn = computed(() => {
  return Math.max(...itemsPerColumn.value);
});

// Calculate tile height for equal column heights
const getTileHeight = (columnIndex: number) => {
  const itemsInThisColumn = itemsPerColumn.value[columnIndex] || 0;
  if (itemsInThisColumn === 0) return '25vh';
  
  // Calculate height per tile to make all columns equal height
  // Base calculation: if max column has 4 items, and this column has 2 items,
  // then each tile should be twice as tall to fill the same space
  const maxItems = maxItemsInColumn.value;
  const tileHeightMultiplier = maxItems / itemsInThisColumn;
  
  // Base tile height (increased for better desktop viewing)
  const baseTileHeight = 20; // Increased from 15vh
  const calculatedHeight = baseTileHeight * tileHeightMultiplier;
  
  // Set minimum height to prevent overly short images
  const minHeight = 25; // Minimum 25vh per tile
  
  return `${Math.max(calculatedHeight, minHeight)}vh`;
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

const getImageUrl = (item: MosaicItem) => {
  // First check if we have a selected_image
  if (item.properties.selected_image) {
    const selectedImage = item.properties.selected_image;
    
    // Parse properties JSON if it exists
    let imageProperties = null;
    if (selectedImage.properties) {
      try {
        imageProperties = JSON.parse(selectedImage.properties);
      } catch (e) {
        console.warn('Failed to parse image properties:', e);
      }
    }
    
    // For video items, use the thumbnail_url from properties
    if (imageProperties?.type === 'video' && imageProperties?.thumbnail_url) {
      return imageProperties.thumbnail_url;
    }
    
    // For video URLs (YouTube, etc.), use thumbnail_url if available
    const path = selectedImage.path.toLowerCase();
    if ((path.includes('youtube.com') || path.includes('youtu.be') || path.includes('vimeo.com')) && imageProperties?.thumbnail_url) {
      return imageProperties.thumbnail_url;
    }
    
    // For regular images, use the path
    return selectedImage.path;
  }
  
  // Fallback to album cover
  return item.properties.album?.cover_image_path || 
         'https://picsum.photos/800/800?random=' + item.id.slice(-1);
};

const getImageAlt = (item: MosaicItem) => {
  return item.properties.selected_image?.caption || 
         item.properties.selected_image?.title ||
         item.properties.edit_text ||
         item.properties.album?.title || 
         'Mosaic item';
};

const getItemTitle = (item: MosaicItem) => {
  // Use edit_text first (this is the main display text from the API)
  return item.properties.edit_text || 
         item.properties.album?.title || 
         '';
};

const getItemDescription = (item: MosaicItem) => {
  return item.properties.selected_image?.caption || 
         item.properties.selected_image?.title || 
         '';
};

const isVideoItem = (item: MosaicItem) => {
  if (!item.properties.selected_image) return false;
  
  const selectedImage = item.properties.selected_image;
  
  // Check properties JSON for video type
  if (selectedImage.properties) {
    try {
      const imageProperties = JSON.parse(selectedImage.properties);
      if (imageProperties.type === 'video') return true;
    } catch (e) {
      // Ignore parsing errors
    }
  }
  
  // Check URL patterns
  const path = selectedImage.path.toLowerCase();
  return path.includes('youtube.com') || 
         path.includes('youtu.be') || 
         path.includes('vimeo.com');
};

const isClickable = (item: MosaicItem) => {
  return !!item.properties.link || (item.type === 'album' && item.properties.album);
};

const navigateToAlbum = (item: MosaicItem) => {
  // Handle custom link property first
  if (item.properties.link) {
    const link = item.properties.link;
    
    // If it's just one word, treat as album title
    if (!/\s/.test(link) && !link.includes('/') && !link.includes('.')) {
      router.push(`/albums/${link}`);
      return;
    }
    
    // If starts with '/', treat as relative URL
    if (link.startsWith('/')) {
      router.push(link);
      return;
    }
    
    // Otherwise treat as external URL
    window.open(link, '_blank');
    return;
  }
  
  // Fallback to original album navigation
  if (item.type === 'album' && item.properties.album) {
    router.push(`/albums/${item.properties.album.title}`);
  }
};
</script>

<style scoped>
.dynamic-mosaic {
  display: grid;
  gap: 1rem;
  padding: 1rem;
  min-height: 85vh; /* Increased minimum height for desktop viewing */
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
  min-height: 80vh; /* Ensure columns have adequate height */
}

.mosaic-item {
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
  cursor: pointer;
  min-height: 200px; /* Minimum height to prevent tiny images */
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
    min-height: auto; /* Remove min-height on mobile */
  }

  .mosaic-column {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    min-height: auto; /* Remove min-height on mobile */
  }

  .mosaic-item {
    min-height: 150px; /* Smaller min-height on mobile */
  }
}

@media (max-width: 480px) {
  .mosaic-column {
    grid-template-columns: 1fr !important;
  }
  
  .mosaic-item {
    min-height: 120px; /* Even smaller on very small screens */
  }
}
</style> 