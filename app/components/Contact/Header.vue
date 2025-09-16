<template>
  <div class="space-y-4">
    <!-- Header Title -->
    <div class="p-4 pb-0">
      <p class="text-lg font-semibold text-gold-primary">
        Send me a message.
      </p>
    </div>

    <!-- Success Message -->
    <div v-if="showSuccess" class="fade-in p-4 mx-4 mt-4 rounded-lg border border-green-500 bg-green-500/10">
      <div class="flex items-center">
        <UIcon name="i-heroicons-check-circle" class="text-green-500 text-xl mr-3" />
        <p class="text-green-400 font-medium">
          Message sent successfully! Benjamin will get back to you soon.
        </p>
      </div>
    </div>

    <!-- General Error Message -->
    <div v-if="errorMessage" class="fade-in p-4 mx-4 mt-4 rounded-lg border border-red-500 bg-red-500/10">
      <div class="flex items-center">
        <UIcon name="i-heroicons-exclamation-triangle" class="text-red-500 text-xl mr-3" />
        <p class="text-red-400 font-medium">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  showSuccess: boolean
  errorMessage: string
}

defineProps<Props>()
</script>
