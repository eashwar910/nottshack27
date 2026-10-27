// Tailwind build config: brand colours + font mapping.
// Colours are RGB channel variables defined per theme in css/style.css, so every class (and /opacity) follows the theme.
// font-pixel -> display font, font-mono -> code font, font-sans -> body font.
const v = name => `rgb(var(--${name}) / <alpha-value>)`;
module.exports = {
  content: ['./index.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        ink: v('ink'), deep: v('deep'), card: v('card'), rim: v('rim'), line: v('line'),
        spring: v('spring'), peri: v('peri'), orchid: v('orchid'),
        lilac: v('lilac'), mute: v('mute'), snow: v('snow')
      },
      fontFamily: {
        pixel: ['var(--font-display)'],
        mono: ['var(--font-mono)'],
        sans: ['var(--font-body)']
      }
    }
  }
};
