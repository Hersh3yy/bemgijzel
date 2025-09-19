<template>
  <form 
    ref="contactForm"
    @submit="handleSubmit"
    class="p-4 space-y-4"
  >

    <div>
      <label class="block font-semibold mb-2 text-gold-secondary">Your name</label>
      <UInput 
        v-model="formData.name"
        name="name"
        type="text" 
        autocomplete="on"
        required
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
        name="email"
        type="email" 
        autocomplete="on"
        maxlength="50"
        required
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
        name="message"
        maxlength="500"
        :rows="4"
        required
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

    <div class="flex justify-center w-full pt-4">
      <BaseButton 
        type="submit"
        :loading="isSending"
        :disabled="!isFormValid"
        size="lg"
        variant="primary"
        class="send-email-btn"
      >
        Send Message
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { logger } from '~/utils/logger'

interface FormData {
  name: string
  email: string
  message: string
}

interface FieldErrors {
  [key: string]: string
}

interface Emits {
  (e: 'success'): void
  (e: 'error', message: string): void
}

const emit = defineEmits<Emits>()

const formData = ref<FormData>({
  name: '',
  email: '',
  message: ''
})

const isSending = ref(false)
const fieldErrors = ref<FieldErrors>({})

const isFormValid = computed(() => {
  const nameValid = formData.value.name.trim().length >= 1
  const emailValid = formData.value.email.trim().length >= 5 && 
                    /^[\w.-]+@[\w.-]+\.\w+$/.test(formData.value.email.trim())
  const messageValid = formData.value.message.trim().length >= 1
  
  return nameValid && emailValid && messageValid
})

const contactForm = ref<HTMLFormElement>()

const handleSubmit = async (event: Event) => {
  event.preventDefault()
  
  if (!isFormValid.value) return
  
  isSending.value = true
  fieldErrors.value = {}
  
  try {
    // Submit to our API endpoint which will forward to Zapier
    const response = await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: formData.value.name.trim(),
        email: formData.value.email.trim(),
        message: formData.value.message.trim(),
        subject: 'New Contact Form Submission from benjamingijzel.nl'
      }
    })
    
    if (response.success) {
      // Reset form
      formData.value = {
        name: '',
        email: '',
        message: ''
      }
      
      emit('success')
      logger.info('Contact form submitted successfully via Zapier webhook')
    } else {
      throw new Error('Failed to submit form')
    }
    
  } catch (error: any) {
    logger.error('Error submitting form:', error)
    emit('error', error.data?.message || error.message || 'Failed to send message. Please try again or contact directly.')
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

/* Button styling is now handled by BaseButton component */
</style>
