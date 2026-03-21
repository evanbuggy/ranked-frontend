import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const backendStatic = path.resolve(__dirname, '../backend/src/main/resources/static')
/** Monorepo only: BUILD_TO_BACKEND=1 writes into Spring static/. Default: dist/ for ranked-frontend clone. */
const deployToBackend =
  process.env.BUILD_TO_BACKEND === '1' || process.env.BUILD_TO_BACKEND === 'true'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: deployToBackend ? backendStatic : 'dist',
    emptyOutDir: true,
    sourcemap: false
  }
})
