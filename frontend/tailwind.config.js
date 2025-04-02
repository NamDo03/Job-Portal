/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4640DE',
        'sub-primary': '#F8F8FD',
        'secondary': '#E9EBFD',
        'third': '#CCCCF5',
        'dark': '#202430',
        'ocean': '#26A4FF',
        'text-primary': '#25324B',
        'text-footer': '#D6DDEB',
        'text-1': '#515B6F',
        'text-2': '#7C8493',
        'accents-green': '#56CDAD',
        'bg-admin': '#F9FAFB'
      },
      fontFamily: {
        heading: ['Sora', 'serif'],
        content: ['Red Hat Display', 'serif'],
      },
    },
  },
  plugins: [],
}

