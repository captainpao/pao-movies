import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.webp'],
  build: {
    rollupOptions: {
      input: {
        main: '/index.html'
      }
    },
    assetsDir: 'assets',
    copyPublicDir: true
  },
  base: '/'
})