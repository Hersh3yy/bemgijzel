<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="bg-gray-200 aspect-[3/2] rounded-lg"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-500">{{ error }}</p>
      <button @click="fetchMosaicData" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Retry
      </button>
    </div>

    <!-- Mosaic Content -->
    <div v-else-if="mosaicData" class="relative">
      <div v-for="item in sortedItems" 
           :key="item.id" 
           class="absolute group"
           :style="getItemStyle(item)">
        <template v-if="item.type === 'image'">
          <NuxtLink :to="getItemLink(item)" class="block w-full h-full overflow-hidden">
            <img 
              :src="getItemImage(item)"
              :alt="getImageAlt(item)"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div v-if="getImageTitle(item)" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span class="text-white font-bold text-xl">{{ getImageTitle(item) }}</span>
            </div>
          </NuxtLink>
        </template>
        <!-- Container items can be used for grouping or spacing -->
        <div v-else-if="item.type === 'container'" 
             :class="{'split-horizontal': item.split_direction === 'horizontal', 'split-vertical': item.split_direction === 'vertical'}"
             class="w-full h-full">
          <!-- Render child items if needed -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface DesktopPosition {
  x: number
  y: number
  width: number
  height: number
}

interface ImageProperties {
  src?: string
  alt?: string
  position?: {
    x: number
    y: number
    scale: number
  }
}

interface MosaicItem {
  id: string
  type: 'container' | 'image'
  split_direction?: 'horizontal' | 'vertical' | 'none' | null
  desktop_position: string // JSON string of DesktopPosition
  order: number
  parent_id?: string | null
  properties?: string // JSON string of ImageProperties
}

interface MosaicData {
  mosaic: {
    id: string
    title: string
    description?: string
  }
  items: MosaicItem[]
}

const loading = ref(true)
const error = ref<string | null>(null)
const mosaicData = ref<MosaicData | null>(null)

// Sort items by order
const sortedItems = computed(() => {
  if (!mosaicData.value?.items) return []
  return [...mosaicData.value.items].sort((a, b) => a.order - b.order)
})

// Parse desktop position from JSON string
function parsePosition(positionStr: string): DesktopPosition | null {
  try {
    return JSON.parse(positionStr)
  } catch {
    console.error('Failed to parse position:', positionStr)
    return null
  }
}

// Parse image properties from JSON string
function parseProperties(propertiesStr?: string): ImageProperties | null {
  if (!propertiesStr) return null
  try {
    return JSON.parse(propertiesStr)
  } catch {
    console.error('Failed to parse properties:', propertiesStr)
    return null
  }
}

// Convert position data to CSS style
function getItemStyle(item: MosaicItem) {
  const position = parsePosition(item.desktop_position)
  if (!position) return {}
  
  return {
    left: `${position.x * 100}%`,
    top: `${position.y * 100}%`,
    width: `${position.width * 100}%`,
    height: `${position.height * 100}%`,
  }
}

// Get image URL
function getItemImage(item: MosaicItem) {
  const props = parseProperties(item.properties)
  if (props?.src) {
    return props.src
  }
  // Fallback to picsum
  return `https://picsum.photos/800/600?random=${item.id}`
}

// Get image alt text
function getImageAlt(item: MosaicItem) {
  const props = parseProperties(item.properties)
  return props?.alt || ''
}

// Get image title
function getImageTitle(item: MosaicItem) {
  const props = parseProperties(item.properties)
  return props?.alt || '' // Using alt as title since there's no specific title field
}

// Get link from item data
function getItemLink(item: MosaicItem) {
  // You might want to customize this based on your routing needs
  return `/images/${item.id}`
}

// Function to fetch mosaic data
async function fetchMosaicData() {
  try {
    loading.value = true
    error.value = null
    
    // TODO: Replace with your actual API endpoint
    const response = await fetch('/api/mosaics/home')
    mosaicData.value = await response.json()
  } catch (e) {
    error.value = 'Failed to load mosaic data'
    console.error('Error fetching mosaic data:', e)
  } finally {
    loading.value = false
  }
}

// Fetch data on component mount
onMounted(() => {
  fetchMosaicData()
})
</script>

<style scoped>
.relative {
  aspect-ratio: 16/9;
}

.split-horizontal {
  display: flex;
  flex-direction: row;
}

.split-vertical {
  display: flex;
  flex-direction: column;
}
</style> 