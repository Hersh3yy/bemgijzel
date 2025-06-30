// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-07-03',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  runtimeConfig: {
    // Private (server-side only)
    sendGridApiKey: process.env.SENDGRID_API_KEY,
    sendGridTemplateId: process.env.SENDGRID_TEMPLATE_ID,
    
    public: {
      vamsUrl: process.env.VAMS_URL,
      vamsBgApiKey: process.env.VAMS_BG_API_KEY,
      apiUrl: process.env.VAMS_URL,
      apiKey: process.env.VAMS_BG_API_KEY,
    }
  },
  modules: [
    '@nuxt/fonts',
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/content'
  ],
  css: ['~/assets/css/main.css'],
  ui: {
    theme: {
      colors: ['primary', 'secondary', 'gold'] // Add gold as a custom color
    }
  }
  // srcDir: 'app/', // This should be picked up by compatibilityVersion: 4
})