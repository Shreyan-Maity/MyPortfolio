import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nexus: resolve(__dirname, 'Nexus AI/index.html'),
        vibesync: resolve(__dirname, 'VibeSync/index.html')
      }
    }
  }
});
