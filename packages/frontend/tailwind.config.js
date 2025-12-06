// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'midnight-violet': 'var(--midnight-violet)',
        'frosted-mint': 'var(--frosted-mint)',
        'clay-soil': 'var(--clay-soil)',
        'faded-copper': 'var(--faded-copper)',
        'shadow-grey': 'var(--shadow-grey)',
        'gold': 'var(--gold)',
      },
    },
  },
  plugins: [],
};