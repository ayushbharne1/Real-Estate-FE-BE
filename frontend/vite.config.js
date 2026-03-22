import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
 plugins: [react(), tailwindcss()],  // remove the duplicate plugins line
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router-dom'],  // add this
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'react-vendor'
          if (id.includes('node_modules/react-router')) return 'router-vendor'
          if (id.includes('node_modules/@reduxjs') || id.includes('node_modules/react-redux')) return 'redux-vendor'
          if (id.includes('node_modules/leaflet') || id.includes('node_modules/react-leaflet')) return 'map-vendor'
          if (id.includes('node_modules/@tanstack')) return 'table-vendor'
          if (id.includes('node_modules/lucide-react')) return 'icons-vendor'
          if (id.includes('node_modules/formik') || id.includes('node_modules/yup')) return 'form-vendor'
          if (id.includes('node_modules/')) return 'vendor'
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@reduxjs/toolkit', 'react-redux'],
  },
})