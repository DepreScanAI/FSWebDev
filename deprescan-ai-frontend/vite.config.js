import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // allowedHosts: ['most-citadel-distill.ngrok-free.dev'],
    proxy: {
      '/api': {
        target: 'https://deprescan-ai-backend-production.up.railway.app',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          three: ['three'],
        },
      },
    },
  },
});
