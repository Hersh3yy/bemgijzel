<template>
  <div class="page-container">
    <UCard>
      <template #header>
        <h1 class="text-3xl font-bold text-center" :style="{ color: 'var(--color-site-gold-500)' }">I Am...</h1>
      </template>

      <div class="p-6">
        <p class="text-center mb-8 text-lg" :style="{ color: 'var(--color-site-gold-100)' }">
          Get to know more about Benjamin Gijzel - his experience, background, and interests.
        </p>

        <!-- Collapsible sections -->
        <div class="space-y-4 max-w-4xl mx-auto">
          <div 
            v-for="(item, index) in iAmItems" 
            :key="item.id"
            class="collapse-item border rounded-lg overflow-hidden"
            :style="{ borderColor: 'var(--color-site-gold-700)' }"
          >
            <button 
              @click="toggleCollapse(index)"
              class="w-full p-4 text-left flex justify-between items-center hover:bg-opacity-10 transition-all duration-300"
              :style="{ 
                backgroundColor: isOpen === index ? 'var(--color-site-gold-800)' : 'transparent',
                color: 'var(--color-site-gold-100)'
              }"
            >
              <h3 class="text-lg font-semibold">{{ item.Title }}</h3>
              <UIcon 
                :name="isOpen === index ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" 
                class="w-5 h-5 transition-transform duration-300"
                :style="{ color: 'var(--color-site-gold-500)' }"
              />
            </button>
            
            <div 
              v-if="isOpen === index"
              class="p-4 border-t"
              :style="{ 
                borderColor: 'var(--color-site-gold-700)',
                backgroundColor: 'var(--color-site-gold-900)'
              }"
            >
              <div 
                class="text-base leading-relaxed whitespace-pre-line"
                :style="{ color: 'var(--color-site-gold-100)' }"
                v-html="formatContent(item.Content)"
              />
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-center">
          <UButton label="Back to Home" to="/" icon="i-heroicons-arrow-uturn-left" color="primary" />
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

useHead({
  title: 'I Am... - About Benjamin Gijzel',
  meta: [
    { name: 'description', content: 'Learn about Benjamin Gijzel - his acting experience, background, and interests.' }
  ]
})

const isOpen = ref(0) // First item open by default

const toggleCollapse = (index: number) => {
  isOpen.value = isOpen.value === index ? -1 : index
}

const formatContent = (content: string) => {
  // Convert line breaks and preserve formatting
  return content.replace(/\n/g, '<br>')
}

// Hardcoded data from the old site, sorted by Order
const iAmItems = [
  {
    "id": 11,
    "Order": 101,
    "Content": "In ACTING FICTION you will find  some \"small roles in big films\" - like f.e. DE ZAAK MENTEN bij Tim Oliehoek, but mainly \"big roles in small films\" - like f.e. THE SANDS OF SUMMERS PAST, THE MAID and SHORTS.  \nIn ACTING CORPORATE you will find COMMERCIALS - like my favorite one for UNOX - and some CORPORATE productions.\nIn  ART you will find pictures and links to the results of my cooperation with great photographers like Annabel Oosteweeghel and the late Daniel Chorup as well as some experimental artists.\nIn MUSICVIDEOS you will find the results of my cooperation with musicians. ",
    "Title": "CONTENT PAGE"
  },
  {
    "id": 4,
    "Order": 102,
    "Content": "My name is Benjamin Gijzel, I am a senior actor & model, living in Amsterdam and the Düsseldorf area, interested in working with ambitious filmers and photographers anywhere. Please do send me an email if you want to work with me or just to know more.",
    "Title": "I AM ...."
  },
  {
    "id": 5,
    "Order": 103,
    "Content": "What you see is what you get:\n * a passionate professional\n\n  * with character & charisma\n\n  * reliable & receptive\n\n  * serious & sensitive\n\n  * tough & tender\n",
    "Title": "WHAT YOU SEE ..."
  },
  {
    "id": 1,
    "Order": 104,
    "Content": "Height 1.80 m \n\nWeight 76 kg \n\nBust 105 \n\nWaist 92 \n\nHips 98\n\nHead 59 \n\nSize 48 \n\nShoes 43",
    "Title": "SETCARD"
  },
  {
    "id": 6,
    "Order": 105,
    "Content": "Born and raised in the Netherlands, so Dutch is my native tongue. However I speak fluently German and Polish, English on a professional and French on conversation level. This is because I have always been curious and interested in foreign languages and living abroad. I lived for 4 years in Poland in the 70's and since 2000 I live part time in Germany. ",
    "Title": "LANGUAGES & NATIONALITY"
  },
  {
    "id": 3,
    "Order": 106,
    "Content": "I graduated in regional economics & townplanning in 1974 from the Erasmus University Rotterdam and  switched to directing for the theatre in 1979, studying at the State Theatre Academy in Warsaw.  Living in Poland for 4 years in the 70's had a great impact on my education and work. That's why I admire Krzysztof Kieslowski (1941-1996) with whom I had the chance to work with at several occasions.",
    "Title": "EDUCATION & INSPIRATION"
  },
  {
    "id": 2,
    "Order": 107,
    "Content": "I am passionate about my experience  of more than 25 years as a professional role-player for training and assessing communicative and managerial skills. It was very rewarding to feel my added value helping people to perform better in their jobs. This is where I learned to listen well and improvise in a consistent and convincing manner. Then in 2015 these skills turned out to be very helpful when I discovered the freedom and pleasure of acting in front of the camera giving that little extra bit of my personality. Since then I had the chance to play big roles in small productions and small things in big ones. In 2018 I reached the semi finals of FILMSTER GEZOCHT, a casting show of SBS6.",
    "Title": "ACTING EXPERIENCE"
  },
  {
    "id": 8,
    "Order": 108,
    "Content": "In the past I directed various productions with both professionals and amateurs (1985-1995) and taugth acting (1995-2004)",
    "Title": "DIRECTING & TEACHING DRAMA"
  },
  {
    "id": 9,
    "Order": 109,
    "Content": "Living the simple outdoor live, enjoying spectacular nature, traveling through foreign countries - preferably on my motorbike - to great cities and historical old towns in Europe. \nWatching films and drama productions that show some truth about ourselves and the way we live. \nChallenges to write that way and being a sparring partner for developing serious ideas and projects.",
    "Title": "HOBBIES & INTEREST"
  },
  {
    "id": 10,
    "Order": 110,
    "Content": "In the Netherlands: Unox, De Bijenkorf, ABN/AMRO, Focusera, Monuta, LUMC, De Politie, Taskforce, Just Verzekeringen, Liberty Global.\nIn Germany: Schwaebisch Hall, Seniorenhaeuser Gelsenkirchen.\nIn UK: ATAG.\nIn Greece: Vassilopoulos.\nIn Colombia: Fallabella.",
    "Title": "CLIENTS, COMMERCIALS & CORPORATE"
  },
  {
    "id": 7,
    "Order": 111,
    "Content": "Here you may find the credits related to different kind of productions I was involved in,  with footage, pics and demoreels.",
    "Title": "IMDb"
  }
].sort((a, b) => a.Order - b.Order)
</script>

<style scoped>
.page-container {
  padding: 2rem;
}

.collapse-item {
  background: var(--color-site-black);
  transition: all 0.3s ease;
}

.collapse-item:hover {
  border-color: var(--color-site-gold-500) !important;
  box-shadow: 0 4px 12px rgba(196, 147, 38, 0.1);
}

button {
  cursor: pointer;
}

button:hover {
  background-color: var(--color-site-gold-800) !important;
}
</style> 