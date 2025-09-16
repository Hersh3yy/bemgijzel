<template>
  <div class="loading-container flex flex-col items-center justify-center p-8" :class="containerClass">
    <div class="loading-spinner mb-4">
      <UIcon 
        :name="icon" 
        :class="['animate-spin', iconClass]" 
        :style="{ color: 'var(--color-site-gold-500)' }" 
      />
    </div>
    
    <p v-if="message" class="loading-message text-center" :style="{ color: 'var(--color-site-gold-100)' }">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string;
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
  containerClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  message: 'Loading...',
  icon: 'i-heroicons-arrow-path',
  size: 'md'
});

const iconClass = computed(() => {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl'
  };
  return sizeClasses[props.size];
});
</script>

<style scoped>
.loading-container {
  min-height: 200px;
}
</style>
