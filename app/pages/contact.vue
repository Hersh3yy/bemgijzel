<template>
  <LayoutsPageContainer>
    <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 lg:gap-12 items-start">
      <!-- Contact Information and Form Section -->
      <div class="space-y-6">
        <!-- Contact Details Card -->
        <UCard class="bg-site-black border-gold-hover card-hover-effect">
          <div class="p-4">
            <div class="text-gold-secondary space-y-2">
              <p>
                <strong class="text-gold-primary">Location:</strong> NL Amsterdam
              </p>
              <p>
                <strong class="text-gold-primary">Phone (NL):</strong> + 31 (0)6 2897 2693
              </p>
              <p>
                <strong class="text-gold-primary">Phone (DE):</strong> + 49 (0)2054 871 557
              </p>
              <p>
                <strong class="text-gold-primary">KvK:</strong> A'dam 34274244
              </p>
            </div>
          </div>
        </UCard>

        <!-- Contact Form Card -->
        <UCard class="bg-site-black border-gold-hover card-hover-effect">
          <template #header>
            <p class="text-lg font-semibold text-gold-primary">
              Send me a message.
            </p>
          </template>

          <div class="p-4 space-y-4">
            <!-- Success Message -->
            <div v-if="showSuccess" class="fade-in p-4 rounded-lg border border-green-500 bg-green-500/10">
              <div class="flex items-center">
                <UIcon name="i-heroicons-check-circle" class="text-green-500 text-xl mr-3" />
                <p class="text-green-400 font-medium">
                  Email sent successfully! Benjamin will get back to you soon.
                </p>
              </div>
            </div>

            <!-- General Error Message -->
            <div v-if="errorMessage" class="fade-in p-4 rounded-lg border border-red-500 bg-red-500/10">
              <div class="flex items-center">
                <UIcon name="i-heroicons-exclamation-triangle" class="text-red-500 text-xl mr-3" />
                <p class="text-red-400 font-medium">
                  {{ errorMessage }}
                </p>
              </div>
            </div>
            <div>
              <label class="block font-semibold mb-2 text-gold-secondary">Your name</label>
              <UInput 
                v-model="formData.name"
                type="text" 
                autocomplete="on"
                :class="['w-full', fieldErrors.name && 'border-red-500']"
                placeholder="Enter your full name"
              />
              <div v-if="fieldErrors.name" class="mt-1">
                <p class="text-red-400 text-sm">{{ fieldErrors.name }}</p>
              </div>
            </div>

            <div>
              <label class="block font-semibold mb-2 text-gold-secondary">Your e-mail</label>
              <UInput 
                v-model="formData.email"
                type="email" 
                autocomplete="on"
                maxlength="50"
                :class="['w-full', fieldErrors.email && 'border-red-500']"
                placeholder="your.email@example.com"
              />
              <div class="flex justify-between items-center mt-1">
                <div v-if="fieldErrors.email">
                  <p class="text-red-400 text-sm">{{ fieldErrors.email }}</p>
                </div>
                <small class="text-xs opacity-60 text-gold-300">
                  {{ formData.email.length }} / 50
                </small>
              </div>
            </div>

            <div>
              <label class="block font-semibold mb-2 text-gold-secondary">Message</label>
              <UTextarea 
                v-model="formData.message"
                maxlength="500"
                :rows="4"
                :class="['w-full', fieldErrors.message && 'border-red-500']"
                placeholder="Tell Benjamin about your project or inquiry..."
              />
              <div class="flex justify-between items-center mt-1">
                <div v-if="fieldErrors.message">
                  <p class="text-red-400 text-sm">{{ fieldErrors.message }}</p>
                </div>
                <small class="text-xs opacity-60 text-gold-300">
                  {{ formData.message.length }} / 500
                </small>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-center w-full">
              <BaseButton 
                @click="sendEmail"
                :loading="isSending"
                :disabled="!isFormValid"
                size="lg"
                variant="primary"
                class="send-email-btn"
              >
                Send Email
              </BaseButton>
            </div>
          </template>
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

const formData = ref({
  name: '',
  email: '',
  message: ''
})

const isSending = ref(false)
const showSuccess = ref(false)
const errorMessage = ref('')
const fieldErrors = ref<Record<string, string>>({})

const isFormValid = computed(() => {
  const nameValid = formData.value.name.trim().length >= 1
  const emailValid = formData.value.email.trim().length >= 5 && 
                    /^[\w.-]+@[\w.-]+\.\w+$/.test(formData.value.email.trim())
  const messageValid = formData.value.message.trim().length >= 1
  
  return nameValid && emailValid && messageValid
})

const clearMessages = () => {
  showSuccess.value = false
  errorMessage.value = ''
  fieldErrors.value = {}
}

const sendEmail = async () => {
  if (!isFormValid.value) return
  
  clearMessages()
  isSending.value = true
  
  try {
    const response = await $fetch<{ success: boolean; message: string }>('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        name: formData.value.name.trim(),
        email: formData.value.email.trim(),
        message: formData.value.message.trim()
      }
    })
    
    if (response.success) {
      // Reset form
      formData.value = {
        name: '',
        email: '',
        message: ''
      }
      
      // Show success message
      showSuccess.value = true
      logger.info('Contact form submitted successfully')
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        showSuccess.value = false
      }, 5000)
    } else {
      throw new Error(response.message || 'Failed to send email')
    }
    
  } catch (error: any) {
    logger.error('Error sending email:', error)
    
    // Handle different error types
    if (error.statusCode === 400) {
      // Validation errors
      if (error.data?.field) {
        fieldErrors.value[error.data.field] = error.message || 'Invalid input'
      } else if (error.data?.fields) {
        // Multiple field errors
        Object.entries(error.data.fields).forEach(([field, message]) => {
          if (message) {
            fieldErrors.value[field] = message as string
          }
        })
      } else {
        errorMessage.value = error.message || 'Please check your input and try again.'
      }
    } else if (error.statusCode === 500) {
      errorMessage.value = 'Server error. Please try again later.'
    } else if (error.statusCode === 405) {
      errorMessage.value = 'Method not allowed. Please refresh and try again.'
    } else {
      errorMessage.value = error.message || 'Failed to send email. Please try again or contact directly.'
    }
  } finally {
    isSending.value = false
  }
}

// Clear field errors when user starts typing
watch(() => formData.value.name, () => {
  if (fieldErrors.value.name) {
    delete fieldErrors.value.name
  }
})

watch(() => formData.value.email, () => {
  if (fieldErrors.value.email) {
    delete fieldErrors.value.email
  }
})

watch(() => formData.value.message, () => {
  if (fieldErrors.value.message) {
    delete fieldErrors.value.message
  }
})
</script>

<style scoped>
/* Form styling overrides */
:deep(.input),
:deep(.textarea) {
  background-color: var(--color-site-black) !important;
  border-color: var(--color-site-gold-700) !important;
  color: var(--color-site-gold-100) !important;
}

:deep(.input:focus),
:deep(.textarea:focus) {
  border-color: var(--color-site-gold-500) !important;
  box-shadow: 0 0 0 1px var(--color-site-gold-500) !important;
}

:deep(.input::placeholder),
:deep(.textarea::placeholder) {
  color: var(--color-site-gold-400) !important;
}

/* Ensure button is always visible and properly styled */
.send-email-btn {
  min-height: 48px !important;
  min-width: 120px !important;
  visibility: visible !important;
  opacity: 1 !important;
  display: inline-flex !important;
}
</style> 