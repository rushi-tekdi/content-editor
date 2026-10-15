import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 4200,
    open: true,
    proxy: {
    '/api': { target: 'https://dev-lap.prathamdigital.org', changeOrigin: true, secure: false },
  },
  },
  resolve: {
    alias: {
      '@editor/editor-core': resolve(__dirname, '../../packages/editor-core/src/index.ts'),
      '@editor/editor-content': resolve(__dirname, '../../packages/editor-content/src/index.ts'),
      '@editor/editor-course': resolve(__dirname, '../../packages/editor-course/src/index.ts'),
      '@editor/editor-webcomponent': resolve(__dirname, '../../packages/editor-webcomponent/src/index.ts'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
