import { test, expect } from '@playwright/test';
import * as path from 'node:path';

test('import accepts JSON and shows summary', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.locator('[formcontrolname="username"]').fill('admin');
  await page.locator('[formcontrolname="password"]').fill('password');
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page).toHaveURL(/\/notes$/);

  // Go to Import & Export page
  await page.goto('/import-export');
  await expect(page.getByRole('heading', { name: 'Import & Export' })).toBeVisible();

  // Upload fixture
  const filePath = path.resolve(__dirname, 'fixtures', 'notes-valid.json');
  const fileInput = page.locator('input[type="file"][accept=".json"]');
  await expect(fileInput).toHaveCount(1, { timeout: 10_000 });
  await fileInput.setInputFiles(filePath);

  // Start import
  await page.getByRole('button', { name: 'Start Import' }).click();

  // Import result should appear
  await expect(page.getByRole('heading', { name: 'Import Result' })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText(/Created:\s*\d+/i)).toBeVisible();
  await expect(page.getByText(/Rejected:\s*\d+/i)).toBeVisible();
});
