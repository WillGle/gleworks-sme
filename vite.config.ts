import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/api'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
    }
  },
  
  server: {
    port: 5173,
    host: true, // Listen on all interfaces (needed for Tailscale/Docker)
    strictPort: false,
    
    // HMR configuration
    hmr: {
      overlay: true,
    },
    
    // Proxy API requests
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    },
  },
  
  build: {
    outDir: 'dist',
    sourcemap: true,
    
    // Optimize chunks
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'icons': ['react-icons'],
          'utils': ['axios', 'date-fns', 'jwt-decode'],
        },
      }
    },
    
    // Set chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  
  preview: {
    port: 4173,
    host: true,
  },
  
  // Test configuration (for vitest)
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
