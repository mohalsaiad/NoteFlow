import { test, expect } from '@playwright/test';
import * as path from 'node:path';

test('import accepts JSON and shows summary', async ({ page }) => {
  await page.goto('/login');
  await page.locator('[formcontrolname="username"]').fill('admin');
  await page.locator('[formcontrolname="password"]').fill('password');
  await page.getByRole('button', { name: /login/i }).click();

  await expect(page).toHaveURL(/\/notes$/);

  await page.goto('/import-export');
  await expect(page.getByRole('heading', { name: 'Import & Export' })).toBeVisible();

  const filePath = path.resolve(__dirname, 'fixtures', 'notes-valid.json');

  const fileInput = page.locator('input[type="file"][accept=".json"]');
  await fileInput.setInputFiles(filePath);

  await page.getByRole('button', { name: 'Start Import' }).click();

  const resultBox = page.locator('.import-result');
  await expect(resultBox).toBeVisible({ timeout: 20_000 });
  await expect(resultBox).toContainText('Created');
  await expect(resultBox).toContainText('Rejected');
});
