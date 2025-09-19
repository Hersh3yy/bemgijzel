<template>
  <LayoutsPageContainer>
    <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 lg:gap-12 items-start">
      <!-- Contact Information and Form Section -->
      <div class="space-y-6">
        <!-- Contact Details -->
        <ContactDetails />

        <!-- Contact Form Card -->
        <UCard class="bg-site-black border-gold-hover card-hover-effect">
          <ContactHeader 
            :show-success="showSuccess" 
            :error-message="errorMessage" 
          />
          
          <ContactForm 
            @success="handleSuccess"
            @error="handleError"
          />
        </UCard>
      </div>

      <!-- Image Section -->
      <div class="lg:sticky lg:top-8">
        <figure class="relative w-full">
          <img 
            src="/by-the-water.jpg" 
            alt="Benjamin Gijzel by the water - Contact"
            class="w-full h-auto object-contain object-center rounded-lg shadow-2xl transition-transform duration-300 hover:scale-105"
            style="max-height: 60vh; min-height: 300px;"
          />
        </figure>
      </div>
    </div>

    <!-- Back to Home Button -->
    <div class="flex justify-center mt-8">
      <BaseButton label="Back to Home" to="/" icon="i-heroicons-arrow-uturn-left" variant="primary" />
    </div>

  </LayoutsPageContainer>
</template>

<script setup lang="ts">
import { logger } from '~/utils/logger'

useHead({
  title: 'Contact - Benjamin Gijzel',
  meta: [
    { name: 'description', content: 'Get in touch with Benjamin Gijzel for acting, modeling, and creative projects.' }
  ]
})

const showSuccess = ref(false)
const errorMessage = ref('')

const handleSuccess = () => {
  showSuccess.value = true
  errorMessage.value = ''
  
  // Auto-hide success message after 8 seconds
  setTimeout(() => {
    showSuccess.value = false
  }, 8000)
}

const handleError = (message: string) => {
  errorMessage.value = message
  showSuccess.value = false
}
</script>

<!-- Styles are now handled by individual components --> 