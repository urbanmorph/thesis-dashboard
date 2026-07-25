import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      // the site is these two pages only: the operating-model tree (landing) + the field guide
      input: {
        main: resolve(__dirname, 'index.html'),
        'field-guide': resolve(__dirname, 'field-guide.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  publicDir: 'public',
})
