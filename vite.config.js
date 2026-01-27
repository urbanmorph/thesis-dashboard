import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        sectors: resolve(__dirname, 'sectors.html'),
        thesis: resolve(__dirname, 'thesis.html'),
        resources: resolve(__dirname, 'resources.html'),
        admin: resolve(__dirname, 'admin.html'),
        'admin-partners': resolve(__dirname, 'admin-partners.html'),
        'admin-funding': resolve(__dirname, 'admin-funding.html'),
        'admin-roadmap': resolve(__dirname, 'admin-roadmap.html'),
        login: resolve(__dirname, 'login.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  publicDir: 'public',
})
