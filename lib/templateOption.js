import { blue, yellow, lightGreen, lightMagenta, reset, green, cyan } from 'kolorist'
export const ENVIRONMENTS = [
  // {
  //   value: 'cli',
  //   title: 'vue-cli',
  //   color: blue,

  // },
  {
    value: 'vite',
    title: 'vite',
    color: yellow,
  }
]

export const LANGUAGES = [
  {
    value: 'js',
    title: 'JavaScript',
    color: lightGreen
  },
  {
    value: 'ts',
    title: 'TypeScript',
    color: lightMagenta
  }
]

export const TEMPLATES = [
  {
    value: 'default',
    title: 'default(官方預設模板)',
    color: reset
  },
  {
    value: 'common',
    title: 'custom(加入開發常用套件)',
    color: green
  }
]

export const TOOLS = [
  {
    value: 'signalr',
    title: 'signalr(.NET Framework)',
    color: cyan
  },
  {
    value: 'electron',
    title: 'electron',
    color: cyan
  }
]