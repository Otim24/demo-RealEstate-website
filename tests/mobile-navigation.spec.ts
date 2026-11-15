import { test, expect } from '@playwright/test';

test.describe('Mobile Navigation Drawer — iPhone 16 Pro Max', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('Initial state: toggle is collapsed and drawer is hidden with proper ARIA attributes', async ({ page }) => {
    const toggleBtn = page.locator('#mobile-menu-toggle');
    const drawer = page.locator('#mobile-nav-drawer');

    await expect(toggleBtn).toBeVisible();
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
    await expect(toggleBtn).toHaveAttribute('aria-controls', 'mobile-nav-drawer');
    await expect(drawer).toBeHidden();
    await expect(drawer).toHaveAttribute('aria-hidden', 'true');

    // Body scroll must not be locked initially
    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).toBe('');
  });

  test('Hamburger toggle opens drawer and locks body scroll', async ({ page }) => {
    const toggleBtn = page.locator('#mobile-menu-toggle');
    const drawer = page.locator('#mobile-nav-drawer');

    await toggleBtn.click();

    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute('aria-hidden', 'false');
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');

    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).toBe('hidden');
  });

  test('Hamburger toggle closes drawer on second tap (two-way toggle contract)', async ({ page }) => {
    const toggleBtn = page.locator('#mobile-menu-toggle');
    const drawer = page.locator('#mobile-nav-drawer');

    // 1st tap: Open
    await toggleBtn.click();
    await expect(drawer).toBeVisible();
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');

    // 2nd tap: Close (verifies fix for single-direction toggle bug)
    await toggleBtn.click();
    await expect(drawer).toBeHidden();
    await expect(drawer).toHaveAttribute('aria-hidden', 'true');
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');

    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).toBe('');
  });

  test('Close button inside drawer dismisses menu and unlocks scroll', async ({ page }) => {
    const toggleBtn = page.locator('#mobile-menu-toggle');
    const closeBtn = page.locator('#mobile-menu-close');
    const drawer = page.locator('#mobile-nav-drawer');

    await toggleBtn.click();
    await expect(drawer).toBeVisible();

    await closeBtn.click();
    await expect(drawer).toBeHidden();
    await expect(drawer).toHaveAttribute('aria-hidden', 'true');
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');

    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).toBe('');
  });

  test('Tapping a navigation link closes drawer and navigates to target page', async ({ page }) => {
    const toggleBtn = page.locator('#mobile-menu-toggle');
    const drawer = page.locator('#mobile-nav-drawer');

    await toggleBtn.click();
    await expect(drawer).toBeVisible();

    const propertiesLink = drawer.locator('a[data-drawer-link][href="/properties"]');
    await propertiesLink.click();

    await page.waitForURL('**/properties');
    await expect(drawer).toBeHidden();
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');

    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).toBe('');
  });

  test('Pressing Escape key closes open drawer', async ({ page }) => {
    const toggleBtn = page.locator('#mobile-menu-toggle');
    const drawer = page.locator('#mobile-nav-drawer');

    await toggleBtn.click();
    await expect(drawer).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(drawer).toHaveAttribute('aria-hidden', 'true');
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
  });

  test('Resizing viewport to desktop breakpoint (>=1024px) automatically closes drawer', async ({ page }) => {
    const toggleBtn = page.locator('#mobile-menu-toggle');
    const drawer = page.locator('#mobile-nav-drawer');

    await toggleBtn.click();
    await expect(drawer).toBeVisible();

    // Resize to desktop viewport
    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(drawer).toBeHidden();

    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).toBe('');
  });

  test('Rapid toggle burst (10 rapid taps) maintains deterministic parity', async ({ page }) => {
    const toggleBtn = page.locator('#mobile-menu-toggle');
    const drawer = page.locator('#mobile-nav-drawer');

    // 10 rapid clicks (even count -> must end closed)
    for (let i = 0; i < 10; i++) {
      await toggleBtn.click();
      await page.waitForTimeout(80);
    }

    await expect(drawer).toBeHidden();
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).toBe('');
  });
});
