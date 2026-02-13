import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:4200',
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
  reporter: [['list']],
});
