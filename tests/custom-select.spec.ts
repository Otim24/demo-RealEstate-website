import { test, expect } from '@playwright/test';

test.describe('CustomSelect Interactivity & Outside Clicks — iPhone 16 Pro Max', () => {
  test('Properties budget dropdown opens, selects option, and dismisses on mobile outside tap', async ({ page }) => {
    await page.goto('/properties');
    await page.waitForLoadState('domcontentloaded');

    const selectRoot = page.locator('[data-custom-select][data-select-id="budget-filter"]');
    const trigger = selectRoot.locator('[data-select-trigger]');
    const menu = selectRoot.locator('[data-select-menu]');
    const input = selectRoot.locator('[data-select-input]');
    const label = selectRoot.locator('[data-select-label]');

    // 1. Initial State
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeHidden();

    // 2. Open dropdown
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(menu).toBeVisible();

    // 3. Dismiss on outside tap (simulates mobile touch event bubbling on background)
    await page.locator('main').click({ position: { x: 20, y: 50 } });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeHidden();

    // 4. Re-open and select option
    await trigger.click();
    await expect(menu).toBeVisible();

    const option3B = selectRoot.locator('[data-select-option][data-value="3.5"]');
    await option3B.click();

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeHidden();
    await expect(input).toHaveValue('3.5');
    await expect(label).toContainText('Up to UGX 3.5B');
    await expect(option3B).toHaveAttribute('aria-selected', 'true');
  });

  test('Contact consultation dropdown updates selection and syncs hidden input', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('domcontentloaded');

    const selectRoot = page.locator('[data-custom-select][data-select-id="residence-select"]');
    const trigger = selectRoot.locator('[data-select-trigger]');
    const menu = selectRoot.locator('[data-select-menu]');
    const input = selectRoot.locator('[data-select-input]');

    await trigger.click();
    await expect(menu).toBeVisible();

    const penthouseOption = selectRoot.locator('[data-select-option][data-value="nakasero-sky-penthouse"]');
    await penthouseOption.click();

    await expect(menu).toBeHidden();
    await expect(input).toHaveValue('nakasero-sky-penthouse');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('Escape key closes open CustomSelect dropdown', async ({ page }) => {
    await page.goto('/properties');
    await page.waitForLoadState('domcontentloaded');

    const selectRoot = page.locator('[data-custom-select][data-select-id="budget-filter"]');
    const trigger = selectRoot.locator('[data-select-trigger]');
    const menu = selectRoot.locator('[data-select-menu]');

    await trigger.click();
    await expect(menu).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
