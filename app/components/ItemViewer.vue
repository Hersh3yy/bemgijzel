<template>
  <!-- Video Viewer for videos -->
  <VideoViewer 
    v-if="isVideo"
    :videos="videoItems" 
    :initialVideo="selectedItem"
    @close="close"
  />
  
  <!-- Image Viewer for images -->
  <ImageViewer 
    v-else
    :images="imageItems" 
    :initialImage="selectedItem"
    @close="close"
  />
</template>

<script setup lang="ts">
import type { AlbumImage } from '~/types/api';
import { useAlbum } from '~/composables/useAlbum';
import ImageViewer from './ImageViewer.vue';
import VideoViewer from './VideoViewer.vue';

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