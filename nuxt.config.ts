// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-07-03',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
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
    // Removed 'colors' from here as primary/secondary are defined in app.config.ts
    // Or by default Nuxt UI primary is 'green' and neutral is 'slate'.
    // We will override these in app.config.ts or use CSS variables.
  }
  // srcDir: 'app/', // This should be picked up by compatibilityVersion: 4
})