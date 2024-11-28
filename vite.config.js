import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/digital-portfolio/' : '/',
  build: {
    outDir: 'dist'
  },
  resolve: {
    alias: {
      '@assets': '/src/assets',
      '@images': '/src/assets/images',
      '@data': '/src/assets/data',
      '@components': '/src/components',
      '@static': '/src/components/static',
      '@interactive': '/src/components/interactive',
      '@contexts': '/src/contexts',
      '@helpers': '/src/helpers',
      '@hooks': '/src/hooks',
      '@utils': '/src/utils',
      '@stores': '/src/stores',
      '@reducers': '/src/reducers'
    }
  }
}));
