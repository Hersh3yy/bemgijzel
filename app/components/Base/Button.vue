<template>
  <UButton
    v-bind="$attrs"
    :variant="uiVariant"
    :color="uiColor"
    :size="size"
    :loading="loading"
    :disabled="disabled"
    :to="to"
    :href="href"
    :target="target"
    :icon="icon"
    :trailing-icon="trailingIcon"
    :leading-icon="leadingIcon"
    :label="label"
    :class="[
      'base-button',
      variantClass,
      sizeClass,
      widthClass,
      {
        'base-button-loading': loading,
        'base-button-disabled': disabled
      }
    ]"
    @click="handleClick"
  >
    <slot />
  </UButton>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  width?: 'narrow' | 'normal' | 'wide' | 'full'
  loading?: boolean
  disabled?: boolean
  to?: string
  href?: string
  target?: string
  icon?: string
  trailingIcon?: string
  leadingIcon?: string
  label?: string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  width: 'normal',
  loading: false,
  disabled: false
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

// Map our custom variants to UButton variants
const uiVariant = computed(() => {
  const variantMap: Record<string, 'link' | 'ghost' | 'outline' | 'solid' | 'soft' | 'subtle'> = {
    primary: 'solid',
    secondary: 'solid', 
    ghost: 'ghost',
    outline: 'outline',
    danger: 'solid'
  }
  return variantMap[props.variant] || 'solid'
})

// Map our custom variants to UButton colors
const uiColor = computed(() => {
  const colorMap: Record<string, 'primary' | 'secondary' | 'gold' | 'neutral'> = {
    primary: 'primary',
    secondary: 'neutral', 
    ghost: 'primary',
    outline: 'primary',
    danger: 'primary'
  }
  return (props.color as 'primary' | 'secondary' | 'gold' | 'neutral') || colorMap[props.variant] || 'primary'
})

const variantClass = computed(() => {
  const variants = {
    primary: 'base-button-primary',
    secondary: 'base-button-secondary', 
    ghost: 'base-button-ghost',
    outline: 'base-button-outline',
    danger: 'base-button-danger'
  }
  return variants[props.variant]
})

const sizeClass = computed(() => {
  const sizes = {
    sm: 'base-button-sm',
    md: 'base-button-md',
    lg: 'base-button-lg',
    xl: 'base-button-xl'
  }
  return sizes[props.size]
})

const widthClass = computed(() => {
  const widths = {
    narrow: 'base-button-narrow',
    normal: 'base-button-normal',
    wide: 'base-button-wide',
    full: 'base-button-full'
  }
  return widths[props.width]
})

const handleClick = (event: MouseEvent) => {
  if (!props.loading && !props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
.base-button {
  transition: all 0.2s ease;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* Variant styles */
.base-button-primary {
  background-color: var(--color-site-gold-500);
  color: var(--color-black);
  font-weight: 600;
}

.base-button-primary:hover {
  background-color: var(--color-site-gold-400);
}

.base-button-secondary {
  background-color: #4b5563;
  color: white;
  font-weight: 600;
}

.base-button-secondary:hover {
  background-color: #6b7280;
}

.base-button-ghost {
  background-color: transparent;
  color: var(--color-site-gold-500);
}

.base-button-ghost:hover {
  background-color: rgba(196, 147, 38, 0.1);
  color: var(--color-site-gold-400);
}

.base-button-outline {
  background-color: transparent;
  border: 1px solid var(--color-site-gold-500);
  color: var(--color-site-gold-500);
}

.base-button-outline:hover {
  background-color: var(--color-site-gold-500);
  color: var(--color-black);
}

.base-button-danger {
  background-color: #ef4444;
  color: white;
  font-weight: 600;
}

.base-button-danger:hover {
  background-color: #f87171;
}

/* Size styles */
.base-button-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.base-button-md {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.base-button-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}

.base-button-xl {
  padding: 1rem 2rem;
  font-size: 1.25rem;
}

/* Width styles */
.base-button-narrow {
  min-width: 80px;
}

.base-button-normal {
  min-width: 120px;
}

.base-button-wide {
  min-width: 200px;
}

.base-button-full {
  width: 100%;
}

/* State styles */
.base-button-loading {
  opacity: 0.75;
  cursor: not-allowed;
}

.base-button-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Focus styles */
.base-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-site-gold-500);
}

/* Deep selectors for Nuxt UI overrides - more specific targeting */
:deep(.base-button),
:deep(.base-button-primary),
:deep(button.base-button),
:deep(button.base-button-primary) {
  background-color: var(--color-site-gold-500) !important;
  color: var(--color-black) !important;
  border: none !important;
  font-weight: 600 !important;
}

:deep(.base-button:hover),
:deep(.base-button-primary:hover) {
  background-color: var(--color-site-gold-400) !important;
}

:deep(.base-button:focus),
:deep(.base-button-primary:focus) {
  box-shadow: 0 0 0 2px var(--color-site-gold-500) !important;
  outline: none !important;
}

:deep(.base-button-ghost) {
  background-color: transparent !important;
  color: var(--color-site-gold-500) !important;
  font-weight: 500 !important;
}

:deep(.base-button-ghost:hover) {
  background-color: rgba(196, 147, 38, 0.1) !important;
  color: var(--color-site-gold-400) !important;
}

:deep(.base-button-outline) {
  background-color: transparent !important;
  border: 1px solid var(--color-site-gold-500) !important;
  color: var(--color-site-gold-500) !important;
}

:deep(.base-button-outline:hover) {
  background-color: var(--color-site-gold-500) !important;
  color: var(--color-black) !important;
}

/* Ensure button is always visible and properly styled */
:deep(.base-button) {
  min-height: 48px !important;
  min-width: 120px !important;
  visibility: visible !important;
  opacity: 1 !important;
  display: inline-flex !important;
}
</style>