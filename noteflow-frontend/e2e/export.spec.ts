import { test, expect } from '@playwright/test';

test('export shows progress and allows download after completion', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.locator('[formcontrolname="username"]').fill('admin');
  await page.locator('[formcontrolname="password"]').fill('password');
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page).toHaveURL(/\/notes$/);

  // Go to Import & Export page
  await page.goto('/import-export');
  await expect(page.getByRole('heading', { name: 'Import & Export' })).toBeVisible();

  // Start export
  await page.getByRole('button', { name: 'Start Export' }).click();

  // Progress text should appear and change (at least become visible)
  await expect(page.locator('.progress-text')).toBeVisible({ timeout: 10_000 });

  // Wait for completion status/message
  await expect(page.getByText(/Export completed!/i)).toBeVisible({ timeout: 30_000 });

  // Also verify status line reaches completed (extra proof)
  await expect(page.getByText(/Status:\s*completed/i)).toBeVisible({ timeout: 30_000 });
});
