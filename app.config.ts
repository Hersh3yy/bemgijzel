export default defineAppConfig({
  ui: {
    colors: {
      primary: 'black',
      secondary: 'gold',
      gold: 'amber' // Using amber as base for our gold palette
    },
    button: {
      defaultVariants: {
        color: 'primary' // Make buttons use our primary color by default
      }
    }
    // We can also customize specific component variants here globally
  }
}) 