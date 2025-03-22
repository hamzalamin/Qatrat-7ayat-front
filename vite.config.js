import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
    'global': 'window'
  },
  optimizeDeps: {
    include: ['draft-js', 'react-draft-wysiwyg', 'draftjs-to-html', 'html-to-draftjs'],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  resolve: {
    alias: {
      'process': 'process/browser',
      'stream': 'stream-browserify',
      'util': 'util'
    }
  }
});