import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/user/',
  plugins: [react()],
  define: {
    global: 'window',
  },
  server: {
    proxy: {
      '/ws': {
        target: 'http://localhost:9191',
        ws: true,            
        changeOrigin: true, 
      }
    }
  }
})
