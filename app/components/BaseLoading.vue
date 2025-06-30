<template>
  <div class="flex justify-center items-center py-8" :class="containerClass">
    <div class="loading-container">
      <UIcon 
        :name="icon" 
        :class="['animate-spin', iconClass]" 
      />
      <p v-if="message" :class="['mt-2 text-center', textClass]">{{ message }}</p>
    </div>
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
  icon: 'i-heroicons-arrow-path',
  size: 'md'
});

const iconClass = computed(() => {
  const baseClass = 'text-site-gold-500';
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };
  return `${baseClass} ${sizeClasses[props.size]}`;
});

const textClass = computed(() => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };
  return `text-site-gold-300 ${sizeClasses[props.size]}`;
});
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style> 