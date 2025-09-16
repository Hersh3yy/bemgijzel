<template>
  <div 
    :class="[
      'media-item-container cursor-pointer relative',
      containerClass
    ]"
    @click="handleClick"
  >
    <!-- Video thumbnail with play button -->
    <template v-if="isVideo">
      <div class="relative w-full" :class="aspectRatioClass">
        <img 
          :src="thumbnailUrl" 
          :alt="altText" 
          class="image-responsive"
          @error="handleImageError"
          @load="handleImageLoad"
        />
        <div :class="playButtonClass">
          <UIcon :name="playIcon" :class="playIconClass" />
        </div>
      </div>
    </template>
    
    <!-- Regular image -->
    <template v-else>
      <img 
        :src="imageUrl" 
        :alt="altText" 
        :class="['image-responsive', hoverEffect && 'image-hover-darken']"
        @error="handleImageError"
        @load="handleImageLoad"
      />
    </template>

    <!-- Caption overlay -->
    <div v-if="showCaption && caption" class="middle-overlay">
      <div class="middle-overlay-text">{{ caption }}</div>
    </div>

    <!-- Optional slot for additional content -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { AlbumImage } from '~/types/api';
import { useAlbum } from '~/composables/useAlbum';
import { useMedia } from '~/composables/useMedia';
import { logger } from '~/utils/logger';

interface Props {
  item: AlbumImage;
  aspectRatio?: 'square' | 'video' | 'auto' | 'portrait';
  showCaption?: boolean;
  hoverEffect?: boolean;
  playButtonStyle?: 'interactive' | 'static' | 'subtle';
  playIcon?: string;
  containerClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  aspectRatio: 'auto',
  showCaption: true,
  hoverEffect: true,
  playButtonStyle: 'interactive',
  playIcon: 'i-heroicons-play'
});

const emit = defineEmits<{
  click: [item: AlbumImage];
  imageError: [event: Event, item: AlbumImage];
  imageLoad: [event: Event, item: AlbumImage];
}>();

const { isVideoItem, getVideoThumbnail } = useAlbum();
const { handleImageError: handleMediaImageError, handleImageLoad: handleMediaImageLoad } = useMedia();

const isVideo = computed(() => isVideoItem(props.item));
const caption = computed(() => props.item.caption || props.item.title);
const altText = computed(() => caption.value || (isVideo.value ? 'Video thumbnail' : 'Image'));

const thumbnailUrl = computed(() => {
  if (isVideo.value) {
    return getVideoThumbnail(props.item);
  }
  return props.item.thumbnail_url || props.item.path;
});

const imageUrl = computed(() => {
  return props.item.thumbnail_url || props.item.webp_url || props.item.path || '';
});

const aspectRatioClass = computed(() => {
  const aspectRatios = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[4/5]',
    auto: ''
  };
  return aspectRatios[props.aspectRatio];
});

const playButtonClass = computed(() => {
  const baseClasses = 'absolute inset-0 flex items-center justify-center';
  const styleClasses = {
    interactive: 'video-overlay-interactive',
    static: 'video-overlay-static',
    subtle: 'video-overlay-subtle'
  };
  return `${baseClasses} ${styleClasses[props.playButtonStyle]}`;
});

const playIconClass = computed(() => {
  const sizeClasses = {
    interactive: 'play-icon-medium',
    static: 'play-icon-small',
    subtle: 'play-icon-subtle'
  };
  return sizeClasses[props.playButtonStyle];
});

const handleClick = () => {
  emit('click', props.item);
};

const handleImageError = (event: Event) => {
  logger.error('MediaItem image error:', {
    title: props.item.title,
    path: props.item.path,
    isVideo: isVideo.value
  });
  
  // Use the centralized media error handler
  handleMediaImageError(event, props.item);
  
  // Emit for parent component handling
  emit('imageError', event, props.item);
};

const handleImageLoad = (event: Event) => {
  logger.debug('MediaItem image loaded:', {
    title: props.item.title,
    isVideo: isVideo.value
  });
  
  // Use the centralized media load handler
  handleMediaImageLoad(event, props.item);
  
  // Emit for parent component handling
  emit('imageLoad', event, props.item);
};
</script>

<style scoped>
.media-item-container {
  transition: transform 0.3s ease-in-out;
}

.media-item-container:hover {
  transform: translateY(-2px);
}

.middle-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.media-item-container:hover .middle-overlay {
  opacity: 1;
}

.middle-overlay-text {
  color: white;
  text-align: center;
  padding: 1rem;
  font-weight: 600;
}

/* Video overlay styles - moved from main.css */
.video-overlay-interactive {
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

.video-overlay-interactive:hover {
  background-color: #6b7280;
}

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

.video-overlay-static {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
}

/* Play icon styles - moved from main.css */
.play-icon-base {
  color: white;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
}

.play-icon-small {
  color: white;
  font-size: 2.25rem;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
}

.play-icon-medium {
  color: white;
  font-size: 3.75rem;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
}

.play-icon-large {
  color: white;
  font-size: 5rem;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
}

.play-icon-subtle {
  color: white;
  font-size: 3.75rem;
  opacity: 0.8;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
}

/* Image responsive styles - moved from main.css */
.image-responsive {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.image-hover-darken:hover {
  opacity: 0.9;
}
</style>
