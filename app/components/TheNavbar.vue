<template>
  <nav class="navbar-container p-4 flex items-center justify-between">
    <!-- Brand and Social Icons -->
    <div class="flex items-center space-x-4">
      <NuxtLink to="/">
        <img src="/icons/BG_LOGO.png" alt="Site Logo" class="navbar-logo cursor-pointer hover:opacity-80 transition-opacity" />
      </NuxtLink>
      <a href="https://www.imdb.com/name/nm7465457/" target="_blank" aria-label="IMDB">
        <UIcon name="i-mdi-filmstrip" class="navbar-social-icon" />
      </a>
      <a href="https://www.spotlight.com/9917-0160-4801" target="_blank" aria-label="Spotlight">
        <UIcon name="i-mdi-theater" class="navbar-social-icon" />
      </a>
      <a href="https://www.instagram.com/benjamin.gijzel/" target="_blank" aria-label="Instagram">
        <UIcon name="i-mdi-instagram" class="navbar-social-icon" />
      </a>
      <a href="https://www.facebook.com/profile.php?id=100012437895143" target="_blank" aria-label="Facebook">
        <UIcon name="i-mdi-facebook" class="navbar-social-icon" />
      </a>
      <a href="https://www.youtube.com/@benjamingijzel446" target="_blank" aria-label="YouTube">
        <UIcon name="i-mdi-youtube" class="navbar-social-icon" />
      </a>
    </div>

    <!-- Navigation Links -->
    <div class="flex items-center space-x-3">
      <UDropdownMenu :items="actingDropdownItems" :ui="{ content: 'w-48' }">
        <UButton 
          label="Acting" 
          color="primary" 
          variant="ghost" 
          class="navbar-link hover:navbar-link-hover"
          trailing-icon="i-heroicons-chevron-down"
        />
      </UDropdownMenu>

      <UDropdownMenu :items="modelingDropdownItems" :ui="{ content: 'w-48' }">
        <UButton 
          label="Modeling" 
          color="primary" 
          variant="ghost" 
          class="navbar-link hover:navbar-link-hover"
          trailing-icon="i-heroicons-chevron-down"
        />
      </UDropdownMenu>

      <NuxtLink to="/albums/Art">
        <UButton label="ART" color="primary" variant="ghost" class="navbar-link hover:navbar-link-hover" />
      </NuxtLink>

      <NuxtLink to="/whoami">
        <UButton label="I AM..." color="primary" variant="ghost" class="navbar-link hover:navbar-link-hover" />
      </NuxtLink>

      <NuxtLink to="/contact">
        <UButton label="CONTACT" color="primary" variant="ghost" class="navbar-link hover:navbar-link-hover" />
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
const actingDropdownItems = [
  [
    { label: 'FICTION: ACTING', to: '/albums/ActingFiction' },
    { label: 'MUSIC VIDEOS', to: '/albums/MusicVideos' },
    { label: 'COMMERCIALS', to: '/albums/Commercials' }
  ]
];

const modelingDropdownItems = [
  [
    { label: 'CORPORATE', to: '/albums/Corporate' },
    { label: 'FASHION', to: '/albums/Fashion' }
  ]
];
</script>

<style scoped>
.navbar-container {
  background-color: var(--color-site-black);
  height: var(--navbar-height, 6rem);
  border-bottom: 1px solid var(--color-site-gold-700);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar-logo {
  max-height: 70px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 2px 4px rgba(196, 147, 38, 0.1));
}

.navbar-logo:hover {
  transform: scale(1.05) rotate(1deg);
  filter: drop-shadow(0 4px 8px rgba(196, 147, 38, 0.2));
}

.navbar-social-icon {
  width: 40px;
  height: 40px;
  color: var(--color-site-gold-500);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
}

.navbar-social-icon:hover {
  color: var(--color-site-gold-100);
  transform: translateY(-2px) scale(1.1);
  filter: drop-shadow(0 4px 8px rgba(196, 147, 38, 0.3));
}

.navbar-social-icon::before {
  content: '';
  position: absolute;
  inset: -4px;
  background: radial-gradient(circle, rgba(196, 147, 38, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.navbar-social-icon:hover::before {
  opacity: 1;
}

.navbar-link {
  color: var(--color-site-gold-500) !important;
  background-color: transparent !important;
  font-size: 1.3rem !important;
  font-weight: 600 !important;
  padding: 0.875rem 1.25rem !important;
  border-radius: 0.5rem !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  cursor: pointer !important;
  border: 1px solid transparent !important;
  position: relative !important;
  overflow: hidden !important;
}

.navbar-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(196, 147, 38, 0.1), transparent);
  transition: left 0.5s ease;
}

.navbar-link:hover::before {
  left: 100%;
}

.navbar-link-hover:hover {
  background-color: var(--color-site-gold-500) !important;
  color: var(--color-site-black) !important;
  border-color: var(--color-site-gold-500) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(196, 147, 38, 0.3) !important;
}

.navbar-link:focus {
  background-color: var(--color-site-gold-500) !important;
  color: var(--color-site-black) !important;
  outline: none !important;
  box-shadow: 0 0 0 3px rgba(196, 147, 38, 0.3) !important;
}

.navbar-link:active {
  transform: translateY(0px) !important;
  transition: transform 0.1s ease !important;
}

/* Deep selectors for dropdown styling */
:deep(.text-navbar) {
  color: var(--color-site-gold-500);
}

:deep(.hover\:text-site-gold-300:hover) {
  color: var(--color-site-gold-300) !important;
}

:deep(.text-site-gold-300) {
  color: var(--color-site-gold-300) !important;
}

/* Dropdown menu styling - when open */
:deep([data-headlessui-state="open"]) .navbar-link {
  background-color: var(--color-site-gold-500) !important;
  color: var(--color-site-black) !important;
  border-color: var(--color-site-gold-500) !important;
}

/* Style the dropdown content */
:deep(.fixed) {
  background-color: var(--color-site-black) !important;
  border: 1px solid var(--color-site-gold-700) !important;
  border-radius: 0.5rem !important;
}

/* Style dropdown items */
:deep(.fixed a) {
  color: var(--color-site-gold-500) !important;
  padding: 0.875rem 1.25rem !important;
  font-size: 1.2rem !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
}

:deep(.fixed a:hover) {
  background-color: var(--color-site-gold-500) !important;
  color: var(--color-site-black) !important;
}

/* Dropdown arrow styling */
:deep(.navbar-link svg) {
  color: inherit !important;
}

/* Override any Nuxt UI defaults for dropdowns */
:deep([role="menuitem"]) {
  color: var(--color-site-gold-500) !important;
}

:deep([role="menuitem"]:hover) {
  background-color: var(--color-site-gold-500) !important;
  color: var(--color-site-black) !important;
}
</style> 