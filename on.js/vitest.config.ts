import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'on.js',
    root: './spec',
    environment: 'happy-dom',
    setupFiles: [],
  },
})
