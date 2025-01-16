import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    solidPlugin(),
  ],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
  server: {
    port: 3000,
    host: true,
  },
  resolve: {
    alias: {
      'monaco-editor': resolve(__dirname, 'node_modules/monaco-editor'),
    },
  },
});
