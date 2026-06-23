import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // ExcelJS needs global to be defined in browser builds
    global: 'globalThis',
  },
})
