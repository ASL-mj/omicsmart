import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(fileURLToPath(import.meta.url), 'src')
    }
  },
  server: {
    port: 15000,
    open: true,
    host: '0.0.0.0'
  }
})