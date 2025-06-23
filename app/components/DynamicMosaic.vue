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
        :class="{ 'clickable': isClickable(item) }"
        @click="isClickable(item) ? navigateToAlbum(item) : null"
      >
        <img 
          :src="getImageUrl(item)"
          :alt="getImageAlt(item)"
          class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div class="overlay" v-if="getItemTitle(item) || getItemDescription(item)">
          <h3 v-if="getItemTitle(item)" class="text-xl font-bold text-white">{{ getItemTitle(item) }}</h3>
          <p v-if="getItemDescription(item)" class="text-white">{{ getItemDescription(item) }}</p>
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
    selected_image: {
      id: string;
      path: string;
      title: string | null;
      caption: string | null;
    };
    title?: string;
    link?: string;
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

const getItemsForColumn = (columnIndex: number) => {
  return props.mosaicData.items
    .filter(item => item.column_index === columnIndex && item.is_active)
    .sort((a, b) => a.order - b.order);
};

const getImageUrl = (item: MosaicItem) => {
  // Prefer selected_image path, fallback to album cover
  return item.properties.selected_image?.path || 
         item.properties.album?.cover_image_path || 
         'https://picsum.photos/800/800?random=' + item.id.slice(-1);
};

const getImageAlt = (item: MosaicItem) => {
  return item.properties.selected_image?.caption || 
         item.properties.album?.title || 
         'Mosaic item';
};

const getItemTitle = (item: MosaicItem) => {
  // Use the new title property first, then fallback to album title, or return empty string
  return item.properties.title || item.properties.album?.title || '';
};

const getItemDescription = (item: MosaicItem) => {
  return item.properties.selected_image?.title || 
         item.properties.selected_image?.caption || 
         '';
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
  min-height: 100vh;
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
}

.mosaic-item {
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
  cursor: pointer;
  aspect-ratio: 1;
}

.mosaic-item.clickable {
  cursor: pointer;
}

.mosaic-item:not(.clickable) {
  cursor: default;
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

/* Mobile responsive - single column */
@media (max-width: 1024px) {
  .dynamic-mosaic {
    grid-template-columns: 1fr !important;
  }

  .mosaic-column {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 480px) {
  .mosaic-column {
    grid-template-columns: 1fr !important;
  }
}
</style> 