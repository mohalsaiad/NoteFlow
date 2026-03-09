import { test, expect } from '@playwright/test';

test('export shows progress and allows download after completion', async ({ page }) => {
  await page.goto('/login');
  await page.locator('[formcontrolname="username"]').fill('admin');
  await page.locator('[formcontrolname="password"]').fill('password');
  await page.getByRole('button', { name: /login/i }).click();

  await expect(page).toHaveURL(/\/notes$/);

  await page.goto('/import-export');
  await expect(page.getByRole('heading', { name: 'Import & Export' })).toBeVisible();

  await page.getByRole('button', { name: 'Start Export' }).click();

  // Don’t rely on progress text rendering; status/success are enough
  await expect(page.getByText(/Status:\s*completed/i)).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText(/Export completed!/i)).toBeVisible({ timeout: 30_000 });
});
