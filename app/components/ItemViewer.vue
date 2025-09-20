<template>
  <!-- Video Viewer for videos -->
  <ModalVideo 
    v-if="isVideo"
    :videos="videoItems" 
    :initialVideo="selectedItem"
    @close="close"
  />
  
  <!-- Image Viewer for images -->
  <ModalImage 
    v-else
    :images="imageItems" 
    :initialImage="selectedItem"
    @close="close"
  />
</template>

<script setup lang="ts">
import type { AlbumImage } from '~/types/api';
import { useAlbum } from '~/composables/useAlbum';

const props = defineProps<{
  items: AlbumImage[];
  initialItem: AlbumImage;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const { isVideoItem } = useAlbum();

// Determine if the selected item is a video
const isVideo = computed(() => isVideoItem(props.initialItem));

// Separate items into videos and images
const videoItems = computed(() => props.items.filter(item => isVideoItem(item)));
const imageItems = computed(() => props.items.filter(item => !isVideoItem(item)));

// Current selected item (ensures type safety)
const selectedItem = computed(() => props.initialItem);

// Close method
const close = () => {
  emit('close');
};
</script> 