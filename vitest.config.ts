import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'base.js',
    root: './spec',
    environment: 'happy-dom',
    setupFiles: [],
  },
})
