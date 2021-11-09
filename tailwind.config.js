module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  important: true,
  theme: {
    container: {
      center: true,
    },
    extend: {
      backgroundImage: {
        'hero-background': "url('/src/assets/hero-background.png')",
      },
      color: {
        'f-color': '#50504E'

      },
      textColor: {
        'pure-white': '#FFFFFF',
        'main': '#F7BC41',
      },
      backgroundColor: {
        'header': '#50504E',
        'main-color': '#F7BC41',
        'dt-gr': '#373737',
        'seondary-color': '#2A2A2A',
        'highlighted': '#F7BC41',
        'tcolor': '#5E5E5E',
        'dark': '#171717',
      },
      borderColor: {
        'primary': '#5A5A5A'
      },
      fontSize: {
        '4.5xl': [
          '40px', {
            letterSpacing: 'auto'
          }
        ],
        'text-xsm': [
          '10px', {
            letterSpacing: 'auto'
          }
        ],
      },
      gradientColorStops: {
        'primary': '#171717',
        'secondary': '#424242',
      },
      screens: {
        'xsm': {'min': '320px', 'max': '459px'},
        'msm': {'min': '460px', 'max': '639px'}
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
