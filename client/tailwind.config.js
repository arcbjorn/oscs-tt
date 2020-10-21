module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  separator: '_',
  purge: {
    content: ['./src/**/*.vue'],
  },
  theme: {
    fontFamily: {
      display: ['Montserrat', 'sans-serif'],
      body: ['Montserrat', 'sans-serif'],
    },
    extend: {
      screens: {
        phone: '480px',
        smartphone: '640px',
        tablet: '768px',
        laptop: '1024px',
        desktop: '1280px',
        monitor: '1440px',
        print: { raw: 'print' },
        dark: { raw: '(prefers-color-scheme: dark)' },
      },
    },
  },
  variants: {},
  plugins: [],
  // corePlugins: [
  //   'margin',
  //   'padding',
  //   'backgroundColor',
  // ],
};
