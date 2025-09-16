<template>
  <div class="error-container p-6 text-center" :class="containerClass">
    <div class="error-icon mb-4">
      <UIcon 
        :name="icon" 
        :class="['text-red-500', iconClass]" 
      />
    </div>
    
    <h3 v-if="title" class="error-title mb-2 font-semibold text-red-400">
      {{ title }}
    </h3>
    
    <p class="error-message mb-4 text-red-300">
      {{ message }}
    </p>
    
    <div v-if="showRetry || $slots.actions" class="error-actions">
      <slot name="actions">
        <BaseButton 
          v-if="showRetry"
          label="Try Again" 
          icon="i-heroicons-arrow-path" 
          variant="outline"
          @click="$emit('retry')"
        />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string;
  title?: string;
  icon?: string;
  showRetry?: boolean;
  size?: 'sm' | 'md' | 'lg';
  containerClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Error',
  icon: 'i-heroicons-exclamation-triangle',
  showRetry: false,
  size: 'md'
});

defineEmits<{
  retry: [];
}>();

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
.error-container {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.5rem;
  max-width: 32rem;
  margin: 0 auto;
}
</style>
