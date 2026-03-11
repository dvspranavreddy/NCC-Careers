import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',          // default – just make sure your files are here
  base: '/',
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://ncc-career.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
