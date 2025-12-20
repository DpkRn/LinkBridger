import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/app",
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    // Ensure the dev server properly handles the base path
    origin: 'http://localhost:5173'
  }
})