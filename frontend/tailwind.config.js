export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0b1326',
        surface: '#0b1326',
        card: '#131b2e',
        accent: '#c0c1ff',
        highlight: '#8083ff',
        muted: '#908fa0',
        tertiary: '#4edea3',
        line: '#2d3449',
        panel: '#171f33',
        panelHi: '#222a3d',
        copy: '#dae2fd',
      },
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['Newsreader', 'serif'],
      },
      boxShadow: {
        glow: '0 18px 60px rgba(192, 193, 255, 0.12)',
      },
    },
  },
  plugins: [],
}
