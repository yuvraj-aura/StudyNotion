import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Keep the local frontend and API ports explicit and independent of shell PORT.
const proxy = {
  '/api': { target: 'http://127.0.0.1:4000', changeOrigin: true },
}

export default defineConfig({
  server: { port: 5173, strictPort: true, proxy },
  preview: { port: 5173, strictPort: true, proxy },
  plugins: [react(), tailwindcss()],
})
