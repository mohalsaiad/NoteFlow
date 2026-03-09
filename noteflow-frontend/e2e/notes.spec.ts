import { test, expect } from '@playwright/test';

test('user can create a note', async ({ page }) => {
  await page.goto('/login');
  await page.locator('[formcontrolname="username"]').fill('admin');
  await page.locator('[formcontrolname="password"]').fill('password');
  await page.getByRole('button', { name: /login/i }).click();

  await expect(page).toHaveURL(/\/notes$/);
  await page.waitForLoadState('networkidle');

  // Use stable CSS class instead of strict button text matching
  await page.locator('.create-button').click();

  await expect(page).toHaveURL(/\/notes\/new$/);

  const title = `E2E Note ${Date.now()}`;

  await page.locator('[formcontrolname="title"]').fill(title);
  await page.locator('[formcontrolname="body"]').fill('Created by Playwright.');

  const tagsField = page.locator('[formcontrolname="tags"]');
  if (await tagsField.count()) {
    await tagsField.fill('tag1, tag2');
  }

  // Use button text Create or CSS fallback
  await page.getByRole('button', { name: /^create$/i }).click();

  await expect(page).toHaveURL(/\/notes$/);
  await expect(page.getByRole('heading', { name: title })).toBeVisible();
});
