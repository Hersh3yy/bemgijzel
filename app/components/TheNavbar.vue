<template>
  <nav class="navbar-container p-4 flex items-center justify-between">
    <!-- Brand and Social Icons -->
    <div class="flex items-center space-x-4">
      <NuxtLink to="/">
        <img src="/icons/BG_LOGO.png" alt="Site Logo" class="navbar-logo" />
      </NuxtLink>
      <a href="https://www.spotlight.com/1234-5678-9012" target="_blank" aria-label="Spotlight">
        <UIcon name="i-mdi-theater" class="navbar-social-icon" />
      </a>
      <a href="https://www.imdb.com/name/nm7465457/" target="_blank" aria-label="IMDB">
        <UIcon name="i-mdi-filmstrip" class="navbar-social-icon" />
      </a>
      <a href="https://www.instagram.com/benjamin.gijzel/" target="_blank" aria-label="Instagram">
        <UIcon name="i-mdi-instagram" class="navbar-social-icon" />
      </a>
      <a href="https://www.facebook.com/profile.php?id=100012437895143" target="_blank" aria-label="Facebook">
        <UIcon name="i-mdi-facebook" class="navbar-social-icon" />
      </a>
      <a href="https://www.youtube.com/@benjamingijzel" target="_blank" aria-label="YouTube">
        <UIcon name="i-mdi-youtube" class="navbar-social-icon" />
      </a>
    </div>

    <!-- Navigation Links -->
    <div class="flex items-center space-x-2">
      <UDropdownMenu :items="actingDropdownItems" :ui="{ content: 'w-48' }">
        <UButton label="Acting" color="primary" variant="ghost" class="navbar-link hover:navbar-link-hover" />
      </UDropdownMenu>

      <UDropdownMenu :items="modelingDropdownItems" :ui="{ content: 'w-48' }">
        <UButton label="Modeling" color="primary" variant="ghost" class="navbar-link hover:navbar-link-hover" />
      </UDropdownMenu>

      <NuxtLink to="/albums/arts">
        <UButton label="Art" color="primary" variant="ghost" class="navbar-link hover:navbar-link-hover" />
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
const actingDropdownItems = [
  [
    { label: 'Fiction', to: '/albums/fiction' },
    { label: 'Corporate', to: '/albums/corporate' },
    { label: 'Music', to: '/albums/music' },
    { label: 'Commercials', to: '/albums/commercials' }
  ]
];

const modelingDropdownItems = [
  [
    { label: 'Corporate', to: '/albums/corporate' },
    { label: 'Fashion', to: '/albums/fashion' }
  ]
];
</script>

<style scoped>
.navbar-container {
  background-color: var(--navbar-bg-color);
  height: var(--navbar-height, 6rem);
}

.navbar-logo {
  max-height: 70px;
}

.navbar-social-icon {
  font-size: 2rem;
  color: var(--navbar-item-color);
  transition: color 0.3s ease;
}

.navbar-social-icon:hover {
  color: var(--navbar-item-hover-bg-color);
}

.navbar-link {
  color: var(--navbar-item-color) !important;
  background-color: transparent !important;
}

.navbar-link-hover:hover {
  background-color: var(--navbar-item-hover-bg-color) !important;
  color: var(--navbar-item-hover-color) !important;
}

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