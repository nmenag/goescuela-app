/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          lightPink: '#FAE0F0',
          lightPurple: '#EAE6FA',
          teal: '#71C0C4',
          hotPink: '#ff66c4',
          black: '#000000',
        },
      },
    },
  },
  plugins: [],
};
