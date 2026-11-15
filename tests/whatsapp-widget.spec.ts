import { test, expect } from '@playwright/test';

test.describe('WhatsApp Concierge Widget Redesign — iPhone 16 Pro Max', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('Widget trigger button floats in bottom-right corner with proper accessibility attributes', async ({ page }) => {
    const triggerBtn = page.locator('#wa-toggle-btn');
    const popover = page.locator('#wa-popover');

    await expect(triggerBtn).toBeVisible();
    await expect(triggerBtn).toHaveAttribute('aria-expanded', 'false');
    await expect(triggerBtn).toHaveAttribute('aria-controls', 'wa-popover');
    await expect(popover).toBeHidden();
    await expect(popover).toHaveAttribute('aria-hidden', 'true');
    await expect(popover).toHaveAttribute('role', 'dialog');
  });

  test('Trigger opens popover and close button dismisses it cleanly', async ({ page }) => {
    const triggerBtn = page.locator('#wa-toggle-btn');
    const popover = page.locator('#wa-popover');
    const closeBtn = page.locator('#wa-close-btn');

    // Open
    await triggerBtn.click();
    await expect(popover).toBeVisible();
    await expect(triggerBtn).toHaveAttribute('aria-expanded', 'true');
    await expect(popover).toHaveAttribute('aria-hidden', 'false');

    // Close via close button
    await closeBtn.click();
    await expect(popover).toBeHidden();
    await expect(triggerBtn).toHaveAttribute('aria-expanded', 'false');
    await expect(popover).toHaveAttribute('aria-hidden', 'true');
  });

  test('Preset topic chips populate message input and synchronize WhatsApp URL', async ({ page }) => {
    const triggerBtn = page.locator('#wa-toggle-btn');
    const popover = page.locator('#wa-popover');
    const launchLink = page.locator('#wa-launch-link');
    const msgInput = page.locator('#wa-message-input');

    await triggerBtn.click();
    await expect(popover).toBeVisible();

    const presetBtn = popover.locator('[data-wa-preset]').first();
    const presetText = await presetBtn.getAttribute('data-wa-preset');
    expect(presetText).toBeTruthy();

    await presetBtn.click();
    await expect(msgInput).toHaveValue(presetText!);

    const href = await launchLink.getAttribute('href');
    expect(href).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
    expect(href).toContain(encodeURIComponent(presetText!));
  });

  test('Desk selector changes recipient telephone number in generated link', async ({ page }) => {
    const triggerBtn = page.locator('#wa-toggle-btn');
    const popover = page.locator('#wa-popover');
    const launchLink = page.locator('#wa-launch-link');

    await triggerBtn.click();
    await expect(popover).toBeVisible();

    // Verify initial URL points to default Kampala desk
    const initialHref = await launchLink.getAttribute('href');
    expect(initialHref).toContain('256772410890');

    // Select Entebbe desk option if custom select exists
    const deskSelectRoot = popover.locator('[data-custom-select][data-select-id="wa-desk-select"]');
    if (await deskSelectRoot.count() > 0) {
      const trigger = deskSelectRoot.locator('[data-select-trigger]');
      await trigger.click();
      const entebbeOption = deskSelectRoot.locator('[data-select-option][data-value="256752814320"]');
      if (await entebbeOption.count() > 0) {
        await entebbeOption.click();
        const updatedHref = await launchLink.getAttribute('href');
        expect(updatedHref).toContain('256752814320');
      }
    }
  });

  test('Escape key closes open WhatsApp popover dialog', async ({ page }) => {
    const triggerBtn = page.locator('#wa-toggle-btn');
    const popover = page.locator('#wa-popover');

    await triggerBtn.click();
    await expect(popover).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(popover).toBeHidden();
    await expect(triggerBtn).toHaveAttribute('aria-expanded', 'false');
  });

  test('Tapping outside popover dismisses WhatsApp concierge on mobile', async ({ page }) => {
    const triggerBtn = page.locator('#wa-toggle-btn');
    const popover = page.locator('#wa-popover');

    await triggerBtn.click();
    await expect(popover).toBeVisible();

    // Tap outside on main container
    await page.locator('main').click({ position: { x: 30, y: 120 } });
    await expect(popover).toBeHidden();
    await expect(triggerBtn).toHaveAttribute('aria-expanded', 'false');
  });

  test('Closed widget does not block hero CTA taps on mobile and Explore All Properties navigates', async ({ page }) => {
    const conciergeBox = await page.locator('#whatsapp-concierge').boundingBox();
    expect(conciergeBox).not.toBeNull();
    // Closed concierge bounding box must wrap only the floating toggle pill, never spanning over the hero
    expect(conciergeBox!.height).toBeLessThan(90);

    const exploreBtn = page.locator('a[href="/properties"]', { hasText: 'Explore All Properties' });
    await expect(exploreBtn).toBeVisible();

    const hitIsExploreLink = await exploreBtn.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      return hit === el || el.contains(hit);
    });
    expect(hitIsExploreLink).toBe(true);

    await exploreBtn.click();
    await page.waitForURL('**/properties');
  });
});
