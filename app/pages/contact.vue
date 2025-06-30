<template>
  <div class="page-container">
    <div class="contact-layout">
      <!-- Contact Information and Form Section -->
      <div class="contact-content">
        <!-- Contact Details Card -->
        <UCard class="contact-details-card mb-6">
          <div class="p-4">
            <div class="contact-info-text" :style="{ color: 'var(--color-site-gold-100)' }">
              <p class="mb-2">
                <strong :style="{ color: 'var(--color-site-gold-500)' }">Location:</strong> NL Amsterdam
              </p>
              <p class="mb-2">
                <strong :style="{ color: 'var(--color-site-gold-500)' }">Phone (NL):</strong> + 31 (0)6 2897 2693
              </p>
              <p class="mb-2">
                <strong :style="{ color: 'var(--color-site-gold-500)' }">Phone (DE):</strong> + 49 (0)2054 871 557
              </p>
              <p class="mb-2">
                <strong :style="{ color: 'var(--color-site-gold-500)' }">KvK:</strong> A'dam 34274244
              </p>
            </div>
          </div>
        </UCard>

        <!-- Contact Form Card -->
        <UCard class="contact-form-card">
          <template #header>
            <p class="card-header-title text-lg font-semibold" :style="{ color: 'var(--color-site-gold-500)' }">
              Send me a message.
            </p>
          </template>

          <div class="p-4 space-y-4">
            <div>
              <label class="block font-semibold mb-2" :style="{ color: 'var(--color-site-gold-100)' }">Your name</label>
              <UInput 
                v-model="formData.name"
                type="text" 
                autocomplete="on"
                class="w-full"
              />
            </div>

            <div>
              <label class="block font-semibold mb-2" :style="{ color: 'var(--color-site-gold-100)' }">Your e-mail</label>
              <UInput 
                v-model="formData.email"
                type="email" 
                autocomplete="on"
                maxlength="50"
                class="w-full"
              />
              <small class="text-xs opacity-60" :style="{ color: 'var(--color-site-gold-300)' }">
                {{ formData.email.length }} / 50
              </small>
            </div>

            <div>
              <label class="block font-semibold mb-2" :style="{ color: 'var(--color-site-gold-100)' }">Message</label>
              <UTextarea 
                v-model="formData.message"
                maxlength="200"
                :rows="4"
                class="w-full"
              />
              <small class="text-xs opacity-60" :style="{ color: 'var(--color-site-gold-300)' }">
                {{ formData.message.length }} / 200
              </small>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-center w-full">
              <UButton 
                @click="sendEmail"
                :loading="isSending"
                :disabled="!isFormValid"
                size="lg"
                class="send-email-btn"
              >
                <span>Send Email</span>
              </UButton>
            </div>
          </template>
        </UCard>
      </div>

      <!-- Image Section -->
      <div class="contact-image">
        <figure class="image-container">
          <img 
            src="/by-the-water.jpg" 
            alt="Benjamin Gijzel by the water - Contact"
            class="contact-photo"
          />
        </figure>
      </div>
    </div>

    <!-- Back to Home Button -->
    <div class="flex justify-center mt-8">
      <UButton label="Back to Home" to="/" icon="i-heroicons-arrow-uturn-left" color="primary" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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

const isFormValid = computed(() => {
  return formData.value.name.trim() !== '' && 
         formData.value.email.trim() !== '' && 
         formData.value.message.trim() !== '' &&
         formData.value.email.includes('@')
})

const sendEmail = async () => {
  if (!isFormValid.value) return
  
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
      
      // Show success message (you can implement a toast/notification here)
      alert('Email sent successfully! Benjamin will get back to you soon.')
    } else {
      throw new Error('Failed to send email')
    }
    
  } catch (error: any) {
    logger.error('Error sending email:', error)
    
    // Show user-friendly error messages
    if (error.statusCode === 400) {
      alert('Please check your input and try again.')
    } else if (error.statusCode === 500) {
      alert('Server error. Please try again later.')
    } else {
      alert('Failed to send email. Please try again or contact directly.')
    }
  } finally {
    isSending.value = false
  }
}
</script>

<style scoped>
.page-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.contact-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  align-items: start;
}

.contact-content {
  /* Left column content */
}

.contact-details-card,
.contact-form-card {
  background: var(--color-site-black);
  border: 1px solid var(--color-site-gold-700);
}

.contact-details-card:hover,
.contact-form-card:hover {
  border-color: var(--color-site-gold-500);
  box-shadow: 0 4px 12px rgba(196, 147, 38, 0.1);
}

.contact-image {
  /* Right column image */
  position: sticky;
  top: 2rem;
}

.image-container {
  width: 100%;
  height: auto;
}

.contact-photo {
  width: 100%;
  height: auto;
  min-height: 600px;
  max-height: 80vh;
  object-fit: cover;
  object-position: center;
  border-radius: 0.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.contact-photo:hover {
  transform: scale(1.02);
}

.send-email-btn {
  background-color: var(--color-site-black) !important;
  color: var(--color-site-gold-500) !important;
  border: 1px solid var(--color-site-gold-500) !important;
  transition: all 0.3s ease !important;
}

.send-email-btn:hover {
  background-color: var(--color-site-gold-500) !important;
  color: var(--color-site-black) !important;
}

.send-email-btn:disabled {
  opacity: 0.5 !important;
  cursor: not-allowed !important;
}

/* Mobile responsive design */
@media (max-width: 1024px) {
  .contact-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .contact-image {
    order: -1; /* Image goes to top on mobile */
    position: static;
  }
  
  .contact-photo {
    min-height: 300px;
    max-height: 50vh;
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }
  
  .contact-layout {
    gap: 1.5rem;
  }
  
  .contact-photo {
    min-height: 250px;
    max-height: 40vh;
  }
}

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
</style> 