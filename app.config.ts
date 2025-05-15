export default defineAppConfig({
  ui: {
    colors: {
      primary: 'neutral', // Using neutral (like zinc or slate) as primary, and then overriding its dark shades to be black
      // We can add a secondary color here if needed, e.g., secondary: 'amber'
      // Or define a custom name like 'gold' if we add it to nuxt.config.ts ui.theme.colors
    },
    button: {
      defaultVariants: {
        color: 'primary' // Make buttons use our primary color by default
      }
    }
    // We can also customize specific component variants here globally
  }
}) 