import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['src/**/*.perf.test.ts'],
    globals: true,
    testTimeout: 60000,
    hookTimeout: 60000,
    browser: {
      enabled: true,
      provider: 'playwright',
      headless: true,
      screenshotFailures: false,
      instances: [
        {
          browser: 'chromium',
          launch: {
            args: [
              '--headless=new',
              '--enable-gpu',
              '--ignore-gpu-blocklist',
              '--use-angle=gl',
              '--enable-features=Vulkan',
              '--autoplay-policy=no-user-gesture-required',
            ],
          },
        },
      ],
    },
  },
});
