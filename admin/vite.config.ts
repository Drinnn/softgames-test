import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const env = {};

console.log('Injected environment:', env);

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: false,
  },
  plugins: [react()],
  define: {
    __APP_ENV__: JSON.stringify(env),
  },
});
