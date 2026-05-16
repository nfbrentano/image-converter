import { defineConfig } from 'vite'

export default defineConfig({
  base: '/image-converter/',
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 3000
  }
})
