import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Keep the local frontend and API ports explicit and independent of shell PORT.
const proxy = {
  '/api': { target: 'http://127.0.0.1:4000', changeOrigin: true },
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  if (command === 'build' && !env.VITE_API_BASE_URL?.trim()) {
    throw new Error('Set VITE_API_BASE_URL to the Render HTTPS origin before building for production')
  }
  return {
  server: { port: 5173, strictPort: true, proxy },
  preview: { port: 5173, strictPort: true, proxy },
  plugins: [react(), tailwindcss()],
  }
})
