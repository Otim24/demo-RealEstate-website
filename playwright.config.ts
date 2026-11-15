import { defineConfig } from '@playwright/test';

/**
 * iPhone 16 Pro Max Mobile Emulation Profile
 * Screen: 440 x 956 CSS pixels, @3x device pixel ratio, touch enabled
 */
export const IPHONE_16_PRO_MAX = {
  name: 'iPhone 16 Pro Max',
  use: {
    viewport: { width: 440, height: 956 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    defaultBrowserType: 'chromium' as const,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1'
  }
};

export default defineConfig({
  testDir: './tests',
  timeout: 45000,
  expect: {
    timeout: 8000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'Mobile Safari - iPhone 16 Pro Max',
      use: {
        ...IPHONE_16_PRO_MAX.use
      }
    },
    {
      name: 'Desktop Chrome - Luxury Viewport',
      use: {
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 2,
        isMobile: false,
        hasTouch: false
      }
    }
  ],
  webServer: {
    command: 'npm run preview -- --port 4321',
    port: 4321,
    reuseExistingServer: !process.env.CI,
    timeout: 15000
  }
});
