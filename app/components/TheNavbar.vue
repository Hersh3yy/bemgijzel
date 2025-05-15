<template>
  <nav class="navbar-container p-4 flex items-center justify-between">
    <!-- Brand and Social Icons -->
    <div class="flex items-center space-x-4">
      <NuxtLink to="/">
        <!-- TODO: Replace with actual image path -->
        <img src="/icons/BG_LOGO.png" alt="Site Logo" class="navbar-logo" />
      </NuxtLink>
      <a href="https://www.facebook.com/profile.php?id=100012437895143&fref=ts" target="_blank" aria-label="Facebook">
        <UIcon name="i-mdi-facebook" class="navbar-social-icon" />
      </a>
      <a href="https://www.instagram.com/benjamin.gijzel/" target="_blank" aria-label="Instagram">
        <UIcon name="i-mdi-instagram" class="navbar-social-icon" />
      </a>
      <a href="https://www.imdb.com/name/nm7465457/" target="_blank" aria-label="IMDB">
        <!-- Using a generic film icon for IMDB, can be changed -->
        <UIcon name="i-mdi-filmstrip" class="navbar-social-icon" /> 
      </a>
    </div>

    <!-- Navigation Links -->
    <div class="flex items-center space-x-2">
      <UHorizontalNavigation :links="mainNavLinks" :ui="{ 
        active: 'text-site-gold-300 dark:text-site-gold-300', 
        inactive: 'text-navbar hover:text-site-gold-300 dark:hover:text-site-gold-300'
      }" />

      <UDropdown :items="actingDropdownItems" :popper="{ placement: 'bottom-start' }" :ui="{ item: { disabled: 'cursor-text select-text' } }">
        <UButton label="Acting" color="primary" variant="ghost" class="navbar-link hover:navbar-link-hover" />
      </UDropdown>

      <UDropdown :items="modelingDropdownItems" :popper="{ placement: 'bottom-start' }" :ui="{ item: { disabled: 'cursor-text select-text' } }">
        <UButton label="Modeling" color="primary" variant="ghost" class="navbar-link hover:navbar-link-hover" />
      </UDropdown>

      <NuxtLink to="/art">
        <UButton label="Art" color="primary" variant="ghost" class="navbar-link hover:navbar-link-hover" />
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { HorizontalNavigationLink } from '#ui/types'

const mainNavLinks: HorizontalNavigationLink[][] = [
  [
    { label: 'I am..', to: '/whoami' },
    { label: 'Showreels', to: '/showreel' },
    { label: 'Contact', to: '/contact' },
    { label: 'New!', to: '/new' }
  ]
];

const actingDropdownItems = [
  [
    { label: 'Fiction', to: '/fiction' },
    { label: 'Corporate', to: '/commercial' }, // Path was /commercial, assuming it means corporate acting
    { label: 'Music Videos', to: '/music-videos' }
  ]
];

const modelingDropdownItems = [
  [
    { label: 'Fashion', to: '/fashion' },
    { label: 'Corporate', to: '/corporate' } // Path was /corporate for modeling
  ]
];

</script>

<style scoped>
.navbar-container {
  background-color: var(--navbar-bg-color);
  height: var(--navbar-height, 6rem); /* Use CSS var or default */
}

.navbar-logo {
  max-height: 70px;
}

.navbar-social-icon {
  font-size: 2rem; /* Equivalent to max-height: 40px approx */
  color: var(--navbar-item-color);
}
.navbar-social-icon:hover {
  color: var(--navbar-item-hover-bg-color); /* Using this var as it's the gold color */
}

.navbar-link {
  color: var(--navbar-item-color) !important; /* Important to override UButton default colors */
  background-color: transparent !important;
}

.navbar-link-hover:hover {
  background-color: var(--navbar-item-hover-bg-color) !important;
  color: var(--navbar-item-hover-color) !important;
}

/* Custom styling for UHorizontalNavigation links to match desired colors */
:deep(.text-navbar) {
  color: var(--navbar-item-color);
}
:deep(.hover\:text-site-gold-300:hover) {
   color: var(--color-site-gold-300) !important;
}
:deep(.text-site-gold-300) {
   color: var(--color-site-gold-300) !important;
}

</style> 