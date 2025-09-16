<template>
  <div :class="containerClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'full' | 'narrow' | 'wide';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
  className: ''
});

const containerClasses = computed(() => {
  const baseClasses = 'mx-auto';
  
  // Width variants
  const widthClasses = {
    default: 'max-w-7xl',
    full: 'max-w-full',
    narrow: 'max-w-4xl',
    wide: 'max-w-8xl'
  };
  
  // Padding variants
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4 md:p-6',
    md: 'p-4 md:p-8',
    lg: 'p-6 md:p-12'
  };
  
  // Mobile-specific padding (reduced for better mobile experience)
  const mobilePadding = 'p-2 md:p-8';
  
  return [
    baseClasses,
    widthClasses[props.variant],
    props.padding === 'md' ? mobilePadding : paddingClasses[props.padding],
    props.className
  ].filter(Boolean).join(' ');
});
</script>
