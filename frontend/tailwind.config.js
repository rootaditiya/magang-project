import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        asnesia:{
          black: '#181c32',
          yellow: '#FFC700',
          blue: '#009ef7',
          gray: '#7e8299',
          darkblue: '#162D43'
        }
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}

