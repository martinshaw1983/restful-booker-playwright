import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  workers: 5,
  
  reporter: [
    ['html'],
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],

  use: {
    baseURL: process.env.BASE_URL,
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'API-tests',
      use: { ...devices['Desktop Chrome'] },
      fullyParallel: true,
    }
  ],
});