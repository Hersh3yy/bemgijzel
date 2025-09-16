<template>
  <div class="space-y-8 p-6">
    <div>
      <h2 class="text-2xl font-bold text-gold-primary mb-4">Button Variants</h2>
      <div class="flex flex-wrap gap-4">
        <BaseButton variant="primary">Primary</BaseButton>
        <BaseButton variant="secondary">Secondary</BaseButton>
        <BaseButton variant="ghost">Ghost</BaseButton>
        <BaseButton variant="outline">Outline</BaseButton>
        <BaseButton variant="danger">Danger</BaseButton>
      </div>
    </div>

    <div>
      <h2 class="text-2xl font-bold text-gold-primary mb-4">Button Sizes</h2>
      <div class="flex flex-wrap items-center gap-4">
        <BaseButton size="sm">Small</BaseButton>
        <BaseButton size="md">Medium</BaseButton>
        <BaseButton size="lg">Large</BaseButton>
        <BaseButton size="xl">Extra Large</BaseButton>
      </div>
    </div>

    <div>
      <h2 class="text-2xl font-bold text-gold-primary mb-4">Button Widths</h2>
      <div class="space-y-4">
        <div class="flex gap-4">
          <BaseButton width="narrow">Narrow</BaseButton>
          <BaseButton width="normal">Normal</BaseButton>
          <BaseButton width="wide">Wide</BaseButton>
        </div>
        <BaseButton width="full">Full Width</BaseButton>
      </div>
    </div>

    <div>
      <h2 class="text-2xl font-bold text-gold-primary mb-4">Button States</h2>
      <div class="flex flex-wrap gap-4">
        <BaseButton>Normal</BaseButton>
        <BaseButton loading>Loading</BaseButton>
        <BaseButton disabled>Disabled</BaseButton>
      </div>
    </div>

    <div>
      <h2 class="text-2xl font-bold text-gold-primary mb-4">Combined Examples</h2>
      <div class="space-y-4">
        <div class="flex gap-4">
          <BaseButton variant="primary" size="lg" width="wide">Large Wide Primary</BaseButton>
          <BaseButton variant="outline" size="sm" width="narrow">Small Narrow Outline</BaseButton>
        </div>
        <BaseButton variant="secondary" size="xl" width="full">Extra Large Full Width Secondary</BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Demo component showing all BaseButton variants
// This demonstrates the atomic design approach where
// a single component can handle all styling variations through props
</script>
