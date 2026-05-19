import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 2 : undefined,
  
  reporter: [
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],

  use: {
    baseURL: process.env.BASE_URL,
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'API-tests',
      fullyParallel: true,
    }
  ],
});
