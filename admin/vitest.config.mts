/* eslint-disable import/no-extraneous-dependencies, import/extensions */
import 'dotenv/config';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'cobertura'],
    },
    reporters: ['verbose', 'junit'],
    outputFile: './junit.xml',
    exclude: ['node_modules', 'coverage', 'build', 'dist', '.idea', '.git', '.cache'],
    passWithNoTests: true,
  },
});
