import { test, expect } from '@playwright/test';

test.describe('Sustained Interaction & Zero Console Errors Over Time — iPhone 16 Pro Max', () => {
  test('Site remains responsive with zero errors during sustained dwell time and rapid toggling', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', (err) => {
      consoleErrors.push(err.message);
    });

    await page.goto('/properties');
    await page.waitForLoadState('domcontentloaded');

    // Phase 1: Rapid category switching (12 rapid filter taps)
    const filterBtns = page.locator('[data-filter-btn]');
    const filterCount = await filterBtns.count();
    if (filterCount > 0) {
      for (let i = 0; i < 12; i++) {
        await filterBtns.nth(i % filterCount).click();
        await page.waitForTimeout(60);
      }
    }

    // Phase 2: Rapid view mode switching (spread <-> index 6 times)
    const spreadBtn = page.locator('[data-view-btn="spread"]');
    const indexBtn = page.locator('[data-view-btn="index"]');
    if (await spreadBtn.count() > 0 && await indexBtn.count() > 0) {
      for (let i = 0; i < 6; i++) {
        await indexBtn.click();
        await page.waitForTimeout(70);
        await spreadBtn.click();
        await page.waitForTimeout(70);
      }
    }

    // Phase 3: Scroll stress (rapid inertial scroll simulation)
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(150);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(150);
    }

    // Phase 4: Sustained Dwell Time (10 seconds delay simulating user reading)
    await page.waitForTimeout(10000);

    // Phase 5: Verification of interaction after dwell time
    const toggleBtn = page.locator('#mobile-menu-toggle');
    const drawer = page.locator('#mobile-nav-drawer');

    // Mobile menu toggle after dwell
    await toggleBtn.click();
    await expect(drawer).toBeVisible();
    await toggleBtn.click();
    await expect(drawer).toBeHidden();

    // WhatsApp widget toggle after dwell
    const waTrigger = page.locator('#wa-toggle-btn');
    const waPopover = page.locator('#wa-popover');
    await waTrigger.click();
    await expect(waPopover).toBeVisible();
    const waClose = page.locator('#wa-close-btn');
    await waClose.click();
    await expect(waPopover).toBeHidden();

    // Verify zero unhandled exceptions or runtime errors occurred
    expect(consoleErrors).toEqual([]);
  });
});
