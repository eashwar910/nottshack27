// Tailwind build config: brand colours + font mapping.
// font-pixel -> display font, font-mono -> body font (both defined in css/style.css :root)
module.exports = {
  content: ['./index.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        night: '#241845', deep: '#1a1033', card: '#32245c', rim: '#4d3a85',
        orchid: '#ff7ad9', spring: '#7dffb2', peri: '#9aa5ff', peach: '#ffb86b',
        lilac: '#d6cbf5', snow: '#fffaff'
      },
      fontFamily: {
        pixel: ['var(--font-display)'],
        mono: ['var(--font-body)']
      }
    }
  }
};
