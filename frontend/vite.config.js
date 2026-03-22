import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
          'ui-vendor': ['lucide-react', 'react-toastify'],
          'table-vendor': ['@tanstack/react-table'],
          'map-vendor': ['leaflet', 'react-leaflet'],
          'form-vendor': ['formik', 'yup'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})