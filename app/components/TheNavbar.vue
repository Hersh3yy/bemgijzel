<template>
  <nav class="navbar-container">
    <div class="navbar-content">
      <!-- Brand Logo - Left side -->
      <div class="brand-section">
        <NuxtLink to="/" class="brand-link">
          <img src="/icons/BG_LOGO.png" alt="Site Logo" class="navbar-logo" />
        </NuxtLink>
        
        <!-- Social icons - hidden on mobile, shown on larger screens -->
        <div class="social-icons desktop-only">
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
      </div>

      <!-- Desktop Navigation Links -->
      <div class="desktop-nav desktop-only">
        <UDropdownMenu :items="actingDropdownItems" :ui="{ content: 'w-48' }">
          <BaseButton 
            label="ACTING" 
            variant="ghost"
            class="navbar-link hover:navbar-link-hover"
            trailing-icon="i-heroicons-chevron-down"
          />
        </UDropdownMenu>

        <UDropdownMenu :items="modelingDropdownItems" :ui="{ content: 'w-48' }">
          <BaseButton 
            label="MODELING" 
            variant="ghost"
            class="navbar-link hover:navbar-link-hover"
            trailing-icon="i-heroicons-chevron-down"
          />
        </UDropdownMenu>

        <NuxtLink to="/albums/Art">
          <BaseButton label="ART" variant="ghost" class="navbar-link hover:navbar-link-hover" />
        </NuxtLink>

        <NuxtLink to="/whoami">
          <BaseButton label="I AM..." variant="ghost" class="navbar-link hover:navbar-link-hover" />
        </NuxtLink>

        <NuxtLink to="/contact">
          <BaseButton label="CONTACT" variant="ghost" class="navbar-link hover:navbar-link-hover" />
        </NuxtLink>
      </div>

      <!-- Mobile menu button - Right side -->
      <BaseButton 
        class="mobile-menu-btn mobile-only mobile-button"
        variant="ghost"
        :icon="mobileMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
        @click="toggleMobileMenu"
        aria-label="Toggle navigation"
      />
    </div>

    <!-- Mobile Navigation Menu -->
    <div v-show="mobileMenuOpen" class="mobile-nav mobile-only">
      <div class="mobile-nav-content">
        <!-- Mobile social icons -->
        <div class="mobile-social-icons mobile-only">
          <a href="https://www.imdb.com/name/nm7465457/" target="_blank" aria-label="IMDB">
            <UIcon name="i-mdi-filmstrip" class="mobile-social-icon" />
          </a>
          <a href="https://www.spotlight.com/9917-0160-4801" target="_blank" aria-label="Spotlight">
            <UIcon name="i-mdi-theater" class="mobile-social-icon" />
          </a>
          <a href="https://www.instagram.com/benjamin.gijzel/" target="_blank" aria-label="Instagram">
            <UIcon name="i-mdi-instagram" class="mobile-social-icon" />
          </a>
          <a href="https://www.facebook.com/profile.php?id=100012437895143" target="_blank" aria-label="Facebook">
            <UIcon name="i-mdi-facebook" class="mobile-social-icon" />
          </a>
          <a href="https://www.youtube.com/@benjamingijzel446" target="_blank" aria-label="YouTube">
            <UIcon name="i-mdi-youtube" class="mobile-social-icon" />
          </a>
        </div>

        <!-- Mobile navigation items -->
        <div class="mobile-nav-items">
          <!-- Acting submenu -->
          <div class="mobile-nav-section">
            <h3 class="mobile-nav-heading">ACTING</h3>
            <div class="mobile-nav-sublist">
              <NuxtLink to="/albums/ActingFiction" @click="closeMobileMenu" class="mobile-nav-link">
                FICTION: ACTING
              </NuxtLink>
              <NuxtLink to="/albums/MusicVideos" @click="closeMobileMenu" class="mobile-nav-link">
                MUSIC VIDEOS
              </NuxtLink>
              <NuxtLink to="/albums/Commercials" @click="closeMobileMenu" class="mobile-nav-link">
                COMMERCIALS
              </NuxtLink>
            </div>
          </div>

          <!-- Modeling submenu -->
          <div class="mobile-nav-section">
            <h3 class="mobile-nav-heading">MODELING</h3>
            <div class="mobile-nav-sublist">
              <NuxtLink to="/albums/Corporate" @click="closeMobileMenu" class="mobile-nav-link">
                CORPORATE
              </NuxtLink>
              <NuxtLink to="/albums/Fashion" @click="closeMobileMenu" class="mobile-nav-link">
                FASHION
              </NuxtLink>
            </div>
          </div>

          <!-- Other links -->
          <NuxtLink to="/albums/Art" @click="closeMobileMenu" class="mobile-nav-main-link">
            ART
          </NuxtLink>
          <NuxtLink to="/whoami" @click="closeMobileMenu" class="mobile-nav-main-link">
            I AM...
          </NuxtLink>
          <NuxtLink to="/contact" @click="closeMobileMenu" class="mobile-nav-main-link">
            CONTACT
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const mobileMenuOpen = ref(false);

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

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

// Close mobile menu when clicking outside or on route change
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const nav = document.querySelector('.navbar-container');
    if (nav && !nav.contains(event.target as Node)) {
      closeMobileMenu();
    }
  };

  document.addEventListener('click', handleClickOutside);
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });
});

// Close mobile menu on route change
const route = useRoute();
watch(() => route.path, () => {
  closeMobileMenu();
});
</script>

<style scoped>
.navbar-container {
  background-color: var(--color-site-black);
  border-bottom: 1px solid var(--color-site-gold-700);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 99998;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  min-height: var(--navbar-height, 6rem);
  width: 100%;
  max-width: 100vw;
  overflow: hidden;
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand-link {
  display: flex;
  align-items: center;
}

.social-icons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mobile-menu-btn {
  color: var(--color-site-gold-500) !important;
  background-color: transparent !important;
  border: 1px solid var(--color-site-gold-700) !important;
  transition: all 0.3s ease !important;
  min-width: 44px !important;
  min-height: 44px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.mobile-menu-btn:hover {
  background-color: var(--color-site-gold-500) !important;
  color: var(--color-site-black) !important;
}

.mobile-nav {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  width: 100vw;
  background-color: var(--color-site-black);
  border-bottom: 1px solid var(--color-site-gold-700);
  z-index: 99999;
  max-height: calc(100vh - var(--navbar-height, 6rem));
  overflow-y: auto;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transform: translateX(0);
}

.mobile-nav-content {
  padding: 1.5rem;
}

.mobile-social-icons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-site-gold-700);
}

.mobile-social-icon {
  width: 32px;
  height: 32px;
  color: var(--color-site-gold-500);
  transition: all 0.3s ease;
}

.mobile-social-icon:hover {
  color: var(--color-site-gold-100);
  transform: scale(1.1);
}

.mobile-nav-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mobile-nav-section {
  border-bottom: 1px solid var(--color-site-gold-800);
  padding-bottom: 1rem;
}

.mobile-nav-heading {
  color: var(--color-site-gold-500);
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.mobile-nav-sublist {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-left: 1rem;
}

.mobile-nav-link {
  color: var(--color-site-gold-300);
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem 0;
  transition: all 0.3s ease;
  text-decoration: none;
  display: block;
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
  color: var(--color-site-gold-100);
  transform: translateX(0.25rem);
}

.mobile-nav-main-link {
  color: var(--color-site-gold-500);
  font-size: 1.1rem;
  font-weight: 700;
  padding: 0.75rem 0;
  transition: all 0.3s ease;
  text-decoration: none;
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--color-site-gold-800);
}

.mobile-nav-main-link:hover,
.mobile-nav-main-link.router-link-active {
  color: var(--color-site-gold-100);
  background-color: rgba(196, 147, 38, 0.1);
  transform: translateX(0.25rem);
}

.navbar-logo {
  max-height: 70px;
  width: auto;
  height: 50px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 2px 4px rgba(196, 147, 38, 0.1));
  display: block !important;
  visibility: visible !important;
}

@media (max-width: 768px) {
  .navbar-container {
    border-bottom: 2px solid var(--color-site-gold-700);
  }
  
  .navbar-content {
    padding: 1rem;
    min-height: 5rem;
  }
  
  .navbar-logo {
    height: 60px;
    max-height: 60px;
    min-width: 60px;
  }
  
  .brand-section {
    gap: 0.75rem;
  }
  
  .mobile-menu-btn {
    min-width: 56px !important;
    min-height: 56px !important;
    font-size: 1.5rem !important;
    border: 2px solid var(--color-site-gold-700) !important;
  }
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

/* Mobile/Desktop visibility classes */
.desktop-only {
  display: none;
}

.mobile-only {
  display: block;
}

.mobile-only.mobile-button {
  display: flex;
}

@media (min-width: 1024px) {
  .desktop-only {
    display: flex;
  }
  
  .mobile-only {
    display: none !important;
  }
  
  .mobile-only.mobile-button {
    display: none !important;
  }
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